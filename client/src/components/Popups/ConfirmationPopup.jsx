import React from "react";

const ConfirmationPopup = ({
  isOpen,
  message,
  onCancel,
  onConfirm,
  cancelButtonText = "Cancel",
  confirmButtonText = "Confirm",
  data
}) =>{
    const handleConfirm = ()=>{
        onConfirm(data)
    }
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative flex flex-col items-center p-5 md:p-8 text-center bg-white rounded-lg shadow dark:bg-gray-800">
            <button
              onClick={onCancel}
              type="button"
              className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover-text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark-hover-bg-gray-600 dark-hover-text-white"
              data-modal-toggle="deleteModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <p className="mb-4 text-gray-500 text-lg font-medium px-4">
              {message}
            </p>
            <div className="flex justify-center items-center space-x-6">
              <button
                onClick={onCancel}
                type="button"
                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover-bg-gray-100 focus-ring-4 focus-outline-none focus-ring-primary-300 hover-text-gray-900 focus-z-10 dark-bg-gray-700 dark-text-gray-300 dark-border-gray-500 dark-hover-text-white dark-hover-bg-gray-600 dark-focus-ring-gray-600"
              >
                {cancelButtonText}
              </button>
              <button
                onClick={handleConfirm}
                type="submit"
                className="py-2 px-3 z-50 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover-bg-red-700 focus-ring-4 focus-outline-none focus-ring-red-300 dark-bg-red-500 dark-hover-bg-red-600 dark-focus-ring-red-900"
              >
                {confirmButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationPopup;
