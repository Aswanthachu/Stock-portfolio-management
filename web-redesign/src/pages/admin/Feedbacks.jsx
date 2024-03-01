import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { baseUrl,getConfig } from '@/Redux/Api'
import { StarIcon } from '@heroicons/react/20/solid';

const Feedbacks = () => {
const [feedback,setFeedback] = useState([])
    useEffect(()=>{
        const fetch = async()=>{
          const config = getConfig()
            const {data} =await axios.get(`${baseUrl}/admin/get-feedbacks`,config)
            setFeedback(data?.feedbackData)
        }
        fetch()
    },[])
  
  return (
    <div className="flex flex-col  items-center">
    <h1 className="text-2xl font-bold mb-4">Feedback Details</h1>
    <div className="w-full max-w-2xl">
        {feedback && feedback.map((item,index)=>
      <div key={index} className=' border border-red-200 rounded-lg p-3'>
        <div className="flex items-center mb-2 ">
          <div>
            <div className='flex gap-3'>
                <label htmlFor="username">Username :</label>
            <h2 className="text-lg font-semibold">{item.userId.username}</h2> 
            </div>
            <div className='flex gap-3'>
                <label htmlFor="email">Email :</label>
            <p className="text-gray-600">{item.userId.email}</p>
            </div>
           
          </div>
        </div>
        <div className='flex gap-3'>
            <label htmlFor="rating">Rating :</label>
            <div className="flex relative w-24 h-5 mb-5" >
      {[...Array(5)].map((_, index) => (
        <span key={index} className={`flex ${index < parseInt(item.rating) ? "text-darkGreen" : "text-gray-400"}`}><StarIcon className='w-6 h-6' /></span>
      ))}
    </div>
        </div>
       <div className='flex gap-3'>
        <label htmlFor="feedback">Feedback :</label>
        <p className="text-gray-700">{item.feedback}</p>
       </div>
       
        <p className="text-gray-500 text-sm mt-4">
          Created at : {new Date(item.createdAt).toLocaleDateString("en-GB")}
        </p>
      </div>
      )}
         {(feedback.length === 0) &&  <div className=" flex items-center justify-center ">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl  text-center">No Feedbacks!</h1>
    </div>
    </div>
    }
    </div>
  </div>
  )
}

export default Feedbacks