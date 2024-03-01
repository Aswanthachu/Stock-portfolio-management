import React, { useEffect, useState } from "react";
import Table from "@/components/Table";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllStocks, deleteStock } from "@/Redux/Actions/admin";
import Button from "@/components/Button";
import AddStockModal from "../../components/Popups/AddStockModal";
import AddBulkStockModal from "../../components/Popups/AddBulkStockModal";
import {
  calculateTotalPercentage,
  // deleteStockFromState,
} from "@/Redux/Features/admin";
import { DeleteAlert } from "@/components";
// import { Loading } from "../components";

const AddNewStock = () => {
  const dispatch = useDispatch();

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [percentage, setPercentage] = useState(0);

  const [stocks, setStocks] = useState([]);

  const handleDelete = (id) => {
    dispatch(deleteStock({ id }));
    // dispatch(deleteStockFromState({ id, stocks }));
    setStocks((prevState) => prevState.filter((stk) => stk._id !== id));
  };

  const handleEdit = (id) => {
    setEditId(id);
    setIsOpen(true);
  };

  const StockHead = [
    {
      title: "No",
      render: (rowData, index) => {
        return <p>{index + 1}</p>;
      },
    },
    {
      title: "Stock",
      render: (rowData) => {
        return <Link to={`/admin/stocks/${rowData.stock_symbol}`}><span className=" cursor-pointer flex items-center gap-4"> <img src={rowData?.logo_url} alt="Stock Logo"  className="w-12"/><span>{rowData?.stock_symbol}</span></span></Link>;
      },
    },
    {
      title: "Status",
      render: (rowData) => {
        return (
          <span className=" cursor-pointer">
            {rowData?.active ? (
              <p className="text-green-600 font-semibold">Active</p>
            ) : (
              <p className="text-red-600 font-semibold">deleted</p>
            )}
          </span>
        );
      },
    },
    {
      title: "Current Price",
      render: (rowData) => {
        return <span>{rowData?.current_Price}</span>;
      },
    },
    {
      title: "% of Portfolio",
      render: (rowData) => {
        return <span>{rowData?.percentage_portfolio}</span>;
      },
    },
    {
      title: "Quantity",
      render: (rowData) => {
        return <span>(X*25%)/150</span>;
      },
    },

    {
      title: "",
      render: (rowData) => {
        return (
          <div className="space-x-2">
            <Button
              text="Edit"
              className="bg-darkGreen  px-6 text-white"
              onClick={() => handleEdit(rowData._id)}
            />
            <DeleteAlert
              heading="Delete"
              btnClsName="bg-darkGreen hover:bg-darkGreen rounded-none px-6 py-0.5 text-white"
              handleDelete={() => handleDelete(rowData._id)}
              message="This action will lead to soft delete this stock from your stocklist,Upcoming portfolio's doesn't include this stock for portfolio creation."
            />
            {/* <Button
              text="Delete"
              className=
              onClick={}
            /> */}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getAllStocks());
  }, []);

  const stockData = useSelector((state) => state.admin.stockData);
  const totalPercentage = useSelector((state) => state.admin.totalPercentage);

  useEffect(() => {
    setStocks(stockData);
  }, [stockData]);

  useEffect(() => {
    dispatch(calculateTotalPercentage({ stocks }));
  }, [stocks]);

  useEffect(() => {
    setPercentage(totalPercentage);
  }, [totalPercentage]);

  // ##### loading functionality ########

  const loading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    setLoadingStatus(loading);
  }, [loading]);

  

  return (
    <>
     
        <div className="m-10">
          <h4 className="font-sans text-5xl font-medium mx-5">Stock List</h4>

          <Table tableHead={StockHead} tableData={stocks} total={percentage} />

          <div className="flex justify-end gap-8 mx-5">
            <Button
              text="Bulk Upload"
              className="bg-darkGreen text-white px-4 py-2"
              onClick={() => {
                setIsBulkAddOpen(true);
              }}
            />
            <Button
              text="Add New Stock"
              className="bg-darkGreen text-white px-4 py-2"
              onClick={() => {
                setIsOpen(true);
              }}
            />
          </div>
          <p className="text-sm  font-semibold">
            <span className="mr-1 text-red-500 text-lg">*</span>
            Only active stocks percentage is calculated for total percentage.
          </p>
          <AddStockModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            editId={editId}
            setEditId={setEditId}
          />

          <AddBulkStockModal
            isOpen={isBulkAddOpen}
            setIsOpen={setIsBulkAddOpen}
          />
        </div>
    
    </>
  );
};

export default AddNewStock;
