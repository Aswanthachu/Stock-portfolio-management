import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewStocks, editStock } from "@/Redux/Actions/admin";

import Button from "@/components/Button";

const AddStockModal = ({ isOpen, setIsOpen, editId, setEditId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    stock: "",
    portfolioPercentage: "",
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const handleCancel = () => {
    setFormData({
      stock: "",
      portfolioPercentage: "",
    });
    setEditId("");
    setIsOpen(false);
  };
  const handleSubmit = (id) => {
    setIsOpen(false);
    if (id) dispatch(editStock({ id, formData }));
    else dispatch(addNewStocks({ formData }));
    setFormData({
      stock: "",
      portfolioPercentage: "",
    });
    setEditId("");
  };

  const stocks = useSelector((state) =>
    state.admin.stockData ? state.admin.stockData : ""
  );

  useEffect(() => {
    if (stocks) {
      const stockDetails = stocks.filter((stk) => stk._id === editId);
      setFormData((prevState) => ({
        ...prevState,
        stock: stockDetails[0]?.stock_symbol,
        portfolioPercentage: stockDetails[0]?.percentage_portfolio,
      }));
    }
  }, [editId]);

  return (
 
    <>
    {isOpen && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
      <div className="flex flex-col justify-center bg-white items-center shadow-2xl rounded-xl p-8 mx-5 md:mx-36 lg:mx-96 my-32 md:ml-44 lg:my-20 ">
        <h5 className="text-darkGreen font-medium font-main text-xl md:text-2xl w-full text-start ">
          Add new Stock
        </h5>

        <div className="w-full mt-6 mb-2">
          <label
            for="description"
            className="block mb-0 text-lg md:text-2xl font-medium text-darkGreen"
          >
            Stock Name
          </label>
          <input
            name="stock"
            id="stock"
            placeholder="Enter Stock Name"
            value={formData.stock}
            className="border-b-2 border-darkGreen w-full placeholder:text-darkGreen mb-5 text-darkGreen "
            onChange={onChange}
          />

          <label
            for="description"
            className="block mb-0 text-lg md:text-2xl font-medium text-darkGreen"
          >
            % of Portfolio
          </label>
          <input
            name="portfolioPercentage"
            id="portfolioPercentage"
            placeholder="Enter % of Portfolio"
            value={formData.portfolioPercentage}
            className="border-b-2 border-darkGreen w-full placeholder:text-darkGreen mb-5 text-darkGreen "
            onChange={onChange}
          />

          <Button
            text="Add new Stock"
            className="bg-darkGreen text-white rounded-xl px-4 py-1"
            onClick={() => handleSubmit(editId)}
          />
          <Button
            text="Cancel"
            className="text-darkGreen hover:bg-slate-100  rounded-xl px-4 py-1 ml-3 font-semibold"
            onClick={() => {
              handleCancel();
            }}
          />
        </div>
      </div>
      </div>
      )}


    </>
  );
};

export default AddStockModal;
