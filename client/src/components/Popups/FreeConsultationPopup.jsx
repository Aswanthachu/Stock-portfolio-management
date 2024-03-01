import React from 'react'
import { useState } from 'react';
import Button from '../Button';
import axios from 'axios';
import { getConfig, baseUrl } from '@/Redux/Api';
import { useToast } from '../ToastContext/ToastContext';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
const FreeConsultationPopup = ({ isOpen, setIsOpen }) => {
  const { showToast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [requested, setRequested] = useState(false);
  const validatePhoneNumber = (value) => {
    const regex = /^\d{10}$/;
    if (value.trim() === '') {
      setIsValid(false);
      setErrorMessage('Phone number is required.');
    } else if (!regex.test(value)) {
      setIsValid(false);
      setErrorMessage('Invalid phone number. Please enter a 10-digit number.');
    } else {
      setIsValid(true);
      setErrorMessage('');
    }
  };
  const resetForm = () => {
    setIsValid(true);
    setPhoneNumber('');
    setErrorMessage('');
  };
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setRequested(true);

    try {
      const formData = { phoneNumber };
      const config = getConfig();
      const { data } = await axios.post(`${baseUrl}/user/update-phone`, formData, config);

      if (data.status) {
        showToast(data.message, 'success');
        resetForm();
        closeModal();
      }
    } catch (error) {
      showToast(error?.response?.data?.message, 'error');
    } finally {
      setRequested(false);
    }
  };

  const closeModal = () => {
    localStorage.setItem('popupShowed', 'true');
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center lg:pb-28 bg-black bg-opacity-50 backdrop-blur-sm  z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg   mx-4">
            <div className=' justify-end hidden md:flex'>
              <Button className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={closeModal} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>} />

            </div>
            <div className=''>
              <div className='flex max-w-2xl'>
                <div className='md:w-1/2 p-5'>
                  <h3 className='text-darkGreen  font-semibold text-2xl py-4'>Get Free Consultation</h3>
                  <p>We offer free consultation for portfolio
                    management. please provide your
                    contact details and our experts will
                    get in touch with you </p>
                </div>
                <div className='md:w-1/2 hidden md:block'>
                  <img src="/assets/consultation.svg" alt="Free Consultation" />
                </div>
              </div>
              <div className='p-5 w-full -mt-5'>

                <h2 className="text-lg lg:text-xl font-bold mb-2 text-darkGreen">Enter Phone Number</h2>
                <form onSubmit={(e) => handleSubmit(e)} className='flex w-full'>
                  <div className="relative flex flex-col md:flex-row w-full   gap-3 items-center">

                    <PhoneInput className='  px-4 text-center  text-black   focus:outline-none rounded-lg w-full appearance-none  '
                      defaultCountry="in"
                      value={phoneNumber} inputClassName='w-full focus:outline-none rounded-lg w-full appearance-none'
                      onChange={handlePhoneNumberChange}
                    />
                    <button
                      type="submit"
                      className={`bg-darkGreen hover:bg-teal-900 w-full text-white font-bold py-2 px-4 rounded ${!isValid && 'pointer-events-none opacity-50'}`}
                    > {requested ? <div className="w-full flex justify-center items-center text-center" role="status">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="text-[#778899]">Please Wait...</span>
                    </div> : 'Get Free Consultation'}

                    </button>

                  </div>

                </form>
                {/* Validation Error Message */}
                {!isValid && (
                  <div className="text-xs text-red-500">{errorMessage}</div>
                )}
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

export default FreeConsultationPopup