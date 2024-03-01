import React, { useEffect } from "react";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ToastContext/ToastContext";
import { getReferData } from "@/Redux/Actions/user";
const ReferAndEarn = () => {
  const dispatch = useDispatch();
  const referData = useSelector((state) => state.user.referData);
  const {showToast} = useToast()
  useEffect(() => {
    dispatch(getReferData());
  }, []);

  // share
  const url = `${import.meta.env.VITE_APP_CLIENT_URL}/signup?referal=${referData?.referalCode}`;
  const message = `Elevate your US stock investments with KKS Capitals. Your trusted partner for expert advice and smart strategies. Join Now: ${url}`;
  
  const shareData = {
 url
  };

  const handleSharing = async () => {
    if (navigator.share) {
      try {
        await navigator
          .share(shareData)
         
      } catch (error) {
console.log(error);      }
    } else {
      showToast('Web share is currently not supported on this browser.','error')      
    }
  };

  // Share

  const copyTOClipboard = () => {
    navigator.clipboard.writeText(referData?.referalCode);
    showToast("Referal Code copied to clipboard","success")
  };

  const userdata = JSON.parse(localStorage.getItem("status"));
  let status;
  if (userdata) {
    status = userdata.status;
  }

  return (
    <div className="flex">
      <div className='lg:w-7/12'>
      <>
      <div className={`flex`}>
        <div className="flex flex-col items-center lg:items-start  p-5 md:p-8">
          <div className="my-5">
            <h3 className="text-3xl font-main font-medium text-darkGreen ">Refer and Earn</h3>
          </div>
          <div className="bg-gray-200 rounded-xl mt-4 px-6 py-2 lg:order-4 flex items-center justify-between gap-2  w-full lg:w-[80%]">
            <div className="flex items-center gap-4">
            <h5 className="font-main font-semibold text-darkGreen text-lg my-2">
              Referred Users
            </h5>
            <svg width="33" height="22" viewBox="0 0 33 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="user group">
<path id="Vector" d="M25.3627 20.9987V18.7765C25.3627 17.5977 24.8961 16.4673 24.0656 15.6338C23.2351 14.8003 22.1087 14.332 20.9342 14.332H12.077C10.9025 14.332 9.77605 14.8003 8.94554 15.6338C8.11502 16.4673 7.64844 17.5977 7.64844 18.7765V20.9987" stroke="#096A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Vector_2" d="M16.4989 9.88885C18.9447 9.88885 20.9275 7.89901 20.9275 5.44443C20.9275 2.98984 18.9447 1 16.4989 1C14.0531 1 12.0703 2.98984 12.0703 5.44443C12.0703 7.89901 14.0531 9.88885 16.4989 9.88885Z" stroke="#096A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Vector_3" d="M32.0011 20.9988V18.7765C32.0004 17.7918 31.6738 16.8352 31.0726 16.0569C30.4715 15.2786 29.6298 14.7227 28.6797 14.4766" stroke="#096A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Vector_4" d="M0.998884 20.9988V18.7765C0.999616 17.7918 1.3262 16.8352 1.92737 16.0569C2.52854 15.2786 3.37024 14.7227 4.32031 14.4766" stroke="#096A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Vector_5" d="M24.25 1.14453C25.2026 1.38931 26.0469 1.94531 26.6499 2.72487C27.2528 3.50443 27.5801 4.46322 27.5801 5.45007C27.5801 6.43692 27.2528 7.3957 26.6499 8.17527C26.0469 8.95483 25.2026 9.51083 24.25 9.75561" stroke="#096A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Vector_6" d="M8.75 1.14453C7.7974 1.38931 6.95307 1.94531 6.35011 2.72487C5.74716 3.50443 5.41989 4.46322 5.41989 5.45007C5.41989 6.43692 5.74716 7.3957 6.35011 8.17527C6.95307 8.95483 7.7974 9.51083 8.75 9.75561" stroke="#096A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
</svg>
            </div>
           
            <div className="flex gap-5 text-darkGreen font-semibold bg-slate-300 rounded-md text-lg px-2 py-1">
           
              <span>{referData?.referedUsers?.length} +</span>
            </div>
          
          </div>

         

         {status==="active"? <div className="lg:order-3  my-5">
         <h1 className="text-darkGreen font-semibold pb-4"> Your refer code</h1>
         <div className="flex justify-center lg:justify-start">
         <Button
              text={referData?.referalCode}
              logo={
                <svg
                  width="14"
                  height="18"
                  viewBox="0 0 14 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 0C3.90326 0 3.33097 0.237053 2.90901 0.65901C2.48705 1.08097 2.25 1.65326 2.25 2.25V13.5C2.25 14.0967 2.48705 14.669 2.90901 15.091C3.33097 15.5129 3.90326 15.75 4.5 15.75H11.25C11.8467 15.75 12.419 15.5129 12.841 15.091C13.2629 14.669 13.5 14.0967 13.5 13.5V2.25C13.5 1.65326 13.2629 1.08097 12.841 0.65901C12.419 0.237053 11.8467 0 11.25 0H4.5ZM3.375 2.25C3.375 1.95163 3.49353 1.66548 3.70451 1.4545C3.91548 1.24353 4.20163 1.125 4.5 1.125H11.25C11.5484 1.125 11.8345 1.24353 12.0455 1.4545C12.2565 1.66548 12.375 1.95163 12.375 2.25V13.5C12.375 13.7984 12.2565 14.0845 12.0455 14.2955C11.8345 14.5065 11.5484 14.625 11.25 14.625H4.5C4.20163 14.625 3.91548 14.5065 3.70451 14.2955C3.49353 14.0845 3.375 13.7984 3.375 13.5V2.25ZM0 4.5C1.00332e-05 4.10505 0.103979 3.71706 0.301457 3.37503C0.498935 3.033 0.782965 2.74897 1.125 2.5515V14.0625C1.125 14.8084 1.42132 15.5238 1.94876 16.0512C2.47621 16.5787 3.19158 16.875 3.9375 16.875H10.9485C10.751 17.217 10.467 17.5011 10.125 17.6985C9.78294 17.896 9.39495 18 9 18H3.9375C2.89321 18 1.89169 17.5852 1.15327 16.8467C0.414843 16.1083 0 15.1068 0 14.0625V4.5Z"
                    fill="#096A56"
                  />
                </svg>
              }
              className="bg-darkGreen w-fit flex px-4 py-2 text-white gap-2 rounded-lg cursor-pointer"
              onClick={() => {
                copyTOClipboard();
              }}
            />
            <Button
              className="px-4 py-2 cursor-pointer"
              icon={
                <svg
                  width="24"
                  height="26"
                  viewBox="0 0 24 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.38126 16.2433C5.47415 16.24 6.52569 15.8251 7.32635 15.0812L15.1483 19.5507C14.8862 20.5748 15.0017 21.659 15.4737 22.6049C15.9457 23.5508 16.7426 24.2951 17.7185 24.7014C18.6943 25.1078 19.7839 25.1491 20.7878 24.8178C21.7916 24.4865 22.6425 23.8047 23.1848 22.8972C23.727 21.9898 23.9243 20.9174 23.7405 19.8764C23.5567 18.8354 23.0041 17.8954 22.1839 17.2285C21.3637 16.5616 20.3308 16.2125 19.2742 16.2449C18.2176 16.2774 17.208 16.6893 16.4303 17.4053L8.60834 12.9358C8.69081 12.6234 8.73579 12.2998 8.74329 11.9762L16.4278 7.58417C17.1677 8.25737 18.1166 8.65563 19.1154 8.71212C20.1141 8.76861 21.1019 8.47991 21.9131 7.89444C22.7242 7.30897 23.3093 6.46236 23.5702 5.49664C23.8311 4.53092 23.752 3.50484 23.3461 2.59055C22.9402 1.67626 22.2322 0.929376 21.3409 0.475208C20.4496 0.0210404 19.4292 -0.112783 18.4509 0.0961895C17.4726 0.305162 16.596 0.844215 15.968 1.62292C15.3401 2.40162 14.999 3.37259 15.0021 4.37293C15.0071 4.73279 15.0558 5.0914 15.1483 5.43876L8.04606 9.49592C7.6342 8.85874 7.06365 8.33968 6.39049 7.98973C5.71732 7.63977 4.96469 7.47096 4.20655 7.49989C3.4484 7.52881 2.71082 7.75448 2.06628 8.15471C1.42173 8.55494 0.892395 9.11597 0.530277 9.78267C0.168159 10.4494 -0.0142844 11.1988 0.000873024 11.9574C0.0160304 12.7159 0.228267 13.4575 0.61673 14.1092C1.00519 14.7609 1.55652 15.3003 2.21654 15.6745C2.87655 16.0486 3.62256 16.2446 4.38126 16.2433V16.2433Z"
                    fill="#096A56"
                  />
                </svg>
              }
              onClick={() => {
                handleSharing();
              }}
            />
         </div>
           
          
          </div>: <div className="lg:order-3 flex justify-center lg:justify-start text-base font-medium md:text-lg my-5 text-red-500">
            <h5 >You don't have any subscription. Please Subscribe to participate in our refer and earn program.</h5>
            </div>}
          <div className="lg:order-2 text-xl font-main font-normal text-black ">
            <p>
              Refer 10 friends to the premium plan and get a chance to become a
              part of our Davos Conference Switzerland, where leaders from Best
              Global Business, Government, International organizations and
              Academia come together.
            </p>

            <p className="my-4">
              Every time you invite a friend to the premium plan, you will get a
              1-month subscription extension.
            </p>
          </div>
        </div>
      
      </div>

    
    </>
      </div>
      <div className='hidden lg:w-5/12 lg:block'>
<img src="/assets/referandearn.png" alt="Refer and earn" />
      </div>

    </div>
  )
}

export default ReferAndEarn