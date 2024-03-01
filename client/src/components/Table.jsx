import React, { useState } from "react";

const Table = ({ tableHead, tableData, total }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState(null);

  const handleSort = (column) => {
    setSortColumn(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedData = () => {
    if (!sortColumn) {
      return tableData;
    }

    return tableData.slice().sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };
  return (
    <>
      <div className="w-full lg:flex p-3 lg:justify-center overflow-x-auto custom-scrollbar2">
        <table className="shadow-xl rounded-md w-full">
          <thead className="bg-darkGreen font-main font-fiveHundred rounded-md text-normal text-xl text-white">
            <tr className="border">
              {tableHead?.map((heading, index) => (
                <th
                  key={index}
                  className={`p-4 lg:pl-9 border-r border-white cursor-pointer`}
                  onClick={() => handleSort(heading?.name)}
                >
                  {heading?.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData()?.map((item, dataIndex) => (
              <tr
                className="border-b-2 border-darkGreen text-black font-main font-normal text-xl"
                key={dataIndex}
              >
                {tableHead?.map((tHead, index) => (
                  <td className="text-center p-4" key={index}>
                    {tHead?.render(item, dataIndex)}
                  </td>
                ))}
              </tr>
            ))}
            {total && (
              <tr className="border-b-4 border-darkGreen">
                <td className="p-4 pl-9"></td>
                <td className="p-4 pl-9 font-semibold text-xl ">Total</td>
                <td className="p-4 pl-9"></td>

                <td className="p-4 pl-9  font-semibold text-xl text-center  ">
                  {" "}
                  {total}
                </td>
                <td className="p-4 pl-9"></td>

                <td className="p-4 pl-9"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;