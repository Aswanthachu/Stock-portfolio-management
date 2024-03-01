import { useState, useEffect } from "react";
import Button from "@/components/Button";

import { useDispatch, useSelector } from "react-redux";
import {
  getunVerifiedUpi,
  rejectUpiPayment,
  verifyUpiPayment,
} from "@/Redux/Actions/admin";
// import { getAdminNotificationCount } from "../Redux/Actions/user";
// import { Loading } from "../components";
const VerifyUpi = () => {
  const dispatch = useDispatch();
  const upiData = useSelector((state) => state.admin.unverifiedPayment);
  useEffect(() => {
    dispatch(getunVerifiedUpi());
  }, []);
  const handleReject = async (id) => {
    dispatch(rejectUpiPayment({ id: id }));
    // dispatch(getAdminNotificationCount());
  };
  const handleVerify = async (id) => {
    dispatch(verifyUpiPayment({ id: id }));
    // dispatch(getAdminNotificationCount());
  };

  // ##### loading functionality ##### //
  const [loadingStatus, setLoadingStatus] = useState(false);

  const loading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    setLoadingStatus(loading);
  }, [loading]);

  const convert=(data)=>{
    var date = new Date(data);
    return date.getDate() +  "/" + date.getMonth() + "/" + date.getFullYear()
  }

  return (
    <>
      {!loadingStatus ? (
        <div>
          <div className=" ml-7">
            <h4 className="text-2xl font-main font-semibold">
              Un-Verified Payments
            </h4>
            {upiData &&
              upiData?.map((item, index) => (
                <form
                  key={index}
                  className="flex border border-darkGreen rounded-xl m-5 justify-evenly items-center"
                >
                  <div>
                    <div>
                      <label
                        className="text-lg text-darkGrey font-medium font-main"
                        htmlFor="username"
                      >
                        Username :
                      </label>
                      <span className="font-main  font-semibold">
                        {item.username}
                      </span>
                    </div>
                    <div>
                      <label
                        className="text-lg text-darkGrey font-medium font-main"
                        htmlFor="email"
                      >
                        Email :
                      </label>
                      <span className="font-main  font-semibold">
                        {item.email}
                      </span>
                    </div>
                    <div>
                      <label
                        className="text-lg text-darkGrey font-medium font-main"
                        htmlFor="plan"
                      >
                        Plan :
                      </label>
                      <span className="font-main  font-semibold">
                        {item.plan}
                      </span>
                    </div>
                    <div>
                      <label
                        className="text-lg text-darkGrey font-medium font-main"
                        htmlFor="amount"
                      >
                        Amount :
                      </label>
                      <span className="font-main  font-semibold">
                        {item?.amount}
                      </span>
                    </div>
                    <div>
                      <label
                        className="text-lg text-darkGrey font-medium font-main"
                        htmlFor="transactionId"
                      >
                        Transaction Id :
                      </label>
                      <span className="font-main  font-semibold">
                        {item.upiTransactionId}
                      </span>
                    </div>
                    <div>
                      <label
                        className="text-lg text-darkGrey font-medium font-main"
                        htmlFor="transactionId"
                      >
                        Uploaded Date :
                      </label>
                      <span className="font-main  font-semibold">
                        {item?.createdAt && convert(item?.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-lg text-darkGrey font-medium font-main"
                      htmlFor="screenshort"
                    >
                      Screenshort :
                    </label>
                    <img
                      src={item.screenshort}
                      alt="screenshort"
                      className="w-72 h-72"
                    />
                  </div>
                  <div className="">
                    <Button
                      text="Verify"
                      className="bg-darkGreen text-lg font-main m-2 text-white px-2 rounded-xl"
                      onClick={() => handleVerify(item._id)}
                    />
                    <Button
                      text="Reject"
                      className="bg-red-500 text-lg font-main m-2 text-white px-2 rounded-xl"
                      onClick={() => handleReject(item._id)}
                    />
                  </div>
                </form>
              ))}
              {upiData?.length<1&& <div className=" w-full flex justify-center items-center h-52"> <span className="font-main text-2xl font-semibold text-darkGrey">No Un-Verified Payments</span></div>}
          </div>
        </div>
      ) : (
        <></>
        // <Loading />  
      )}
    </>
  );
};

export default VerifyUpi;
