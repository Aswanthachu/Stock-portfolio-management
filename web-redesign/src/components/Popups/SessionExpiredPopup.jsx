import React from 'react'
import { useNavigate} from "react-router-dom";
import Button from '../Button';
const SessionExpiredPopup = () => {
    const navigate = useNavigate()
    const onClose = ()=>{
        localStorage.clear()
navigate('/login')
    }
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Session Expired</h2>
      <p className="text-gray-700">Your session has expired. Please log in again.</p>
      <div className="mt-4 text-right">
        <Button text={'Login'}  onClick={onClose} className={'px-4 py-2 bg-darkGreen text-white rounded hover:shadow-2xl'} />

      </div>
    </div>
  </div>  )
}

export default SessionExpiredPopup