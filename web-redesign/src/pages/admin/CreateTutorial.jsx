import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTutorialVideo } from '@/Redux/Actions/admin';
import { useToast } from '@/components/ToastContext/ToastContext';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';
const CreateTutorial = () => {
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [video, setVideo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoType: 'upload',
        videoUrl: '',
        embedCode: '',
    });

    const handleEditorChange = (content, editor) => {
        setFormData({ ...formData, description: content });
    };


    const uploadToCloudinary = async (selectedVideo) => {
        if (!selectedVideo) {
            showToast('Please select a video to upload.', 'error');
            return null;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedVideo);
            formData.append('upload_preset', 't5divivb');
            const response = await axios.post('https://api.cloudinary.com/v1_1/dfkhac2oo/video/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response?.data?.secure_url;
        } catch (error) {
            console.error('Error uploading video to Cloudinary', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.description || !formData.title || !formData.videoType) {
            showToast('1Please fill in all required fields', 'error');
            return;
        }

        if (formData.videoType === 'upload') {
            const cloudinaryVideoUrl = await uploadToCloudinary(video);
            if (cloudinaryVideoUrl) {
                setFormData({ ...formData, videoUrl: cloudinaryVideoUrl });
                dispatch(addTutorialVideo({ formData, showToast,navigate }));
            }
        } else {
            if (!formData.embedCode) {
                showToast('2Please fill in all required fields', 'error');
                return;
            }
            dispatch(addTutorialVideo({ formData, showToast ,navigate}));
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="bg-white shadow-md rounded-md p-6 w-full">
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
                  fill="black"
                />
              </svg>
            }
            className="pt-5 pb-10 pl-5"
            onClick={() => navigate(-1)}
          />
                <h1 className="text-2xl font-bold mb-6">Create tutorial</h1>
                <form onSubmit={handleSubmit} className="px-4 space-y-4">

                    <div className="space-y-2 w-1/3">
                        <label htmlFor="videoType" className="block text-gray-700 font-semibold">
                            Video Type
                        </label>
                        <select
                            id="videoType"
                            name="videoType"
                            value={formData.videoType}
                            onChange={(e) => setFormData({ ...formData, videoType: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="upload">Upload tutorial video</option>
                            <option value="youtube">Add YouTube video embed code</option>
                        </select>

                    </div>
                    <div className="space-y-2 w-2/3">

                        <label htmlFor="videoTitle" className="block text-gray-700 font-semibold">
                            Video Title <span className='text-red-500 font-semibold text-2xl'>*</span>
                        </label>
                        <input
                            type="text"
                            id="videoTitle"
                            name="videoTitle"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Enter video title"
                        />
                    </div>
                    {formData.videoType === 'upload' && (
                        <div className="space-y-2">
                            <label htmlFor="uploadVideo" className="block text-gray-700 font-semibold">
                                Upload Video
                            </label>
                            <input
                                type="file"
                                id="uploadVideo"
                                accept="video/*"
                                onChange={(e) => setVideo(e.target.files[0])}
                            />
                        </div>
                    )}

                    {formData.videoType === 'youtube' && (
                        <div className="space-y-2">
                            <label htmlFor="embedCode" className="block text-gray-700 font-semibold">
                                YouTube Video ID
                            </label>
                            <input
                                type="text"
                                id="embedCode"
                                name="embedCode"
                                value={formData.embedCode}
                                onChange={(e) => setFormData({ ...formData, embedCode: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter YouTube video ID"
                                pattern="^[^/]+$"
                                required
                            />


                        </div>)
                    }

                    <div className="space-y-2">
                        <label htmlFor="editor" className="block text-gray-700 font-semibold">
                            Tutorial Description
                        </label>
                        <Editor
                            id="editor"
                            apiKey="lr8zrmdh2m3ruite4bk9zmtophmutlmxgrtgeotseocwgh3k"
                            init={{
                                directionality: 'ltr',
                                plugins: 'lists link paste help wordcount emoticons',
                                toolbar:
                                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link  table mergetags | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | emoticons charmap | help | forecolor backcolor',
                            }}
                            onEditorChange={handleEditorChange}
                        />
                    </div>

                    {formData.embedCode.includes('/') && (
                        <p className="text-red-500">Please enter a valid YouTube video ID without "/"</p>
                    )}
                  <div className='py-10 px-10'>
                  <Button text={`Create Tutorial`} type={'submit'} className={`bg-darkGreen  text-white font-semibold rounded-md px-7 py-2 w-fit`} />

                  </div>

                </form>
            </div>
        </div>
    );
};

export default CreateTutorial;
