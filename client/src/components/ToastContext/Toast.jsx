import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, duration = 5000 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      setVisible(true);
  
      const timeout = setTimeout(() => {
        setVisible(false);
      }, duration);
  
      return () => {
        clearTimeout(timeout);
      };
    }, [duration]);
  
    return <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md z-50 ${visible ? 'opacity-100 cursor-pointer ' : 'opacity-0 pointer-events-none' } w-96 md:w-[420px] lg:w-[500px] `}>
      <div  className={`flex items-center w-full justify-center p-4 mb-4 border-t-4 ${getTypeClasses(type)}`} role="alert">
    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <div className="ml-3 text-sm font-medium">
    {message}
    </div>
    <button type="button" onClick={()=>{setVisible(false)}} className={`ml-auto -mx-1.5 -my-1.5   rounded-lg  inline-flex items-center justify-center h-8 w-8 ${getTypeClasses(type)}`} data-dismiss-target="#alert-border-1" aria-label="Close">
      <span className="sr-only">Dismiss</span>
      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
</div>      
      </div>;
  }
  
  const getTypeClasses=(type)=> {
    switch (type) {
      case 'success':
        return 'text-green-800 border-green-300 bg-green-50';
      case 'error':
        return 'text-red-800 border-red-300 bg-red-50';
      case 'info':
        return 'text-blue-800 border-blue-300 bg-blue-50';
      case 'warning':
        return 'text-yellow-800 border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  }

export default Toast