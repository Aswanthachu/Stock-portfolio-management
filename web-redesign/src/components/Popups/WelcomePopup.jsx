import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const WelcomePopup = ({ isOpen, setIsOpen, setShowConsultation}) => {
  const navigate = useNavigate()
    const closeModal = () => {
      localStorage.setItem("popupShowed", "true");
        setIsOpen(false);
      };
 const handleConsultation = ()=>{
  localStorage.setItem("popupShowed", "true");
setShowConsultation(true)
setIsOpen(false)
 }

 const handleSubscribeNow = ()=>{
  localStorage.setItem("popupShowed", "true");
navigate("/plans")
setIsOpen(false)
 }
  return (
    <>
    {isOpen && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
  <div className="bg-white p-4 rounded-lg shadow-lg   mx-4">
    <div className='justify-end hidden md:flex'>
    <Button className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={closeModal} icon={ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>} />
    </div>
    <div className='md:m-5 lg:max-w-3xl '>

    <div className='flex flex-col-reverse md:flex-row '>
<div className="md:w-1/2">
<div className=" w-full flex flex-col items-center">
  <h1 className="text-teal-800 text-2xl font-bold text-center  py-3 ">Welcome to KKS capitals.</h1>

  <div className="mb-2 inline-flex gap-1">
    <p className="text-red-600 text-lg font-bold  ">Attention:</p>
    <p className="text-stone-950 text-lg font-bold  ">Subscription required</p>
  </div>

  <p className="text-center text-gray-700 text-sm font-bold  ">
    To access premium features, kindly subscribe to unlock the full potential of our application
  </p>

  <div className="relative text-center w-[95%] py-1 md:py-4">
  <div className="border-t-2 border-darkGreen absolute top-1/2 left-0 right-0 transform -translate-y-1/2"></div>
  <span className="text-darkGreen text-base md:text-2xl font-bold bg-white px-4 relative z-10">Benefits</span>
</div>
<div className="text-sm">
<ul className="list-disc   flex flex-col md:flex-row items-start  md:gap-8 justify-center ">
    <li className="text-gray-700  font-bold md:py-2  leading-snug">1 To 1 Support</li>
    <li className="text-gray-700  font-bold md:py-2  leading-snug">Advanced Sips</li>
  </ul> <ul className="list-disc   flex flex-col md:flex-row items-start  md:gap-8 justify-center">
    <li className="text-gray-700  font-bold md:py-2  leading-snug">List of stocks to buy</li>
    <li className="text-gray-700  font-bold md:py-2  leading-snug">Portfolio Management</li>
  </ul>
</div>
 
 <div className=" md:w-[76%] lg:w-2/3 my-3">
  <Button text={'Subscribe now'} onClick={handleSubscribeNow}  className={`bg-darkGreen  text-white md:text-xl font-bold  w-full  py-2 px-4 rounded-md`} />

<Button  text={`Get free Consultation`} onClick={handleConsultation} className="bg-white w-full text-gray-700 md:text-xl font-bold  border-black border-2  py-2 px-4 rounded-md mt-4" />
 
 </div>
 
</div>
</div>
<div className="hidden md:block md:w-1/2 ">
<img src="/assets/welcome2.svg" alt="Welcome" className=""  />

</div>
</div>

    </div>

   
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
          </svg>} className="text-gray-600 rounded-full bg-white hover:bg-red-100 p-4 hover:text-gray-800 text-sm absolute bottom-16 left-1/2 transform -translate-x-1/2 translate-y-1/2 m-4 md:hidden"
            onClick={closeModal} />
</div>
    )}
 
 
 </>
  )
}

export default WelcomePopup