import React, { useState } from 'react';
import Button from '../Button';
import { InputField } from '..';
import { LockIcon } from "@/assets";
import { useToast } from '../ToastContext/ToastContext';
import axios from 'axios';
import { baseUrl, getConfig } from '@/Redux/Api';
const ChangePasswordPopup = ({ isOpen, setIsOpen }) => {
    const { showToast } = useToast()
    const [formValues, setFormValues] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [showError, setShowError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        if (name === 'newPassword') {
            validatePassword(value, formValues.confirmPassword);
        } else if (name === 'confirmPassword') {
            validatePassword(value, formValues.newPassword);

        }
    };

    const validatePassword = (newPassword, confirmPassword) => {
        // Password regex to require at least 8 characters, at least one uppercase letter, one number, and one special character.
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            setPasswordError('Password must be at least 8 characters long, with at least one uppercase letter, one number, and one special character (@#$%^&+=).');
        } else if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirm password do not match.');
        } else {
            setPasswordError(''); // Clear any previous error message
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // Validate the password before submission
        setShowError(true);
        validatePassword(formValues.newPassword, formValues.confirmPassword);
        if (formValues.oldPassword === formValues.newPassword) {
            setPasswordError('Old password and new password cannot be the same.');
            return; // Prevent the API request if there's an error
        }
        if (!passwordError) {
            try {
                const config = getConfig(); // Ensure this function correctly provides the axios configuration.

                // Make the password change request to your API
                const res = await axios.post(`${baseUrl}/user/change-password`, formValues, config);

                if (res.status === 201) {
                    showToast('Password updated successfully', 'success');
                    setIsOpen(false);
                } else {
                    showToast(res.data.error.message || 'Password change failed', 'error');
                }
            } catch (error) {
                console.log(error);
                showToast('An error occurred while changing the password', 'error');
            }

        }
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="w-full p-8 mx-4 lg:p-12 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md">
                        <div className="justify-end hidden md:flex">
                            <Button
                                className="text-gray-600 hover-text-gray-800 text-sm"
                                onClick={closeModal}
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                }
                            />
                        </div>
                        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-darkGreen md:text-2xl">
                            Change Password
                        </h2>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handlePasswordChange}>
                            <div>

                                <InputField
                                    title="Old Password"
                                    astrik
                                    name="oldPassword"
                                    value={formValues.oldPassword}
                                    icon1={<LockIcon />}
                                    placeholder="************"
                                    type="password"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>

                                <InputField
                                    title="New Password"
                                    astrik
                                    name="newPassword"
                                    value={formValues.newPassword}
                                    icon1={<LockIcon />}
                                    placeholder="************"
                                    type="password"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>

                                <InputField
                                    title="Confirm Password"
                                    astrik
                                    name="confirmPassword"
                                    value={formValues.confirmPassword}
                                    icon1={<LockIcon />}
                                    placeholder="************"
                                    type="password"
                                    onChange={handleChange}
                                />
                            </div>

                            {showError && passwordError && <p className="text-red-500">{passwordError}</p>}
                            <Button
                                text="Update Password"
                                className="w-full text-white bg-darkGreen hover-underline focus-ring-4 focus-outline-none focus-ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                type="submit"
                            >
                                Reset Password
                            </Button>
                        </form>
                    </div>
                    <Button
                        icon={
                            <svg
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
                            </svg>
                        }
                        className="text-gray-600 rounded-full bg-white hover-bg-red-100 p-4 hover-text-gray-800 text-sm absolute bottom-24 left-1/2 transform -translate-x-1/2 translate-y-1/2 m-4 md:hidden"
                        onClick={closeModal}
                    />
                </div>
            )}
        </>
    );
};

export default ChangePasswordPopup;
