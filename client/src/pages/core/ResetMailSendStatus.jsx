import React from 'react'
import { useLocation } from 'react-router-dom';
import { Success } from '@/components'
const ResetMailSendStatus = () => {
    const location = useLocation();
    const data = location.state;
  return (
    <Success
          title={`We send you the reset link to ${data? data :'your email address'}`}
          loadingMessage="Go to home page......"
          ButtonName="Home"
          buttonLink="/login"
        />
  )
}

export default ResetMailSendStatus