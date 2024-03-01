import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import  Button  from "@/components/Button";
import { baseUrl ,getConfig } from "../../Redux/Api";
import { useToast } from "@/components/ToastContext/ToastContext";
const stripePromise = loadStripe(
  "pk_live_51Lb4saSCLh3607pFN0R1CoNAESg0MnzKSGbzLCnfOAoMNp4OQs16wJiL9uTSBFKouI2Q9zr0cODeFSOOsCfcz9Z000MVdxE4mt"
);

const Checkout = () => {
    const { showToast } = useToast();

    const navigate = useNavigate();
    const location = useLocation();
    const [plan] = useState(location?.state?.state)
    const [isValid, setIsValid] = useState(false);
    const [value, setValue] = useState("");
    const formSubmit = useRef(null);
    const surl =`${baseUrl}/payment/payumoney-response`
    const furl = `${baseUrl}/payment/payumoney-response`
    const [productinfo] = useState(location?.state?.state)
    const [data, setData] = useState();
    const [planDetails, setPlanDetails] = useState();
    const [discount, setDiscount] = useState(planDetails?.discount);
    const [subTotal, setSubTotal] = useState(planDetails?.subTotal);
    const [cardPayInited,setCardPayInited] = useState(false)
    const stripePay = async () => {
      try {
        setCardPayInited(true)
        const stripe = await stripePromise;
        const config = getConfig()
  
        const  {data}  = await axios.post(
          `${baseUrl}/payment/create-payment-intent`,
          { productinfo: productinfo, couponCode: value },config
        );
        const result = await stripe.redirectToCheckout({
          sessionId: data.session.id,
        });
        if (result.error) {
          setCardPayInited(false)
  
          throw new Error(result.error.message);
        }
      } catch (error) {
        setCardPayInited(false)
  
      }
    };
    useEffect(() => {
      if (!plan) {
        navigate("/login");
      }
      const fetchPlan = async () => {
        const config = getConfig()
        const { data } = await axios.get(`${baseUrl}/plan/plan-details/${plan}`,config);
        setPlanDetails(data);
      };
      fetchPlan();
    }, []);
  
  
    const handleChange = (event) => {
      setValue(event.target.value.toUpperCase());
      event.preventDefault();
    };
    const validateCoupon = async (e) => {
      try {
        const config = getConfig()
        const response = await axios.post(`${baseUrl}/coupons/validate-coupon`, {
          couponCode: value,
          planDetails,
        },config);
        if (response.data.valid) {
          setPlanDetails(response.data.planDetails);
          setIsValid(true);
          setDiscount(response.data.planDetails.discount);
          setSubTotal(response.data.planDetails.subTotal);
          showToast('Coupon Applied Succesfully',"success")
       
        } else {
            showToast("Invalid Coupon",'error')
         
        }
      } catch (error) {
        if (error.response.status === 400) {
          setValue("")
          showToast(`${error?.response?.data?.message}`,'error')
      }
     
    };
    }
    const removeCoupon = () => {
      setIsValid(false);
      setDiscount(false);
      setSubTotal(false);
      setValue("");
    };
    
    return (
     <>
     <div className="flex flex-col items-center mb-10 md:mb-0 mt-4 md:mt-8 text-[#353F4E]">
<p className="font-semibold text-darkGreen text-xl md:text-4xl  ">Checkout</p>
<Button text={`Go back`} icon={<svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
    </svg>} onClick={()=>navigate(-1)} className={`w-full flex flex-row-reverse items-center justify-center font-semibold  px-5 py-2 text-base text-gray-700 transition-colors duration-200 bg-white mt-4 lg:border rounded-lg gap-x-2 sm:w-auto  hover:bg-gray-100  `} />

         
     </div>
     <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4  lg:gap-10 mt-7 md:mt-10 text-[#353F4E]">
      <div className="md:w-fit w-5/6  bg-neutral-100 rounded-lg">
    <div className="w-full h-full font-medium   p-3 md:p-6  ">
              <p className="font-semibold text-xl text-center md:text-2xl lg:text-3xl">
                Selected Plan : {planDetails?.plan}
              </p>
              <p className="mt-4 text-darkGreen text-center text-base md:text-lg">What's Included ?</p>
              <ul className=" lg:px-10">
                {planDetails?.features.map((plan, index) => (
                  <li key={index} className=" text-base md:text-lg lg:text-xl flex  mb-3 mt-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17" fill="none">
  <path d="M1 7.19355L5.33274 14.7578C5.98291 15.8929 7.52976 16.1086 8.4656 15.1946L23 1" stroke="#353F4E" strokeWidth="2" strokeLinecap="round"/>
</svg>
  
                    <span className="ml-2">{plan}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  navigate("/plans");
                }}
                className="rounded-lg w-full  border
             border-darkGreen p-1 md:p-3 mt-2 text-darkGreen hover:bg-darkGreen hover:text-white
             "
              >
                Change Plan
              </button>
            </div>
          </div>
      <div className="w-fit  bg-neutral-100 rounded-lg ">
<div className=" px-2    md:p-3 md:mt-0 mt-10 rounded-md">
            <p className="font-semibold text-2xl ml-5 md:text-3xl lg:text-4xl">Order Summary</p>
            <table className=" mt-5 font-medium">
              <tbody>
                <tr className="  text-base md:text-lg  lg:text-xl flex items-center justify-between mx-5">
                  <td className="px-2 py-1 "> Plan Amout :</td>
                  <td className="pl-2 min-w-[80px] text-center">{planDetails?.planAmount}</td>
                </tr>
                <tr className="   text-base md:text-lg  lg:text-xl flex items-center justify-between mx-5">
                  <td className="px-2 py-1 ">Shipping Charges :</td>
                  <td className="pl-2 min-w-[80px] text-center">{planDetails?.shippingCharges}</td>
                </tr>
                <tr className="  text-base md:text-lg  lg:text-xl flex items-center justify-between mx-5">
                  <td className="px-2 py-1 ">Tax :</td>
                  <td className="pl-2 min-w-[80px] text-center">{planDetails?.tax}</td>
                </tr>
                <tr className="  text-base md:text-lg  lg:text-xl flex items-center justify-between mx-5">
                  <td className="px-2 py-1 ">Plan Discount : </td>
                  <td
                    className={`text-green-500 
                    pl-2 min-w-[80px] text-center`}
                  >
                    -{planDetails?.planDiscount ? planDetails?.planDiscount : "0"}
                  </td>
                </tr>
                <tr className="   text-base md:text-lg  lg:text-xl flex items-center justify-between mx-5">
                  <td className="px-2 py-1 ">Coupon Discount : </td>
                  <td
                    className={`${
                      isValid ? "text-green-500" : "text-black"
                    }pl-2 min-w-[80px] text-center `}
                  >
                    -{discount ? discount : "0"}
                  </td>
                </tr>
                <div className="flex flex-col px-5">
                  <label className="text-lg mb-2 mt-2 text-darkGreen ">
                    Have any coupons ?{" "}
                  </label>
                  <div className="flex  md:w-80 justify-between ">
                    <input
                      readOnly={isValid}
                      className="p-2 w-32 md:w-full border   border-gray-300 rounded-md mb-2"
                      type="text"
                      placeholder="Enter your coupon code "
                      name="couponCode"
                      maxLength={10}
                      value={value}
                      onChange={handleChange}
                    />
                    <Button
                      text={isValid ? "Applied" : "Verify"}
                      className={`${
                        isValid && "hover:cursor-not-allowed   bg-green-500"
                      } p-2 bg-gray-700 text-white pl-2 ml-3 rounded-md mb-2`}
                      onClick={validateCoupon}
                    />
                    <Button
                      text={"Remove"}
                      className={`${
                        isValid ? "block " : "hidden"
                      }  p-2  text-black border hover:border-black pl-2 ml-3 rounded-md mb-2`}
                      onClick={removeCoupon}
                    />
                  </div>
                </div>
  
                <tr className="  flex items-center justify-between mx-5 text-black  rounded   bg-gray-300   text-base md:text-lg  lg:text-xl">
                  <td className="p-2 ">SubTotal</td>
                  <td className="pl-2 font-medium min-w-[80px] text-center">
                    ₹{subTotal ? Math.ceil(subTotal) : planDetails?.planAmount-planDetails?.planDiscount}
                  </td>
                </tr>
              </tbody>
            </table>
        
           <button
              className={`w-full  bg-gray-700 text-white rounded-md mt-4 p-2 ${cardPayInited ? "text-[#778899]" : "text-white" }`}
              onClick={stripePay}
            >
             {cardPayInited?<div className="w-full flex justify-center items-center text-center" role="status">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="text-[#778899]">Please Wait...</span>
                    </div>:"Pay with Card" }
            </button>
            <Button
              text="Pay With UPI"
              link="/payment/upi"
              state={{ productinfo, couponCode: value }}
              className="w-full flex text-center justify-center bg-gray-700 text-white rounded-md mb-5 mt-4 p-2"
            />
          </div>
      </div>
      </div>
     </>
    );
  };
export default Checkout