import React from 'react'
import Button from '../Button';
const WelcomePopupSubscribed = ({isOpen , setIsOpen, setIsTakeATourOpen}) => {
    const closeModal = () => {
      localStorage.setItem('popupShowedSub', 'true');
        setIsOpen(false);
      };
      const handleClick = ()=>{
        localStorage.setItem('popupShowedSub', 'true');
        setIsTakeATourOpen(true)
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
     <div className='md:relative'>

     <div className='md:m-5 lg:m-10'>
     <div className="md:absolute p-3 md:p-0 top-0 left-0 z-10  w-full h-full ">
    <div className='w-full h-full flex flex-col justify-end items-center '>
  
  <div className=" text-teal-800 text-lg lg:text-3xl font-semibold mb-5  lg:leading-7">Welcome to kks capital</div>
  {/* <div className=" text-center text-gray-700 text-base lg:text-lg font-normal  leading-[35px]">Lorem ipsum dolor sit amet consectetur<br/>Lorem morbi vitae at scelerisque</div> */}
   <Button text={'Start exploring'} onClick={handleClick} className={`hidden md:block text-white bg-darkGreen text-xl font-medium  leading-7 rounded-lg px-4 py-2`} />
   <Button text={'Start exploring'} onClick={closeModal} className={`md:hidden text-white bg-darkGreen text-xl font-medium  leading-7 rounded-lg px-4 py-2`} />
 </div>
  </div>
  <div className='md:max-w-lg lg:max-w-xl'>
  <img src="/assets/welcome.svg" alt="Welcome" className=' hidden md:block' />

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
          </svg>} className="text-gray-600 rounded-full bg-white hover:bg-red-100 p-4 hover:text-gray-800 text-sm absolute bottom-24 left-1/2 transform -translate-x-1/2 translate-y-1/2 m-4 md:hidden"
            onClick={closeModal} />
 </div>
     )}
  
  
  </>
 
  )
}

export default WelcomePopupSubscribed