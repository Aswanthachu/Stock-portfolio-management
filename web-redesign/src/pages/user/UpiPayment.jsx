import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ToastContext/ToastContext";
import { getUpiPayment, uploadUpiPaymentDetails } from "../../Redux/Actions/user";
import bhim from "/assets/bhim.svg";
import upi from "/assets/upi.svg";
import Button from "@/components/Button";

const UpiPayment = () => {
    const {showToast} = useToast()
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location.state;
  const payment = useSelector((state) => state.user.upiPaymentData);
  useEffect(() => {
    if (payment?.errorMessage) {
        showToast(`${payment?.errorMessage}`,'error')
      
    }
  }, [payment]);
  useEffect(() => {
    dispatch(getUpiPayment(state));
  }, []);
  const dispatch = useDispatch();
  const [upiData, setUpiData] = useState();
  const handleChange = (e) => {
    setUpiData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const convert2base64 = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];

    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
        showToast("Invalid file type. Only JPEG and PNG images are allowed.",'error')
     
      e.target.value = null;
      return;
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const width = img.width;
          const height = img.height;
          const ratio = width / height;
          const maxWidth = 800;
          const maxHeight = 800 / ratio;
          canvas.width = maxWidth;
          canvas.height = maxHeight;

          ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
          canvas.toBlob(
            (blob) => {
              const newFile = new File([blob], e.target.files[0].name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              const newReader = new FileReader();
              newReader.readAsDataURL(newFile);

              newReader.onload = () => {
                const base64String = newReader.result;
                setUpiData((prevState) => ({
                  ...prevState,
                  screenshort: base64String,
                }));
                resolve(base64String);
              };
            },
            "image/jpeg",
            0.7
          );
        };
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      userId: payment.userId,
      txnid: payment.txnid,
      amount: payment.amount,
      email: payment.email,
      username: payment.firstname,
      upiTransactionId: upiData?.upiTransactionId,
      screenshort: upiData?.screenshort,
      plan: payment.plan,
    };

    dispatch(uploadUpiPaymentDetails({ formData, navigate }));
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen gap-5">
  
      <div className=" w-full md:w-1/2 lg:w-7/12 flex-col  flex items-center ">
        <Button text={`Go back`} icon={<svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
    </svg>} onClick={()=>navigate(-1)} className={`w-full flex flex-row-reverse mb-4 mt-14 md:mt-4 items-center justify-center font-semibold  px-5 py-2 text-base text-gray-700 transition-colors duration-200 bg-white lg:border rounded-lg gap-x-2 sm:w-auto  hover:bg-gray-100  `} />

        <h3 className=" text-2xl md:text-3xl font-main font-semibold text-center text-darkGreen   ">
          Scan , pay & upload the Screenshort
        </h3>
        <a
          className="lg:hidden bg-darkGreen text-white font-main rounded-xl px-4 py-2 my-3"
          href={`upi://pay?pa=7736845337@paytm&pn=KKS-Capitals&am=${Math.ceil(
            payment?.amount
          )}&tn=${payment?.plan}&cu=INR`}
        >
          Pay with UPI
        </a>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex flex-col lg:p-20 p-5 justify-center gap-3"
        >
          <div>
            {" "}
            <label
              className=" font-main  font-medium text-xl md:text-2xl "
              htmlFor="email"
            >
              Email :
            </label>
            <span className="font-medium bg-gray-100 text-gray-600 p-2  rounded-md border   font-main text-lg md:text-xl ml-2">
              {payment?.email}
            </span>
          </div>
          <div>
            {" "}
            <label
              className="font-main  font-medium text-xl md:text-2xl "
              htmlFor="plan"
            >
              Plan :
            </label>
            <span className="font-medium font-main text-lg md:text-2xl ml-2">
              {payment?.plan}
            </span>
          </div>
          <div>
            {" "}
            <label
              className="font-main  font-medium text-xl md:text-2xl "
              htmlFor="amount"
            >
              Amount :
            </label>
            <span className="font-medium font-main text-lg md:text-2xl ml-2">
              {Math.ceil(payment?.amount)}
            </span>
          </div>
          <div>
            <label
              className="font-main  font-medium text-xl md:text-2xl "
              htmlFor="transactionId"
            >
              UPI transaction Id :
            </label>
            <input
              className="font-medium rounded-lg py-1 text-lg md:text-2xl border p-3"
              type="text"
              name="upiTransactionId"
              onChange={handleChange}
            />
          </div>

          <div>
            {" "}
            <label
              className="font-main  font-medium text-lg md:text-2xl"
              htmlFor="screenshort"
            >
              Screenshort :
            </label>
            <input
              accept="image/*"
              type="file"
              name="screenshort"
              onChange={(e) => convert2base64(e)}
            />
          </div>
          <button className="text-lg bg-darkGreen text-white p-2 w-full rounded-xl mt-3">
            Submit
          </button>
        </form>
      </div>
      <div className="  md:w-1/2 lg:w-5/12 mb-20 md:mb-0  flex justify-center items-center lg:h-screen ">
        <div className="h-[500px] w-[300px] lg:w-[400px] flex flex-col items-center  shadow-xl border-2 rounded-2xl">
          <h3 className=" text-black font-main font-semibold text-3xl my-6 w-full text-center bg-green-100">
            KKS CAPITALS
          </h3>
          <QRCode
            size={256}
            value={`upi://pay?pa=7736845337@paytm&pn=KKS Capitals&am=${Math.ceil(
              payment?.amount
            )}&tn=${payment?.plan}&cu=INR`}
          />

          <p className="text-darkGrey my-2">7736845337@paytm</p>
          <p className="text-lg  font-semibold px-4 text-darkGrey">
            Scan and pay with any BHIM UPI app
          </p>
          <div className="flex my-2 gap-2">
            <img className=" h-8" src={bhim} alt="Bhim" />
            <img className=" h-8" src={upi} alt="UPI" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpiPayment;
