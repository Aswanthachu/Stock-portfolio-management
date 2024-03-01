import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserSubscriptionDetails, extendUserPlan, cancelUserPlan, addPlan } from '@/Redux/Actions/admin';
import { useEffect, useState } from 'react';
import ConfirmationPopup from '../Popups/ConfirmationPopup';
import Button from '../Button';
import { useToast } from '../ToastContext/ToastContext';
import SubLoading from '../SubLoading';
const ManageUserPlans = ({ id, user, isOpen, setIsOpen }) => {
    const dispatch = useDispatch()
    const { showToast } = useToast()
    const [isExtendSubscription, setIsExtendSubscription] = useState(false);
    const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [extensionDays, setExtensionDays] = useState(10);
    const [extensionUnit, setExtensionUnit] = useState("days");
    const [newEndDate, setNewEndDate] = useState(null);
    const [showExtendConfirmation, setShowExtendConfirmation] = useState(false)
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
    const [showAddPlanConfirmation, setShowAddPlanConfirmation] = useState(false)
    const subscriptions = useSelector((state) => state.admin.userSubscriptionDetails)
    const loading = useSelector((state) => state.admin.userSubscriptionDetailsLoading)

    // Update end date when extensionDays or extensionUnit changes
    useEffect(() => {
        if (extensionDays && extensionUnit) {
            // Calculate the new end date based on extensionDays and extensionUnit
            let newDate = new Date(subscriptions[0]?.endDate);

            if (extensionUnit === "days") {
                newDate.setDate(newDate.getDate() + extensionDays);
            } else if (extensionUnit === "weeks") {
                newDate.setDate(newDate.getDate() + extensionDays * 7);
            } else if (extensionUnit === "months") {
                newDate.setMonth(newDate.getMonth() + extensionDays);
            }
            setNewEndDate(newDate);
        } else {
            setNewEndDate(null); // Reset if extensionDays or extensionUnit is not set
        }
    }, [extensionDays, extensionUnit, subscriptions]);
    const handlePlanChange = (event) => {
        setSelectedPlan(event.target.value); // Update the state when the selection changes
    };
    const closeExtendConfirmation = () => {
        setShowExtendConfirmation(false)
    }
    const closeCancelConfirmation = () => {
        setShowCancelConfirmation(false)
    }
    const closeAddPlanConfirmation = () => {
        setShowAddPlanConfirmation(false)
    }
    const handleExtend = (subscription) => {
        const formData = {
            userId: subscription?.userId,
            planId: subscription?._id,
            extensionUnit,
            extensionDays,
            newEndDate,
            isUpcomingPlan: subscriptions?.length > 0
        }
        dispatch(extendUserPlan({ formData, showToast }))
        setShowExtendConfirmation(false)
    };

    const handleCancel = (subscription) => {
        const formData = {
            userId: subscription?.userId,
            planId: subscription?._id,
            status: subscription?.status,
            endDate: subscription?.endDate,
            isUpcomingPlan: subscriptions?.length > 0
        }
        dispatch(cancelUserPlan({ formData, showToast }))
        setShowCancelConfirmation(false)
    };
    const handleAddPlan = () => {
        const formData = {
            userId: user.id,
            plan: selectedPlan
        }
        dispatch(addPlan({ formData, showToast }))
        setShowAddPlanConfirmation(false)
    };
    const handleExtensionUnitChange = (event) => {
        setExtensionUnit(event.target.value);
    };
    const handleExtensionDaysChange = (event) => {
        const days = parseInt(event.target.value, 10);
        setExtensionDays(days);
    };
    useEffect(() => {
        dispatch(getUserSubscriptionDetails(id))
    }, [])
    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
                   {loading? <SubLoading/>: <div className="bg-white p-4 rounded-lg shadow-lg max-h-[90%] w-[60%]  mx-4">
                        <div className=' justify-end hidden md:flex'>
                            <Button className="text-gray-600 hover:text-gray-800 text-sm"
                                onClick={() => setIsOpen(false)} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>} />

                        </div>
                        <h1 className="text-xl font-semibold mb-4">Manage User Plan</h1>

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
                            <div>
                                <Button text={`Add New Plan`} onClick={() => setIsAddPlanOpen(true)} className={`text-white bg-darkGreen rounded-md px-4 mr-8`} />
                            </div>
                        </div>
                        {isAddPlanOpen &&

                            <div className='flex items-end gap-4 '>
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="selectMenu">
                                        Select a Plan:
                                    </label>
                                    <select
                                        id="selectMenu"
                                        name="selectMenu"
                                        value={selectedPlan}
                                        onChange={handlePlanChange}
                                        className="block w-fit bg-white border border-gray-400 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                                    >
                                        {/* <option value="">Select an option</option> */}
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                                <Button text={'Add Plan'} onClick={() => setShowAddPlanConfirmation(true)} className={`bg-darkGreen text-white rounded-md px-4 mb-3`} />
                            </div>}
                        <div className="space-y-4">
                            {subscriptions?.map((subscription, index) => (
                                <div key={index} className='flex  border-2 p-4 rounded-md'>
                                    {/* <p className=''>{subscription.status=== 'active'?'Current Plan' : 'Upcomming Plan' }</p> */}
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
                                        <div className="mt-2 space-x-2">
                                            {subscription?.status === 'active' && <Button text={`Extend`}
                                                className="bg-blue-500 text-white rounded-md px-4 "
                                                onClick={() => setIsExtendSubscription(true)}
                                            />
                                            }
                                            <Button text={`Cancel`}
                                                className="bg-red-500 text-white rounded-md px-4 "
                                                onClick={() => setShowCancelConfirmation(true)}
                                            />
                                        </div>

                                        {(subscription?.status === 'active' && isExtendSubscription) && (
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
                    </div>}
                </div>

            )}
            <ConfirmationPopup isOpen={showExtendConfirmation} onConfirm={handleExtend} data={subscriptions[0]} onCancel={closeExtendConfirmation} message={`Are you sure you want to extend Plan with ${user?.username} to ${extensionDays} ${extensionUnit}`} />
            <ConfirmationPopup isOpen={showCancelConfirmation} onConfirm={handleCancel} data={subscriptions[0]} onCancel={closeCancelConfirmation} message={`Are you sure you want to cancel Plan of ${user?.username} `} />
            <ConfirmationPopup isOpen={showAddPlanConfirmation} onConfirm={handleAddPlan} onCancel={closeAddPlanConfirmation} message={`Are you sure you want to Add ${selectedPlan.toLocaleUpperCase()} Plan to ${user?.username} `} />

        </>
    )
}
export default ManageUserPlans