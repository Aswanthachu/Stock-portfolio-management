import { Fragment, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { DropdownClose, DropdownOpen, LeftIcon, SettingIcon } from "@/assets";
import { menuItems } from "./MenuList";
import RateUs from "./Popups/RateUs";
import ConfirmationPopup from "./Popups/ConfirmationPopup";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SidebarMobile from "./SidebarMobile";
import socket from "@/Redux/Api/socket";
import { SettingsMenu } from ".";
import { useDispatch } from "react-redux";
import { Bars3Icon } from "@heroicons/react/20/solid";
import Bata from "../assets/images/Beta.png";

import { resetState as resetCoreState } from "@/Redux/Features/core";
import { resetState as resetUserState } from "@/Redux/Features/user";
import { resetState as resetTicketState } from "@/Redux/Features/ticket";
import { resetState as resetDashboardState } from "@/Redux/Features/dashboard";
import { resetState as resetAdminState } from "@/Redux/Features/admin";
import { resetState as resetPortfolioState } from "@/Redux/Features/portfolio";
import { resetState as resetNotificationState } from "@/Redux/Features/notification";
import { resetState as resetAiChatAssistantState } from "@/Redux/Features/chatAssistant";

export const menuItems2 = [
  {
    id: 1,
    text: "Account Settings",
    path: "/account-settings",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 33 35"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path
          d="M16.5063 12.7347C15.342 12.7347 14.2517 13.1885 13.4262 14.0178C12.6045 14.8471 12.1489 15.9424 12.1489 17.112C12.1489 18.2816 12.6045 19.3769 13.4262 20.2062C14.2517 21.0316 15.342 21.4893 16.5063 21.4893C17.6706 21.4893 18.761 21.0316 19.5865 20.2062C20.4081 19.3769 20.8637 18.2816 20.8637 17.112C20.8637 15.9424 20.4081 14.8471 19.5865 14.0178C19.1833 13.6096 18.7034 13.286 18.1746 13.0658C17.6458 12.8455 17.0788 12.733 16.5063 12.7347ZM32.5613 21.9469L30.4402 20.1256C30.1758 19.8987 30.0514 19.5508 30.0936 19.205C30.1624 18.6411 30.1977 18.071 30.1977 17.5032C30.1977 16.9361 30.1625 16.3645 30.0938 15.8019C30.0516 15.4557 30.176 15.1075 30.4406 14.8803L32.5613 13.0594C32.7537 12.894 32.8914 12.6736 32.9561 12.4277C33.0208 12.1817 33.0094 11.9218 32.9235 11.6825L32.8884 11.5808C32.1875 9.61194 31.1374 7.78697 29.7888 6.19427L29.7187 6.11212C29.5549 5.9187 29.3367 5.77965 29.0927 5.71331C28.8487 5.64697 28.5904 5.65646 28.3519 5.74051L25.7244 6.67994C25.3929 6.79844 25.0252 6.73174 24.7448 6.51903C23.845 5.8366 22.8726 5.27026 21.8373 4.83153C21.5139 4.69449 21.2726 4.41039 21.209 4.06496L20.7002 1.30066C20.6541 1.05047 20.5332 0.820306 20.3538 0.640738C20.1743 0.46117 19.9448 0.340701 19.6955 0.295338L19.5904 0.275779C17.5655 -0.0919264 15.4316 -0.0919264 13.4067 0.275779L13.3016 0.295338C13.0523 0.340701 12.8228 0.46117 12.6433 0.640738C12.4639 0.820306 12.343 1.05047 12.2969 1.30066L11.7836 4.08457C11.7203 4.42786 11.4815 4.71074 11.1606 4.84834C10.1349 5.28827 9.16623 5.85182 8.27591 6.52657C7.99522 6.7393 7.62736 6.80623 7.29571 6.68771L4.6452 5.74051C4.40675 5.65579 4.14829 5.64596 3.90415 5.71234C3.66001 5.77872 3.44176 5.91816 3.2784 6.11212L3.20831 6.19427C1.86213 7.78867 0.812221 9.61318 0.108686 11.5808L0.0736398 11.6825C-0.10159 12.1714 0.0424879 12.7191 0.435782 13.0594L2.5866 14.9034C2.85174 15.1308 2.97628 15.4796 2.93437 15.8264C2.86724 16.3818 2.83449 16.9427 2.83449 17.4993C2.83449 18.0601 2.86706 18.621 2.93383 19.1721C2.97584 19.5189 2.8519 19.868 2.58704 20.0958L0.44357 21.9391C0.25119 22.1045 0.113501 22.3249 0.0488115 22.5709C-0.0158775 22.8168 -0.00450131 23.0767 0.0814277 23.316L0.116474 23.4178C0.821288 25.3854 1.86099 27.2043 3.2161 28.8042L3.28619 28.8864C3.44995 29.0798 3.66821 29.2189 3.9122 29.2852C4.15619 29.3515 4.41447 29.3421 4.65299 29.258L7.30314 28.3109C7.63498 28.1923 8.00309 28.2594 8.28359 28.4727C9.17554 29.151 10.1395 29.7153 11.1642 30.1511C11.4872 30.2884 11.7284 30.5723 11.792 30.9175L12.3047 33.6979C12.3508 33.948 12.4716 34.1782 12.6511 34.3578C12.8305 34.5373 13.0601 34.6578 13.3094 34.7032L13.4145 34.7227C15.4593 35.0924 17.5534 35.0924 19.5982 34.7227L19.7033 34.7032C19.9525 34.6578 20.1821 34.5373 20.3616 34.3578C20.541 34.1782 20.6618 33.948 20.708 33.6979L21.2171 30.932C21.2805 30.5874 21.5208 30.3037 21.8433 30.1666C22.8792 29.7262 23.8522 29.1616 24.7525 28.4794C25.033 28.2668 25.4007 28.2001 25.7322 28.3186L28.3597 29.258C28.5981 29.3427 28.8566 29.3526 29.1007 29.2862C29.3449 29.2198 29.5631 29.0804 29.7265 28.8864L29.7966 28.8042C31.1517 27.1965 32.1914 25.3854 32.8962 23.4178L32.9312 23.316C33.0987 22.831 32.9546 22.2873 32.5613 21.9469ZM16.5063 23.9889C12.7253 23.9889 9.66068 20.9103 9.66068 17.112C9.66068 13.3137 12.7253 10.2351 16.5063 10.2351C20.2874 10.2351 23.352 13.3137 23.352 17.112C23.352 20.9103 20.2874 23.9889 16.5063 23.9889Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: 2,
    text: "Feedback",
    // path: "/account-settings",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 56 55"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        className="-ml-1"
      >
        <g filter="url(#filter0_d_761_16893)">
          <path
            fill="currentColor"
            d="M26.6045 29.875C27.4753 29.875 28.3103 30.2207 28.926 30.8361C29.5418 31.4514 29.8877 32.286 29.8877 33.1562V34.25C29.8877 38.5616 25.8166 43 18.9438 43C12.0711 43 8 38.5616 8 34.25V33.1562C8 32.286 8.3459 31.4514 8.96161 30.8361C9.57732 30.2207 10.4124 29.875 11.2831 29.875H26.6045ZM18.9438 15.6562C20.5402 15.6562 22.0712 16.29 23.2 17.4182C24.3288 18.5463 24.9629 20.0764 24.9629 21.6719C24.9629 23.2673 24.3288 24.7974 23.2 25.9256C22.0712 27.0537 20.5402 27.6875 18.9438 27.6875C17.3475 27.6875 15.8165 27.0537 14.6877 25.9256C13.5589 24.7974 12.9247 23.2673 12.9247 21.6719C12.9247 20.0764 13.5589 18.5463 14.6877 17.4182C15.8165 16.29 17.3475 15.6562 18.9438 15.6562ZM38.6427 8C39.7467 8.0002 40.8099 8.41731 41.6193 9.16777C42.4286 9.91822 42.9243 10.9466 43.0071 12.0469L43.0203 12.375V16.75C43.0206 17.8538 42.6035 18.9169 41.8526 19.7262C41.1016 20.5355 40.0723 21.0313 38.971 21.1141L38.6427 21.125H35.3574L32.7352 24.625C31.5752 26.1694 29.2245 25.5438 28.8458 23.8025L28.8086 23.5597L28.7933 23.3125V20.9828L28.6226 20.9391C27.8358 20.7008 27.1319 20.2464 26.5913 19.6275C26.0506 19.0086 25.6949 18.2503 25.5648 17.4391L25.5211 17.0759L25.5101 16.75V12.375C25.5098 11.2712 25.9269 10.2081 26.6778 9.3988C27.4288 8.58947 28.4581 8.09372 29.5593 8.01094L29.8877 8H38.6427Z"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_761_16893"
            x="0"
            y="0"
            width="55.0195"
            height="55"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="2" dy="2" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_761_16893"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_761_16893"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    ),
  },
  {
    id: 3,
    text: "Refer & Earn",
    path: "/refer-and-earn",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 36 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M10.8162 16.5C8.84626 16.5614 7.23509 17.3471 5.98263 18.8571H3.5385C2.5414 18.8571 1.70237 18.6085 1.02142 18.1113C0.340475 17.6141 0 16.8867 0 15.9291C0 11.5954 0.753908 9.42857 2.26172 9.42857C2.33468 9.42857 2.59916 9.55748 3.05515 9.81529C3.51115 10.0731 4.10394 10.334 4.83352 10.5979C5.56311 10.8619 6.28662 10.9939 7.00405 10.9939C7.81876 10.9939 8.62739 10.8527 9.42993 10.5703C9.36913 11.0246 9.33873 11.4297 9.33873 11.7857C9.33873 13.4922 9.83121 15.0636 10.8162 16.5ZM30.3509 28.2305C30.3509 29.7037 29.9071 30.8669 29.0194 31.7201C28.1317 32.5734 26.9522 33 25.4809 33H9.53937C8.06803 33 6.88853 32.5734 6.00087 31.7201C5.1132 30.8669 4.66937 29.7037 4.66937 28.2305C4.66937 27.5798 4.69065 26.9445 4.73321 26.3245C4.77577 25.7045 4.86088 25.0354 4.98856 24.3172C5.11624 23.5991 5.27736 22.933 5.47191 22.3192C5.66647 21.7054 5.92791 21.1069 6.25622 20.5237C6.58454 19.9406 6.96149 19.4434 7.38708 19.0321C7.81268 18.6208 8.33251 18.2924 8.94658 18.0469C9.56065 17.8013 10.2386 17.6786 10.9803 17.6786C11.1019 17.6786 11.3633 17.8105 11.7646 18.0745C12.1659 18.3384 12.6097 18.6331 13.0961 18.9584C13.5825 19.2838 14.2331 19.5784 15.0478 19.8424C15.8625 20.1063 16.6833 20.2383 17.5101 20.2383C18.337 20.2383 19.1578 20.1063 19.9725 19.8424C20.7872 19.5784 21.4377 19.2838 21.9241 18.9584C22.4105 18.6331 22.8544 18.3384 23.2556 18.0745C23.6569 17.8105 23.9183 17.6786 24.0399 17.6786C24.7817 17.6786 25.4596 17.8013 26.0737 18.0469C26.6877 18.2924 27.2076 18.6208 27.6332 19.0321C28.0588 19.4434 28.4357 19.9406 28.764 20.5237C29.0923 21.1069 29.3538 21.7054 29.5483 22.3192C29.7429 22.933 29.904 23.5991 30.0317 24.3172C30.1594 25.0354 30.2445 25.7045 30.287 26.3245C30.3296 26.9445 30.3509 27.5798 30.3509 28.2305ZM11.6734 4.71429C11.6734 6.01562 11.2174 7.12667 10.3054 8.04743C9.39345 8.96819 8.29299 9.42857 7.00405 9.42857C5.71511 9.42857 4.61465 8.96819 3.70266 8.04743C2.79068 7.12667 2.33468 6.01562 2.33468 4.71429C2.33468 3.41295 2.79068 2.3019 3.70266 1.38114C4.61465 0.460379 5.71511 0 7.00405 0C8.29299 0 9.39345 0.460379 10.3054 1.38114C11.2174 2.3019 11.6734 3.41295 11.6734 4.71429ZM24.5142 11.7857C24.5142 13.7377 23.8302 15.4043 22.4622 16.7854C21.0942 18.1666 19.4435 18.8571 17.5101 18.8571C15.5767 18.8571 13.926 18.1666 12.558 16.7854C11.1901 15.4043 10.5061 13.7377 10.5061 11.7857C10.5061 9.83371 11.1901 8.16713 12.558 6.78599C13.926 5.40486 15.5767 4.71429 17.5101 4.71429C19.4435 4.71429 21.0942 5.40486 22.4622 6.78599C23.8302 8.16713 24.5142 9.83371 24.5142 11.7857ZM35.0203 15.9291C35.0203 16.8867 34.6798 17.6141 33.9988 18.1113C33.3179 18.6085 32.4789 18.8571 31.4818 18.8571H29.0376C27.7852 17.3471 26.174 16.5614 24.2041 16.5C25.189 15.0636 25.6815 13.4922 25.6815 11.7857C25.6815 11.4297 25.6511 11.0246 25.5903 10.5703C26.3929 10.8527 27.2015 10.9939 28.0162 10.9939C28.7336 10.9939 29.4571 10.8619 30.1867 10.5979C30.9163 10.334 31.5091 10.0731 31.9651 9.81529C32.4211 9.55748 32.6856 9.42857 32.7585 9.42857C34.2663 9.42857 35.0203 11.5954 35.0203 15.9291ZM32.6856 4.71429C32.6856 6.01562 32.2296 7.12667 31.3176 8.04743C30.4056 8.96819 29.3051 9.42857 28.0162 9.42857C26.7273 9.42857 25.6268 8.96819 24.7148 8.04743C23.8028 7.12667 23.3468 6.01562 23.3468 4.71429C23.3468 3.41295 23.8028 2.3019 24.7148 1.38114C25.6268 0.460379 26.7273 0 28.0162 0C29.3051 0 30.4056 0.460379 31.3176 1.38114C32.2296 2.3019 32.6856 3.41295 32.6856 4.71429Z"
        />
      </svg>
    ),
  },
];

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [userType, setUserType] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRateUsOpen, setIsRateUsOpen] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(true);
  const [isBig, setIsBig] = useState(false);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  useEffect(() => {
    if (user?.role === 1) {
      setUserType("admin");
    } else if (user?.role > 1) {
      setUserType("sub-admin");
    } else if (user?.role === 0) {
      setUserType("user");
    }
  }, [user]);

  const handleLogout = async () => {
    dispatch(resetCoreState());
    dispatch(resetUserState());
    dispatch(resetTicketState());
    dispatch(resetDashboardState());
    dispatch(resetAdminState());
    dispatch(resetPortfolioState());
    dispatch(resetNotificationState());
    dispatch(resetAiChatAssistantState());
    socket.disconnect();
    navigate("/login");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsBig((prevSize) => !prevSize);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <SidebarMobile
        userType={userType}
        settingsOpen={settingsOpen}
        setIsRateUsOpen={setSettingsOpen}
        setConfirmationVisible={setConfirmationVisible}
        toggleOpen={toggleOpen}
        setSettingsOpen={setSettingsOpen}
        setToggleOpen={setToggleOpen}
        handleLogout={handleLogout}
      />
      <div
        className={cn(
          toggleOpen ? "w-[220px] lg:w-[300px] " : "w-[110px]",
          "bg-darkGreen  h-full hidden md:flex flex-col justify-between transition-width ease-in-out duration-300"
        )}
      >
        <div>
          <div className="py-5 hidden md:flex justify-center items-center space-x-1.5">
            <Bars3Icon
              className="w-6 h-6 text-white hover:cursor-pointer"
              onClick={() => setToggleOpen((prevState) => !prevState)}
            />
            <>
              {toggleOpen ? (
                <img
                  className="w-4/5 hidden md:block"
                  src="/assets/KKS-logo.png"
                  alt="KKS-Capitals"
                />
              ) : (
                <img
                  className="w-fit md:block"
                  src="/assets/KKS-logo-small.png"
                  alt="KKS-Capitals"
                />
              )}
            </>
          </div>
          <div className="flex flex-col relative">
            <>
              {menuItems.map((menu) => (
                <Fragment key={menu.id}>
                  {menu.userTypes.includes(userType) && (
                    <Button
                      className={cn(
                        toggleOpen ? "justify-start" :"justify-center",
                        "rounded-none  text-base font-bold tracking-wide py-6 px-8 flex  gap-5 items-center",
                        location.pathname === menu.path
                          ? "bg-white text-darkGreen bg-opacity-80 hover:bg-white hover:text-darkGreen hover:bg-opacity-80"
                          : "bg-darkGreen hover:bg-white hover:bg-opacity-20",
                        menu.beta && "relative"
                      )}
                      onClick={() => navigate(menu.path)}
                    >
                      <span >{menu.icon}</span>
                      <span className={cn(!toggleOpen && "hidden")}>
                        {menu.text}
                      </span>
                      <img
                        src={Bata}
                        className={cn(
                          menu.beta ? "block" : "hidden",
                          "w-8 absolute right-0 top-0"
                        )}
                        alt="beta"
                      />
                    </Button>
                  )}
                </Fragment>
              ))}
            </>
            <span
              className=" hidden absolute top-0 -right-12 text-gray-700 p-3 bg-gray-300 rounded-r-xl hover:cursor-pointer z-50"
              onClick={() => setToggleOpen((prevState) => !prevState)}
            >
              {toggleOpen ? (
                <ArrowLeftIcon
                  className={cn(
                    isBig ? "animate-scale-big" : "animate-scale-small",
                    "w-6 h-6 text-gray-700"
                  )}
                />
              ) : (
                <Bars3Icon
                  className={cn(
                    isBig ? "animate-scale-big" : "animate-scale-small",
                    "w-6 h-6 text-gray-700"
                  )}
                />
              )}
            </span>
          </div>
          <div className={cn(!toggleOpen && "hidden", "px-5 py-3")}>
            <div className="text-center bg-white p-2 rounded-md max-w-[180px] space-y-2">
              <h1 className="font-semibold">Upgrade to pro</h1>
              <p className="text-xs">To access all premium Features.</p>
              <Button
                className="bg-darkGreen text-white text-xs"
                onClick={() => navigate("/plans")}
              >
                Upgrade
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="w-full">
            <Button
              className="w-full bg-inherit rounded-none text-white hover:bg-inherit hover:text-white text-base tracking-wide font-bold py-6 px-8 flex justify-start items-center gap-5 relative hover:cursor-pointer"
              onClick={() => setSettingsOpen((prevState) => !prevState)}
            >
              {toggleOpen ? (
                <span>
                  <SettingIcon className="w-6 h-6 fill-white " />
                </span>
              ) : (
                <SettingsMenu setIsRateUsOpen={setIsRateUsOpen} />
              )}
              <span className={cn(!toggleOpen && "hidden")}>Settings</span>
              {!settingsOpen ? (
                <DropdownOpen
                  className={cn(!toggleOpen && "hidden", "w-4 h-2 mt-1")}
                />
              ) : (
                <DropdownClose
                  className={cn(!toggleOpen && "hidden", "w-4 h-2 mt-1")}
                />
              )}
            </Button>
            {settingsOpen && toggleOpen && (
              <Fragment>
                {menuItems2.map((menu) => (
                  <Button
                    key={menu.id}
                    className={cn(
                      "w-full  rounded-none  text-base font-bold tracking-wide py-6 px-8 flex justify-start gap-5",
                      location.pathname === menu.path
                        ? "bg-white text-darkGreen bg-opacity-80 hover:bg-white hover:text-darkGreen hover:bg-opacity-80"
                        : "bg-darkGreen hover:bg-white  hover:bg-opacity-20"
                    )}
                    onClick={
                      menu.text === "Feedback"
                        ? () => setIsRateUsOpen(true)
                        : () => navigate(menu.path)
                    }
                  >
                    <span>{menu.icon}</span>
                    <span className={cn(!toggleOpen && "hidden")}>
                      {menu.text}
                    </span>
                  </Button>
                ))}
              </Fragment>
            )}
            <Button
              className="w-full bg-inherit rounded-none text-white hover:bg-inherit hover:bg-red-100 hover:text-red-400 hover:bg-opacity-20  text-lg tracking-wide font-bold py-6 px-8 flex justify-start items-center gap-5"
              onClick={() => setConfirmationVisible(true)}
            >
              <span>
                <LeftIcon className="w-7 h-7 " />
              </span>
              <span className={cn(!toggleOpen && "hidden")}>Logout</span>
            </Button>
          </div>
        </div>
      </div>
      <RateUs isOpen={isRateUsOpen} setIsOpen={setIsRateUsOpen} />
      <ConfirmationPopup
        isOpen={isConfirmationVisible}
        message={"Are you sure you want to logout"}
        onConfirm={handleLogout}
        onCancel={() => setConfirmationVisible(false)}
      />
    </>
  );
};

export default SideBar;
