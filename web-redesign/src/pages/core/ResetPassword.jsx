import { useState , useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from 'moment';
// import newPassImage from "../assets/new-pass.png";
import { resetPassword } from "@/Redux/Actions/core";
import axios from "axios";
import { baseUrl } from "@/Redux/Api";
import { useToast } from "@/components/ToastContext/ToastContext";
const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    const {showToast} = useToast()
    const [tokenExpired,setTokenExpired] = useState(false)
    useEffect(()=>{
      const fetchData = async()=>{
        const {data} = await axios.post(`${baseUrl}/user/validate-reset-password-token`,{"token":token})
        if(data.status){
          const expirationDate = moment.unix(data?.expireAt);
        const currentTime = moment();
        const timeDiff = expirationDate.diff(currentTime);
        const duration = moment.duration(timeDiff);
  
        const interval = setInterval(() => {
          duration.subtract(1, 'second');
          const formattedDuration = formatDuration(duration);
          setExpirationTime(formattedDuration);
          if (duration.asSeconds() <= 0) {
            clearInterval(interval);
            setTokenExpired(true)        }
        }, 1000);
  
        return () => clearInterval(interval);
        }else{
          setTokenExpired(true)
        }
        
      }
    
      
      fetchData()
    },[])
    const [expirationTime, setExpirationTime] = useState('');
    const [passwordData, setPasswordData] = useState({
      password: "",
      cpassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
  
    const { password, cpassword } = passwordData;
  
    const handleChange = (e) => {
      setPasswordData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    };
  
    const formatDuration = (duration) => {
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      setErrorMessage("");
      if (!password || !cpassword) {
        setErrorMessage("Please Enter a valid password and confirm it.");
      } else if (password !== cpassword) {
        setErrorMessage("Passwords should be equal.");
      } else if (
        !/^(?=.*[a-z])/.test(password) ||
        !/^(?=.*[A-Z])/.test(password) ||
        !/^[a-zA-Z0-9!@#$%^&*_]{6,16}$/.test(password)
      ) {
        setErrorMessage(
          "Password should contain atleast one capital letter , small letter, number , special character"
        );
      } else {
        dispatch(resetPassword({ password, token, navigate ,showToast}));
      }
    };
  
    return (
      <>
      {!tokenExpired ?  <div className="flex     w-full justify-center">
       
        <div className="flex flex-col justify-center   mt-28 md:mt-8 ">
          <p className="  font-main font-[400] text-xl  md:text-2xl  ">
            | Reset Password
          </p>
          <p className="font-sans text-3xl   md:text-6xl mt-3 items-center ">
            Time to get a <br />{" "}
            <span className=" text-4xl md:text-7xl font-bold">
              New Password!{" "}
            </span>{" "}
          </p>
          <p className="font-main font-[400]   text-xl md:text-2xl mt-4">
            Let us Help you get back on the track!
          </p>
         <h4>Token expiration time: {expirationTime}</h4> 
          <div className="flex  flex-col mt-14">
            <label>Enter a New password</label>
            <input
              className="border-b border-black mt-3 text-xl"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex  flex-col mt-14">
            <label>Confirm the new password</label>
            <input
              className="border-b border-black mt-3 text-xl"
              type="password"
              name="cpassword"
              value={cpassword}
              onChange={handleChange}
              required
            />
          </div>
          <button
            className="btn mt-10  md:mt-14 bg-darkGreen rounded-lg text-white p-4"
            onClick={handleSubmit}
          >
            Reset Password
          </button>
          {errorMessage && (
            <p className="text-red-500 mt-4 md:mt-3 text-sm my-5 font-medium flex ">
              <span className="text-xl mr-1">*</span>
              {errorMessage}
            </p>
          )}
  
          <p className="font-sans mt-9"> ✓ should contain atleas 8 characters</p>
          <p className="font-sans mt-3">✕ Should be Alphanumerical</p>
        </div>
        <div className="  ml-96  hidden lg:flex ">
          {/* <img className=" w-96  rounded" src={newPassImage} alt="" /> */}
        </div>
      </div>:
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl mb-6">Reset Password Session Expired</h1>
        <p className="text-lg mb-6">The link to reset your password has expired or is invalid.</p>
        <p className="text-lg mb-6">Please request a new password reset link.</p>
        <p><a className="text-blue-500 underline" href="/forgot-password">Request Password Reset</a></p>
      </div>
    </div>
      }
      </>
     
    );
  };
export default ResetPassword