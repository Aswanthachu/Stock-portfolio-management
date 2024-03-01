import React from 'react'
import Button from './Button'
import { SuccessIcon } from "@/assets";

const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="p-8 bg-white flex flex-col justify-center items-center shadow-md rounded-md">
        <SuccessIcon />
      <h2 className="text-2xl font-bold text-green-500 mb-4">Payment Successful</h2>
      <p className="text-gray-700 mb-4">
        Thank you for your payment. Your transaction was successful!
      </p>
      <p className="text-gray-700 mb-4">
        Subscription added Successfully
      </p>
      <Button text={` Go to Dashboard`} link={`/dashboard`} className="bg-darkGreen text-white px-4 py-2 rounded-md hover:bg-teal-900 focus:outline-none focus:shadow-outline-blue active:bg-blue-700"
 />
  
       

    </div>
  </div>
    )
}

export default PaymentSuccess