
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserSubscriptionDetails,extendUserPlan,cancelUserPlan } from '@/Redux/Actions/admin';
import { useEffect, useState } from 'react';
import ConfirmationPopup from '../Popups/ConfirmationPopup';
import Button from '../Button';
import { useToast } from '../ToastContext/ToastContext';
const AddNewPlan = () => {

  return (
    <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-h-[90%] w-[60%]  mx-4">
                        <div className=' justify-end hidden md:flex'>
                            <Button className="text-gray-600 hover:text-gray-800 text-sm"
                                onClick={() => setIsOpen(false)} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>} />

                        </div>
                        <h1 className="text-xl font-semibold mb-4">Add New Plan</h1>

                        <div className="flex items-center justify-between gap-5 my-4">

                            <div className="flex flex-col md:flex-row gap-3 md:gap-10">
                                <div>
                                    <h4 className="font-main font-medium text-base md:text-xl">
                                        <strong>Username:</strong> {user?.username}
                                    </h4>
                                    <p className="font-main font-medium text-base md:text-xl text-darkGreen">
                                        <strong>Email:</strong> {user?.email}
                                    </p>

                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {subscriptions?.map((subscription, index) => (
                                <div key={index} className='flex  border-2 p-4 rounded-md'>
                                    <div className='flex w-full flex-col'>
                                        <div className='flex justify-between gap-8 w-full'>

                                            <p><strong>Plan:</strong> {subscription.plan}</p>
                                            <p>
                                                <strong>Days Remaining:</strong> {Math.floor((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))}
                                            </p>
                                        </div>
                                        <div className='flex justify-between gap-8'>
                                            <p><strong>Start Date:</strong> {new Date(subscription?.startDate).toLocaleDateString('en-GB')}</p>
                                            <p><strong>End Date:</strong> {new Date(subscription?.endDate).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div className='flex justify-between gap-8 w-full'>
                                            <p><strong>Amount:</strong> {subscription?.amount}</p>
                                            <p><strong>Status:</strong> {subscription?.status}</p>

                                        </div>
                                    

                                        {(subscription?.status === 'active'&& isExtendSubscription) && (
                                            <div className="mt-2 ">
                                                <p><strong>Extend Subscription:</strong></p>
                                                <div className='flex  gap-4'>

                                                    <input
                                                        type="number"
                                                        value={extensionDays}
                                                        onChange={handleExtensionDaysChange}
                                                        className="mt-2 p-1 rounded-md border border-gray-300"
                                                    />

                                                    <div className="mt-2">
                                                        <input
                                                            type="radio"
                                                            id="days"
                                                            name="extensionUnit"
                                                            value="days"
                                                            checked={extensionUnit === "days"}
                                                            onChange={handleExtensionUnitChange}
                                                        />
                                                        <label htmlFor="days" className="mr-2">Days</label>

                                                        <input
                                                            type="radio"
                                                            id="weeks"
                                                            name="extensionUnit"
                                                            value="weeks"
                                                            checked={extensionUnit === "weeks"}
                                                            onChange={handleExtensionUnitChange}
                                                        />
                                                        <label htmlFor="weeks" className="mr-2">Weeks</label>

                                                        <input
                                                            type="radio"
                                                            id="months"
                                                            name="extensionUnit"
                                                            value="months"
                                                            checked={extensionUnit === "months"}
                                                            onChange={handleExtensionUnitChange}
                                                        />
                                                        <label htmlFor="months">Months</label>
                                                    </div>

                                                    <Button text={`Cancel`}
                                                        className="bg-gray-400 text-white rounded-md px-4  mt-2"
                                                        onClick={() => setIsExtendSubscription(false)}
                                                    />
                                                    
                                                    <Button text={`Submit Extension`}
                                                        className="bg-green-500 text-white rounded-md px-4  mt-2"
                                                        onClick={() => setShowExtendConfirmation(true)}
                                                    />
                                                    
                                                </div>
                                                {newEndDate && (
                                                    <p >New End Date:<strong className='text-orange-800'>{newEndDate.toLocaleDateString('en-GB')}</strong> </p>
                                                )}
                                            </div>
                                        )}
                                    </div>




                                </div>

                            ))}
                        </div>
                    </div>
                </div>

            )}
{loading &&  <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-50">
        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-darkGreen" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
        <span className="sr-only">Loading...</span>
    </div>}
<ConfirmationPopup isOpen={showExtendConfirmation} onConfirm={handleExtend} data={subscriptions[0]} onCancel={closeExtendConfirmation} message={`Are you sure you want to extend Plan with ${user?.username} to ${extensionDays} ${extensionUnit}`} />
<ConfirmationPopup isOpen={showCancelConfirmation} onConfirm={handleCancel} data={subscriptions[0]} onCancel={closeCancelConfirmation} message={`Are you sure you want to cancel Plan of ${user?.username} `} />
       
        </>
  )
}

export default AddNewPlan
