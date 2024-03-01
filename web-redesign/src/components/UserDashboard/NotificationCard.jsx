import { HoverCardContent } from "../ui/hover-card";
import { Button } from "../ui/button";
import { EyeIcon, HomeIcon } from "@/assets";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { convert } from "html-to-text";
import { useDispatch } from "react-redux";
import {
  readAllNotifications,
  handleSingleClose,
  updateSingleRead,
} from "@/Redux/Actions/notification";
import { XMarkIcon, ClockIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import notification, {
  updateSingleClose,
  updateRaed,
  updateReadAll,
} from "@/Redux/Features/notification";

const NotificationCountButton = ({ count, selected, title }) => {
  return (
    <div
      className={cn(
        selected === title ? "bg-darkIcon" : "bg-iconColor",
        " text-white rounded-md font-bold px-2 py-1 text-xs min-w-[35px]"
      )}
    >
      {count}
    </div>
  );
};

const NotificationButton = ({ title, count, selected, setSelected }) => {
  return (
    <Button
      className={cn(
        selected === title
          ? "hover:text-darkIcon text-darkIcon "
          : "text-iconColor",
        "bg-inherit hover:bg-inherit font-bold gap-2 px-0"
      )}
      onClick={() => setSelected(title)}
    >
      <p className="text-base">{title}</p>
      <NotificationCountButton
        count={count}
        selected={selected}
        title={title}
      />
    </Button>
  );
};

const NotificationMessage = ({ heading, message, notification }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(handleSingleClose(notification?._id));
    dispatch(updateSingleClose(notification?._id));
  };

  const handleSingleRead = () => {
    dispatch(updateSingleRead(notification?._id));
    dispatch(updateRaed(notification?._id));
  };

  return (
    <>
      <div className="flex py-4  gap-3 font-semibold h-full ">
        <span className="p-2 bg-gray-400/40 rounded-lg w-fit h-fit">
          <HomeIcon className="w-5" />
        </span>
        <div>
          <p className="text-md">{notification?.heading || heading}</p>
          <p className="text-xs">{convert(notification?.message) || message}</p>
          {notification && (
            <div className="flex justify-between items-center w-full grow gap-10 mt-4 -mb-3 ">
              <div className="flex gap-1 items-center">
                <ClockIcon className="w-3 text-gray-500/50" />
                <p className="text-gray-500 text-[10px]">
                  {format(new Date(notification?.updatedAt), "PPP")}
                </p>
              </div>
              {!notification?.read && (
                <Button
                  className="bg-white hover:bg-white text-darkGreen hover:text-darkGreen text-xs p-0 m-0 h-fit hover:scale-105 gap-1"
                  onClick={handleSingleRead}
                >
                  <EyeIcon className="w-4 fill-violet-700" />
                  <p className="text-violet-700">mark as read</p>
                </Button>
              )}
            </div>
          )}
        </div>
        <div
          className="flex items-center ml-auto hover:cursor-pointer"
          onClick={handleClose}
        >
          <span className="mr-3 p-1 bg-gray-300/60 rounded-lg ml-auto flex items-center">
            <XMarkIcon className="w-4 text-gray-600" />
          </span>
        </div>
      </div>
      <hr className="h-[2px] bg-gray-400 " />
    </>
  );
};

const NotificationCard = ({ data: portfolioNotifications }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("All");

  const handleReadAll = () => {
    dispatch(readAllNotifications());
    dispatch(updateReadAll());
  };

  return (
    <HoverCardContent className="w-[450px] max-h-[340px]  p-5 mt-6 shadow-2xl relative">
      <span className="-top-[4.5%] left-[46.5%] bg-white content-none w-[2rem] h-[2rem] absolute -z-1 rotate-[45deg] border-l border-t shadow-2xl rounded-sm" />
      <div className="flex justify-between font-semibold">
        <p className="">Notifications</p>
        <p
          className="text-xs underline hover:cursor-pointer hover:scale-105 text-darkGreen"
          onClick={handleReadAll}
        >
          Mark all as read
        </p>
      </div>
      <div className="mt-5 space-x-8">
        {/* <NotificationButton
          title="All"
          count={99}
          selected={selected}
          setSelected={setSelected}
        /> */}
        <NotificationButton
          title="All"
          count={portfolioNotifications?.filter(notification=> !notification.read )?.length}
          selected={selected}
          setSelected={setSelected}
        />
        {/* <NotificationButton
          title="Tickets"
          count={41}
          selected={selected}
          setSelected={setSelected}
        /> */}
      </div>
      <hr className="h-[2px] bg-gray-400" />
      <div className="overflow-y-auto max-h-[230px]">
        {portfolioNotifications && selected === "All" ? (
          portfolioNotifications.map((notification, index) => (
            <NotificationMessage key={index} notification={notification} />
          ))
        ) : (
          <>
            <NotificationMessage
              heading="Notification dummy text"
              message="dummy paragraph"
            />
            <NotificationMessage
              heading="Notification dummy text"
              message="dummy paragraph"
            />
            <NotificationMessage
              heading="Notification dummy text"
              message="dummy paragraph"
            />
            <NotificationMessage
              heading="Notification dummy text"
              message="dummy paragraph"
            />
            <NotificationMessage
              heading="Notification dummy text"
              message="dummy paragraph"
            />
            <NotificationMessage
              heading="Notification dummy text"
              message="dummy paragraph"
            />
          </>
        )}
      </div>
    </HoverCardContent>
  );
};

export default NotificationCard;
