import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "@/components/Button";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import socket from "@/Redux/Api/socket";
import { Modal, ModalBody, ModalFooter } from "react-modern-modal";
import jsPDF from "jspdf";

import { baseUrl, getConfig } from "@/Redux/Api";
import { useSelector, useDispatch } from "react-redux";

import {
  addNewMessage,
  clearProgress,
  closeNew,
} from "@/Redux/Features/ticket";

import {
  getSingleTicket,
  handleNewMessage,
  ticketReply,
  updateMessageRead,
} from "@/Redux/Actions/ticket";
import AdminSettings from "@/components/AdminSettings";

const AdminTicketView = () => {
  const token = useSelector((state) => state.ticket.tokens);
  const loading = useSelector((state) => state.ticket.loading);
  const progress = useSelector((state) => state.ticket.progress);
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const location = useLocation()
  const { ticketId } = useParams();
  // const [token, setToken] = useState();
  const [reply, setReply] = useState("");
  const [image, setImage] = useState();
  const [viewImage, setViewImage] = useState();
  const [imageHeight, setImageHeight] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [pdf, setPdf] = useState();
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (token?.adminUnread) {
      dispatch(updateMessageRead({ id: token?._id }));
    }
    // dispatch(getAdminNotificationCount());
  }, [token]);

  let navigate = useNavigate();
  const handleChange = (e) => {
    setReply(e.target.value);
  };
  useEffect(() => {
    socket.on('ticketReply', (data) => {
      dispatch(handleNewMessage(data))
    })
    socket.on('error', (error) => {
      console.log(error);
    })
    return () => {
      socket.off('ticketReply')
      socket.off('error')
    }
  })
  const handleDelete = async () => {
    const config = getConfig();
    const { data } = await axios.delete(
      `${baseUrl}/ticket/delete-ticket/${token?._id}`,
      config
    );
    if (data.status) {
      navigate("/admin/tickets");
    }
  };

  const handleTrending = async () => {
    const config = getConfig();
    const { data } = await axios.patch(
      `${baseUrl}/ticket/make-trending/${token?._id}`,
      config
    );
    if (data.status) {
      alert("Ticket added to Trending tickets");
    } else {
      alert("Failed to add to trending tickets , Please retry");
    }
  };

  const handleReply = async () => {
    setFilename("");
    let cloudRes;
    let replyData;
    if (image && reply.trim() === "") {
      replyData = {
        image,
        status: token.status,
        ticketId: token._id,
      };
    } else if (reply.trim() !== "" && !image) {
      replyData = {
        message: reply,
        status: token.status,
        ticketId: token._id,
      };
    } else if (pdf) {
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/aswanth/image/upload",
          {
            method: "POST",
            body: pdf,
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.format === "pdf") {
            replyData = {
              cloudinaryResponseData: data,
              status: token.status,
              ticketId: token._id,
            };
            cloudRes = data;
          }
        } else {
          throw new Error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }

    if (replyData && replyData !== undefined) {
      let newMessage;
      if (reply.trim() !== "") {
        newMessage = {
          role: JSON.parse(localStorage?.getItem("user"))?.role,
          message: reply,
          username: token.username,
          date: new Date().toDateString().slice(4),
          new: true,
        };
      } else if (image && reply.trim() === "") {
        newMessage = {
          role: JSON.parse(localStorage?.getItem("user"))?.role,
          url: image,
          fileFormat: "image",
          username: token.username,
          date: new Date().toDateString().slice(4),
          new: true,
        };
      } else {
        newMessage = {
          role: JSON.parse(localStorage?.getItem("user"))?.role,
          url: cloudRes.secure_url,
          fileFormat: "pdf",
          username: token.username,
          date: new Date().toDateString().slice(4),
          new: true,
        };
      }
      dispatch(addNewMessage(newMessage));
      dispatch(ticketReply(replyData));
      setReply("");
      setFilename("");
      setImage();
      setPdf();
    } else {
      return;
    }
  };

  // message Sending onclicking

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && reply.trim() !== "") {
      handleReply();
    }
  };

  useEffect(() => {
    dispatch(getSingleTicket(location?.state?.ticketId));
  }, []);


  useEffect(() => {
    if (progress === 100) {
      setInterval(() => {
        dispatch(closeNew());
        dispatch(clearProgress());
      }, 1000);
    }
  }, [progress]);

  // useEffect(() => {
  //   setToken(tokens);
  // }, [tokens,dispatch]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    setFilename(file.name);

    if (file.name.includes(".pdf")) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

      setPdf(formData);
    } else {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;
        setImage(fileContent);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (event) => {
    const { naturalHeight } = event.target;
    setImageHeight(naturalHeight);
  };

  const handleImageView = (image) => {
    setViewImage(image);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setViewImage("");
  };

  const handleDownloadImagePdf = () => {
    const imageBase64 = viewImage;
    const pdf = new jsPDF();

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imageBase64, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${ticketId}.pdf`);
  };

  const handlePdfDownload = async (url) => {
    const cloudinaryUrl = url;
    fetch(cloudinaryUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${ticketId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Failed to download the PDF:", error);
      });
  };

  // loading functionality

  useEffect(() => {
    setLoadingStatus(loading);
  }, [loading]);

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [token, ticketId]);

  return (
    <>
      {!loadingStatus ? (
        <div className="h-full flex flex-col overflow-hidden">
          {/*back button*/}

          <div className="w-full relative  hidden md:flex justify-between  items-center  md:left-8   z-50 top-5 max-h-[200px]">
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
          {/* token heading section*/}

          <>
            <div
              className="flex md:hidden  m-1 w-7 h-7 rounded-full border border-gray-500 hover:cursor-pointer items-center justify-center"
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

            <div className="flex  flex-row w-full  justify-between  mx-auto max-w-5xl px-1 md:pr-4 md:pl-20 lg:pr-0 lg:pl-0 bg-white  py-3 border-b border-b-gray-100 h-3/12">
              <div className="flex w-2/3 justify-start  items-center flex-col">
                <div className="w-full flex gap-7">
                  <h3 className="font-sans font-medium text-lg md:text-2xl lg:text-4xl text-black">
                    #{token?.ticketId}
                  </h3>
                  <div className="flex flex-col justify-center min-w-[150px]">
                    <h1 className="text-sm md:text-base font-semibold w-full">
                      {token?.username}
                    </h1>
                    <p className="text-xs font-medium">{token?.date}</p>
                  </div>
                </div>
                <p className="w-full text-sm md:text-xl font-main font-medium text-black mt-3">
                  <span className="font-sans font-semibold">Subject:</span>{" "}
                  {token?.subject}
                </p>
              </div>

              <div className="w-1/3 flex flex-col items-end gap-2">
                <span
                  className={`border-2 p-2 w-fit h-fit flex items-center font-semibold  ${token?.status
                      ? " border-green-700   text-green-700"
                      : " border-red-700  text-red-700"
                    } rounded-xl  text-base font-medium`}
                >
                  {`${token?.status ? "Open" : "Closed"}`}
                </span>
                <div className=" text-xs md:text-sm font-semibold">
                  Category : {token?.category}
                </div>
              </div>
            </div>
          </>

          {/* ticket reply */}

          <div className="mx-auto max-w-5xl w-full px-3 h-8/12 min-h-[400px] grow overflow-y-auto custom-scrollbar4">
            {token?.replies &&
              token.replies.map((reply, index) => (
                <div
                  key={index}
                  className={`flex w-full ${reply.notification ? "my-3 md:my-5" : "my-7 md:my-10"
                    }`}
                >
                  <div
                    className={`gap-0 md:gap-3 lg:gap-6 flex ${reply.role > 0 && 'flex-row-reverse'} space-x-4 items-center w-full`}
                  >
                    {!reply.notification && (
                      <div className="flex flex-col items-start gap-2">
                        <div
                          className={`w-10 h-10 md:w-14 md:h-14 flex justify-center items-center rounded-full text-white text-xl font-medium border border-darkGreen ${reply.role > 0
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
                                    src='/assets/PDF.png'
                                    alt="pdf"
                                    className="h-7 w-7"
                                  />
                                  <img
                                    src='/assets/downloadpdf.jpg'
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
                                      src='/assets/NotificationInfo.svg'
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

          {/*Textarea for typing token */}

          <div className="flex flex-col w-full items-center px-2  mx-auto  h-2/12">
            <div className="w-full flex justify-start lg:justify-center items-center gap-1   pb-5 md:pb-10 px-1 ">
              <div className="w-full flex items-center max-w-6xl mx-auto gap-2 md:gap-5 justify-center ">
                <div className="w-8/12 px-1 md:px-5 md:w-9/12  border border-darkGreen rounded-xl max-w-lg md:max-w-4xl flex items-center justify-between lg:px-3 py-1">
                  <textarea
                    name=""
                    id="reply"
                    cols="70"
                    rows="2"
                    className={`rounded-xl w-10/12 md:w-full lg:w-11/12 px-3 py-2 max-h-12  overflow-hidden resize-none disabled:opacity-0`}
                    disabled={filename === "" ? false : true}
                    value={reply}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  ></textarea>
                  <div className="relative flex flex-col text-center">
                    <div className="flex justify-end">
                      <img
                        src='/assets/Upload.png'
                        alt="upload"
                        className="w-10  md:w-8 md:h-8 hover:cursor-pointer"
                      />

                      <input
                        accept="image/*,application/pdf"
                        type="file"
                        onChange={handleFileSelect}
                        className="w-8 h-8 z-20  file:border-0 file:hover:cursor-pointer absolute top-0 rounded-full opacity-0 hover:cursor-pointer"
                      />
                    </div>
                    <p className="text-xs truncate">{filename}</p>
                  </div>
                </div>

                <Button
                  text="Send"
                  className="bg-darkGreen text-white p-2 rounded-xl"
                  onClick={handleReply}
                />
                <AdminSettings ticketId={ticketId} />
              </div>
            </div>
          </div>

          <Modal isOpen={modalOpen} onClose={handleClose} size="lg">
            <ModalBody className="flex justify-center overflow-y-auto custom-scrollbar5 max-h-[650px]">
              <img
                src={viewImage}
                alt="view"
                className="w-full rounded-lg h-[90%]"
              />
            </ModalBody>
            <ModalFooter>
              <img
                src='/assets/Download.png'
                alt="download"
                className="w-10 h-10 hover:cursor-pointer"
                onClick={handleDownloadImagePdf}
              />
            </ModalFooter>
          </Modal>
        </div>
      ) : (
        <></>
        // <Loading />
      )}
    </>
  );
};

export default AdminTicketView;
