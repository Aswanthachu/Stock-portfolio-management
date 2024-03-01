import { getSingleTicket ,reAssignTicket} from '@/Redux/Actions/ticket';
import React, { useState , useEffect,useRef } from 'react';
import Button from '@/components/Button';
import { useParams,useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import socket from '@/Redux/Api/socket';
import NotificationInfo from "/assets/NotificationInfo.svg";

import { useToast } from '@/components/ToastContext/ToastContext';
const AdminSingleTicketDetails = () => {
    const {showToast} = useToast()
    const user = JSON.parse(localStorage.getItem("user"));
    const { ticketId } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isReassigning, setReassigning] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [subAdmins,setSubAdmins] = useState()
    const token = useSelector((state) => state.ticket.tokens);
    const progress = useSelector((state) => state.ticket.progress);

    useEffect(() => {
        if(ticketId)
        dispatch(getSingleTicket(ticketId));
      }, [ticketId]);
    const handleReassignClick = () => {
      setReassigning(true);
    };
  
    const handleConfirmReassign = () => {
        const ticketData = {
            assignTo:selectedUser,
            ticketId:token._id
        }
        dispatch(reAssignTicket({ticketData,showToast}))
      setReassigning(false);
    };
  
    const handleCloseReassign = () => {
      setReassigning(false);
    };
   // 
   const scrollRef = useRef(null);
   const [imageHeight, setImageHeight] = useState();

 useEffect(()=>{
    socket.on('getSubadmins',(data)=>{
       setSubAdmins(data)
    })
    return ()=>{
        socket.off('getSubadmins')
    }
 },[])

 useEffect(()=>{
    if(token ){
        socket.emit('getSubadmins',token?.category)
    }
 },[token])
 
   useEffect(() => {
     if (progress === 100) {
       setInterval(() => {
         dispatch(closeNew());
         dispatch(clearProgress());
       }, 1000);
     }
   }, [progress]);
 
   
  
 
   const handleImageLoad = (event) => {
     const { naturalHeight } = event.target;
     setImageHeight(naturalHeight);
   };
 
   const handleImageView = (image) => {
     setViewImage(image);
     setModalOpen(true);
   };
 
   const subadminList = [
    { id: 1, name: 'Subadmin 1' },
    { id: 2, name: 'Subadmin 2' },
    { id: 3, name: 'Subadmin 3' },
    { id: 4, name: 'Subadmin 4' },
    { id: 5, name: 'Subadmin 5' },
  ];

   const handlePdfDownload = async (url) => {
     const cloudinaryUrl = url;
     fetch(cloudinaryUrl)
       .then((response) => response.blob())
       .then((blob) => {
         const url = window.URL.createObjectURL(new Blob([blob]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", `${token.ticketId}.pdf`);
         document.body.appendChild(link);
         link.click();
         link.remove();
       })
       .catch((error) => {
         console.error("Failed to download the PDF:", error);
       });
   };
 
 
 
   useEffect(() => {
     scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
   }, [token, token.ticketId]);
 
  return (
    <div className=" bg-white  shadow-md dark:bg-gray-800">
      <div className="p-4">
        <>
        <div className='flex ju gap-6 '>
        <div
              className="flex   m-1 w-7 h-7 rounded-full border border-gray-500 hover:cursor-pointer items-center justify-center"
              onClick={() => navigate(-1)}
            >
              <Button
                icon={
                  <svg
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
                className="w-4 "
              />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Ticket Details</h2>

            {isReassigning && (
                <div className="fixed inset-0 flex justify-center  bg-black bg-opacity-20 z-50">
                <div className="relative top-20 h-fit  flex flex-col items-center p-5 md:p-8 text-center bg-white rounded-lg shadow dark:bg-gray-800 ">
                <button onClick={handleCloseReassign} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                         <div className="flex gap-6 mt-4">
           
           <select
             onChange={(e) => setSelectedUser(e.target.value)}
             className="bg-gray-100 border border-gray-300 rounded px-2  mb-2"
           >
             <option value="">Select User</option>
             {subAdmins?.map((user,index) => (
               <option key={index} value={user._id}>
                 {user?.username}
               </option>
             ))}
           </select>
           <div className="flex text-sm justify-between">
             <button
               onClick={handleConfirmReassign}
               className="bg-green-300 text-white px-4  rounded-md hover:bg-green-500 focus:outline-none mr-4"
             >
               Confirm
             </button>
             <button
               onClick={handleCloseReassign}
               className="bg-gray-300 text-white px-4  rounded-md hover:bg-gray-500 focus:outline-none"
             >
               Cancel
             </button>
           </div>
         </div>   
                </div>
            </div>
      
        )} 
        </div>
           


            <div className="flex  flex-row w-full  justify-between  mx-auto max-w-5xl px-1 md:pr-4 md:pl-20 lg:pr-0 lg:pl-0 bg-white  py-1 border-b border-b-gray-100 h-3/12">
              <div className="flex w-1/2 justify-start  items-center flex-col">
                <div className="w-full flex gap-7">
                  <h3 className="font-sans font-medium text-lg md:text-2xl  text-black">
                    #{token?.ticketId}
                  </h3>
                  <div className="flex flex-col justify-center min-w-[150px]">
                    <h1 className="text-xs md:text-sm font-semibold w-full">
                      {token?.username}
                    </h1>
                    <p className="text-xs font-medium">{token?.date}</p>
                  </div>
                </div>
                <p className="w-full text-sm md:text-lg font-main font-medium text-black mt-1">
                  <span className="font-sans font-semibold">Subject:</span>{" "}
                  {token?.subject}
                </p>
              </div>

              <div className="w-1/2 flex flex-col items-end gap-1">
                
                <div className='font-semibold flex gap-3'>
                <span className="font-normal text-sm">Assigned To:</span> {token.assignedUsername}
                {!isReassigning&& (
          <div className="text-center">
            <button
              onClick={handleReassignClick}
              className="bg-orange-200 text-white px-2 text-sm  rounded-lg hover:bg-orange-400 focus:outline-none"
            >
              Re-Assign
            </button>
          </div>
        )}
                </div>

                <span
                  className={`border-2 px-1 w-fit h-fit flex items-center font-semibold  ${token?.status
                      ? " border-green-700   text-green-700"
                      : " border-red-700  text-red-700"
                    } rounded-xl  text-sm font-medium`}
                >
                  {`${token?.status ? "Open" : "Closed"}`}
                </span>
                <div className=" text-xs md:text-sm font-semibold">
                  Category : {token?.category}
                </div>
              </div>
              
            </div>
           
          </>
       
        <div className="mx-auto max-w-5xl w-full max-h-96 px-3 h-8/12 min-h-[400px] grow overflow-y-auto custom-scrollbar4">
        {token?.replies &&
          token.replies.map((reply, index) => (
            <div
              key={index}
              className={`flex w-full ${reply.notification ? "my-3 md:my-5" : "my-7 md:my-10"
                }`}
            >
              <div
                className={`gap-0 md:gap-1  flex ${reply.role > 0 && 'flex-row-reverse'} space-x-4 items-center w-full`}
              >
                {!reply.notification && (
                  <div className="flex flex-col items-start gap-1">
                    <div
                      className={`w-6 h-6 md:w-10 md:h-10 flex justify-center items-center rounded-full text-white text-xl font-medium border border-darkGreen ${reply.role > 0
                          ? "bg-kkslogo2 bg-contain bg-no-repeat bg-center"
                          : "bg-darkGreen "
                        }`}
                    >
                      {reply.role < 1 &&
                        reply.username.charAt(0)?.toUpperCase()}
                    </div>
                    <span className={` text-darkGreen  font-medium text-xs`}>
                      {reply.date}
                    </span>
                  </div>
                )}

                {reply.message ? (
                  <>
                    <div
                      className={` text-base  font-main font-normal text-black border  ${reply.role !== 0 ? "bg-gray-300 rounded-tl-xl" : "border-darkGreen rounded-tr-xl"
                        }  px-2 py-1 rounded-b-xl  max-w-[250px] md:max-w-lg lg:max-w-xl break-words `}
                    >
                      <h6>{reply?.message}</h6>
                    </div>
                    <div
                      ref={scrollRef}
                      className={` ${index + 1 === token?.replies?.length && "h-24"
                        }`}
                    />
                  </>
                ) : (
                  <>
                    {!(reply.fileFormat === "pdf") &&
                      !reply.notification ? (
                      <>
                        <div className="flex items-center gap-5">
                          <div
                            className=" p-2 bg-gray-200 rounded-xl hover:cursor-pointer"
                            onClick={() => handleImageView(reply.url)}
                          >
                            <img
                              src={reply.url || reply.file}
                              alt="ticket"
                              className="rounded-xl md:max-w-xl max-h-[400px]"
                            />
                          </div>
                          {reply.new && (
                            <div className="w-12 h-12">
                              <CircularProgressbar
                                value={progress + 1}
                                text={`${progress}%`}
                                styles={buildStyles({
                                  pathColor: "#25D366",
                                  trailColor: "#808080",
                                  textColor: "#0055A4",
                                  fontWeight: "600",
                                  textSize: "20px",
                                })}
                              />
                            </div>
                          )}
                        </div>
                        <div
                          ref={scrollRef}
                          style={{
                            height: `${index + 1 === token?.replies?.length &&
                              imageHeight + 10
                              }px`,
                          }}
                        />
                      </>
                    ) : (
                      <>
                        {!reply.notification ? (
                          <>
                            <div className="p-2 bg-gray-200   min-w-[250px] rounded-b-xl rounded-tr-xl flex justify-between border border-gray-400">
                              <img
                                src={Pdf}
                                alt="pdf"
                                className="h-7 w-7"
                              />
                              <img
                                src={DownloadPdf}
                                alt="down"
                                className="h-7 w-7 rounded-full hover:cursor-pointer"
                                onClick={() => handlePdfDownload(reply.url)}
                                onLoad={handleImageLoad}
                              />
                            </div>
                            <div
                              ref={scrollRef}
                              className={` ${index + 1 === token?.replies?.length &&
                                "h-24"
                                }`}
                            />
                          </>
                        ) : (
                          <>
                            <div className=" text-gray-500 text-xs font-semibold flex  w-full">
                              <div className="flex bg-blue-400/30 w-fit mx-auto gap-1 px-3 py-1 rounded-md items-center">
                                <img
                                  src={NotificationInfo}
                                  alt="info"
                                  className="w-3 h-3 md:w-4 md:h-4 font-gray-500"
                                />
                                {reply?.notification === "close" &&
                                  reply?.role > 0 &&
                                  user?.role > 0
                                  ? "You closed the ticket."
                                  : reply?.notification === "close" &&
                                    reply?.role > 0 &&
                                    user?.role < 1
                                    ? "Your ticket is closed by admin,If you have further queries you can reopen ticket."
                                    : reply?.notification === "reopen" &&
                                      reply?.role > 0 &&
                                      user?.role > 0
                                      ? "You reopend the ticket."
                                      : reply?.notification === "reopen" &&
                                        reply?.role < 1 &&
                                        user?.role < 1
                                        ? "You reopend the ticket."
                                        : reply?.notification === "reopen" &&
                                          reply?.role < 1 &&
                                          user?.role > 0
                                          ? "User reopend the ticket."
                                          : "Admin reopned the ticket."}
                              </div>
                            </div>
                            <div
                              ref={scrollRef}
                              className={` ${index + 1 === token?.replies?.length &&
                                "h-16"
                                }`}
                            />
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
      </div>
    </div>
  )
}

export default AdminSingleTicketDetails