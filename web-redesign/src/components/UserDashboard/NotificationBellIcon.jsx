import { BellIcon } from "@/assets";
import { NotificationCard } from "..";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import { getNewNotificationQuery } from "@/Redux/hooks/notification";
import { Skeleton } from "../ui/skeleton";

const NotificationBellIcon = ({ className }) => {
  const { data, isLoading } = getNewNotificationQuery();

  return (
    <HoverCard>
      {data?.notifications?.length > 0 && (
        <>
          <HoverCardTrigger asChild className={className}>
            <div className="relative">
              {!isLoading &&
              data?.notifications?.filter((notification) => !notification.read)
                ?.length > 0 ? (
                <div className="absolute top-0 -right-1 bg-red-500 text-white rounded-full md:w-4 md:h-4 lg:w-5 lg:h-5 p-2 flex items-center justify-center text-xs font-medium border-2 border-solid border-white">
                  {
                    data?.notifications?.filter(
                      (notification) => !notification.read
                    )?.length
                  }
                </div>
              ) : (
                <>
                  {isLoading && (
                    <Skeleton className="absolute top-0 -right-1 bg-red-600 text-white rounded-full md:w-4 md:h-4 lg:w-5 lg:h-5 p-2 flex items-center justify-center text-xs font-medium border-2 border-solid border-white" />
                  )}
                </>
              )}
              <BellIcon className="md:w-7 lg:w-8 cursor-pointer" />
            </div>
          </HoverCardTrigger>
          <NotificationCard data={data?.notifications} />
        </>
      )}
    </HoverCard>
  );
};

export default NotificationBellIcon;
