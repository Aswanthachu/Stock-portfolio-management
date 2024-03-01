import React, { useEffect } from "react";
import  Button from '@/components/Button'
import { useLocation } from "react-router-dom";
import correctIcon from "/assets/correct-icon.png";

const UpiUpdateStatus = () => {
  const location = useLocation();
  const data = location?.state;
  useEffect(() => {
    if (data) {
      window.gtag("event", "conversion", {
        send_to: "AW-11095003306/CyDQCKP0n5QYEKqhwaop",
        transaction_id: data,
      });
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-[100vh] justify-center items-center">
      <img className="w-40 py-5" src={correctIcon} alt="" />

      <h3 className="text-green-500 font-main text-2xl text-center w-full ">
        Your Payment Details updated successsfully
      </h3>

      <p className="font-main text-lg my-4 text-center w-full">
        It may takes upto 12 Hours to reflect in your dashboard <br />
         In the meantime if you have any queries , you can raise a ticket in the ticket section and our support team will connect with you soon .
      </p>
      <Button
        text="Home"
        link="/dashboard"
        className="bg-darkGreen text-white rounded-lg text-xl px-4 py-2 "
      />
    </div>
  );
};

export default UpiUpdateStatus;
