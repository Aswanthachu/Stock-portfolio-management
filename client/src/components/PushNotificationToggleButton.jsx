// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { baseUrl,getConfig } from '@/Redux/Api';
// import AllowNotificationPopup from './Popups/AllowNotificationPopup';
// const PushNotificationToggleButton = () => {

//     const [subscription, setSubscription] = useState(null);
//     const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
//     const [isAllowNotificationPopupOpen, setIsAllowNotificationPopupOpen] = useState(false);

//     useEffect(() => {
//       const checkSubscriptionStatus = async () => {
//         const registration = await navigator.serviceWorker.ready;
//         const existingSubscription = await registration.pushManager.getSubscription();
//         setSubscription(existingSubscription);
//         setIsNotificationEnabled(existingSubscription !== null);
//       };

    
//       checkSubscriptionStatus();
//     }, []);
  
//     const toggleSubscription = async () => {
//       const registration = await navigator.serviceWorker.ready;
  
//       if (subscription) {
//         // User is currently subscribed, unsubscribe
//         try {
//           await subscription.unsubscribe();
        
//           // Remove the subscription from the server
//           const config = getConfig();
//           const response = await axios.post(`${baseUrl}/web-push/unsubscribe`, { subscription }, config);
//           setSubscription(null);
//           setIsNotificationEnabled(false);
//           console.log('Subscription turned off');
//         } catch (error) {
//           console.error('Error during unsubscribe or server request:', error);
//         }
//       } else {
//         // User is not subscribed, subscribe
//         if (Notification.permission !== 'granted' && Notification.permission !== 'denied'){
//           setIsAllowNotificationPopupOpen(true)
//         }
//         try {
//           const newSubscription = await registration.pushManager.subscribe({
//             userVisibleOnly: true,
//             applicationServerKey: 'BKJfTAUX0Ufxn7rcLdndrAtYlpcuRI_N1vNY_vP-G_f13kvWbJrTbd3IIg9qJ7WvOYEQe0_QWsEYB1Y3J4N02jo',
//           });
        
//           // Save the new subscription to the server
//           const config = getConfig();
//           const response = await axios.post(`${baseUrl}/web-push/subscribe`, { subscription: newSubscription }, config);
        
//           setSubscription(newSubscription);
//           setIsNotificationEnabled(true);
//           console.log('Subscription turned on');
//         } catch (error) {
//           console.error('Error during subscription or server request:', error);
//         }
//       }
//     };
//     useEffect(()=>{
//       if(Notification.permission === 'granted' || Notification.permission === 'denied'){
//         setIsAllowNotificationPopupOpen(false)
//       }
//     },[Notification.permission])
  
//     return (
    
//     <>

// <label className="relative inline-flex items-center cursor-pointer">
//       <input type="checkbox" className="sr-only peer" checked={isNotificationEnabled} onChange={toggleSubscription} />
//       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none    rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-darkGreen"></div>
//       <span className="ms-3 text-sm font-semibold text-darkGreen"> Push Notifications</span>
//     </label>
//      <AllowNotificationPopup isOpen={isAllowNotificationPopupOpen} setIsOpen={setIsAllowNotificationPopupOpen} />

//     </>
    
//     );
//   };

// export default PushNotificationToggleButton