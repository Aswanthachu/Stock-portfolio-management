import React, { useState } from "react";
import { DropdownIcon, NoData } from "@/assets";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { SubscribeButton, TableSkelton } from "..";
import { Link } from "react-router-dom";
const Table = ({
  columns,
  title,
  headings,
  data,
  numbering,
  isLoading,
  setIsOpen,
  planStatus,
  logo,
  usExchangeRate,
  symbol,
  stocklist
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };
  return (
    <section className="py-10 space-y-6 -mx-4 md:mx-0">
      {title && (
        <p className="text-darkGreen text-xl font-bold ml-2">{title}</p>
      )}

      <div className={cn(stocklist && "overflow-x-auto styled-scrollbar","w-full")}>
        <table className={cn(stocklist ? "w-full min-w-[700px] md:min-w-[900px]":"w-full  min-w-fit lg:min-w-[1000px]","text-gray-600")}>
          {headings && (
            <thead className="w-full">
              <tr className={cn("space-x-5 grid", columns)}>
                {numbering && (
                  <th className="flex bg-lightGrey p-2 rounded-md justify-center items-center font-semibold text-sm md:text-base">
                    No.
                  </th>
                )}
                {headings.map((heading, index) => (
                  <th
                    key={index}
                    className={cn(
                      " bg-lightGrey p-0.5 md:p-2 rounded-md justify-center items-center font-semibold text-xs md:text-base",
                      index === 0 && "col-span-2",
                      heading === "Amount to invest" && "col-span-2",
                      heading === "Total Chg" ||
                        heading === "Total Chg%" ||
                        heading === "Cost"
                        ? "hidden lg:flex"
                        : "flex",
                        heading === "Last price" && "hidden md:flex"
                    )}
                  >
                    <span className="text-xs md:text-base">{heading}</span>
                    {heading === "Amount to invest" && (
                      <div className="flex items-center ml-5 space-x-1">
                        <select
                          className="px-1   focus:outline-none focus:shadow-outline-gray focus:border-gray-300 rounded-md bg-gray-300 text-gray-700"
                          value={selectedCurrency}
                          onChange={handleCurrencyChange}
                        >
                          <option value="USD">USD</option>
                          <option value="INR">INR</option>
                        </select>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {isLoading ? (
              <TableSkelton
                columns={columns}
                headings={headings}
                numbering={numbering}
              />
            ) : (
              <>
                {data &&
                Object.keys(data)?.length > 0 &&
                !isLoading &&
                planStatus === "active" ? (
                  Object.keys(data)?.map((key, index) => (
                    <div key={index}>
                      <>
                        <tr
                          className={cn(
                            "grid space-x-5 text-center space-y-4 md:space-y-7",
                            columns
                          )}
                        >
                          {numbering && (
                            <td className="col-span-1 flex items-end justify-center">
                              {index + 1}
                            </td>
                          )}
                          {key && (
                            <td className="flex items-end w-full justify-start pl-10 col-span-2 ">
                              <Link
                                className="flex items-center gap-5 text-xs md:text-base"
                                to={symbol ? `/stocks/${symbol[key]}` : "#"}
                              >
                                {logo && (
                                  <img
                                    src={logo[key]}
                                    alt="Stock Logo"
                                    className="w-6 h-6"
                                  />
                                )}
                                <p className="font-semibold text-xs md:text-base">{key}</p>
                              </Link>
                            </td>
                          )}
                          {Object.entries(data[key]).map(
                            ([key2, value], indx) => (
                              <td
                                className={cn(
                                  "items-end justify-center",
                                  key2 === "amount_invest"
                                    ? "col-span-2"
                                    : "col-span-1",
                                  key2 === "totalCostAverage" || key2=== "cost" ||
                                    key2 === "totalChange" ||
                                    key2 === "totalChangeInPercentage" ? "hidden lg:flex" :"flex",
                                    key2 === "latestPrice" && "hidden md:flex"
                                )}
                                key={indx}
                              >
                                {key2 === "totalChange" ||
                                key2 === "totalChangeInPercentage" ? (
                                  <span className="flex gap-2">
                                    <DropdownIcon
                                      className={cn(
                                        value < 0
                                          ? "fill-red-600"
                                          : "fill-green-500 rotate-180",
                                        "w-3"
                                      )}
                                    />
                                    <p
                                      className={cn(
                                        value < 0
                                          ? "text-red-600"
                                          : "text-green-500"
                                      ,"text-xs md:text-base")}
                                    >
                                      {Number(value)}
                                    </p>
                                  </span>
                                ) : key2 === "amount_invest" &&
                                  selectedCurrency === "INR" ? (
                                  <p className="gap-4 text-xs md:text-base">
                                    <span>
                                      {(
                                        Number(value) * Number(usExchangeRate)
                                      ).toFixed(2)}
                                    </span>
                                    <span className="ml-3">
                                      {selectedCurrency}
                                    </span>
                                  </p>
                                ) : (
                                  <p className="text-xs md:text-base font-semibold">
                                    <span>{value && Number(value)}</span>
                                    <span className="ml-3">
                                      {key2 === "amount_invest" &&
                                        selectedCurrency}
                                    </span>
                                  </p>
                                )}
                              </td>
                            )
                          )}
                        </tr>
                        <hr className="mt-2 border-gray-300" />
                      </>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col justify-center md:px-20 lg:px-0 items-start lg:items-center py-20 gap-10 ml-10 md:ml-8 lg:ml-0">
                    <NoData className="  w-[300px] md:w-[400px] lg:w-[500px]" />
                    {planStatus === "active" ||
                    planStatus === "notSubscribed" ||
                    !planStatus ? (
                      <Button
                        className="bg-darkGreen text-white hover:bg-darkGreen hover:text-white ml-14 md:ml-20 lg:ml-0"
                        onClick={() => setIsOpen(true)}
                      >
                        Create new portfolio
                      </Button>
                    ) : (
                      <SubscribeButton className="ml-20 md:ml-24 lg:ml-0" />
                    )}
                  </div>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs md:text-sm font-semibold">
        <span className="text-red-600 text-base font-bold mr-1">*</span>All
        currencies are calculated in USD.
      </p>
    </section>
  );
};

export default Table;
