import { Outlet } from "react-router-dom";
import {
  ApiLimitWarning,
  DashboardNavBar,
  DashboardSideBar,
  SideBar,
} from "@/components";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileIncompleteAlert from "../ProfileIncompleteAlert";
import SessionExpiredPopup from "../Popups/SessionExpiredPopup";
import { Toaster } from "react-hot-toast";
import { Toaster as LimitToaster } from "@/components/ui/toaster";
import Tour from "../Tour";
import PlanExpiringNotification from "@/components/PlanExpiringNotification";
import { PageNotFound } from "@/pages/core";
import Navbar from "../Navbar";
// import axios from "axios";
// import { baseUrl, getConfig } from "@/Redux/Api";
// import AllowNotificationPopup from "../Popups/AllowNotificationPopup";
const AuthorizedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // State to control the visibility of the SessionExpiredPopup
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [showUpdateProfileAlert, setShowUpdateProfileAlert] = useState(true);
  // const [subscription, setSubscription] = useState(null);
  // const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  // const [isAllowNotificationPopupOpen, setIsAllowNotificationPopupOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (Object.keys(userData).length < 1) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    // Function to check if the token has expired
    function checkTokenExpiration() {
      const expirationDate = localStorage.getItem("tokenExpiration");
      const currentTime = new Date().getTime();

      if (expirationDate && currentTime > parseInt(expirationDate)) {
        setIsTokenExpired(true);
        // Set a timeout to clear localStorage and navigate after 10 seconds
        setTimeout(() => {
          localStorage.clear();
          setIsTokenExpired(false); // Hide the popup
          navigate("/login"); // Navigate to the login page
        }, 10000); // 10 seconds in milliseconds
      } else {
        setIsTokenExpired(false);
      }
    }

    // Check token expiration on component mount
    checkTokenExpiration();
  }, []);
  // Empty dependency array ensures this runs only once when the component mounts
  const { gender, role } = userData;
  const statusData = JSON.parse(localStorage.getItem("status")) || {};
  const { status } = statusData;
  const isProfileIncomplete =
    !gender &&
    location.pathname !== "/generate-portfolio" &&
    status === "active";

  //   useEffect(() => {
  //     if ("serviceWorker" in navigator && "PushManager" in window) {
  //       navigator.serviceWorker
  //         .register("/service-worker.js")
  //         .then((registration) => {
  //           // console.log('Service Worker registered with scope:', registration.scope);
  //         })
  //         .catch((error) => {
  //           console.error("Service Worker registration failed:", error);
  //         });
  //     }
  //   }, []);

  //   useEffect(() => {
  //     const checkSubscriptionStatus = async () => {
  //       const registration = await navigator.serviceWorker.ready;
  //       const existingSubscription = await registration.pushManager.getSubscription();
  //       setSubscription(existingSubscription);
  //       setIsNotificationEnabled(existingSubscription !== null);
  //     };

  //     checkSubscriptionStatus();

  //   }, []);

  //   const pushNotificationSubscribe = async () => {
  //     localStorage.setItem('pnps', 'true');

  //     const registration = await navigator.serviceWorker.ready;

  //     if (!subscription) {

  //       if (Notification.permission !== 'granted') {
  //         setIsAllowNotificationPopupOpen(true)
  //       }

  //       // User is not subscribed, subscribe
  //       const newSubscription = await registration.pushManager.subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey: 'BKJfTAUX0Ufxn7rcLdndrAtYlpcuRI_N1vNY_vP-G_f13kvWbJrTbd3IIg9qJ7WvOYEQe0_QWsEYB1Y3J4N02jo',
  //       });

  //       const config = getConfig();
  //       axios.post(`${baseUrl}/web-push/subscribe`, { subscription: newSubscription }, config)
  //         .then(response => {
  //           setSubscription(newSubscription);
  //         })
  //         .catch(error => {
  //           console.error('Subscription failed:', error);
  //         });
  //         setIsNotificationEnabled(true);
  //     }
  //   };
  // useEffect(()=>{
  //   if(Notification.permission === 'granted' || Notification.permission === 'denied'){
  //     setIsAllowNotificationPopupOpen(false)
  //   }
  // },[Notification.permission])
  //   useEffect(() => {
  //     const hasBeenSubscribed = localStorage.getItem('pnps');
  //     if (hasBeenSubscribed !== 'true') {
  //       setTimeout(() => {
  //         pushNotificationSubscribe();
  //       }, 5000);
  //     }
  //   }, [pushNotificationSubscribe]);

  if (role === 0) {
    return (
      <>
        {Object.keys(userData).length > 0 && (
          <div className="flex h-screen font-sans">
            <div className=" md:flex w-full relative">
              {/* <DashboardSideBar />
              <DashboardNavBar /> */}
              <Navbar />
              <SideBar/>
              {isTokenExpired && <SessionExpiredPopup />}
              <div className="hidden md:block">
                <Tour />
              </div>
              <ApiLimitWarning />
              <div className="md:overflow-y-auto  w-full mt-[60px] md:mt-0">
                <PlanExpiringNotification />
                <Outlet />
              </div>
              {isProfileIncomplete && showUpdateProfileAlert && (
                <ProfileIncompleteAlert setIsOpen={setShowUpdateProfileAlert} />
              )}
              {/* {!isNotificationEnabled && <AllowNotificationPopup isOpen={isAllowNotificationPopupOpen} setIsOpen={setIsAllowNotificationPopupOpen} />} */}
              <Toaster />
              <LimitToaster />
            </div>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <PageNotFound />
    </>
  );
};

export default AuthorizedLayout;