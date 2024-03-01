import React, { useState ,useEffect} from "react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import Button from "./Button";
import RateUs from "./Popups/RateUs";
import { getConfig,baseUrl } from "@/Redux/Api";
import axios from "axios";
import { resetState as resetCoreState } from "@/Redux/Features/core";
import { resetState as resetUserState } from "@/Redux/Features/user";
import { resetState as resetTicketState } from "@/Redux/Features/ticket";
import { resetState as resetDashboardState } from "@/Redux/Features/dashboard";
import { resetState as resetAdminState } from "@/Redux/Features/admin";
import { resetState as resetPortfolioState} from '@/Redux/Features/portfolio';
import { resetState as resetNotificationState} from '@/Redux/Features/notification';
import { useDispatch } from "react-redux";
import ConfirmationPopup from "./Popups/ConfirmationPopup";
import MenuListMobile from "./MenuListMobile";
import socket from "@/Redux/Api/socket";
const DashboardNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [isRateUsOpen, setIsRateUsOpen] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [greeting, setGreeting] = useState('');
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
};
// const unSubscribePushNotification = async()=>{
//   try {
//      const registration = await navigator.serviceWorker.ready;
//      const subscription = await registration.pushManager.getSubscription();
//      if(subscription !== null){
//       await subscription.unsubscribe();

