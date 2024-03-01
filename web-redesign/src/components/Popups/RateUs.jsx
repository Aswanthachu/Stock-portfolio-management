import React , {useState} from 'react'
import Button from '../Button';
import { StarIcon } from "@heroicons/react/20/solid";
import { baseUrl,getConfig } from '@/Redux/Api';
import { useToast } from '@/components/ToastContext/ToastContext';
import axios from 'axios';
const RateUs = ({ isOpen, setIsOpen }) => {
  const {showToast} = useToast();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(false);
  const  role  = JSON.parse(localStorage.getItem("user"))?.role

  const handleClose = () => {
    setIsOpen(false);
    setFeedback("");
    setRating(0);
  };
  const handleFeedback = (e) => {
    setFeedback(e.target.value);
    setError("");
  };
  const handleRating = (i) => {
    setRating(i);
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) {
      setError("Please Enter Your Feedback");
    } else if (!rating) {
      setError("Please Rate Our Site");
    } else {
      const formData = {
        feedbackData: feedback,
        rating,
      };
      try {
        const config = getConfig();
        const { data } = await axios.post(
          `${baseUrl}/user/submit-feedback`,
          formData,
          config
        );
        if (data?.status) {
          showToast("Thank you for your feedback! Your input is valuable to us.",'success')
         
          localStorage.setItem(
            "user",
            JSON.stringify( data.userData )
          );
        }
      } catch (error) {
        console.log(error);
        // showToast(error?.response?.data?.message,'error')
     
      }
      // Submit feedback and rating to server

      handleClose();
    }
  };
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl  mx-4">
            <div className='justify-end hidden md:flex'>
              <Button className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={handleClose} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>} />
            </div>
            <div className='flex '>
              <div className='md:w-1/2 px-5  flex flex-col justify-center'>
                <div className='flex items-center gap-4 justify-center pb-5'>
                <div className=" flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <StarIcon className="h-6 w-6 text-darkGreen " />
                      </div>
                <h3 className='font-semibold text-2xl text-darkGreen text-center'>Rate us</h3>
                </div>
                <div className="mt-2">
                          <p className="text-sm text-black text-center">
                            How would you rate your experience using our app?
                          </p>
                          <div className="mt-5 flex items-center justify-center space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <button
                                key={i}
                                type="button"
                                className={`${
                                  i <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-400"
                                }`}
                                onClick={() => handleRating(i)}
                              >
                                <StarIcon className="h-6 w-6 " />
                              </button>
                            ))}
                          </div>
                        </div>
                        <form className="mt-2" onSubmit={handleSubmit}>
                          <div>
                            <label
                              htmlFor="feedback"
                              className="block text-sm font-medium text-center my-2 text-gray-700"
                            >
                              Feedback
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="feedback"
                                name="feedback"
                                rows="3"
                                className="shadow-sm bg-gray-200 focus:ring-blue-500 placeholder:text-center  focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 text-black rounded-md"
                                value={feedback}
                                onChange={(e) => handleFeedback(e)}
                                placeholder="                                                                                Enter your feedback"
                              />
                            </div>
                          </div>
                          {error && (
                            <div className="text-red-600 font-medium text-xs mb-4 mt-2 w-full text-center">
                              {error}
                            </div>
                          )}
                          <div className="mt-4 flex w-full justify-center">
                            <button
                              type="submit"
                              className="bg-darkGreen hover:bg-teal-800 px-12 py-1 rounded-lg text-white"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
              </div>
              <div className='md:w-1/2 hidden md:block'>
                <img src="/assets/rateus.svg" alt="Rate Us" />
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
            onClick={handleClose} />
        </div>
      )}


    </>
  )
}

export default RateUs