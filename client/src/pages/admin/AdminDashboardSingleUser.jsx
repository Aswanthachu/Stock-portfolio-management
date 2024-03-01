import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import { getSingleUser, updateUserRole,setActiveUsers ,getSubadminActivities, getUserActivities} from "@/Redux/Actions/admin";
import ManageUserPlans from "@/components/Admin/ManageUserPlans";
import socket from "@/Redux/Api/socket";
import { Link } from "react-router-dom";
import SubLoading from "@/components/SubLoading";
const AdminDashboardSingleUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [role, setRole] = useState(0);
  const [edit, setEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const activeUsers = useSelector((state)=>state?.admin?.activeUsers)
  const userData = useSelector((state) => state?.admin?.userDetails);
  const loading = useSelector((state) => state.admin.loading);
  const subAdminActivities = useSelector((state) => state.admin.subAdminActivities);
  const userActivities = useSelector((state) => state.admin.userActivities);
  const activitiesLoading = useSelector((state) => state.admin.activitiesLoading);
  const user = JSON.parse(localStorage.getItem("user"))

  const handleViewPortfolio = (pid, type) => {
    navigate(`/admin/user/${id}/${type}/${pid}`);
  };

  const handleSelfPortfolioView=(portfolioId)=>{
    navigate(`/admin/user/self-portfolio-details/${portfolioId}`)
  }
  useEffect(() => {
    socket.on('activeUsers', (activeUsers) => {
      dispatch(setActiveUsers(activeUsers));
    });
  
    return () => {
      socket.off('activeUsers');
    }
  }, []);
  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [dispatch]);

  useEffect(() => {
    if(userData?.user?.role===0){
      dispatch(getUserActivities(id))
    }else if(userData?.user?.role > 1){
      dispatch(getSubadminActivities(id));

    }
  }, [dispatch,userData]);

  const handleSubmit = () => {
    setEdit(false);
    const formData = {
      id: userData.user._id,
      role: role,
    };
    dispatch(updateUserRole(formData));
  };

  // ####### Loading functionality ##### //

  const handleTicketClick = (ticket) => {
    navigate(`/admin/user/${userData.user._id}/subadmin-activities/${ticket.ticketId}`)
  };

  useEffect(() => {
    setLoadingStatus(loading);
  }, [loading]);

  const isUserOnline = (userId) => {
    return activeUsers.some((user) => user.userId === userId);
  };
  return (
    <>

        <div className=" p-[1.9%] ">
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

          <h3 className="font-sans font-medium text-2xl lg:text-4xl mx-4 text-black">
            User Info
          </h3>
          {/* user details */}
          <div className="flex items-center justify-start gap-5 my-4">
            <div>
              <img
                src='/assets/avatar.jpg'
                alt="avatar"
                className="rounded-full w-28 h-28 md:w-32 md:h-32 "
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-10">
              <div>
                <h4 className="font-main font-medium text-base md:text-2xl">
                  {userData?.user?.username}
                </h4>
                <p className="font-main font-medium text-base md:text-xl text-darkGreen">
                  {userData?.user?.email}
                </p>
                {userData.loginHistory && (
                  <p className="font-main font-medium text-base  text-slate-500">
                    Last Seen :
                    {isUserOnline(userData?.user?._id)? (
                <span className="text-green-500 font-semibold ">Online</span>
              ): new Date(userData?.user?.lastSeen || userData?.user?.lastLogin?.timestamp).toLocaleString("en-GB")}
                  </p>
                )}
              </div>
              {user?.role === 1 ? (
                <div>
                  <div className="flex">
                    {" "}
                    <h6 className="flex font-main font-medium text-base md:text-lg">
                      Role :
                      {!edit && (
                        <span className="text-darkGreen ">
                          {userData?.user?.role}
                        </span>
                      )}
                    </h6>
                    {edit && (
                      <div className="flex">
                        {" "}
                        <select
                          id="role"
                          name="role"
                          className=" w-30   text-black font-medium   block h-7 ml-4 text-lg"
                          onChange={(e) => setRole(e.target.value)}
                          required
                        >
                          <option selected value="0">
                            User
                          </option>
                          <option value="2">Financial</option>
                          <option value="3">Technical</option>
                        </select>
                        <Button
                          text="update"
                          className="bg-darkGreen font-sans text-lg cursor-pointer text-white ml-4 px-2 rounded-xl"
                          onClick={handleSubmit}
                        />{" "}
                      </div>
                    )}
                    {!edit && (
                      <Button
                        onClick={() => {
                          setEdit(true);
                        }}
                        icon={
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.22721 9.24514L0.224435 13.5729C0.189843 13.7311 0.191028 13.8951 0.227906 14.0527C0.264783 14.2104 0.336421 14.3579 0.437585 14.4843C0.538749 14.6108 0.666885 14.7131 0.812631 14.7836C0.958377 14.8542 1.11805 14.8914 1.27999 14.8924C1.35545 14.9 1.43148 14.9 1.50694 14.8924L5.8611 13.8896L14.2211 5.56125L9.55555 0.90625L1.22721 9.24514Z"
                              fill="#222222"
                            />
                          </svg>
                        }
                        className="ml-2"
                      />
                    )}
                  </div>
                  <div className="flex">
                    <h6 className="flex font-main font-medium text-base md:text-lg">
                      Status :
                      <span className="text-darkGreen">
                        {userData?.subscription?.status}
                      </span>
                    </h6>
                    <Button
                      icon={
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.22721 9.24514L0.224435 13.5729C0.189843 13.7311 0.191028 13.8951 0.227906 14.0527C0.264783 14.2104 0.336421 14.3579 0.437585 14.4843C0.538749 14.6108 0.666885 14.7131 0.812631 14.7836C0.958377 14.8542 1.11805 14.8914 1.27999 14.8924C1.35545 14.9 1.43148 14.9 1.50694 14.8924L5.8611 13.8896L14.2211 5.56125L9.55555 0.90625L1.22721 9.24514Z"
                            fill="#222222"
                          />
                        </svg>
                      }
                      className="ml-2"
                    />
                  </div>
                </div>
              ) : (
                <h6 className="flex font-main font-medium text-base md:text-lg">
                  Status :
                  <span className="text-darkGreen">
                    {userData?.subscription?.status}
                  </span>
                </h6>
              )}
            </div>
          </div>
          {/* user details */}

          {/* user subscription details */}
          {userData?.user?.role === 0 && (
            <div className="flex flex-col lg:flex-row w-full">
              <div className="lg:w-1/3  p-4 w-full ">
                <h3 className="font-main font-medium text-2xl text-black mb-5">
                  Subscription Details
                </h3>
                {userData?.subscription?.plan ? (
                  <div className="bg-darkGreen font-main text-white p-4  rounded-lg flex  justify-center  flex-col gap-1 h-full  w-full  ">
                    <div className="w-full">
                      <h3 className=" font-medium text-lg -mt-3">
                        {userData?.subscription?.plan}
                      </h3>
                      <p className="font-normal text-base">
                        Purchased on{" "}
                        {new Date(
                          userData?.subscription?.createdAt
                        ).toDateString()}
                      </p>
                      <p className="font-normal text-base">
                        Valid till{" "}
                        {new Date(
                          userData?.subscription?.endDate
                        ).toDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row lg:flex-col justify-start w-full gap-4  ">
                      {/* <div className="flex  lg:w-full   gap-4">
                        <Button
                          text="Cancel Plan"
                          className="bg-white border-2 border-white text-darkGreen p-2  "
                        />
                        <Button
                          text="Extend"
                          className="border-2 border-white p-2"
                        />
                      </div>
                      <div className="flex lg:w-full  ">
                        <Button
                          text="Upgrade to New Plan"
                          className="border-2 border-white py-2 px-4 w-full"
                        />
                      </div> */}
                      <div className="flex lg:w-full  ">
                        <Button
                          text="Manage Plan" onClick={()=>{setIsOpen(true)}}
                          className="border-2 border-white py-2 px-4 w-fit"
                        />
                      </div>
                    
                    </div>
                  </div>
                ) : (
                  <div className="bg-darkGreen font-main text-white p-4  rounded-lg flex  justify-evenly  flex-col gap-1 h-full  w-full  ">
                   <p>No Active Plan</p> 
                   <div className="flex lg:w-full  ">
                        <Button
                          text="Manage Plan" onClick={()=>{setIsOpen(true)}}
                          className="border-2 border-white py-2 px-4 w-fit"
                        />
                      </div>
                  </div>
                )}
              
              </div>
              <div className="lg:w-1/3 p-4">
                <h3 className="font-main font-medium text-2xl text-black mb-5">
                  Referred Users
                </h3>
                <div className="bg-darkGreen font-main text-white p-3  rounded-lg flex justify-center  flex-col gap-3 h-full  ">
                  <h5>
                    No. of Referred Users:{" "}
                    {userData?.user?.referedUsers?.length}
                  </h5>
                  {userData?.user?.referedUsers?.length > 0 ? (
                    <ul className="max-h-[120px] p-2 overflow-y-auto custom-scrollbar">
                      {userData?.user?.referedUsers?.map((item, index) => (
                        <li
                          key={index}
                          className="w-full border-b flex justify-between"
                        >
                          <h6>{item.username}</h6>
                          <span>{item.date}</span>{" "}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="lg:w-1/3 p-4">
  <h3 className="font-main font-medium text-2xl text-black mb-5">
    Transactions
  </h3>
  <div className="bg-darkGreen font-main text-white p-3 rounded-lg flex justify-center flex-col gap-3 h-full">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left">Plan</th>
          <th className="text-left">Date</th>
          <th className="text-left">Amount</th>
        </tr>
      </thead>
      <tbody className="max-h-[160px] p-2 overflow-y-auto custom-scrollbar">
        {userData?.payments?.map((item, index) => (
          <tr key={index} className="border-b">
            <td>{item.plan || item?.productinfo}</td>
            <td>{new Date(item?.createdAt)?.toLocaleDateString('en-GB')}</td>
            <td>{item?.amount}</td>
          </tr>
        ))}
        {!userData?.payments[0] && (
          <tr>
            <td colSpan="3">No payment history</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
            </div>
          )}
          {/* user subscription details */}
          {/* User Portfolios */}
          <div className=" mt-16 mx-5">
            <h2 className="text-2xl font-main font-semibold text-darkGreen mx-5">
              User Portfolios
            </h2>

            <div className="w-full flex flex-wrap   ">
              {userData &&
                userData?.user?.portfolios?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col p-4 shadow-md rounded-xl m-4 bg-orange-100 hover:bg-blue-100 w-[80%] md:w-[43%] lg:w-[30%] border relative"
                    onClick={() =>
                      handleViewPortfolio(
                        item.portfolioRef,
                        item.investmentType
                      )
                    }
                  >
                    {
                      <span
                        className={`relative left-60 -mb-6 ${
                          item.investmentVerified === "pending"
                            ? "bg-amber-300"
                            : item.investmentVerified === "verified"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }  text-[8px] font-semibold rounded-full px-3 w-fit`}
                      >
                        {item.investmentVerified.toUpperCase()}
                      </span>
                    }
                    {
                      <img src='/assets/Star.png' alt="star" className="w-8 absolute right-2 top-2"/>
                    }
                    <div className="flex gap-2">
                      <label
                        className="font-main text-base  text-black"
                        htmlFor=""
                      >
                        Portfolio Name :
                      </label>
                      <span className="font-semibold">
                        {item.portfolioname}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <label
                        className="font-main text-base  text-black"
                        htmlFor=""
                      >
                        Investment Type :
                      </label>
                      <span>{item.investmentType}</span>
                    </div>
                    {item.frequency ? (
                      <div className="flex gap-2">
                        <label
                          className="font-main text-base  text-black"
                          htmlFor=""
                        >
                          Installment amount :
                        </label>
                        <span>{item.initial_investment}</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <label
                          className="font-main text-base  text-black"
                          htmlFor=""
                        >
                          Investment amount :
                        </label>
                        <span>{item.installment}</span>
                      </div>
                    )}

                    {item.frequency && (
                      <div className="flex gap-2">
                        <label
                          className="font-main text-base  text-black"
                          htmlFor=""
                        >
                          Frequency :
                        </label>
                        <span>{item.frequency}</span>
                      </div>
                    )}
                    {item.createdAt && (
                      <div className="flex gap-2">
                        <label
                          className="font-main text-base  text-black"
                          htmlFor=""
                        >
                          Created On :
                        </label>
                        <span>
                          {new Date(item?.createdAt).toLocaleString("en-GB")}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

              {userData &&
                userData?.user?.user_created_portfolios?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col p-4 shadow-md rounded-xl m-4 bg-orange-100 hover:bg-blue-100 w-[80%] md:w-[43%] lg:w-[30%] border"
                    onClick={() =>
                      handleSelfPortfolioView(item._id)
                    }
                  >
                    {
                      <span
                        className={`relative left-60 -mb-6 bg-red-400
                        text-[8px] font-semibold rounded-full px-3 w-fit`}
                      >
                        Not verified
                      </span>
                    }
                    <div className="flex gap-2">
                      <label
                        className="font-main text-base  text-black"
                        htmlFor=""
                      >
                        Portfolio Name :
                      </label>
                      <span className="font-semibold">
                        {item.portfolio_name}
                      </span>
                    </div>
                    {item.createdAt && (
                      <div className="flex gap-2">
                        <label
                          className="font-main text-base  text-black"
                          htmlFor=""
                        >
                          Created On :
                        </label>
                        <span>
                          {new Date(item?.createdAt).toLocaleString("en-GB")}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          {/* end of User Portfolios */}

          {/* portfolio section */}

          {/* stocks section */}

          <div className="flex ">
            {user?.role === 1 && (
              <>
                {userData?.user?.role === 0 && userData?.user?.gender && (
                  <div className="mx-4 lg:mx-10 mt-20 w-1/2">
                    <h3 className="text-2xl font-main font-semibold text-darkGreen">
                      Info used to Generate Portfolio
                    </h3>
                    <div className="flex flex-col lg:flex-row">
                      <div className="flex flex-col w-full lg:w-1/2 ">
                        <p className="font-main font-normal text-base md:text-2xl text-black p-1">
                          Gender:{" "}
                          <span className="font-medium">
                            {userData?.user?.gender}
                          </span>{" "}
                        </p>
                        <p className="font-main font-normal text-base md:text-2xl text-black p-1">
                          Age Range:{" "}
                          <span className="font-medium">
                            {userData?.user?.ageRange}
                          </span>
                        </p>{" "}
                        <p className="font-main font-normal text-base md:text-2xl text-black p-1">
                          Currently Working:{" "}
                          <span className="font-medium">
                            {userData?.user?.working}
                          </span>{" "}
                        </p>
                        <p className="font-main font-normal text-base md:text-2xl text-black p-1">
                          Working Sector:{" "}
                          <span className="font-medium">
                            {userData?.user?.working_sector}
                          </span>{" "}
                        </p>{" "}
                        <p className="font-main font-normal text-base md:text-2xl text-black p-1">
                          Already have any Mutual fund/SIP Holding:{" "}
                          <span className="font-medium">
                            {userData?.user?.sip_mutual_fund_hold}
                          </span>{" "}
                        </p>{" "}
                        <p className="font-main font-normal text-base md:text-2xl text-black p-1">
                          Already have a Demat account:{" "}
                          <span className="font-medium">
                            {userData?.user?.demat_Ac}
                          </span>{" "}
                        </p>{" "}
                        <p className="font-main font-normal text-base md:text-2xl text-black p-1">
                          How long are you being Investing/trading:{" "}
                          <span className="font-medium">
                            {userData?.user?.how_long_invest}
                          </span>{" "}
                        </p>{" "}
                      </div>
                    </div>
                  </div>
                )}

                {userData?.user?.role > 1 && (
                  <div className="p-5 w-1/2">
                    <h5 className="font-main font-semibold text-2xl text-darkGreen my-5">
                      General
                    </h5>
                    <div className="font-main font-normal text-xl text-black lg:flex lg:items-center space-y-3">
                      <div className="lg:w-72 space-y-3">
                        <p>
                          Gender:{" "}
                          <span className="font-medium">
                            {userData?.user?.gender}
                          </span>
                        </p>
                        <p>
                          Age Range:{" "}
                          <span className="font-medium">
                            {userData?.user?.ageRange}
                          </span>
                        </p>
                        <p>
                          Working Sector:{" "}
                          <span className="font-medium">
                            {userData?.user?.working_sector}
                          </span>
                        </p>
                        <p>
                          About:{" "}
                          <span className="font-medium">
                            {userData?.user?.about}
                          </span>
                        </p>
                      </div>
                    </div>

                    <Button
                      text="Edit"
                      className="bg-darkGreen px-6 py-1 rounded-md my-6"
                    />
                  </div>
                )}
              </>
            )}

            <div className="p-5 w-1/2">
              <h5 className="font-main font-semibold text-2xl  text-darkGreen my-5">
                Recent Logins
              </h5>
              <table className="border-collapse w-3/">
                <thead className="bg-darkGreen text-white">
                  <tr>
                    <th className="border border-neutral-900 py-3 px-4">
                      Time
                    </th>
                    <th className="border border-neutral-900 py-3 px-4">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className=" overflow-y-auto">
                  {userData &&
                    userData?.loginHistory?.map((data, index) => (
                      <tr key={index} className="text-slate-800 ">
                        <td className="border border-neutral-900 py-3 px-4">
                          {new Date(data.timestamp).toLocaleString("en-GB")}
                        </td>
                        <td className="border border-neutral-900 py-3 px-4">
                          {data.ipAddress}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* {userData?.user?.role > 1 && ( */}
            <>
            {activitiesLoading?<SubLoading />
            :
            <div className="p-5">
            <h4 className="font-sans font-medium text-darkGreen text-3xl ">
            Tickets  Activity
            </h4>
            <div className=" flex lg:justify-center">
              <div className="flex flex-col w-full">
              <table className="min-w-full text-xs mt-3 ">
        <thead>
          <tr>
            <th className="text-center">Ticket ID</th>
            <th className="text-center">Subject</th>
            <th className="text-center">Category</th>
            <th className="text-center">Date</th>
            <th className="text-center">Status</th>
            <th className="text-center">Assigned To</th>
            <th className="text-center">Messages</th>
            <th className="text-center">New Unread</th>
          </tr>
        </thead>
        <tbody>
          {userData?.user?.role > 1 ? (subAdminActivities .map((ticket) => (
            <tr key={ticket.ticketId}  onClick={() => handleTicketClick(ticket)} className="border-b  border-gray-200 hover:bg-gray-100 cursor-pointer">
              <td className="py-2 text-center">{ticket.ticketId}</td>
              <td className="py-2 text-center">{ticket.subject}</td>
              <td className="py-2 text-center">{ticket.category}</td>
              <td className="py-2 text-center">{ticket.date}</td>
              <td className="py-2 text-center">{ticket.status ? 'Open' : 'Closed'}</td>
              <td className="py-2 text-center">{ticket.assignedUsername}</td>
              <td className="py-2 text-center">{ticket.numberOfReplies}</td>
              <td className="py-2 text-center">{ticket.count}</td>
            </tr>
          ))
          )  : (userActivities.map((ticket) => (
            <tr key={ticket.ticketId}  onClick={() => handleTicketClick(ticket)} className="border-b  border-gray-200 hover:bg-gray-100 cursor-pointer">
              <td className="py-2 text-center">{ticket.ticketId}</td>
              <td className="py-2 text-center">{ticket.subject}</td>
              <td className="py-2 text-center">{ticket.category}</td>
              <td className="py-2 text-center">{ticket.date}</td>
              <td className="py-2 text-center">{ticket.status ? 'Open' : 'Closed'}</td>
              <td className="py-2 text-center">{ticket.assignedUsername}</td>
              <td className="py-2 text-center">{ticket.numberOfReplies}</td>
              <td className="py-2 text-center">{ticket.count}</td>
            </tr>
          )))
          
          
          }
        </tbody>
      </table>
      {(
  (userData?.user?.role > 1 && subAdminActivities.length === 0) ||
  (userData?.user?.role === 0 && userActivities.length === 0)
) && <p className="text-center py-8">No Ticket activities</p>}
              </div>
            </div>
          </div>
            }
            </>

        </div>

      <ManageUserPlans id={id} isOpen={isOpen} user={userData?.user} setIsOpen={setIsOpen}/>
    </>
  );
};

export default AdminDashboardSingleUser;
