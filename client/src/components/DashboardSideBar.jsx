import React, { useState,useEffect } from 'react'
import Button from './Button'
import { useDispatch } from 'react-redux'
import axios from 'axios';
import { getConfig,baseUrl } from '@/Redux/Api';
import { resetState as resetCoreState } from "@/Redux/Features/core";
import { resetState as resetUserState } from "@/Redux/Features/user";
import { resetState as resetTicketState } from "@/Redux/Features/ticket";
import { resetState as resetDashboardState } from "@/Redux/Features/dashboard";
import { resetState as resetAdminState } from "@/Redux/Features/admin";
import { resetState as resetPortfolioState} from '@/Redux/Features/portfolio';
import { resetState as resetNotificationState} from '@/Redux/Features/notification';
import { Link, useLocation ,useNavigate } from 'react-router-dom'
import RateUs from './Popups/RateUs'
import ConfirmationPopup from './Popups/ConfirmationPopup'
import MenuList from './MenuList'
import socket from '@/Redux/Api/socket';
const DashboardSideBar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [isConfirmationVisible, setConfirmationVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isRateUsOpen, setIsRateUsOpen] = useState(false);
    const [expandMenu, setExpandMenu] = useState(true)
    const [userType, setUserType] = useState("");
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
      navigate('/login')
    }
    const closeConfirmation=()=>{
        setConfirmationVisible(false)
    }
    const toggleMenu = () => {
        setExpandMenu(!expandMenu)
    }
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";
    const data = JSON.parse(localStorage.getItem("status"));
    let status;
    if (data) {
      status = data.status;
    }

  useEffect(() => {
    if (user?.role === 1) {
      setUserType("admin");
    } else if (user?.role > 1) {
      setUserType("sub-admin");
    } else if (user?.role === 0) {
      setUserType("user");
    }
  }, [user]);
    return (
        <div
        className={`hidden md:flex ${expandMenu ? "lg:min-w-[220px] lg:w-[16%]" : 'lg:w-[8%]'} font-sans md:w-[16%] lg:px-3 h-screen bg-darkGreen duration-500 justify-between items-center flex-col py-2 lg:py-5 text-white z-50 left-0`}
        style={{
          transition: 'width 0.5s ease', // Add a transition for the width property
        }}
      >
        <div className='flex flex-col w-full h-full justify-between'>
          <div className={`font-semibold text-xl text-center flex justify-center h-[8%] items-center gap-3`}>
            <Button
              icon={
                <svg className='w-5 h-6' xmlns="http://www.w3.org/2000/svg" width="27" height="22" viewBox="0 0 27 22" fill="none">
                  <path d="M1 1H26" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M1 11H26" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M1 21H26" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              onClick={toggleMenu}
            />
      
            <img className={`w-4/5 hidden ${expandMenu && 'lg:block'}`} src='/assets/KKS-logo.png' alt='KKS-Capitals' />
            <img className={`w-fit block ${expandMenu && 'lg:hidden'}`} src='/assets/KKS-logo-small.png' alt='KKS-Capitals' />
          </div>

                <div className={`w-full  flex flex-col ${expandMenu&& userType==='user'? 'lg:pl-4  lg:text-lg lg:h-[40%] lg:justify-evenly lg:leading-[22px]' : expandMenu && 'lg:pl-4  lg:text-lg lg:h-[65%] lg:justify-evenly lg:leading-[22px]' }   font-poppins text-xs gap-5 lg:gap-0  h-[50%]  font-semibold `}>
                
                <MenuList expandMenu={expandMenu} location={location} userType={userType} userRole={user.role} />

                </div>
               {userType==='user' && <div className={`w-full ${expandMenu && 'lg:flex' }  justify-center hidden   h-[20%]`}>
                    <div className="w-[85%] h-fit flex flex-col justify-evenly items-center my-auto py-2  bg-teal-50 rounded-[10px]">
                        <h3 className=" text-center text-gray-700 text-xs lg:text-sm font-semibold  ">Upgrade to pro</h3>
                        <div className="w-full  text-center flex flex-col items-center ">
                            <div className=" text-center text-gray-700 text-[8px] lg:text-[10px] font-normal">To access all premium<br />Features.</div>
                            <Button link={'/plans'} className=" text-center text-teal-50 text-[8px] lg:text-xs font-normal rounded-lg w-fit px-4 py-1 bg-darkGreen " text={"Upgrade"} />
                        </div>

                    </div>
                </div>}
                <div className='flex flex-col  gap-3  lg:gap-1 py-3 items-center justify-end h-[42%] w-full  '>

                   { user.role !==1 &&<div className={`flex flex-col items-center  w-full justify-center gap-4 ${expandMenu? 'lg:gap-4':'gap-0'}  text-left`}>

                        <button
                            onClick={toggleDropdown}
                            className={`flex flex-col ${expandMenu ? 'lg:flex-row lg:text-lg': 'lg:text-sm'}  items-center gap-2 text-xs font-semibold `}
                        >
                            <svg className={`w-7 h-7 ${expandMenu ? 'lg:w-6 lg:h-6' : isOpen&&'lg:hidden lg:w-0'} `} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 35" fill="none">
                                <path d="M16.5063 12.7347C15.342 12.7347 14.2517 13.1885 13.4262 14.0178C12.6045 14.8471 12.1489 15.9424 12.1489 17.112C12.1489 18.2816 12.6045 19.3769 13.4262 20.2062C14.2517 21.0316 15.342 21.4893 16.5063 21.4893C17.6706 21.4893 18.761 21.0316 19.5865 20.2062C20.4081 19.3769 20.8637 18.2816 20.8637 17.112C20.8637 15.9424 20.4081 14.8471 19.5865 14.0178C19.1833 13.6096 18.7034 13.286 18.1746 13.0658C17.6458 12.8455 17.0788 12.733 16.5063 12.7347ZM32.5613 21.9469L30.4402 20.1256C30.1758 19.8987 30.0514 19.5508 30.0936 19.205C30.1624 18.6411 30.1977 18.071 30.1977 17.5032C30.1977 16.9361 30.1625 16.3645 30.0938 15.8019C30.0516 15.4557 30.176 15.1075 30.4406 14.8803L32.5613 13.0594C32.7537 12.894 32.8914 12.6736 32.9561 12.4277C33.0208 12.1817 33.0094 11.9218 32.9235 11.6825L32.8884 11.5808C32.1875 9.61194 31.1374 7.78697 29.7888 6.19427L29.7187 6.11212C29.5549 5.9187 29.3367 5.77965 29.0927 5.71331C28.8487 5.64697 28.5904 5.65646 28.3519 5.74051L25.7244 6.67994C25.3929 6.79844 25.0252 6.73174 24.7448 6.51903C23.845 5.8366 22.8726 5.27026 21.8373 4.83153C21.5139 4.69449 21.2726 4.41039 21.209 4.06496L20.7002 1.30066C20.6541 1.05047 20.5332 0.820306 20.3538 0.640738C20.1743 0.46117 19.9448 0.340701 19.6955 0.295338L19.5904 0.275779C17.5655 -0.0919264 15.4316 -0.0919264 13.4067 0.275779L13.3016 0.295338C13.0523 0.340701 12.8228 0.46117 12.6433 0.640738C12.4639 0.820306 12.343 1.05047 12.2969 1.30066L11.7836 4.08457C11.7203 4.42786 11.4815 4.71074 11.1606 4.84834C10.1349 5.28827 9.16623 5.85182 8.27591 6.52657C7.99522 6.7393 7.62736 6.80623 7.29571 6.68771L4.6452 5.74051C4.40675 5.65579 4.14829 5.64596 3.90415 5.71234C3.66001 5.77872 3.44176 5.91816 3.2784 6.11212L3.20831 6.19427C1.86213 7.78867 0.812221 9.61318 0.108686 11.5808L0.0736398 11.6825C-0.10159 12.1714 0.0424879 12.7191 0.435782 13.0594L2.5866 14.9034C2.85174 15.1308 2.97628 15.4796 2.93437 15.8264C2.86724 16.3818 2.83449 16.9427 2.83449 17.4993C2.83449 18.0601 2.86706 18.621 2.93383 19.1721C2.97584 19.5189 2.8519 19.868 2.58704 20.0958L0.44357 21.9391C0.25119 22.1045 0.113501 22.3249 0.0488115 22.5709C-0.0158775 22.8168 -0.00450131 23.0767 0.0814277 23.316L0.116474 23.4178C0.821288 25.3854 1.86099 27.2043 3.2161 28.8042L3.28619 28.8864C3.44995 29.0798 3.66821 29.2189 3.9122 29.2852C4.15619 29.3515 4.41447 29.3421 4.65299 29.258L7.30314 28.3109C7.63498 28.1923 8.00309 28.2594 8.28359 28.4727C9.17554 29.151 10.1395 29.7153 11.1642 30.1511C11.4872 30.2884 11.7284 30.5723 11.792 30.9175L12.3047 33.6979C12.3508 33.948 12.4716 34.1782 12.6511 34.3578C12.8305 34.5373 13.0601 34.6578 13.3094 34.7032L13.4145 34.7227C15.4593 35.0924 17.5534 35.0924 19.5982 34.7227L19.7033 34.7032C19.9525 34.6578 20.1821 34.5373 20.3616 34.3578C20.541 34.1782 20.6618 33.948 20.708 33.6979L21.2171 30.932C21.2805 30.5874 21.5208 30.3037 21.8433 30.1666C22.8792 29.7262 23.8522 29.1616 24.7525 28.4794C25.033 28.2668 25.4007 28.2001 25.7322 28.3186L28.3597 29.258C28.5981 29.3427 28.8566 29.3526 29.1007 29.2862C29.3449 29.2198 29.5631 29.0804 29.7265 28.8864L29.7966 28.8042C31.1517 27.1965 32.1914 25.3854 32.8962 23.4178L32.9312 23.316C33.0987 22.831 32.9546 22.2873 32.5613 21.9469ZM16.5063 23.9889C12.7253 23.9889 9.66068 20.9103 9.66068 17.112C9.66068 13.3137 12.7253 10.2351 16.5063 10.2351C20.2874 10.2351 23.352 13.3137 23.352 17.112C23.352 20.9103 20.2874 23.9889 16.5063 23.9889Z" fill="white" />
                            </svg> <span className='flex items-center gap-2'>Settings  {isOpen ?  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                                <path d="M0 6L6 0L12 6L0 6Z" fill="white" />
                            </svg>:<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                                <path d="M0 0L6 6L12 0L0 0Z" fill="white" />
                            </svg> }</span>
                        </button>
                        {isOpen && (
                                <div className={`text-[10px] ${expandMenu?'lg:text-sm': 'lg:text-[10px]'}  flex flex-col gap-4 lg:gap-1 justify-evenly"`} >
                                    <Link to={'/account-settings'} className={`flex flex-col ${expandMenu&& 'lg:flex-row lg:gap-2 ' } lg:gap-0  gap-2 items-center justify-start px-2 py-1 text-center rounded-lg ${location.pathname === '/account-settings' ? 'bg-white  text-darkGreen' : 'hover:bg-green-300 hover:bg-opacity-20'} `}>
                                        <svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="none">
                                            <g filter="url(#filter0_d_872_7903)">
                                                <path d="M24.617 8C25.058 8 25.4524 8.2745 25.6009 8.68549L26.6599 11.621C27.0394 11.7155 27.3649 11.81 27.6409 11.909C27.9424 12.017 28.3308 12.1805 28.8108 12.4039L31.2767 11.099C31.478 10.9923 31.7085 10.9538 31.9335 10.9893C32.1585 11.0247 32.3659 11.1321 32.5247 11.2955L34.6936 13.5379C34.9816 13.8364 35.0626 14.2729 34.9006 14.6539L33.7442 17.3644C33.9362 17.7169 34.0891 18.0184 34.2061 18.2704C34.3321 18.5449 34.4881 18.9229 34.6741 19.4104L37.3695 20.5654C37.7745 20.7378 38.025 21.1428 37.998 21.5763L37.8 24.6888C37.7865 24.891 37.7139 25.0848 37.5912 25.2461C37.4686 25.4074 37.3013 25.5292 37.11 25.5963L34.5571 26.5038C34.4836 26.8563 34.4071 27.1578 34.3261 27.4128C34.1955 27.8066 34.0463 28.194 33.8792 28.5738L35.1616 31.4087C35.2521 31.6079 35.2765 31.8308 35.2311 32.0449C35.1858 32.2589 35.0731 32.4528 34.9096 32.5982L32.4707 34.7762C32.3101 34.919 32.1097 35.0093 31.8963 35.0351C31.6829 35.0608 31.4667 35.0207 31.2767 34.9202L28.7628 33.5882C28.3695 33.7964 27.9638 33.9803 27.5479 34.1387L26.4499 34.5497L25.4749 37.2496C25.4027 37.4474 25.2724 37.6186 25.1011 37.741C24.9297 37.8633 24.7254 37.931 24.515 37.9351L21.6651 37.9996C21.449 38.0053 21.2365 37.9439 21.0568 37.8238C20.8771 37.7037 20.7391 37.5309 20.6616 37.3291L19.5127 34.2887C19.1206 34.1547 18.7325 34.0097 18.3487 33.8537C18.0348 33.7178 17.7256 33.5712 17.4217 33.4142L14.5718 34.6322C14.384 34.7123 14.177 34.7361 13.976 34.7007C13.7749 34.6653 13.5885 34.5721 13.4394 34.4327L11.3304 32.4542C11.1734 32.3075 11.0665 32.1152 11.0248 31.9045C10.983 31.6937 11.0086 31.4751 11.0979 31.2797L12.3234 28.6098C12.1604 28.2935 12.0093 27.9713 11.8704 27.6438C11.7083 27.2429 11.5582 26.8372 11.4204 26.4273L8.73553 25.6098C8.51728 25.5438 8.32693 25.4076 8.19403 25.2224C8.06113 25.0371 7.99311 24.8132 8.00055 24.5853L8.10555 21.7038C8.11302 21.5158 8.17175 21.3334 8.27538 21.1764C8.37902 21.0194 8.52361 20.8936 8.69353 20.8128L11.5104 19.4599C11.6409 18.9814 11.7549 18.6094 11.8554 18.3379C11.9969 17.9753 12.1541 17.6189 12.3264 17.2699L11.1054 14.6899C11.0128 14.494 10.9846 14.2737 11.0251 14.0608C11.0655 13.8479 11.1724 13.6533 11.3304 13.5049L13.4364 11.516C13.584 11.3767 13.7687 11.2831 13.9683 11.2464C14.1679 11.2097 14.3738 11.2314 14.5613 11.309L17.4082 12.4849C17.7232 12.275 18.0082 12.1055 18.2662 11.969C18.5737 11.8055 18.9847 11.6345 19.5022 11.45L20.4921 8.68849C20.5653 8.4864 20.6991 8.31182 20.8752 8.1886C21.0513 8.06537 21.2611 7.99951 21.4761 8H24.617ZM23.036 18.5284C20.5356 18.5284 18.5092 20.5309 18.5092 23.0028C18.5092 25.4748 20.5356 27.4788 23.036 27.4788C25.5349 27.4788 27.5614 25.4748 27.5614 23.0028C27.5614 20.5309 25.5364 18.5284 23.036 18.5284Z" fill="currentColor" />
                                            </g>

                                        </svg>
                                        Account Settings
                                    </Link>
                                  {user.role===0&&  <Button text={'Feedback'} icon={<svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 55" fill="none">
                                            <g filter="url(#filter0_d_872_7899)">
                                                <path d="M26.6045 29.875C27.4753 29.875 28.3103 30.2207 28.926 30.8361C29.5418 31.4514 29.8877 32.286 29.8877 33.1562V34.25C29.8877 38.5616 25.8166 43 18.9438 43C12.0711 43 8 38.5616 8 34.25V33.1562C8 32.286 8.3459 31.4514 8.96161 30.8361C9.57732 30.2207 10.4124 29.875 11.2831 29.875H26.6045ZM18.9438 15.6562C20.5402 15.6562 22.0712 16.29 23.2 17.4182C24.3288 18.5463 24.9629 20.0764 24.9629 21.6719C24.9629 23.2673 24.3288 24.7974 23.2 25.9256C22.0712 27.0537 20.5402 27.6875 18.9438 27.6875C17.3475 27.6875 15.8165 27.0537 14.6877 25.9256C13.5589 24.7974 12.9247 23.2673 12.9247 21.6719C12.9247 20.0764 13.5589 18.5463 14.6877 17.4182C15.8165 16.29 17.3475 15.6562 18.9438 15.6562ZM38.6427 8C39.7467 8.0002 40.8099 8.41731 41.6193 9.16777C42.4286 9.91822 42.9243 10.9466 43.0071 12.0469L43.0203 12.375V16.75C43.0206 17.8538 42.6035 18.9169 41.8526 19.7262C41.1016 20.5355 40.0723 21.0313 38.971 21.1141L38.6427 21.125H35.3574L32.7352 24.625C31.5752 26.1694 29.2245 25.5438 28.8458 23.8025L28.8086 23.5597L28.7933 23.3125V20.9828L28.6226 20.9391C27.8358 20.7008 27.1319 20.2464 26.5913 19.6275C26.0506 19.0086 25.6949 18.2503 25.5648 17.4391L25.5211 17.0759L25.5101 16.75V12.375C25.5098 11.2712 25.9269 10.2081 26.6778 9.3988C27.4288 8.58947 28.4581 8.09372 29.5593 8.01094L29.8877 8H38.6427Z" fill="currentColor" />
                                            </g>

                                        </svg>} onClick={()=>setIsRateUsOpen(true)}
                                    className={`flex flex-col-reverse ${expandMenu&& 'lg:flex-row-reverse lg:gap-2 ' } lg:gap-0 gap-2 items-center justify-end px-2 py-1 rounded-lg ${isRateUsOpen ? 'bg-white  text-darkGreen' : 'hover:bg-green-300 hover:bg-opacity-20'} `}
                                    />}
                                   
                                   { user.role===0&& <Link to={'/refer-and-earn'} className={`flex flex-col text-center ${expandMenu&& 'lg:flex-row lg:gap-2 ' } lg:gap-0  gap-2 items-center justify-start px-2 py-1 rounded-lg   ${location.pathname === '/refer-and-earn' ? 'bg-white  text-darkGreen' : 'hover:bg-green-300 hover:bg-opacity-20'} `}>
                                        <svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 50 30" fill="none">
                                            <path d="M9.88333 15C8.08333 15.0558 6.61111 15.7701 5.46667 17.1429H3.23333C2.32222 17.1429 1.55556 16.9169 0.933333 16.4648C0.311111 16.0128 0 15.3516 0 14.481C0 10.5413 0.688889 8.57143 2.06667 8.57143C2.13333 8.57143 2.375 8.68862 2.79167 8.92299C3.20833 9.15737 3.75 9.39453 4.41667 9.63449C5.08333 9.87444 5.74444 9.99442 6.4 9.99442C7.14444 9.99442 7.88333 9.86607 8.61667 9.60938C8.56111 10.0223 8.53333 10.3906 8.53333 10.7143C8.53333 12.2656 8.98333 13.6942 9.88333 15ZM27.7333 25.6641C27.7333 27.0033 27.3278 28.0608 26.5167 28.8365C25.7056 29.6122 24.6278 30 23.2833 30H8.71667C7.37222 30 6.29444 29.6122 5.48333 28.8365C4.67222 28.0608 4.26667 27.0033 4.26667 25.6641C4.26667 25.0725 4.28611 24.495 4.325 23.9314C4.36389 23.3677 4.44167 22.7595 4.55833 22.1066C4.675 21.4537 4.82222 20.8482 5 20.2902C5.17778 19.7321 5.41667 19.1881 5.71667 18.6579C6.01667 18.1278 6.36111 17.6758 6.75 17.3019C7.13889 16.928 7.61389 16.6295 8.175 16.4062C8.73611 16.183 9.35556 16.0714 10.0333 16.0714C10.1444 16.0714 10.3833 16.1914 10.75 16.4314C11.1167 16.6713 11.5222 16.9392 11.9667 17.2349C12.4111 17.5307 13.0056 17.7985 13.75 18.0385C14.4944 18.2785 15.2444 18.3984 16 18.3984C16.7556 18.3984 17.5056 18.2785 18.25 18.0385C18.9944 17.7985 19.5889 17.5307 20.0333 17.2349C20.4778 16.9392 20.8833 16.6713 21.25 16.4314C21.6167 16.1914 21.8556 16.0714 21.9667 16.0714C22.6444 16.0714 23.2639 16.183 23.825 16.4062C24.3861 16.6295 24.8611 16.928 25.25 17.3019C25.6389 17.6758 25.9833 18.1278 26.2833 18.6579C26.5833 19.1881 26.8222 19.7321 27 20.2902C27.1778 20.8482 27.325 21.4537 27.4417 22.1066C27.5583 22.7595 27.6361 23.3677 27.675 23.9314C27.7139 24.495 27.7333 25.0725 27.7333 25.6641ZM10.6667 4.28571C10.6667 5.46875 10.25 6.47879 9.41667 7.31585C8.58333 8.1529 7.57778 8.57143 6.4 8.57143C5.22222 8.57143 4.21667 8.1529 3.38333 7.31585C2.55 6.47879 2.13333 5.46875 2.13333 4.28571C2.13333 3.10268 2.55 2.09263 3.38333 1.25558C4.21667 0.418527 5.22222 0 6.4 0C7.57778 0 8.58333 0.418527 9.41667 1.25558C10.25 2.09263 10.6667 3.10268 10.6667 4.28571ZM22.4 10.7143C22.4 12.4888 21.775 14.0039 20.525 15.2595C19.275 16.5151 17.7667 17.1429 16 17.1429C14.2333 17.1429 12.725 16.5151 11.475 15.2595C10.225 14.0039 9.6 12.4888 9.6 10.7143C9.6 8.93973 10.225 7.42466 11.475 6.16908C12.725 4.9135 14.2333 4.28571 16 4.28571C17.7667 4.28571 19.275 4.9135 20.525 6.16908C21.775 7.42466 22.4 8.93973 22.4 10.7143ZM32 14.481C32 15.3516 31.6889 16.0128 31.0667 16.4648C30.4444 16.9169 29.6778 17.1429 28.7667 17.1429H26.5333C25.3889 15.7701 23.9167 15.0558 22.1167 15C23.0167 13.6942 23.4667 12.2656 23.4667 10.7143C23.4667 10.3906 23.4389 10.0223 23.3833 9.60938C24.1167 9.86607 24.8556 9.99442 25.6 9.99442C26.2556 9.99442 26.9167 9.87444 27.5833 9.63449C28.25 9.39453 28.7917 9.15737 29.2083 8.92299C29.625 8.68862 29.8667 8.57143 29.9333 8.57143C31.3111 8.57143 32 10.5413 32 14.481ZM29.8667 4.28571C29.8667 5.46875 29.45 6.47879 28.6167 7.31585C27.7833 8.1529 26.7778 8.57143 25.6 8.57143C24.4222 8.57143 23.4167 8.1529 22.5833 7.31585C21.75 6.47879 21.3333 5.46875 21.3333 4.28571C21.3333 3.10268 21.75 2.09263 22.5833 1.25558C23.4167 0.418527 24.4222 0 25.6 0C26.7778 0 27.7833 0.418527 28.6167 1.25558C29.45 2.09263 29.8667 3.10268 29.8667 4.28571Z" fill="CurrentColor" />
                                        </svg>
                                        Refer & Earn
                                    </Link>}
                                </div>
                        )}

                    </div>}
                    <Button text={'Logout'} onClick={()=>{setConfirmationVisible(true); }} icon={<svg className='w-7 h-7 lg:w-6 lg:h-6 ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 56" fill="none">
                        <g filter="url(#filter0_d_683_28607)">
                            <path d="M25.4994 8C25.1015 8 24.72 8.15804 24.4387 8.43936C24.1574 8.72067 23.9993 9.10221 23.9993 9.50005C23.9993 9.89789 24.1574 10.2794 24.4387 10.5608C24.72 10.8421 25.1015 11.0001 25.4994 11.0001C29.3451 11.0001 33.0334 12.5278 35.7528 15.2472C38.4722 17.9666 39.9999 21.6549 39.9999 25.5006C39.9999 29.3464 38.4722 33.0347 35.7528 35.754C33.0334 38.4734 29.3451 40.0012 25.4994 40.0012C25.1015 40.0012 24.72 40.1592 24.4387 40.4405C24.1574 40.7218 23.9993 41.1034 23.9993 41.5012C23.9993 41.899 24.1574 42.2806 24.4387 42.5619C24.72 42.8432 25.1015 43.0013 25.4994 43.0013C30.1408 43.0013 34.5922 41.1575 37.8742 37.8754C41.1562 34.5934 43 30.1421 43 25.5006C43 20.8592 41.1562 16.4078 37.8742 13.1258C34.5922 9.84381 30.1408 8 25.4994 8Z" fill="currentColor" />
                            <path d="M16.559 20.5598C16.824 20.2754 16.9682 19.8993 16.9614 19.5107C16.9545 19.1221 16.7971 18.7513 16.5222 18.4765C16.2474 18.2016 15.8766 18.0442 15.488 18.0373C15.0994 18.0305 14.7233 18.1747 14.4389 18.4397L8.4387 24.4399C8.15779 24.7212 8 25.1024 8 25.5C8 25.8975 8.15779 26.2787 8.4387 26.56L14.4389 32.5602C14.5762 32.7076 14.7418 32.8258 14.9259 32.9078C15.1099 32.9898 15.3085 33.0339 15.5099 33.0374C15.7113 33.041 15.9114 33.0039 16.0982 32.9285C16.285 32.853 16.4546 32.7407 16.5971 32.5983C16.7395 32.4559 16.8518 32.2862 16.9273 32.0994C17.0027 31.9126 17.0397 31.7125 17.0362 31.5111C17.0326 31.3097 16.9886 31.1111 16.9066 30.9271C16.8246 30.7431 16.7064 30.5775 16.559 30.4401L13.1189 27H29.4995C29.8973 27 30.2788 26.842 30.5602 26.5607C30.8415 26.2793 30.9995 25.8978 30.9995 25.5C30.9995 25.1021 30.8415 24.7206 30.5602 24.4393C30.2788 24.158 29.8973 23.9999 29.4995 23.9999H13.1189L16.559 20.5598Z" fill="currentColor" />
                        </g>

                    </svg>} className={`flex flex-col-reverse w-full  ${expandMenu&& 'lg:flex-row-reverse lg:text-lg lg:gap-1 '} lg:gap-0 lg:text-base px-2 py-1 rounded-lg  hover:bg-red-300 hover:text-red-400 font-semibold hover:bg-opacity-20  items-center text-xs  gap-3  justify-center  `} />
                </div>

            </div>
<ConfirmationPopup isOpen={isConfirmationVisible} message={'Are you sure you want to logout'} onConfirm={handleLogout} onCancel={closeConfirmation} />
<RateUs isOpen={isRateUsOpen} setIsOpen={setIsRateUsOpen} />
        </div>
    )
}

export default DashboardSideBar