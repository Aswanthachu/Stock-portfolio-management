import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const UserSelfCreatedPortfolios = () => {
  const { portfolioId } = useParams();

  const [portfolio, setPortfolio] = useState({});

  const userData = useSelector((state) => state?.admin?.userDetails);

  useEffect(() => {
    const { user_created_portfolios } = userData.user;
    const port = user_created_portfolios?.filter(
      (item) => item._id === portfolioId
    );
    setPortfolio(port[0]);
  }, [portfolioId, userData]);

  return (
    <section className="py-2 px-0.5 md:p-10">
      <div className="hidden md:flex">
        <table className=" mb-2 w-full">
          <thead className=" bg-darkGreen text-white">
            <tr className="text-xs md:text-sm font-medium ">
              <th className="px-5 py-3 rounded-tl-xl"></th>
              <th className="border-x-2 px-5 py-3">Stock</th>
              <th>Quantity</th>
              <th className="border-x-2">Price</th>
              <th>Date</th>
              <th className="border-x-2 rounded-tr-xl md:rounded-tr-none">
                Brokerage
              </th>
              <th className="border-x-2 md:rounded-tr-xl ">Total</th>
            </tr>
          </thead>
          <tbody>
            {portfolio?.stock_details?.map((data, index) => (
              <tr
                className="text-center text-xs md:text-sm border-b-2 border-darkGreen relative"
                key={index}
              >
                <td className="py-3">{index + 1}</td>
                <td>{data.stock_symbol}</td>
                <td>{data.quantity}</td>
                <td>{data.purchased_price}</td>
                <td>
                  {new Date(data.purchased_date).toLocaleString().split(",")[0]}
                </td>
                <td>{data.brokerage}</td>
                <td className="hidden md:flex py-3  justify-center">
                  {data.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex md:hidden">
        <table className=" mb-2 w-full">
          <thead className=" bg-darkGreen text-white">
            <tr className="text-xs md:text-sm font-medium ">
              <th className="px-5 py-3 rounded-tl-xl"></th>
              <th className="border-x-2 px-5 py-3">Stock</th>
              <th>Quantity</th>

              <th className="border-x-2 rounded-tr-xl ">Total</th>
            </tr>
          </thead>
          <tbody>
            {portfolio?.stock_details?.map((data, index) => (
              <tr
                className="text-center text-xs md:text-sm border-b-2 border-darkGreen relative"
                key={index}
              >
                <td className="py-3">{index + 1}</td>
                <td>{data.stock_symbol}</td>
                <td>{data.quantity}</td>
                <td className=" py-3  justify-center">
                  {data.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserSelfCreatedPortfolios;
