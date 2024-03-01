import React from 'react'
import Button from './Button'
const PaymentFailed = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-3">
    <div className="p-8 bg-white shadow-md flex flex-col items-center rounded-md">
      <img src="/assets/error1.gif" alt="Error" className='mx-auto' />
      <h2 className="text-2xl font-bold text-red-500 mb-4">Payment Failed</h2>
      <p className="text-gray-700 mb-4">
        We're sorry, but your payment could not be processed at this time.
      </p>
      <p className="text-gray-700 mb-4">
        Please try again or contact our support team for assistance.
      </p>
      <div className=' gap-5 flex'>
      <Button text={`Retry Payment`} link={`/plans`} className={`bg-white text-yellow-500 px-4 py-2 rounded-md font-bold border-2 border-yellow-500 hover:bg-yellow-100 focus:outline-none focus:shadow-outline-blue active:bg-teal-700`}/>
    <Button text={`Home`} link={`/dashboard`} className={`bg-darkGreen text-white px-4 py-2 rounded-md hover:bg-emerald-600 font-bold focus:outline-none focus:shadow-outline-blue active:bg-teal-700 `} />
   
      </div>
   </div>
  </div>  )
}

export default PaymentFailed