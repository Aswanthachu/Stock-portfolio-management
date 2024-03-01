import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getTutorialVideos } from '@/Redux/Actions/user'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'
const Tutorials = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTutorialVideos())
  }, [])
  const videos = useSelector((state) => state.user.tutorialVideos)
  const loading = useSelector((state) => state.user.loading);
  return (
    <>
      <div className="flex flex-col w-full py-5 mb-20 lg:mb-0 ">
        {/*back button*/}
        <div className="w-fit  md:hidden flex justify-between items-center ml-10 -mb-5">
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
        <div className="flex flex-col mt-14 font-semibold mx-10 lg:mx-20">
          <p className="font-main font-five text-4xl text-darkGreen">
            Don't Know how to buy Stock?
          </p>
          <p className="font-normal text-2xl mt-2">
            Here are some Recommended Videos
          </p>
        </div>
        {/* Videos goes here */}
        <div className='w-full flex justify-center mx-auto lg:w-[1100px] 2xl:w-[1300px]'>
        <div className={` mt-14  flex-wrap flex-auto flex  gap-4 2xl:gap-20 h-full flex-row justify-center lg:justify-start   mb-10 md:mb-0 `}>

{videos?.map((video, index) => (
  <Link key={index} to={`/tutorials/${video._id}`} state={video}
    className="bg-white rounded-lg shadow-lg p-4 h-full w-fit min-h-[350px] flex flex-col  overflow-hidden cursor-pointer">
  <div className='h-full'>
  {video.videoType === 'upload' ?
      <video width="320" height="180" controls className='rounded-md mx-auto '>
        <source src="https://res.cloudinary.com/dfkhac2oo/video/upload/v1697180730/tutorial-video/af1yhcozcpk5yordgsl7.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      : <iframe
        className="py-1 mx-auto   rounded-lg" width="320" height="180"
        src={`https://www.youtube.com/embed/${video.embedCode}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>}
  </div>
    
    <div className="mt-3">
      <p className="font-semibold text-lg  w-80">{video.title}</p>
    </div>
  </Link>

))}
</div>
        </div>
       

      </div>

    </>
  )
}

export default Tutorials