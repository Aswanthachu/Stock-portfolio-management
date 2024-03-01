import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
import { getRevenueDetails } from "@/Redux/Actions/admin";

import {
  Chart as chartjs,
  Title,
  Tooltip,
  ArcElement,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboardData } from "@/Redux/Actions/admin";

// import { Loading } from "../components";

chartjs.register(
  Title,
  Tooltip,
  ArcElement,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const datas = useSelector((state) => state.admin?.dashboardData);
  useEffect(() => {
    dispatch(getAdminDashboardData());
  }, [dispatch]);
 
  const [loadingStatus, setLoadingStatus] = useState(false);

  const loading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    setLoadingStatus(loading);
  }, [loading]);
 

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const [revenue, setRevenue] = useState({});

  useEffect(() => {
    dispatch(getRevenueDetails());
  }, []);

  const revenueDetails = useSelector((state) => state.admin.revenueDetails);

  useEffect(() => {
    setRevenue(revenueDetails);
  }, [revenueDetails]);

  const {
    totalWeekRevenue,
    totalMonthRevenue,
    // totalRevenue,
    // recentTransactions,
  } = revenue;

  // ##### loading functionality ##### //


  useEffect(() => {
    setLoadingStatus(loading);
  }, [loading]);

  return (
    <>
      {!loadingStatus ? (
        <section className="flex min-w-[100%] px-6 md:px-10 py-10  lg:px-20 flex-col font-main">
          <div className="w-full flex space-y-10 lg:space-y-0 lg:space-x-10 flex-wrap lg:flex-nowrap">
            <div className="w-full lg:w-1/3 flex">
              <div className="space-y-4 w-full">
                <h3 className=" font-semibold text-xl ">Total Income</h3>
                <div className="px-9 py-7 bg-darkGreen rounded-2xl text-white shadow-xl" >
                  <p className="font-semibold  md:font-normal">Total Income</p>
                  <p className="font-semibold text-xl">
                    {numberFormat(datas?.totalIncome)}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/3 flex">
              <div className="space-y-4 w-full">
                <h3 className=" font-semibold text-xl ">Total Users</h3>
                <div className="px-9 py-7 bg-darkGreen rounded-2xl text-white shadow-xl">
                  <p className="font-semibold  md:font-normal">Total Users</p>
                  <p className="font-semibold text-xl">{datas?.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/3 flex">
              <div className="space-y-4 w-full">
                <h3 className=" font-semibold text-xl ">Subscribed Users</h3>
                <div className="px-9 py-7 bg-darkGreen rounded-2xl text-white shadow-xl">
                  <p className="font-semibold  md:font-normal">Total Users</p>
                  <p className="font-semibold text-xl">
                    {datas?.totalSubscribedUser}
                  </p>
                </div>
              </div>
            </div>
          </div>

        

          {/* Recent Users and Recent Transactions table*/}
          <div className="flex flex-col md:flex-row justify-start gap-10 mt-16 ">
          <div
        className={`w-full lg:w-fit px-10 py-5 
      bg-[#FFBE0B] text-white space-y-5  rounded-lg shadow-xl`}
      >
        <h1 className="font-main text-lg md:text-xl lg:text-2xl font-medium">
         Monthly Revenue
        </h1>
        <p className="font-sans text-xl font-medium md:text-3xl lg:text-5xl">
          {numberFormat(totalMonthRevenue)}
        </p>
      </div>
      <div
        className={`w-full lg:w-fit px-10 py-5 bg-[#84C6BF] text-black" space-y-5 rounded-lg shadow-xl `}
      >
        <h1 className="font-main text-lg md:text-xl lg:text-2xl font-medium">
        Weekly Revenue
        </h1>
        <p className="font-sans text-xl font-medium md:text-3xl lg:text-5xl">
          {numberFormat(totalWeekRevenue)}
        </p>
      </div>
            </div>
          <div className="w-full flex flex-wrap lg:space-x-5 lg:flex-nowrap">
            <div className="mt-8 md:mt-12 lg:mt-20 w-full lg:w-1/2">
              <h3 className="text-lg md:text-xl lg:text-3xl font-medium mb-5">
                Recent Users
              </h3>
              <div className="overflow-hidden overflow-x-auto">
                <table className="w-full  mb-2">
                  <thead className=" bg-darkGreen text-white ">
                    <tr className="text-xs md:text-base lg:text-lg font-medium ">
                      <th className="px-5 py-3">Mail ID</th>
                      <th className="border-x-2">Time of Registration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datas?.recentUsers?.map((data, index) => (
                      <tr
                        className="text-center text-xs md:text-base lg:text-xl font-main lowercase border-b-2 border-darkGreen relative"
                        key={index}
                      >
                        <td className="py-3">{data.email}</td>
                        <td>
                          {new Date(data.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        
            <div className="mt-8 md:mt-12 lg:mt-20 w-full lg:w-1/2">
              <h3 className="text-lg md:text-xl lg:text-3xl font-medium mb-5">
                Recent Transactions
              </h3>
              <div className="overflow-hidden overflow-x-auto">
                <table className="w-full mb-2 overflow-x-auto">
                  <thead className=" bg-darkGreen text-white ">
                    <tr className="text-xs md:text-base lg:text-lg font-medium ">
                      <th className="px-5 py-3">Mail ID</th>
                      <th className="border-x-2">Amount Transferred</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datas &&
                      datas?.recentTransactions?.map((data, index) => (
                        <tr
                          className="text-center text-xs md:text-base lg:text-xl font-main lowercase border-b-2 border-darkGreen relative"
                          key={index}
                        >
                          <td className="py-3">{data?.email}</td>
                          <td>{numberFormat(data?.amount)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <></>
        // <Loading />
      )}
    </>
  );
};

export default AdminDashboard;