//       // Remove the subscription from the server
//       const config = getConfig();
//       const response = await axios.post(`${baseUrl}/web-push/unsubscribe`, { subscription }, config);
//       // console.log(response.data);
//      }
//   } catch (error) {
//     console.error('Error during unsubscribe or server request:', error);
//   }
// }
const handleLogout=async()=>{
//  await unSubscribePushNotification()
  dispatch(resetCoreState());
  dispatch(resetUserState());
  dispatch(resetTicketState());
  dispatch(resetDashboardState());
  dispatch(resetAdminState());
  dispatch(resetPortfolioState());
  dispatch(resetNotificationState());
  socket.disconnect()
  setShowMobileMenu(false)
  navigate('/login')
}
const closeConfirmation=()=>{
  setConfirmationVisible(false)
}
  useEffect(() => {
    // Get the current date and time in the IST time zone
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const currentHour = new Date(currentTime).getHours();

    // Define the time ranges for greetings
    let greetingMessage = '';
    if (currentHour >= 4 && currentHour < 12) {
      greetingMessage = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      greetingMessage = 'Good Afternoon';
    } else {
      greetingMessage = 'Good Evening';
    }

    // Update the state with the greeting message
    setGreeting(greetingMessage);
  }, []);
  const handleClick = () => setShowMobileMenu(!showMobileMenu);

  const data = JSON.parse(localStorage.getItem("status"));
  let status;
  if (data) {
    status = data.status;
  }
  useEffect(() => {
    if (status !== "active") {
      // dispatch(getStatus());
    }
  }, [status]);
  const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : "";
  let userType = "";
  if (user?.role === 1) {
    userType = "admin";
  } else if (user?.role === 2) {
    userType = "sub-admin";
  } else if (user?.role === 0) {
    userType = "user";
  }
 

  return (
    <>
    <header className={`shadow-none md:hidden py-3 relative   z-50 min-w-full ${showMobileMenu? "bg-white text-black": 'bg-darkGreen text-white'}  max-h-[60px]`}>
      <div
        className={` mx-8 flex justify-between items-center realative`}
      >
        <div className="flex gap-4 items-center">
          <button
            onClick={handleClick}
            type="button"
            className=" flex  lg:hidden"
          >
            {showMobileMenu ? (
              <svg
                className="w-5 h-5"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.3337 24.3327L1.66699 1.66602M24.3337 1.66602L1.66699 24.3327"
                  stroke="currentColor"
                  strokeWidth="2.83333"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                width="34"
                height="24"
                viewBox="0 0 34 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="2"
                  y1="-2"
                  x2="32"
                  y2="-2"
                  transform="matrix(1 0 0 -1 0 19.4434)"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="2"
                  y1="-2"
                  x2="32"
                  y2="-2"
                  transform="matrix(1 0 0 -1 0 9.72168)"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="2"
                  y1="-2"
                  x2="32"
                  y2="-2"
                  transform="matrix(1 0 0 -1 0 0)"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
        <Link to={"/"}>
          <div className="flex items-center space-x-0">
            {" "}
            <h1 className="  text-xl font-normal">
              <span className=" font-bold "> KKS</span>
            </h1>
          </div>
        </Link>
        {/* <p className=" text-xs"> {user?.username}</p> */}
        {/* <p className=" text-xs">{greeting}, {user?.username}</p> */}
        <div className="relative">
        {/* <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-3 h-3 p-2 flex items-center justify-center text-sm font-medium">
     5
  </div> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="25" viewBox="0 0 23 25" fill="none">
  <path d="M22.7268 20.4091L22.4675 20.1854C21.7319 19.5446 21.088 18.8098 20.5533 18.0007C19.9693 16.8842 19.6192 15.6648 19.5237 14.4142V10.7308C19.5288 8.76654 18.8 6.86806 17.4743 5.39208C16.1486 3.9161 14.3173 2.96422 12.3243 2.71528V1.75341C12.3243 1.48941 12.2171 1.23622 12.0261 1.04955C11.8352 0.86287 11.5762 0.757996 11.3062 0.757996C11.0362 0.757996 10.7772 0.86287 10.5863 1.04955C10.3953 1.23622 10.2881 1.48941 10.2881 1.75341V2.73019C8.31303 2.99707 6.50381 3.95471 5.19554 5.42573C3.88727 6.89675 3.16858 8.78147 3.1726 10.7308V14.4142C3.07709 15.6648 2.72705 16.8842 2.14303 18.0007C1.61748 18.8078 0.983961 19.5425 0.259299 20.1854L0 20.4091V22.5118H22.7268V20.4091Z" fill="currentColor"/>
  <path d="M9.35767 23.2948C9.42455 23.7674 9.66409 24.2004 10.0321 24.5139C10.4 24.8273 10.8716 24.9999 11.3596 24.9999C11.8476 24.9999 12.3192 24.8273 12.6872 24.5139C13.0551 24.2004 13.2947 23.7674 13.3616 23.2948H9.35767Z" fill="currentColor"/>
</svg>
        </div>
      </div>
    </header>
    <div
      className={`top-[-6px] left-0 w-screen   text-black fixed h-full overflow-scroll  z-40  transition-all ease-in-out duration-700 ${
        showMobileMenu ? "translate-y-[50px] " : "translate-y-[-100%]"
      }`}
    >
      <div className=" h-full  md:hidden bg-white">
        <div className="text-darkGreen text-xl font-semibold leading-loose">
                 <MenuListMobile handleClick={handleClick} location={location}  userType={userType} userRole={user.role} />
        </div>
        <div className="flex flex-col   w-full   text-left">
<Button text={<span className='flex items-center gap-2'>Settings  {isOpen ?  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
        <path d="M0 6L6 0L12 6L0 6Z" fill="currentColor" />
    </svg>:<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
        <path d="M0 0L6 6L12 0L0 0Z" fill="currentColor" />
    </svg> }</span>} onClick={toggleDropdown}
    className="flex mx-6 py-5 gap-6  border-b-2 border-slate-400 text-sm  cursor-pointer items-center text-slate-500"  />
{isOpen && (
        <div className="py- text-[10px] lg:text-sm flex flex-col gap-1 justify-evenly ">
            <Link to={'/account-settings'} onClick={handleClick} className={`flex mx-6 py-5 gap-6  border-b-2 text-sm  cursor-pointer items-center ${location.pathname === '/account-settings' ? 'text-black border-black ' : 'text-slate-500 border-slate-400'}`}>
                Account Settings
            </Link>
            <Button text={'Feedback'} onClick={()=>{setIsRateUsOpen(true)}} className={`flex mx-6 py-5 gap-6  border-b-2 text-sm  cursor-pointer items-center ${location.pathname === '/feedback' ? 'text-black border-black ' : 'text-slate-500 border-slate-400'}'} `} />
            {/* <Link to={'/feedback'} onClick={handleClick} className={`flex mx-6 py-5 gap-6  border-b-2 text-sm  cursor-pointer items-center ${location.pathname === '/feedback' ? 'text-black border-black ' : 'text-slate-500 border-slate-400'}'} `}>
                Feedback
            </Link> */}
            <Link to={'/refer-and-earn'} onClick={handleClick} className={`flex mx-6 py-5 gap-6  border-b-2 text-sm  cursor-pointer items-center ${location.pathname === '/refer-and-earn' ? 'text-black border-black ' : 'text-slate-500 border-slate-400'}`}>
                Refer & Earn
            </Link>
        </div>
)}
  <Button text={'Logout'} onClick={()=>{setConfirmationVisible(true)}}  className={`flex mx-6 py-5 gap-6  border-b-2 text-sm  cursor-pointer items-center text-slate-500 border-slate-400 hover:text-red-400`} />
</div>
      </div>
      <RateUs isOpen={isRateUsOpen} setIsOpen={setIsRateUsOpen} />
      <ConfirmationPopup isOpen={isConfirmationVisible} message={'Are you sure you want to logout'} onConfirm={handleLogout} onCancel={closeConfirmation} />

    </div>
  </>
  )
}

export default DashboardNavBar