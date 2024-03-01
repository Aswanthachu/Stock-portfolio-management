import React from 'react'
import { Link } from 'react-router-dom'
const MenuListMobile = ({location,handleClick,userRole,userType}) => {
    const menuItems = [
        {
          id: 1,
          text: "Home",
          userTypes: ["user"],
          userRole:[0],
          path: "/dashboard",
          selector: "a",
        },
        {
          id: 2,
          text: "Overview",
          userTypes: ["admin"],
          userRole:[1],
          path: "/dashboard",
        },
        {
          id: 3,
          text: "Users",
          userTypes: ["admin", "sub-admin"],
          userRole:[1,4],
          path: "/user",
        },
        {
          id: 4,
          text: "Verify Payment",
          userTypes: ["admin"],
          userRole:[1],
          path: "/verify-payment",
          notification: true,
          notificationType: "verifyPayment",
        },
        {
          id: 6,
          text: "Portfolio",
          userTypes: ["user"],
          userRole:[0],
          path: "/portfolio",
          selector: "b"
        },
      
        {
          id: 8,
          text: "Tickets",
          userTypes: ["user", "admin", "sub-admin"],
          userRole:[0,1,2,3],
          path: "/tickets",
          selector: "c"
        },
        {
          id: 10,
          text: "Stock List",
          userTypes: ["admin"],
          userRole:[1],
          path: "/stocks",
        },
      
        {
          id: 12,
          text: "Coupons",
          userTypes: ["admin"],
          userRole:[1],
          path: "/coupons",
        },
        {
          id: 13,
          text: "Tutorials",
          userTypes: ["user", "admin"],
          userRole:[0,1],
          path: "/tutorials",
          selector: "d"
        },
        {
          id:14,
          userTypes: ["admin"],
          text: "Add Notifications",
          userRole:[1],
          path: "/add-notifications",
        },
      
        {
          id: 16,
        
          text: "Subscription",
          userTypes: ["user"],
          userRole:[0],
          path: "/subscription",
          selector: "e"
        },
        ,
        {
          id: 17,
          text: "Push-Notification",
          userTypes: ["admin"],
          userRole:[1],
          path: "/push-notification",
        },
        {
          id: 18,
          // icon: <RobotIcon className="w-8 h-8"/>,
          text: "Ai Assistant",
          userTypes: ["user"],
          userRole:[0],
          path: "/ai-assistant",
        },
        {
          id: 19,
          // icon: <RobotIcon className="w-12 h-12 mt-4"/>,
          text: "Assistant Overview",
          userTypes: ["admin"],
          userRole:[1],
          path: "/assistant-overview",
        },
      ];
  return (
    <>
    
    {menuItems.map((item,index) => {
                      if (item.userRole.includes(userRole)) {
                          return (
                            <Link key={index}  to={ userType === 'user'
                            ? item.path
                            : `${userType}${item.path}`} onClick={handleClick} className={`flex mx-6 py-5 gap-6  border-b-2 text-sm  cursor-pointer items-center ${location.pathname === (userType === 'user' ? item.path : `/${userType}${item.path}`) ? 'text-black border-black ' : 'text-slate-500 border-slate-400'}`} >
    {item.text}
   </Link>
                          );
                      }
                      return null;
                  })}
      </>
     )
}

export default MenuListMobile