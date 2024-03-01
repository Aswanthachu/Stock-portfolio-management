import React from 'react'
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { setTour } from '@/Redux/Features/user';
const TakeATourPopup = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleClick = ()=>{
   dispatch(setTour())
    setIsOpen(false)
}
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl  mx-4">
            <div className='justify-end hidden md:flex'>
              <Button className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={closeModal} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>} />
            </div>
            <div className='flex '>
              <div className='md:w-1/2 px-5 py-10 flex flex-col justify-center'>
                <h3 className='font-semibold text-2xl text-darkGreen text-center'>Take a tour of software</h3>
                <p className='text-lg font-normal text-center py-3'>Explore features effortlessly with our guided tour. Discover simplicity and power in every click. Start now!</p>
                <Button text={'Take a tour'} onClick={handleClick} className='bg-darkGreen hover:bg-teal-800 px-4 py-2 rounded-lg text-white mx-5' />
              </div>
              <div className='md:w-1/2 hidden md:block'>
                <img src="/assets/takeatour.svg" alt="Take a tour" />
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

export default TakeATourPopup