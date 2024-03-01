import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SelectMenu } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import { useToast } from "@/components/ToastContext/ToastContext";
import {getPlanDetails,getProfile,updateProfile} from '../../Redux/Actions/user'
import ChangePasswordPopup from "@/components/Popups/ChangePasswordPopup";
// import PushNotificationToggleButton from "@/components/PushNotificationToggleButton";
const AccountSettings = () => {

  const dispatch = useDispatch();

  const { showToast } = useToast();
  const ageOptionsData = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "Prefer Not to Say ", label: "Prefer Not To Say" },
  ];
  const ageRangeData = [
    { id: 1, value: "18-24", label: "18-24" },
    { id: 2, value: "25-30", label: "25-30" },
    { id: 3, value: "31-36", label: "31-35" },
    { id: 4, value: "36 & above", label: "36 & above" },
  ];

  const workingData = [
    { value: "no", label: "No" },
    { value: "yes", label: "Yes" },
  ];

  const workingSectorData = [
    { value: "finance", label: "Finance" },
    { value: "agricultural", label: "Agriculture" },
    { value: "It Services", label: "IT Services" },
    { value: "textileIndustry", label: "Textile Industry" },
    { value: "automobile", label: "Automobiles" },
    { value: "Public adminstration", label: "Public administration" },
    { value: "Defense", label: "Defense " },
    { value: "electronics", label: "Electronics" },
    { value: "chemicalIndustry", label: "Chemical Industry" },
    { value: "Oil&Gas", label: "Oil & Gas" },
    { value: "Architect", label: "Architech" },
    { value: "Engineering", label: "Engineering " },
    { value: "Civil Engineering", label: "Civil Engineering" },
    {
      value: "Infrastructure Development",
      label: "Infrastructure Development",
    },
    { value: "Hospitality", label: "Hospitality" },
    { value: "Health Care", label: "Health Care" },
    { value: "Eduction", label: "Education" },
    { value: "MSME", label: "MSME" },

    { value: "Law Enforcement", label: "Law Enforcement " },
    { value: "Other", label: "Other" },
  ];
  const [profileEdit,setProfileEdit] = useState(false)
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    mob: "",
    gender: "",
    ageRange: "",
    working: "",
    workingSector: "",
    investmentPlan: "",
    profilePic: "",
    investedAmount: "",
    installment: "",
  });
  const {
    username,
    email,
    mob,
    gender,
    ageRange,
    working,
    workingSector,

  } = profileData;
  const setGender = (data) => {
    setProfileData((prevState) => ({
      ...prevState,
      gender: data,
    }));
    setProfileEdit(true)
    setError(null)

  };
  const setAgeRange = (data) => {
    setProfileData((prevState) => ({
      ...prevState,
      ageRange: data,
    }));
    setProfileEdit(true)
    setError(null)

  };
  const setWorking = (data) => {
    setProfileData((prevState) => ({
      ...prevState,
      working: data,
    }));
    setProfileEdit(true)
    setError(null)

  };
  const setWorkingSector = (data) => {
    setProfileData((prevState) => ({
      ...prevState,
      workingSector: data,
    }));
    setProfileEdit(true)
    setError(null)

  };


  const handleChange = (e) => {
    setProfileData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setProfileEdit(true)
    setError(null)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profileData.gender || !profileData.ageRange || !profileData.working ) {
      setError("Please enter all fields");
    } else if (working === "yes" && !workingSector) {
      setError("Please enter your Working Sector");
    } else {
    dispatch(updateProfile( {userData: profileData,showToast} ));
    setProfileEdit(false)
  }
  };
  const updatedData = useSelector((state) =>
    state?.user?.userSettingsData ? state.user.userSettingsData : ""
  );
  useEffect(() => {
    setProfileData(prevProfileData => ({
      ...prevProfileData,
      ...updatedData
    }));
    setProfileEdit(false)
  }, [updatedData]);

  useEffect(() => {
    dispatch(getProfile({showToast}));
  }, [dispatch]);

  const currentPlanDetails = useSelector(
    (state) => state?.user?.currentPlanDetails
  );
  
  // ####### loading functionality ######

  // const loading = useSelector((state) => state?.user?.loading);

  // useEffect(() => {
  //   setLoadingStatus(loading);
  // }, [loading]);
 
  const user= JSON.parse(localStorage.getItem("user"));

  return (
    <div className='flex flex-col p-4 md:p-10 w-full'>
     {/* {Notification.permission === 'denied' && (
      <p className="-mt-5 bg-yellow-100 px-5 w-fit rounded-md font-medium z-20">
        Browser notifications are disabled. Please enable them  in your browser settings.
      </p>
    )}
      <div className="flex -mb-6 mx-5 md:-mb-12 justify-end">
      <PushNotificationToggleButton />

      </div> */}
      <div>
        <h5 className="text-xl font-semibold my-8 text-darkGreen">Profile</h5>
        {error && (
                    <p className="text-sm text-red-500 -mt-3 mb-5 ">
                      <span className="mr-1">*</span>
                      {error}
                    </p>
                  )}
      </div>
      <img src="/assets/user.svg" alt="User" className='w-14 md:w-32' />
      <div className='md:grid grid-cols-3 w-full justify-evenly gap-x-4 lg:gap-x-14 '>
        <div className="mb-6">
          <label
            className=" mt-6 font-main  block text-base font-medium  text-gray-900"
            htmlFor=""
          >
            Name
          </label>
          <input
            required
            type="text"
            value={username}
            name="username"
            id="username"
            className="ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-darkGreen bg-gray-200  flex items-center pr-4 border w-full rounded-md shadow-sm mt-2 pl-5 font-medium h-9"
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            className=" mt-6 font-main  block text-base font-medium  text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            name="email"
            id="email"
            disabled
            className="ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-darkGreen  bg-gray-200 flex items-center pr-4 border w-full rounded-md shadow-sm mt-2 pl-5 font-medium h-9"
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            className=" mt-6 font-main  block text-base font-medium  text-gray-900"
            htmlFor="mob"
          >
            Mobile Number
          </label>
          <input
            required
            type="text"
            value={mob}
            name="mob"
            id="mob"
            className="ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-darkGreen bg-gray-200  flex items-center pr-4 border w-full rounded-md shadow-sm mt-2 pl-5 font-medium h-9"
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <SelectMenu
            Label="Gender"
            items={ageOptionsData}
            selectedvalue={gender}
            setdata={setGender}
          />
        </div>

        <div className="mb-6">
          <SelectMenu
            Label="Age Range"
            items={ageRangeData}
            selectedvalue={ageRange}
            setdata={setAgeRange}
          />
        </div>
        <div className="mb-6">
          <SelectMenu
            Label="Currently Working"
            items={workingData}
            selectedvalue={working}
            setdata={setWorking}
          />


        </div>
        <div className="mb-6">
          {working === "yes" && (
            <SelectMenu
              Label="Working Sector"
              items={workingSectorData}
              setdata={setWorkingSector}
              selectedvalue={workingSector}
            />
          )}
        </div>

      </div>
      <div className="flex justify-center space-y-10 lg:space-y-0 space-x-6">
           
            { profileEdit && <Button
                text="Save Changes"
                className="py-2 px-4 bg-darkGreen text-white rounded-2xl hover:scale-110"
                onClick={handleSubmit}
              />}
             
              <Button onClick={()=> setChangePassword(true)} text={'Change Password'} className={`py-2 px-4 bg-darkGreen text-white rounded-2xl hover:scale-110`} />
               
          
          </div>
        { user?.role===0 && <div>

        
      <div>
        <h5 className="text-xl font-semibold my-8 text-darkGreen">Subscription details</h5>

      </div>
<div className="flex flex-col md:flex-row  justify-between md:bg-gray-100 rounded-md mb-8">
  <div className="flex md:flex-col items-center gap-5 w-full md:justify-center my-5 ">
    <h6 className="flex gap-4 text-center rounded-md py-2 justify-center bg-gray-100 font-semibold w-[55%] md:w-auto"><span><svg xmlns="http://www.w3.org/2000/svg" width="34" height="30" viewBox="0 0 34 30" fill="none">
  <path d="M0.567838 12.4821C0.476378 12.4767 0.385013 12.4941 0.301941 12.5328C0.218868 12.5715 0.146687 12.6302 0.0918744 12.7037C-0.146108 13.0527 0.127848 13.4017 0.351994 13.6566C0.991225 14.3879 2.81483 16.8006 3.15797 17.2078C3.20977 17.2735 3.27577 17.3266 3.35102 17.3631C3.42627 17.3996 3.5088 17.4186 3.59242 17.4186C3.67604 17.4186 3.75858 17.3996 3.83383 17.3631C3.90907 17.3266 3.97508 17.2735 4.02688 17.2078C4.36448 16.8172 6.14658 14.5181 6.83009 13.7785C7.06807 13.5014 7.42227 13.1413 7.17045 12.7591C7.11625 12.6857 7.0452 12.6266 6.96332 12.5866C6.88143 12.5465 6.79112 12.5268 6.70003 12.5292L4.98157 12.5153C5.51425 9.93513 6.85878 7.59368 8.81801 5.83433C10.7772 4.07498 13.248 2.9903 15.8681 2.73937C18.4882 2.48844 21.1196 3.08445 23.3766 4.44C25.6335 5.79555 27.3972 7.83932 28.409 10.2716L30.8469 9.25775C29.6092 6.25195 27.4268 3.73166 24.6303 2.07841C21.8337 0.425158 18.5752 -0.271026 15.348 0.0952507C12.1208 0.461528 9.10073 1.87032 6.74492 4.10836C4.38911 6.34639 2.82586 9.29181 2.29182 12.4987L0.567838 12.4821ZM15.5884 8.66773V7.22454H18.0125V8.63726C19.1219 8.69725 20.2243 8.85013 21.3082 9.09432V11.6843C20.7271 11.64 20.0731 11.604 19.3463 11.5763C18.6194 11.5486 17.959 11.5347 17.3649 11.5347C17.0473 11.5321 16.7299 11.5543 16.4158 11.6012C15.1429 11.8062 15.129 13.4793 16.7755 13.4793H18.0152C18.7778 13.4532 19.5359 13.6059 20.229 13.9253C20.7801 14.1882 21.2413 14.6084 21.5545 15.133C21.8588 15.6604 22.0138 16.2609 22.0028 16.8698V17.4238C22.0028 18.4838 21.7934 19.2945 21.3747 19.8559C20.9334 20.4323 20.3017 20.8329 19.5926 20.9861C19.079 21.1341 18.5512 21.227 18.018 21.2631V22.8282H15.5884V21.252C14.4757 21.2035 13.3703 21.0486 12.2871 20.7894V18.205C13.7233 18.3185 15.1899 18.3573 16.6289 18.3573C16.9786 18.3638 17.3281 18.335 17.6721 18.2715C18.9561 18.0138 18.7486 16.5623 17.5199 16.5623H16.5154C15.0488 16.5623 13.9363 16.277 13.1781 15.7064C12.4199 15.1358 12.0408 14.1792 12.0408 12.8366V12.2826C12.0408 11.0527 12.4577 10.1294 13.2916 9.51259C13.9615 9.01663 14.7576 8.71995 15.5884 8.65665V8.66773ZM31.8044 17.2798C31.302 20.6031 29.6961 23.6603 27.2456 25.9582C24.7951 28.2561 21.6429 29.6609 18.2972 29.9461C14.9515 30.2312 11.6074 29.3801 8.80409 27.5299C6.00078 25.6797 3.90168 22.9384 2.84527 19.7479L5.33578 18.9169C6.20029 21.5003 7.89533 23.7244 10.1561 25.2416C12.4168 26.7588 15.1159 27.4837 17.8318 27.303C20.5476 27.1223 23.1271 26.0462 25.1674 24.2429C27.2076 22.4395 28.5937 20.0105 29.1091 17.3352L27.3104 17.374C27.221 17.3789 27.1318 17.3621 27.0503 17.3249C26.9689 17.2878 26.8976 17.2314 26.8427 17.1607C26.566 16.7867 26.923 16.4017 27.1526 16.133C27.814 15.3712 29.5269 13.0195 29.8507 12.6178C29.9011 12.5513 29.9659 12.4972 30.0401 12.4593C30.1144 12.4214 30.1963 12.4008 30.2796 12.399C30.3635 12.3971 30.4466 12.4143 30.5229 12.4494C30.5991 12.4844 30.6664 12.5363 30.7196 12.6012C31.0766 12.9973 32.9721 15.3546 33.6335 16.0665C33.8632 16.313 34.1482 16.6537 33.9102 17.0083C33.8578 17.0841 33.7873 17.1455 33.7052 17.1871C33.623 17.2287 33.5318 17.2491 33.4398 17.2465L31.7933 17.2798H31.8044Z" fill="#353F4E"/>
</svg></span> Plan</h6>
<p>{currentPlanDetails?.pln}</p>
  </div>
  <div className="flex md:flex-col items-center gap-5 w-full md:justify-center my-5 border-black md:border-x-2">
  <h6 className="flex gap-4 text-center rounded-md py-2 justify-center bg-gray-100 font-semibold w-[55%] md:w-auto"><span><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M19.9243 1.15469C19.9243 0.517536 20.5542 0 21.333 0C22.1118 0 22.7417 0.517536 22.7417 1.15469V6.21287C22.7417 6.85003 22.1118 7.36756 21.333 7.36756C20.5542 7.36756 19.9243 6.85003 19.9243 6.21287V1.15469ZM16.1401 25.3422C16.0571 25.3422 15.9912 24.9931 15.9912 24.561C15.9912 24.1289 16.0571 23.7798 16.1401 23.7798H19.9951C20.0781 23.7798 20.144 24.1289 20.144 24.561C20.144 24.9931 20.0781 25.3422 19.9951 25.3422H16.1401ZM3.86963 16.3781C3.78662 16.3781 3.7207 16.029 3.7207 15.5969C3.7207 15.1648 3.78662 14.8157 3.86963 14.8157H7.72461C7.80762 14.8157 7.87354 15.1648 7.87354 15.5969C7.87354 16.029 7.80762 16.3781 7.72461 16.3781H3.86963ZM10.0049 16.3781C9.92188 16.3781 9.85596 16.029 9.85596 15.5969C9.85596 15.1648 9.92188 14.8157 10.0049 14.8157H13.8599C13.9429 14.8157 14.0088 15.1648 14.0088 15.5969C14.0088 16.029 13.9429 16.3781 13.8599 16.3781H10.0049ZM16.1401 16.3781C16.0571 16.3781 15.9912 16.029 15.9912 15.5969C15.9912 15.1648 16.0571 14.8157 16.1401 14.8157H19.9951C20.0781 14.8157 20.144 15.1648 20.144 15.5969C20.144 16.029 20.0781 16.3781 19.9951 16.3781H16.1401ZM22.2778 16.3781C22.1948 16.3781 22.1289 16.029 22.1289 15.5969C22.1289 15.1648 22.1948 14.8157 22.2778 14.8157H26.1328C26.2158 14.8157 26.2817 15.1648 26.2817 15.5969C26.2817 16.029 26.2158 16.3781 26.1328 16.3781H22.2778ZM3.86963 20.8601C3.78662 20.8601 3.7207 20.511 3.7207 20.0789C3.7207 19.6468 3.78662 19.2977 3.86963 19.2977H7.72461C7.80762 19.2977 7.87354 19.6468 7.87354 20.0789C7.87354 20.511 7.80762 20.8601 7.72461 20.8601H3.86963ZM10.0049 20.8601C9.92188 20.8601 9.85596 20.511 9.85596 20.0789C9.85596 19.6468 9.92188 19.2977 10.0049 19.2977H13.8599C13.9429 19.2977 14.0088 19.6468 14.0088 20.0789C14.0088 20.511 13.9429 20.8601 13.8599 20.8601H10.0049ZM16.1401 20.8601C16.0571 20.8601 15.9912 20.511 15.9912 20.0789C15.9912 19.6468 16.0571 19.2977 16.1401 19.2977H19.9951C20.0781 19.2977 20.144 19.6468 20.144 20.0789C20.144 20.511 20.0781 20.8601 19.9951 20.8601H16.1401ZM22.2778 20.8601C22.1948 20.8601 22.1289 20.511 22.1289 20.0789C22.1289 19.6468 22.1948 19.2977 22.2778 19.2977H26.1328C26.2158 19.2977 26.2817 19.6468 26.2817 20.0789C26.2817 20.511 26.2158 20.8601 26.1328 20.8601H22.2778ZM3.86963 25.3422C3.78662 25.3422 3.7207 24.9931 3.7207 24.561C3.7207 24.1289 3.78662 23.7798 3.86963 23.7798H7.72461C7.80762 23.7798 7.87354 24.1289 7.87354 24.561C7.87354 24.9931 7.80762 25.3422 7.72461 25.3422H3.86963ZM10.0049 25.3422C9.92188 25.3422 9.85596 24.9931 9.85596 24.561C9.85596 24.1289 9.92188 23.7798 10.0049 23.7798H13.8599C13.9429 23.7798 14.0088 24.1289 14.0088 24.561C14.0088 24.9931 13.9429 25.3422 13.8599 25.3422H10.0049ZM7.229 1.15469C7.229 0.517536 7.85889 0 8.6377 0C9.4165 0 10.0464 0.517536 10.0464 1.15469V6.21287C10.0464 6.85003 9.4165 7.36756 8.6377 7.36756C7.85889 7.36756 7.229 6.85003 7.229 6.21287V1.15469ZM1.5625 11.0636H28.4351V5.24127C28.4351 5.04598 28.3545 4.86777 28.2251 4.73594C28.0957 4.60656 27.9175 4.526 27.7197 4.526H25.1465C24.7144 4.526 24.3652 4.17691 24.3652 3.74481C24.3652 3.31272 24.7144 2.96363 25.1465 2.96363H27.7222C28.3496 2.96363 28.9185 3.21995 29.3311 3.63252C29.7437 4.04508 30 4.61388 30 5.24127V11.8472V27.7224C30 28.3497 29.7437 28.9185 29.3311 29.3311C28.9185 29.7437 28.3496 30 27.7222 30H2.27783C1.65039 30 1.08154 29.7437 0.668945 29.3311C0.256348 28.9161 0 28.3473 0 27.7199V11.8447V5.24127C0 4.61388 0.256348 4.04508 0.668945 3.63252C1.08154 3.21995 1.65039 2.96363 2.27783 2.96363H5.0293C5.46143 2.96363 5.81055 3.31272 5.81055 3.74481C5.81055 4.17691 5.46143 4.526 5.0293 4.526H2.27783C2.08252 4.526 1.9043 4.60656 1.77246 4.73594C1.64307 4.86533 1.5625 5.04353 1.5625 5.24127V11.0636ZM28.4375 12.6284H1.5625V27.7199C1.5625 27.9152 1.64307 28.0934 1.77246 28.2252C1.90186 28.3546 2.08008 28.4352 2.27783 28.4352H27.7222C27.9175 28.4352 28.0957 28.3546 28.2275 28.2252C28.3569 28.0959 28.4375 27.9177 28.4375 27.7199V12.6284ZM12.312 4.526C11.8799 4.526 11.5308 4.17691 11.5308 3.74481C11.5308 3.31272 11.8799 2.96363 12.312 2.96363H17.5586C17.9907 2.96363 18.3398 3.31272 18.3398 3.74481C18.3398 4.17691 17.9907 4.526 17.5586 4.526H12.312Z" fill="#353F4E"/>
</svg></span> Purchased on:</h6>
<p>{currentPlanDetails?.start_Date}</p>
{!currentPlanDetails &&  <p>No Active Subscription</p>}

  </div>
  <div className="md:flex-col flex items-center gap-5 w-full md:justify-center my-5">
  <h6 className="flex gap-4 text-center rounded-md py-2 justify-center bg-gray-100 font-semibold w-[55%] md:w-auto"><span><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
<path d="M17.4306 1.01199C17.4306 0.454773 17.9811 0 18.6667 0C19.3523 0 19.9028 0.452274 19.9028 1.01199V5.43978C19.9028 5.997 19.3523 6.45177 18.6667 6.45177C17.9811 6.45177 17.4306 5.9995 17.4306 5.43978V1.01199ZM22.8629 14.2504C23.9289 14.2504 24.9473 14.4628 25.8781 14.8476C26.8465 15.2474 27.7148 15.8321 28.4404 16.5567C29.1661 17.2814 29.7516 18.1509 30.152 19.1129C30.5373 20.0425 30.75 21.0595 30.75 22.1239C30.75 23.1884 30.5373 24.2054 30.152 25.1349C29.7516 26.1019 29.1661 26.969 28.4404 27.6937C27.7148 28.4183 26.844 29.003 25.8806 29.4028C24.9498 29.7876 23.9314 30 22.8654 30C21.7995 30 20.7811 29.7876 19.8503 29.4028C18.8819 29.003 18.0136 28.4183 17.288 27.6937C16.5623 26.969 15.9768 26.0994 15.5764 25.1349C15.1911 24.2054 14.9784 23.1884 14.9784 22.1239C14.9784 21.0595 15.1911 20.0425 15.5764 19.1129C15.9768 18.1459 16.5623 17.2789 17.288 16.5542C18.0136 15.8296 18.8844 15.2449 19.8477 14.8451C20.7786 14.4628 21.7945 14.2504 22.8629 14.2504ZM22.2724 18.8331C22.2724 18.6432 22.35 18.4708 22.4751 18.3458C22.6002 18.2209 22.7729 18.1434 22.9655 18.1434C23.1582 18.1434 23.3309 18.2209 23.456 18.3458C23.5811 18.4708 23.6587 18.6432 23.6587 18.8356V22.5187L26.4161 24.1529L26.4386 24.1679C26.5913 24.2654 26.6914 24.4128 26.7314 24.5752C26.7739 24.7451 26.7539 24.93 26.6613 25.09L26.6563 25.0975C26.6513 25.1074 26.6463 25.1149 26.6388 25.1224C26.5412 25.2724 26.3936 25.3723 26.2335 25.4123C26.0633 25.4548 25.8781 25.4348 25.718 25.3423L22.6352 23.5207C22.5276 23.4633 22.4376 23.3758 22.3725 23.2734C22.3075 23.1684 22.2699 23.046 22.2699 22.916L22.2724 18.8331ZM27.4621 17.5312C26.8615 16.9315 26.1459 16.4493 25.3527 16.1219C24.587 15.8046 23.7462 15.6322 22.8629 15.6322C21.9797 15.6322 21.1389 15.8071 20.3732 16.1219C19.58 16.4493 18.8644 16.9315 18.2638 17.5312C17.6633 18.1309 17.1804 18.8456 16.8526 19.6377C16.5348 20.4023 16.3621 21.2419 16.3621 22.1239C16.3621 23.006 16.5373 23.8456 16.8526 24.6102C17.1804 25.4023 17.6633 26.1169 18.2638 26.7166C18.8644 27.3163 19.58 27.7986 20.3732 28.1259C21.1389 28.4433 21.9797 28.6157 22.8629 28.6157C23.7462 28.6157 24.587 28.4408 25.3527 28.1259C26.1459 27.7986 26.8615 27.3163 27.4621 26.7166C28.6406 25.5397 29.3663 23.918 29.3663 22.1239C29.3663 21.2419 29.1911 20.4023 28.8758 19.6377C28.5455 18.8456 28.0626 18.1309 27.4621 17.5312ZM3.36551 14.3328C3.29545 14.3328 3.23289 14.0255 3.23289 13.6482C3.23289 13.2709 3.28794 12.966 3.36551 12.966H6.73853C6.80859 12.966 6.87114 13.2734 6.87114 13.6482C6.87114 14.0255 6.8161 14.3328 6.73853 14.3328H3.36551ZM8.74282 14.3328C8.67276 14.3328 8.6102 14.0255 8.6102 13.6482C8.6102 13.2709 8.66525 12.966 8.74282 12.966H12.1158C12.1859 12.966 12.2485 13.2734 12.2485 13.6482C12.2485 14.0255 12.1934 14.3328 12.1158 14.3328H8.74282ZM14.1201 14.3328C14.0501 14.3328 13.9875 14.0255 13.9875 13.6482C13.9875 13.2709 14.0426 12.966 14.1201 12.966H17.4931C17.5632 12.966 17.6258 13.2709 17.6258 13.6457C17.288 13.8556 16.9627 14.0855 16.6524 14.3328H14.1201ZM3.37302 18.2509C3.30295 18.2509 3.2404 17.9435 3.2404 17.5662C3.2404 17.1889 3.29545 16.8816 3.37302 16.8816H6.74603C6.8161 16.8816 6.87865 17.1889 6.87865 17.5662C6.87865 17.9435 6.8236 18.2509 6.74603 18.2509H3.37302ZM8.75033 18.2509C8.68026 18.2509 8.61771 17.9435 8.61771 17.5662C8.61771 17.1889 8.67276 16.8816 8.75033 16.8816H12.1233C12.1934 16.8816 12.256 17.1889 12.256 17.5662C12.256 17.9435 12.2009 18.2509 12.1233 18.2509H8.75033ZM3.38052 22.1714C3.31046 22.1714 3.2479 21.8641 3.2479 21.4868C3.2479 21.1094 3.30295 20.8021 3.38052 20.8021H6.75354C6.8236 20.8021 6.88616 21.1094 6.88616 21.4868C6.88616 21.8641 6.83111 22.1714 6.75354 22.1714H3.38052ZM8.75783 22.1714C8.68777 22.1714 8.62521 21.8641 8.62521 21.4868C8.62521 21.1094 8.68026 20.8021 8.75783 20.8021H12.1308C12.2009 20.8021 12.2635 21.1094 12.2635 21.4868C12.2635 21.8641 12.2084 22.1714 12.1308 22.1714H8.75783ZM6.32816 1.01199C6.32816 0.454773 6.87865 0 7.56426 0C8.24988 0 8.80037 0.452274 8.80037 1.01199V5.43978C8.80037 5.997 8.24738 6.45177 7.56426 6.45177C6.87865 6.45177 6.32816 5.9995 6.32816 5.43978V1.01199ZM1.36122 9.68016H24.9023V4.58271C24.9023 4.4078 24.8322 4.25537 24.7196 4.14293C24.607 4.03048 24.4469 3.96052 24.2792 3.96052H22.0222C21.6444 3.96052 21.3366 3.65317 21.3366 3.27586C21.3366 2.89855 21.6444 2.5912 22.0222 2.5912H24.2792C24.8322 2.5912 25.3277 2.81359 25.6905 3.17591C26.0533 3.53823 26.276 4.03298 26.276 4.58521V12.6787C25.8256 12.5237 25.3627 12.3988 24.8873 12.3063V11.042H24.9023H1.36122V24.2429C1.36122 24.4178 1.43128 24.5702 1.54388 24.6827C1.65648 24.7951 1.81662 24.8651 1.98427 24.8651H13.1718C13.2994 25.3398 13.4595 25.8021 13.6522 26.2469H1.99679C1.44629 26.2469 0.948348 26.0245 0.585524 25.6622C0.222699 25.3023 0 24.8076 0 24.2554V4.58771C0 4.03798 0.222699 3.54073 0.585524 3.17841C0.948348 2.81609 1.44379 2.5937 1.99679 2.5937H4.40644C4.78428 2.5937 5.09205 2.90105 5.09205 3.27836C5.09205 3.65567 4.78428 3.96302 4.40644 3.96302H1.99679C1.82163 3.96302 1.66899 4.03298 1.55639 4.14543C1.44379 4.25787 1.37373 4.41779 1.37373 4.58521V9.68266H1.36122V9.68016ZM10.7771 3.96052C10.3993 3.96052 10.0915 3.65317 10.0915 3.27586C10.0915 2.89855 10.3993 2.5912 10.7771 2.5912H15.3712C15.7491 2.5912 16.0569 2.89855 16.0569 3.27586C16.0569 3.65317 15.7491 3.96052 15.3712 3.96052H10.7771Z" fill="#353F4E"/>
</svg></span>Valid till</h6>
<p>{currentPlanDetails?.end_Date}</p>

  </div>
</div>
</div>}
<ChangePasswordPopup isOpen={changePassword} setIsOpen={setChangePassword} />
    </div>
  )
}

export default AccountSettings