import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Table";
import Button from "@/components/Button";
import AddCouponModal from "../../components/Popups/AddCouponModal";
import { deleteCoupon, getCoupons } from "@/Redux/Actions/admin";
// import { Loading } from "../components";
const Coupons = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCoupons());
  }, [isOpen]);
  const handleDelete = (data) => {
    dispatch(deleteCoupon({ couponId: data }));
  };
  const couponData = useSelector((state) => state?.admin?.coupons);
  const couponDataHead = [
    {
      title: "No",
      render: (rowData,index) => {
        return (
         <p>{index+1}</p>
        );
      },
    },
    {
      title: "Coupon Code",
      render: (rowData) => {
        return (
          <div className="lg:flex  lg:items-center w-fit text-darkGreen ">
            {rowData.couponCode}
          </div>
        );
      },
    },
    {
      title: "Coupon Type",
      render: (rowData) => {
        return <span className="cursor-pointer">{rowData.couponType}</span>;
      },
    },
    {
      title: "Coupon Value",
      render: (rowData) => {
        return <span>{rowData.couponValue}</span>;
      },
    },
    {
      title: "Coupon Validity",
      render: (rowData) => {
        return <span>{new Date(rowData.validTill).toLocaleDateString("en-GB")}</span>;
      },
    },
    {
      title: "Single Use per User",
      render: (rowData) => {
        return <span>{rowData.isSingleUse? "Yes":"No"}</span>;
      },
    },
    {
      title: "Coupon Description",
      render: (rowData) => {
        return <span>{rowData.couponDescription}</span>;
      },
    },

    {
      title: "Action",
      render: (rowData) => {
        return (
          <Button
            text={"Delete"}
            onClick={() => {
              handleDelete(rowData._id);
            }}
            className="bg-darkGreen px-6 text-white rounded-lg"
          />
        );
      },
    },
  ];

  // ##### loading functionality ##### //
  const [loadingStatus, setLoadingStatus] = useState(false);

  const loading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    setLoadingStatus(loading);
  }, [loading]);

  return (
    <>
      {!loadingStatus ? (
        <div className="p-2  md:p-6">
          <div>
            <Table tableHead={couponDataHead} tableData={couponData} />
            {(couponData?.length === 0) &&  <div className=" flex items-center justify-center ">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl  text-center">No active coupons</h1>
    </div>
    </div>
    }
            <div className="flex justify-end gap-8 mx-5">
              <Button
                text="Add Coupon"
                className="bg-darkGreen text-white px-4 py-2"
                onClick={() => {
                  setIsOpen(true);
                }}
              />
            </div>
          </div>
          <AddCouponModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      ) : (
        <></>
        // <Loading />
      )}
    </>
  );
};

export default Coupons;
