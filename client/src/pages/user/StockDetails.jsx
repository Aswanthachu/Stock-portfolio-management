import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { baseUrl, getConfig } from '@/Redux/Api';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import SubLoading from '@/components/SubLoading';
const StockDetails = () => {
    const { stockSymbol } = useParams();
    const navigate = useNavigate()
    const [chartData, setChartData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [selectedInterval, setSelectedInterval] = useState('6m');
    const [stockDetail, setStockDetail] = useState()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = getConfig();
                const response = await axios.get(`${baseUrl}/admin/portfolio/get-stock/${stockSymbol}`, config);
                const stockData = response.data.stock.stock_rate || [];
                setStockDetail(response.data.stock)
                setAllData(stockData);
                setChartData(filterDataByInterval(stockData, selectedInterval));
            } catch (error) {
                console.error('Error fetching stock data:', error.message);
                setError('Error fetching stock data. Please try again.');
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [stockSymbol, selectedInterval]);



    const handleIntervalChange = (interval) => {
        setSelectedInterval(interval);
        setChartData(filterDataByInterval(allData, interval));
    };

    const filterDataByInterval = (data, interval) => {
        switch (interval) {
            case '1w':
                return data.slice(-8, -1);
            case '1m':
                return data.slice(-31, -1);
            case '3m':
                return data.slice(-91, -1);
            case '6m':
                return data.slice(-181, -1);
            case '1y':
                return data.filter((entry) => new Date(entry.price_date) >= new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
            case '5y':
                return data.filter((entry) => new Date(entry.price_date) >= new Date(new Date().setFullYear(new Date().getFullYear() - 5)));
            default:
                return data;
        }
    };

    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Days',
                },
                autoSkip: true,
                maxTicksLimit: 30,
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
            },
        },
    };

    const chartDataConfig = {
        labels: chartData.map((entry) => entry.date),
        datasets: [
            {
                label: 'Stock Value',
                data: chartData.map((entry) => entry.stock_price),
                borderColor: 'RGB(9, 106, 86)',
                borderWidth: 2,
                fill: false,
                pointStyle: false,
            },
        ],
    };
    return (
        <div className="text-center">
            <div className='flex'>
                <Button
                    icon={
                        <svg
                            width="29"
                            height="24"
                            viewBox="0 0 29 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M27 13.5C27.8284 13.5 28.5 12.8284 28.5 12C28.5 11.1716 27.8284 10.5 27 10.5V13.5ZM0.939341 10.9393C0.353554 11.5251 0.353554 12.4749 0.939341 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.939341 10.9393ZM27 10.5L2 10.5V13.5L27 13.5V10.5Z"
                                fill="#096A56"
                            />
                        </svg>
                    }
                    className="pt-5 pb-5 pl-5"
                    onClick={() => navigate(-1)} />


            </div>
            {loading && <SubLoading />} {/* Display loading spinner while data is being fetched */}
            {error && <div className="text-red-500">{error}</div>} {/* Display error message if an error occurred */}
            {!loading && !error && (
                <div className="    bg-whi te mx-4 bg-darkGreen rounded-md  lg:mx-8  ">

                    <div className='flex flex-col lg:flex-row rounded-md border-darkGreen border-8'>
                        <div className='lg:w-1/5 flex gap-5 lg:flex-col items-center bg-darkGreen   justify-center'>
                            <div className='lg:min-w-max w-20  '>
                                <img src={stockDetail?.logo_url} alt="" className="mb-2" />

                            </div>
                            <div className=' '>
                                <p className='text-lg lg:text-2xl flex-wrap  font-semibold  text-white py-2'>{stockDetail?.stock_name}</p>
                                <p className='text-lg lg:text-2xl font-medium text-white'>{stockDetail?.current_Price} <span>{stockDetail?.currency}</span></p>
                                <p className='text-base lg:text-lg font-medium text-orange-50'>{stockDetail?.exchange} - <span>{stockDetail?.stock_symbol}</span></p>
                                <p className='text-base lg:text-lg text-orange-50
                                '>MIC Code : {stockDetail?.mic_code}</p>
                            </div>
                        </div>
                        <div className='lg:w-4/5 bg-white rounded-md'>
                            <div className="flex justify-center   py-4 text-sm ">
                                <Button text={'1 W'} className={`${selectedInterval === '1w' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('1w')} />

                                <Button text={'1 M'} className={`${selectedInterval === '1m' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('1m')} />

                                <Button text={'3 M'} className={`${selectedInterval === '3m' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('3m')} />

                                <Button text={'6 M'} className={`${selectedInterval === '6m' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('6m')} />

                                <Button text={'1 Y'} className={`${selectedInterval === '1y' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('1y')} />

                                <Button text={'5 Y'} className={`${selectedInterval === '5y' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('5y')} />


                            </div>
                            <div className='w-full bg-white rounded-md h-[300px] md:h-[400px] lg:px-10'>
                                <Line data={chartDataConfig} options={chartOptions} />

                            </div>

                        </div>

                    </div>
                    <div className='w-full  mt-5 mb-10 md:px-5 md:py-4 text-center'>
                        <p className='text-sm font-semibold text-white'>{stockDetail?.description}</p>

                    </div>
                    {/* <div className="flex flex-col  ">
                        <div className=" flex  mb-4 md:mr-4 justify-center items-center">
                            <div className='lg:min-w-max w-20  lg:pl-20'>
                                <img src={stockDetail?.logo_url} alt="" className="mb-2" />

                            </div>
                            <div className='lg:min-w-max px-10'>
                                <h3 className='text-lg lg:text-2xl  font-semibold  text-darkGreen py-2'>{stockDetail?.stock_name}</h3>
                                <p className='text-lg lg:text-2xl font-medium'>{stockDetail?.current_Price} <span>{stockDetail?.currency}</span></p>
                                <p className='text-base lg:text-lg font-medium text-gray-500'>{stockDetail?.exchange} - <span>{stockDetail?.stock_symbol}</span></p>
                                <p className='text-base lg:text-lg text-gray-500'>MIC Code : {stockDetail?.mic_code}</p>
                            </div>
                            <div className='w-fit hidden lg:block'>
                                <p className='text-sm'>{stockDetail?.description}</p>

                            </div>

                        </div>

                        <div className="md:w-full  h-[400px] md:h-[550px] ">
                            <Line data={chartDataConfig} options={chartOptions} />


                            <div className="flex justify-center mb-20 text-sm mt-4">
                                <Button text={'1 W'} className={`${selectedInterval === '1w' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('1w')} />

                                <Button text={'1 M'} className={`${selectedInterval === '1m' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('1m')} />

                                <Button text={'3 M'} className={`${selectedInterval === '3m' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('3m')} />

                                <Button text={'6 M'} className={`${selectedInterval === '6m' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('6m')} />

                                <Button text={'1 Y'} className={`${selectedInterval === '1y' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('1y')} />

                                <Button text={'5 Y'} className={`${selectedInterval === '5y' ? 'bg-darkGreen rounded' : 'bg-gray-300'
                                    } hover:bg-teal-900 text-white font-medium px-2`} onClick={() => handleIntervalChange('5y')} />


                            </div>
                            <div className='w-fit mt-5 lg:hidden'>
                                <p className='text-sm'>{stockDetail?.description}</p>

                            </div>
                        </div>
                    </div> */}


                </div>
            )}
        </div>
    );
};

export default StockDetails;

