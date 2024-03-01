import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import PaymentFailed from "@/components/PaymentFailed";
import PaymentSuccess from "@/components/PaymentSuccess";
import { RoutingAfterPayment } from "@/Redux/Actions/user";

const PaymentStatus = () => {
    const dispatch=useDispatch();
    const navigate = useNavigate();
  
    const { status, txnId } = useParams();
  
    if (status === "success")
      localStorage.setItem("status", JSON.stringify({ status: "active" }));
  
  
    useEffect(() => {
      if (status === "success") {
         // Track a conversion when the user completes a purchase
      window.gtag('event', 'conversion', {
        'send_to':  "AW-11095003306/CyDQCKP0n5QYEKqhwaop",
        'transaction_id': txnId
      });
      dispatch(RoutingAfterPayment(navigate));
        
      } else {
        setTimeout(() => {
          navigate("/plans");
        }, 5000);
      }
    }, [status]);
  
    return (
      <div className="flex flex-col justify-center item-center  font-main ">
      
       
       
          {status === "success" ? (
            <PaymentSuccess />
         
          ) : (
           <PaymentFailed />
          )}
        </div>
    );
  };

export default PaymentStatus