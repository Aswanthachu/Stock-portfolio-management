import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '@/components/Button'
const SingleTutorial = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const video = location.state
    return (
        <div className='py-10 px-2 md:px-10'>
            <div className="w-full relative  flex justify-between pb-4  items-center  left-6   z-50 top-0 max-h-[200px] ">
                <Button
                    icon={
                        <svg
                            width="29"
                            height="24"
                            viewBox="0 0 29 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M27 13.5C27.8284 13.5 28.5 12.8284 28.5 12C28.5 11.1716 27.8284 10.5 27 10.5V13.5ZM0.939341 10.9393C0.353554 11.5251 0.353554 12.4749 0.939341 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.939341 10.9393ZM27 10.5L2 10.5V13.5L27 13.5V10.5Z"
                                fill="#096A56"
                            />
                        </svg>
                    }
                    onClick={() => navigate(-1)}
                />
            </div>

            <div className="bg-white rounded-lg mb-28 shadow-lg p-4 ">
              
                <div className='flex  justify-center '>
                    {video.videoType === 'upload' ?
                        <video width="640" height="360" controls className='rounded-md'>
                            <source src="https://res.cloudinary.com/dfkhac2oo/video/upload/v1697180730/tutorial-video/af1yhcozcpk5yordgsl7.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        :
                        <iframe
                            className="lg:h-[360px] py-1 w-full md:h-[278px] md:w-[480px]  lg:w-[640px]  rounded-md "
                            src={`https://www.youtube.com/embed/${video?.embedCode}`}
                            title={`YouTube Video player`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    }
                </div>

                <div className="mt-10">
                    <p className="font-semibold text-lg lg:text-xl">{video?.title}</p>
                    {/* <p className="text-gray-600 ">{video?.description}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: video.description }} />
                </div>
            </div>
        </div>)
}

export default SingleTutorial