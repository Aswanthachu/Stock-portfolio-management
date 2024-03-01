import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { getAllUsers, getAllInvestmentVerificationDetails,setActiveUsers, getNotificationEnabledUsers} from "@/Redux/Actions/admin";
import Table from "@/components/Table";
import Button from "@/components/Button";
import socket from "@/Redux/Api/socket";

const AdminDashboardUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [showSubAdmins, setShowSubAdmins] = useState(false);
  const [verificationData, setVerificationData] = useState([]);
  const [loadingStatus, seLoadingStatus] = useState(false);

  const userData = useSelector((state) => state?.admin?.users);
  const user =JSON.parse(localStorage.getItem("user"))
  const investmentVerificationDetails = useSelector((state) => state.admin.investmentVerificationDetails);
  const notificationEnabledUsers = useSelector((state) => state.admin.notificationEnabledUsers);
  const loading = useSelector((state) => state.admin.loading);
  const activeUsers = useSelector((state)=>state?.admin?.activeUsers)
  useEffect(() => {
    seLoadingStatus(loading);
  }, [loading]);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllInvestmentVerificationDetails());
    dispatch(getNotificationEnabledUsers());
  }, []);

  useEffect(() => {
    socket.emit('getOnlineUsers');
    return () => {
      socket.off('activeUsers');
    }
  }, []);
  
  useEffect(() => {
    socket.on('activeUsers', (activeUsers) => {
      dispatch(setActiveUsers(activeUsers));
    });
  
    return () => {
      socket.off('activeUsers');
    }
  }, []);
  useEffect(() => {
    setUserDetails(
      showSubAdmins
        ? userData?.subAdmin
        : subscribed
        ? userData?.users?.filter(
            (data) => data.subscriptions.some((sub) => sub.status === "active")
          )
        : userData?.users
    );
  }, [subscribed, showSubAdmins, userData,activeUsers]);

  useEffect(() => {
    setVerificationData(investmentVerificationDetails);
  }, [investmentVerificationDetails]);
  const isUserOnline = (userId) => {
    return activeUsers.some((user) => user.userId === userId);
  };
  const isNotificationEnabled = (userId) => {
    return notificationEnabledUsers.some((user) => user.userId === userId);
  };
  const getSubscriptionStatus = (subscriptions) => {
    if (subscriptions?.length === 0) {
      return "Not Subscribed";
    } else if (subscriptions?.some((sub) => sub.status === "active")) {
      return "Active";
    } else if (subscriptions?.some((sub) => sub.status === "cancelled")) {
      return "Cancelled";
    } else {
      return "Expired";
    }
  };
  const subAdminHead = [
    {
      title: "No",
      render: (rowData,index) => {
        return (
         <p>{index+1}</p>
        );
      },
    },
    {
      title: "UserName",
      name:'username',
      render: (rowData) => {
        return (
          <Link
            to={`/${user?.role === 1 ? "admin" : "sub-admin"}/user/${rowData._id}`}
            className="lg:flex  lg:items-center w-fit text-darkGreen underline cursor-pointer"
          >
            <img
              src='/assets/avatar.jpg'
              alt="avatar"
              className="rounded-full w-12 h-12 md:w-16 md:h-16 "
            />
            {rowData.username}
          </Link>
        );
      },
    },
    {
      title: "Email",
      name:'email',
      render: (rowData) => {
        return (
          <span className="underline cursor-pointer">{rowData.email}</span>
        );
      },
    },
    {
      title: "Last Seen",
      render: (rowData) => {
        return (
          <span className="underline cursor-pointer text-base text-slate-600">
            {isUserOnline(rowData._id)? (
                <span className="text-green-500">Online</span>
              ): new Date(rowData?.lastSeen || rowData?.lastLogin?.timestamp).toLocaleString("en-GB")}
          </span>
        );
      },
    },

    {
      title: "Role",
      render: (rowData) => {
        return <span>{rowData.role === 2 ? "Financial" : "Technical"}</span>;
      },
    },

    {
      title: "Notification",
      render: (rowData) => {
        return (
            <span className=" px-6 text- rounded-lg">{isNotificationEnabled(rowData._id)?(
              <span className="text-green-500 font-semibold ">Enabled</span>
            ): <span>Disable</span>}</span>
         
        );
      },
    },
  ];

  const userDataHead = [
    {
      title: "No",
      render: (rowData,index) => {
        return (
         <p>{index+1}</p>
        );
      },
    },
    {
      title: "UserName",
      name:'username',
      render: (rowData) => {
        return (
          <Link
            to={`/${user?.role === 1 ? "admin" : "sub-admin"}/user/${rowData._id}`}
            className="lg:flex  lg:items-center w-fit text-darkGreen underline cursor-pointer"
          >
            <img
              src='/assets/avatar.jpg'
              alt="avatar"
              className="rounded-full w-12 h-12 md:w-16 md:h-16 "
            />
            {rowData.username}{" "}
            {rowData.unverifiedCount > 0 && (
              <span className="bg-darkGreen text-xs no-underline rounded-3xl  px-1 w-fit ml-2 text-white">
                {" "}
                New {rowData.unverifiedCount}
              </span>
            )}
          </Link>
        );
      },
    },
    {
      title: "Email",
      name:'email',
      render: (rowData) => {
        return (
          <span className="underline cursor-pointer">{rowData.email}</span>
        );
      },
    },
    {
      title: "Last Seen",
      render: (rowData) => {
        return (
          <span className=" cursor-pointer text-base text-slate-600">
           {isUserOnline(rowData._id)? (
                <span className="text-green-500 font-semibold ">Online</span>
              ): new Date(rowData?.lastSeen || rowData?.lastLogin?.timestamp).toLocaleString("en-GB")}
          </span>
        );
      },
    },
    {
      title: "Plan",
      name:'subscriptions',
      render: (rowData) => {
        return (
          <span
            className={`${
              getSubscriptionStatus(rowData?.subscriptions) !== "Active" && "text-red-500"
            }`}
          >
            {getSubscriptionStatus(rowData?.subscriptions)}
          </span>
        );
      },
    },

    {
      title: "Notification",
      render: (rowData) => {
        return (
            <span className=" px-6 text- rounded-lg">{isNotificationEnabled(rowData._id)?(
              <span className="text-green-500 font-semibold ">Enabled</span>
            ): <span>Disable</span>}</span>
         
        );
      },
    },
  ];

  return (
    <>
      {!loadingStatus ? (
        <div className="p-2  md:p-6">
          <div className="w-full flex justify-end my-6 pr-8">
            <Menu>
              <div className="relative inline-block w-fit">
                <Menu.Button className="inline-flex  justify-center rounded-md">
                  {verificationData?.length > 0 && (
                    <span className="absolute top-0 right-0 lg:top-[-10px] lg:right-[-4px] inline-flex items-center justify-center w-4 h-4  lg:w-6 lg:h-6 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {verificationData?.length}
                    </span>
                  )}
                  <svg
                    width="30"
                    height="34"
                    viewBox="0 0 30 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8"
                  >
                    <path
                      d="M29.4182 23.8704L26.177 17.8865V11.6562C26.177 5.43575 21.1163 0.375 14.8958 0.375C8.6753 0.375 3.61454 5.43575 3.61454 11.6562V17.8865L0.373263 23.8703C0.226274 24.1416 0.152294 24.4465 0.158572 24.755C0.16485 25.0635 0.251171 25.3651 0.409076 25.6302C0.566981 25.8954 0.791054 26.1149 1.05934 26.2674C1.32762 26.4198 1.63092 26.5 1.9395 26.5H8.39171C8.37371 26.6974 8.36462 26.8955 8.36447 27.0938C8.36447 28.8259 9.05258 30.4872 10.2774 31.712C11.5023 32.9369 13.1635 33.625 14.8957 33.625C16.6279 33.625 18.2892 32.9369 19.514 31.712C20.7389 30.4872 21.427 28.8259 21.427 27.0938C21.427 26.8934 21.4174 26.6956 21.3997 26.5H27.8519C28.1605 26.5 28.4638 26.4198 28.732 26.2673C29.0002 26.1148 29.2243 25.8953 29.3821 25.6302C29.54 25.365 29.6263 25.0635 29.6326 24.755C29.6389 24.4465 29.5649 24.1417 29.418 23.8704H29.4182ZM19.052 27.0938C19.0525 27.6649 18.9352 28.2301 18.7076 28.7539C18.4799 29.2777 18.1467 29.749 17.7288 30.1383C17.3108 30.5276 16.8171 30.8266 16.2785 31.0166C15.7399 31.2067 15.1678 31.2836 14.5981 31.2427C14.0284 31.2018 13.4733 31.0439 12.9673 30.7789C12.4614 30.5139 12.0154 30.1474 11.6574 29.7024C11.2994 29.2574 11.0369 28.7433 10.8864 28.1923C10.7359 27.6413 10.7006 27.0652 10.7827 26.5H19.0089C19.0374 26.6966 19.0518 26.8951 19.052 27.0938ZM2.93633 24.125L5.98955 18.4885V11.6562C5.98955 9.29417 6.92788 7.02883 8.59813 5.35858C10.2684 3.68833 12.5337 2.75 14.8958 2.75C17.2579 2.75 19.5232 3.68833 21.1935 5.35858C22.8637 7.02883 23.802 9.29417 23.802 11.6562V18.4885L26.8551 24.125H2.93633Z"
                      fill="#0055A4"
                    />
                  </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-20 mt-2 w-fit origin-top- divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-1 py-1 ">
                    {verificationData?.map((details) => (
                      <Menu.Item key={details.userId}>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-fit items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() =>
                              navigate(
                                `/${user?.role === 1 ? "admin" :"sub-admin"}/user/${details?.userId?._id}`
                              )
                            }
                          >
                            {details?.userId?.email}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className="flex">
            <h3
              className={`font-sans font-medium text-2xl lg:text-4xl text-black lg:ml-10 cursor-pointer ${
                !showSubAdmins && "border-darkGreen border-b-4"
              } `}
              onClick={() => {
                setShowSubAdmins(false);
              }}
            >
              Users
            </h3>
              <h3
                className={`font-sans font-medium text-2xl lg:text-4xl text-black lg:ml-10 cursor-pointer ${
                  showSubAdmins && "border-darkGreen border-b-4"
                }`}
                onClick={() => {
                  setShowSubAdmins(true);
                }}
              >
                Sub Admins
              </h3>
          </div>
          <div>
            <div className="flex  lg:justify-end mt-1  items-center md:mx-3 bg-gray-50">
              <div className="lg:order-2">
                <Button
                  icon={
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24 24L18.8057 18.7964M21.6842 11.8421C21.6842 14.4524 20.6473 16.9558 18.8015 18.8015C16.9558 20.6473 14.4524 21.6842 11.8421 21.6842C9.23182 21.6842 6.72844 20.6473 4.88269 18.8015C3.03693 16.9558 2 14.4524 2 11.8421C2 9.23182 3.03693 6.72844 4.88269 4.88269C6.72844 3.03693 9.23182 2 11.8421 2C14.4524 2 16.9558 3.03693 18.8015 4.88269C20.6473 6.72844 21.6842 9.23182 21.6842 11.8421V11.8421Z"
                        stroke="white"
                        strokeWidth="2.73684"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                  className="bg-darkGreen p-3 "
                />
              </div>
              <div className="lg:order-1">
                <input
                  type="text"
                  name="search"
                  placeholder={
                    showSubAdmins
                      ? "Search for Sub Admins..."
                      : "Search for Users..."
                  }
                  id=""
                  className="p-2 text-2xl bg-gray-50 md:w-96 "
                  onChange={(e) => {
                    setQuery(e.target.value.toLowerCase());
                  }}
                />
              </div>
            </div>

            {/* all user /  subscribed user filter */}

            {!showSubAdmins && (
              <div className="flex justify-center gap-10 my-2 font-bold">
                <Button
                  text="All Users"
                  onClick={() => {
                    setSubscribed(false);
                  }}
                  className={`${!subscribed && "border-darkGreen border-b-4"} `}
                />
                <Button
                  text="Subscribed Users"
                  onClick={() => {
                    setSubscribed(true);
                  }}
                  className={`${subscribed && "border-darkGreen border-b-4"} `}
                />
              </div>
            )}

            {/* all user /  subscribed user filter */}

            <Table
              tableHead={showSubAdmins ? subAdminHead : userDataHead}
              tableData={userDetails?.filter((user) =>
                user.username.toLowerCase().includes(query)
              )}
            />
            {userDetails?.filter((user) =>
              user.username.toLowerCase().includes(query)
            )?.length === 0 && (
              <div className=" flex items-center justify-center ">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
                  <h1 className="text-3xl  text-center">
                    No {showSubAdmins ? "Subadmins" : "Users"} found
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
        // <Loading />
      )}
    </>
  );
};

export default AdminDashboardUsers;
