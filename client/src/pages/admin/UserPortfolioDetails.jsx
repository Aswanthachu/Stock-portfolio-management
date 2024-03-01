import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
// import toast from "react-hot-toast";
import { useToast } from "@/components/ToastContext/ToastContext";
import {
  editStockDetails,
  getUserInvestmentDetails,
  getUserPortfolioTable,
  getInvestmentScreenshot,
} from "@/Redux/Actions/admin";
import Button from "@/components/Button";
import { getSingleUser } from "@/Redux/Actions/admin";

const UserPortfolioDetails = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [singleEditDetails, setSingleEditDetails] = useState({});

  const dispatch = useDispatch();
  const { id, pid, itype, generatePortfolioId } = useParams();
  const tableData = useSelector(
    (state) => state?.admin?.userPortfolioTableData
  );
  const userData = useSelector((state) => state?.admin?.userDetails);
  const singleInvestmentDetails = useSelector(
    (state) => state.admin.singleInvestmentDetails
  );
  // download element

  const handleDownload = () => {
    const imgData = singleEditDetails.screenshot;
    const doc = new jsPDF();
    doc.addImage(imgData, "JPEG", 10, 10, 100, 100);
    doc.save(`${singleEditDetails.email}.pdf`);
  };
  useEffect(() => {
    if (!userData) {
      dispatch(getSingleUser(id));
    }
  }, [userData]);

  useEffect(() => {
    dispatch(getInvestmentScreenshot({ pid }));

    dispatch(getUserPortfolioTable({ pid, itype }));
    dispatch(getUserInvestmentDetails({ pid, itype }));
  }, []);

  const stockDetails = useSelector((state) => state.admin.stockDetails);
  useEffect(() => {
    setSingleEditDetails(singleInvestmentDetails);
  }, [singleInvestmentDetails]);

  // convert date to local format

  const convertDate = (date) => {
    const myDate = new Date(date);
    return myDate.toLocaleDateString();
  };

  // setting stock details in to matrix format for editing

  useEffect(() => {
    let matrix = [];

    if (stockDetails) {
      if (itype === "sip") {
        const { buyingDate, stocks } = stockDetails;
        // matrix formation
        for (let i = 0; i < stocks?.length; i++) {
          matrix.push([]);
        }
        for (let i = 0; i < 5; i++) {
          matrix = matrix.map((rowData) => [...rowData, ""]);
        }

        async function maxtrixFormation() {
          for (let i = 0; i < stocks?.length; i++) {
            const { quantity_each_month, stock_symbol } = stocks[i];
            const { quantity, buyed_price, buyed_cost_INR } =
              quantity_each_month[0];
            matrix[i][0] = stock_symbol;
            matrix[i][1] = quantity;
            matrix[i][2] = buyed_price;
            matrix[i][3] = buyed_cost_INR;
            matrix[i][4] = convertDate(stocks[0].quantity_each_month[0].buyed_date);
          }
        }
        maxtrixFormation();
        if (matrix) {
          setStock(matrix);
        }
      } else {
        if (stockDetails) {
          const { buyingDate, stocks, buyed_cost_INR } = stockDetails;

          // matrix formation
          for (let i = 0; i < stocks?.length; i++) {
            matrix.push([]);
          }
          for (let i = 0; i < 6; i++) {
            matrix = matrix.map((rowData) => [...rowData, ""]);
          }

          async function maxtrixFormation() {
            for (let i = 0; i < stocks?.length; i++) {
              const { cost, latest_prices, quantity, stock_symbol } = stocks[i];
              matrix[i][0] = stock_symbol;
              matrix[i][1] = quantity;
              matrix[i][2] = cost;
              matrix[i][3] = buyed_cost_INR;
              matrix[i][4] = latest_prices[0];
              matrix[i][5] = convertDate(buyingDate);
            }
          }
          maxtrixFormation();
          if (matrix) {
            setStock(matrix);
          }
        }
      }
    }
  }, [stockDetails]);

  // matrix handle change

  const handleInputChange = (e, rowIndex, colIndex) => {
    const newData = [...stock];
    newData[rowIndex][colIndex] = e.target.value;
    setStock(newData);
  };

  // handle edit stock details
  const handleClick = (e) => {
    e.preventDefault();
    // const notification = toast.loading("Editing  Portfolio details");
    showToast("Editing  Portfolio details", "info");
    dispatch(
      editStockDetails({
        pid,
        itype,
        stock,
        gPId: generatePortfolioId,
        showToast,
      })
    );
  };


  return (
    <div className="mx-5">
      <div className="mx-5">
        <div className="mt-8 md:mt-12 lg:mt-6 hidden lg:block">
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
                  fill="black"
                />
              </svg>
            }
            className="pt-5 pb-10 pl-5"
            onClick={() => navigate(-1)}
          />
          <h3 className="text-3xl font-semibold mb-8">Portfolio</h3>
          <table className="w-full mb-2 ">
            <thead className=" bg-darkGreen text-white ">
              <tr className="text-sm font-medium ">
                <th className="px-5 py-3 rounded-tl-xl">Company Name</th>
                <th className="border-x-2">Shares</th>
                <th>Cost</th>
                <th className="border-x-2">Last Price</th>
                <th>Total Chg</th>
                <th className="border-x-2">Total Chg %</th>
                <th className="rounded-tr-xl">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((data, index) => (
                <tr
                  className="text-center text-xs md:text-sm border-b-2 border-darkGreen relative"
                  key={index}
                >
                  <td className="py-3">{data.companyName}</td>
                  <td>{data.share}</td>
                  <td>{data?.cost || data?.totalCostAverage}</td>
                  <td>{data.latestPrice}</td>
                  <td>{data.totalChange}</td>
                  <td>{data.totalChangeInPercentage}</td>
                  <td>{data.totalValue}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs md:text-sm">
            All currencies are calculated in USD
          </p>
        </div>

        {/* table for medium*/}

        <div className="mt-8 md:mt-12 lg:mt-20 hidden md:block lg:hidden">
          <h3 className="text-xl font-semibold mb-10">Your Holdings</h3>
          <table className="w-full mb-2 ">
            <thead className=" bg-darkGreen text-white ">
              <tr className="text-sm font-medium ">
                <th className="px-5 py-3 rounded-tl-xl">Company Name</th>
                <th className="border-x-2">Shares</th>
                <th>Cost</th>
                <th className="border-x-2">Last Price</th>

                <th className="rounded-tr-xl">Market Value</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((data, index) => (
                <tr
                  className="text-center text-xs md:text-sm border-b-2 border-darkGreen relative"
                  key={index}
                >
                  <td className="py-3">{data.companyName}</td>
                  <td>{data.share}</td>
                  <td>{data.latestPrice}</td>
                  <td>{data?.cost || data?.totalCostAverage}</td>
                  <td>{data.totalValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* table for small device*/}

        <div className="mt-8 md:mt-12 lg:mt-20 md:hidden">
          <h3 className="text-xl font-semibold mb-10">Your Holdings</h3>

          <table className="w-full mb-2 ">
            <thead className=" bg-darkGreen text-white ">
              <tr className="text-sm font-medium ">
                <th className="px-5 py-3 rounded-tl-xl">Company Name</th>
                <th className="border-x-2">Shares</th>
                <th className="border-x-2">Last Price</th>

                <th className="rounded-tr-xl">Market Value</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((data, index) => (
                <tr
                  className="text-center text-xs md:text-sm border-b-2 border-darkGreen relative"
                  key={index}
                >
                  <td className="py-3">{data.companyName}</td>
                  <td>{data.share}</td>
                  <td>{data.latestPrice}</td>
                  <td>{data.totalValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {stock && (
        <div className="mx-4 my-16 space-y-6">
          <h1 className="font-main font-medium text-3xl text-black mx-4">
            Edit User Stock Details
          </h1>

          <table className="w-full mb-2 ">
            <thead className=" bg-darkGreen text-white ">
              <tr className="text-sm font-medium ">
                <th className="px-5 py-3 rounded-tl-xl">Stock Symbol</th>
                <th className="border-x-2">Quantity</th>
                {itype === "lumpsum" && <th>Cost for Stock</th>}

                {itype === "lumpsum" ? (
                  <th className="border-x-2">USD/INR Rate</th>
                ) : (
                  <th className="border-x-2">Purchased Price</th>
                )}
                {itype === "lumpsum" ? (
                  <th className="border-x-2">Purchased Price</th>
                ) : (
                  <th className="border-x-2">USD/INR Rate</th>
                )}

                <th className="rounded-tr-xl">Purchased Date</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((rowData, rowIndex) => (
                <tr
                  className="text-center text-xs md:text-sm border-b-2 border-darkGreen relative"
                  key={rowIndex}
                >
                  {rowData.map((cellData, colIndex) => (
                    <td key={colIndex}>
                      <input
                        value={cellData}
                        className="py-3 h-fit w-full text-center"
                        onChange={(e) =>
                          handleInputChange(e, rowIndex, colIndex)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-full flex justify-end">
            <Button
              text="Update"
              className="px-6 py-1 rounded bg-darkGreen text-white font-semibold mt-auto"
              onClick={handleClick}
            />
          </div>
          {singleEditDetails.screenshot && (
            <div className="w-full lg:w-1/2 flex justify-center ">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-fit flex justify-start mt-10">
                <a href="#" onClick={handleDownload}>
                  Download Image
                </a>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPortfolioDetails;
