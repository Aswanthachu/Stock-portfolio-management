import React, { useEffect, useState } from "react";
import  Button  from "@/components/Button";
import CreateNewTicket from "@/components/Popups/CreateNewTicket";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTicketFaq, getTickets, handleTicketReply, newTicket } from "@/Redux/Actions/ticket";
import NewTag from '/assets/NewTag.png'
import noData from "/assets/noData.png";
import socket from "@/Redux/Api/socket";
import FaqCard from "@/components/FaqCard";

const Tickets = () => {
  const dispatch = useDispatch();
  const [showMyTickets, setShowMyTickets] = useState(true);
  let [isOpen, setIsOpen] = useState(false);
  let [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(8);
  const [tokenData, setTokenData] = useState();
  const [selectedTab, setSelectedTab] = useState("tickets");
  const [open, setOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 5);
  };

  const tokensData = useSelector((state) => state.ticket.tickets);
  const ticketFaqs = useSelector((state) => state.ticket.ticketFaqs);
  useEffect(()=>{
    socket.on('newTicketNotification',(data)=>{
      dispatch(handleTicketReply(data))
    })
  
    socket.on('error',(error)=>{
      console.log(error);
    })
    return()=>{
      socket.off('newTicketNotification')
      socket.off('error')
    }
  })
  useEffect(() => {
    if (tokensData.length < 1 && selectedTab === "tickets") {
      dispatch(getTickets());
    }
    if (ticketFaqs.length < 1 && selectedTab === "faq") {
      dispatch(getTicketFaq());
    }
  }, [selectedTab]);

  useEffect(() => {
    setTokenData(tokensData);
  }, [tokensData]);

  useEffect(() => {
    setFaqs(ticketFaqs);
  }, [ticketFaqs]);

  // useEffect(() => {
  //   if (showMyTickets) {
  //     setData(tokenData?.filter((token) => !token?.trending));
  //   } else {
  //     setData(tokenData?.filter((token) => token?.trending === true));
  //   }
  // }, [tokenData, showMyTickets]);

  // loading functionality
  const [loadingStatus, setLoadingStatus] = useState(false);
  const loading = useSelector((state) => state.ticket.loading);
  
  useEffect(() => {
    setLoadingStatus(loading);
  }, [loading]);

  const userdata = JSON.parse(localStorage.getItem("status"));
  let status;

  if (userdata) {
    status = userdata.status;
  };

  const handleAddToken = () => {
    setIsOpen(true);
  };

  const toggle = (index) => {
    if (open === index) {
      return setOpen(null);
    }
    setOpen(index);
  };
  return (
    <>
        <>
          <div className="flex flex-col w-full items-center   min-h-screen">
            <div className="flex justify-end p-2 pt-3 md:mt-10 lg:pt-3  md:px-5 w-full gap-3">
              <button
                className="bg-darkGreen text-white rounded-lg text-sm md:text-base px-2 py-1  text-secondary tex font-main font-normal flex items-center gap-1"
                onClick={() => {
                  handleAddToken();
                }}
              >
                Raise A Ticket +
                
              </button>

              <div className="relative w-fit">
                <button className="md:p-1 mr-2 ml-2">
                  <svg
                    className="w-6 md:w-8"
                    viewBox="0 0 30 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.4182 23.8704L26.177 17.8865V11.6562C26.177 5.43575 21.1163 0.375 14.8958 0.375C8.6753 0.375 3.61454 5.43575 3.61454 11.6562V17.8865L0.373263 23.8703C0.226274 24.1416 0.152294 24.4465 0.158572 24.755C0.16485 25.0635 0.251171 25.3651 0.409076 25.6302C0.566981 25.8954 0.791054 26.1149 1.05934 26.2674C1.32762 26.4198 1.63092 26.5 1.9395 26.5H8.39171C8.37371 26.6974 8.36462 26.8955 8.36447 27.0938C8.36447 28.8259 9.05258 30.4872 10.2774 31.712C11.5023 32.9369 13.1635 33.625 14.8957 33.625C16.6279 33.625 18.2892 32.9369 19.514 31.712C20.7389 30.4872 21.427 28.8259 21.427 27.0938C21.427 26.8934 21.4174 26.6956 21.3997 26.5H27.8519C28.1605 26.5 28.4638 26.4198 28.732 26.2673C29.0002 26.1148 29.2243 25.8953 29.3821 25.6302C29.54 25.365 29.6263 25.0635 29.6326 24.755C29.6389 24.4465 29.5649 24.1417 29.418 23.8704H29.4182ZM19.052 27.0938C19.0525 27.6649 18.9352 28.2301 18.7076 28.7539C18.4799 29.2777 18.1467 29.749 17.7288 30.1383C17.3108 30.5276 16.8171 30.8266 16.2785 31.0166C15.7399 31.2067 15.1678 31.2836 14.5981 31.2427C14.0284 31.2018 13.4733 31.0439 12.9673 30.7789C12.4614 30.5139 12.0154 30.1474 11.6574 29.7024C11.2994 29.2574 11.0369 28.7433 10.8864 28.1923C10.7359 27.6413 10.7006 27.0652 10.7827 26.5H19.0089C19.0374 26.6966 19.0518 26.8951 19.052 27.0938ZM2.93633 24.125L5.98955 18.4885V11.6562C5.98955 9.29417 6.92788 7.02883 8.59813 5.35858C10.2684 3.68833 12.5337 2.75 14.8958 2.75C17.2579 2.75 19.5232 3.68833 21.1935 5.35858C22.8637 7.02883 23.802 9.29417 23.802 11.6562V18.4885L26.8551 24.125H2.93633Z"
                      fill="#096A56"
                    />
                  </svg>
                </button>
                {tokenData?.filter((item) => item?.count>0)?.length > 0 && (
                  <span className="w-4 h-4 md:w-6 md:h-6 bg-red-600 rounded-full absolute -top-1.5 md:-top-1.5 right-1.5 md:text-center text-xs md:text-sm text-white">
                    <div className="w-fit h-fit flex mx-auto  md:pt-0.5">
                      {tokenData?.filter((item) => item?.count).length}
                    </div>
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-5   md:mt-16 lg:-mt-5">
              <h3 className="text-darkGreen text-3xl lg:text-6xl font-sans font-medium text-center">
                Find & Ask for <br /> Answers
              </h3>
            </div>

            <div
              className={` flex justify-between h-9 md:h-auto my-5 md:my-10 w-[250px] border-black border rounded-full lg:w-[400px]  bg-white`}
            >
              <input
                type="text"
                placeholder="Search for Answers..."
                className="w-full px-5 rounded-full text-sm"
                onChange={(e) => {
                  setQuery(e.target.value.toLocaleLowerCase());
                  setSearch(true);
                }}
              />
              <button className="bg-darkGreen rounded-full px-2 py-2">
                <svg
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5"
                >
                  <path
                    d="M28 28L21.8613 21.8503M25.2632 13.6316C25.2632 16.7165 24.0377 19.675 21.8563 21.8563C19.675 24.0377 16.7165 25.2632 13.6316 25.2632C10.5467 25.2632 7.58816 24.0377 5.40681 21.8563C3.22547 19.675 2 16.7165 2 13.6316C2 10.5467 3.22547 7.58816 5.40681 5.40681C7.58816 3.22547 10.5467 2 13.6316 2C16.7165 2 19.675 3.22547 21.8563 5.40681C24.0377 7.58816 25.2632 10.5467 25.2632 13.6316Z"
                    stroke="white"
                    strokeWidth="2.73684"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {selectedTab === "tickets" && tokensData?.length > 0 && (
              <div className="w-full text-xs font-semibold flex flex-col items-end pr-5 md:hidden">
                <div className="flex gap-2 items-center ">
                  <div className="w-2 h-2 rounded-full bg-green-700" />
                  <p>Open</p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-600" />
                  <p>Close</p>
                </div>
              </div>
            )}
            {(!search ||
              (search && selectedTab === "faq") ||
              (search && query?.trim() === "")) && (
              <div className="flex justify-center gap-20 my-5 mx-10 md:mx-0">
                <button
                  onClick={() => setSelectedTab("faq")}
                  className={`${
                    selectedTab === "faq" &&
                    "border-darkGreen border-b-2 font-semibold flex"
                  }`}
                >
                  <div className="flex gap-1">
                    <p>FAQ</p>
                    <span className="hidden md:flex">Tickets</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTab("tickets")}
                  className={`${
                    selectedTab === "tickets" &&
                    "border-darkGreen border-b-2 font-semibold flex w-fit"
                  }`}
                >
                  <div className="flex gap-1">Tickets</div>
                </button>
              </div>
            )}

            {selectedTab === "tickets" ? (
              <>
                <div className="flex flex-col  w-[90%] lg:w-[80%]">
                  {tokensData &&
                    tokensData
                      .filter((token) =>
                        token?.subject?.toLowerCase().includes(query)
                      )
                      .sort((a, b) => {
                        if (a.userUnread > b.userUnread) {
                          return -1;
                        }
                      })
                      .slice(0, visible)
                      .map((token, index) => (
                        <div key={index} className="relative">
                          {token?.count> 0 && (
                            <img
                              src={NewTag}
                              alt="new"
                              className="w-16 absolute -top-1.5 md:-top-2.5 -left-5"
                            />
                          )}
                          <Link
                            to={`/user/tickets/view/${token.ticketId}`}
                            state={token}
                            className="flex w-full justify-between text-sm md:text-lg lg:text-xl text-black font-main font-normal border-b border-black mt-3 space-y-0.5 px-2 py-1 relative"
                          >
                            <h6 className="w-1/6 font-semibold text-sm md:text-xl font-sans mt-1 md:mt-0 mr-1 md:mr-0">
                              #{token.ticketId}
                            </h6>
                            <div className="flex w-3/6 md:gap-2 items-center  justify-between mr-1 md:mr-0">
                              <div className="flex flex-col w-10/12">
                                <p className="font-main font-semibold text-lg truncate w-full">
                                  {token.subject}
                                </p>

                                <span className="text-xs lg:text-sm">
                                  {token.date}
                                </span>
                              </div>
                              {token.count > 0 && (
                                <span className="bg-red-600 rounded-full md:rounded-xl text-xs text-white px-1  md:py-0.5 flex md:gap-0.5 items-center w-5 h-5 md:w-fit md:h-fit justify-center">
                                  <span className="">{token.count}</span>
                                  <p className="font-semibold font-sans text-xs hidden md:flex">
                                    new
                                  </p>
                                </span>
                              )}
                            </div>
                            <div className="w-1/6 flex justify-center items-center mr-1 md:mr-0">
                              <div
                                className={`${
                                  token.status
                                    ? "bg-green-700 md:bg-inherit md:border-green-700 "
                                    : " bg-orange-600 md:border-orange-600 md:bg-inherit"
                                } border-2 w-5 h-5 rounded-full md:rounded-xl text-sm  md:text-base md:w-fit md:h-fit px-1 py-0.5`}
                              >
                                <p className="hidden md:block">
                                  {token.status ? "Open" : "Closed"}
                                </p>
                              </div>
                            </div>
                            <h6 className="w-1/6  flex justify-center text-xs md:text-lg items-center ">
                              {token?.numberOfReplies
                                ? token.numberOfReplies
                                : "0"}
                              {token?.numberOfReplies > 1 ? "Replies" : "Reply"}
                            </h6>
                          </Link>
                        </div>
                      ))}
                </div>

                {tokensData?.length < 1 && (
                  <div className="flex flex-col items-center mt-3">
                    <img
                      className="w-48 md:w-48 lg:w-52  mb-1 items-center rounded-2xl md:rounded-3xl"
                      src={noData}
                      alt="PNG"
                    />
                    <p className="mt-4 font-main font-medium text-xl">
                      You have not created any ticket !!
                    </p>
                  </div>
                )}
                <div className="flex my-5">
                  {visible < tokensData?.length && (
                    <Button
                      text="Load More"
                      onClick={showMoreItems}
                      className="bg-darkGreen text-white px-2 py-1  rounded-xl text-sm font-main"
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Faq Section*/}
                <div className="container mx-auto text-center ">
                  <div className="w-full flex flex-col space-y-5 items-center my-10">
                    {faqs.map((data, index) => {
                      return (
                        <FaqCard
                          key={index}
                          open={open === index}
                          title={data.subject}
                          desc={data.description}
                          toggle={() => toggle(index)}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          <CreateNewTicket
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </>
      
    </>
  );
};

export default Tickets;
