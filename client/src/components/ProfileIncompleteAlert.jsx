import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileIncompleteAlert = ({setIsOpen}) => {
  const navigate = useNavigate();

  return (
    <div className="md:fixed bottom-5 right-4 md:bottom-10 md:right-8 z-0 flex flex-col md:items-end">
      <div className="bg-yellow-100 border-l-4 border-yellow-300 text-yellow-700 p-4" role="alert">
        <div className="flex items-center">
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG Path for the icon */}
          </svg>
          <p className="font-bold pl-3">Update profile</p>
          <button
            onClick={() => {
              setIsOpen(false)
            }}
            className="ml-auto  hover:bg-white rounded-md"
          >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
        </div>
        <p>Your profile is incomplete. Please update.</p>
        <button
          className="inline-block px-2 py-2 mx-auto text-white bg-blue-600 rounded mt-2 hover-bg-blue-700 md:mx-0"
          onClick={() => navigate("/account-settings")}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileIncompleteAlert;
