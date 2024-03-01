import React from 'react'
import { useEffect } from 'react'
import Button from '../Button'
const AllowNotificationPopup = ({ isOpen, setIsOpen }) => {
  useEffect(()=>{
    if(isOpen){
        setTimeout(() => {
           setIsOpen(false) 
        }, 10000);
    }
  },[isOpen])
    return (
        <>
            {isOpen && (

                <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50">
                    <div className="bg-white flex flex-col justify-center items-center p-6 rounded-lg shadow-md w-[90%] md:w-2/3 lg:w-1/2">
                    <div className='justify-end w-full hidden md:flex'>
              <Button className="text-gray-600 hover:text-gray-800 text-sm z-50"
                onClick={()=>setIsOpen(false)} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>} />
            </div>
             <h2 className="text-2xl font-semibold mb-4 text-darkGreen">Allow Notifications</h2>
                        <img src="/assets/noti.png" alt="" className='w-24 md:w-40 lg:w-96' />
                        <p className="text-gray-600 mb-4 w-fit">
                            Click allow to get notifications. You can turn it off from account settings any time.
                        </p>
                    </div>
                    <Button icon={<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>} className="text-gray-600 rounded-full bg-white hover:bg-red-100 p-3 hover:text-gray-800 text-sm absolute bottom-16 left-1/2 transform -translate-x-1/2 translate-y-1/2 m-4 md:hidden"
            onClick={()=>setIsOpen(false)} />
        </div>
            )}
        </>
    )
}

export default AllowNotificationPopup