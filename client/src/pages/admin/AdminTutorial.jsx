import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTutorialVideos, deleteTutorialVideo,  } from '@/Redux/Actions/admin';
import Button from '@/components/Button';
import { useToast } from '@/components/ToastContext/ToastContext';

const AdminTutorial = () => {
  
    const { showToast } = useToast()
    const dispatch = useDispatch();

const [videos, setVideos] = useState([]);


const tutorialVideos = useSelector((state) => state?.admin?.tutorialVideos);

useEffect(() => {
    dispatch(getTutorialVideos(showToast));
}, []);

useEffect(() => {
    if (tutorialVideos) {
        setVideos(tutorialVideos);
    }
}, [tutorialVideos]);


const handleDeleteVideo = (index, embedCode) => {
    dispatch(deleteTutorialVideo({ embedCode, showToast }));
    setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
};

return (
    <div className="flex justify-center items-center ">
        <div className="bg-white shadow-md rounded-md p-6 w-full">
            <div className='flex justify-end px-16 pt-5'>
            <Button link={'/admin/create-tutorial'} text={'Add tutorial video'} className={'bg-darkGreen px-8 py-2 rounded-md text-white font-semibold'} />

            </div>

            <h2 className="text-xl font-bold mt-8">Added Videos:</h2>
            <div className="grid grid-cols-3 items-start gap-12  lg:flex-row mt-14 justify-evenly px-10  w-full ">
                {videos && videos?.map((video, index) => (
                    <div key={index} className="flex justify-between flex-col items-center py-1">
                        <div className="w-full">
                            {video.videoType === 'upload'?
                            <video width="640" height="360" controls className='rounded-md'>
                            <source src="https://res.cloudinary.com/dfkhac2oo/video/upload/v1697180730/tutorial-video/af1yhcozcpk5yordgsl7.mp4" type="video/mp4"  />
                            Your browser does not support the video tag.
                          </video>
                            //  <ReactPlayer  controls url='https://res.cloudinary.com/dfkhac2oo/video/upload/v1697180730/tutorial-video/af1yhcozcpk5yordgsl7.mp4' /> 
:
                             <iframe
                             className="w-full rounded-md "
                             src={`https://www.youtube.com/embed/${video?.embedCode}`}
                             title={`YouTube Video ${index + 1}`}
                             frameBorder="0"
                             allow="autoplay; encrypted-media"
                             allowFullScreen
                         ></iframe>
                        

                        }
                           
                        </div>
                        <div className="mt-3">
                            <p className="font-semibold">{video?.title}</p>
                        </div>
                        <div className="flex space-x-2 mt-2">
                            {/* <Button
                                text={"Edit"}
                                onClick={() => handleEditVideo(index, video)}
                                className="font-normal text-blue-600 text-sm md:text-base border-blue-600 border rounded-md px-1 hover:scale-105"
                            /> */}
                            <Button 
                                text={"Delete"}
                                onClick={() => handleDeleteVideo(index, video.embedCode)}
                                className="font-normal text-red-600 text-sm md:text-base border-red-600 border rounded-md px-1 hover:scale-105"
                            />
                        </div>
                    </div>
                ))}


            </div>

        </div>

    </div>
)
}

export default AdminTutorial;