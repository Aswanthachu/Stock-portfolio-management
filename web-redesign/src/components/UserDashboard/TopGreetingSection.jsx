import { buttonVariants } from "../ui/button";
import { NotificationBellIcon } from "..";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TopGreetingSection = () => {
  const [greeting, setGreeting] = useState();

  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const currentHour = new Date(currentTime).getHours();

  useEffect(() => {
    let greetingMessage = "";
    if (currentHour >= 4 && currentHour <= 12) {
      greetingMessage = "Good Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      greetingMessage = "Good Afternoon";
    } else {
      greetingMessage = "Good Evening";
    }

    setGreeting(greetingMessage);
  }, [currentHour]);

  return (
    <div className="w-full  hidden md:flex justify-between items-center border-2 border-darkGreen p-5 rounded-xl">
      <p className="text-lg md:font-bold">
        {greeting}, {JSON.parse(localStorage.getItem("user")).username}
      </p>
      <div className="flex items-center md:gap-5 lg:gap-8">
        <NotificationBellIcon />
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "bg-darkGreen text-white hover:bg-darkGreen hover:text-white"
          )}
          to="/account-settings"
        >
          View details
        </Link>
      </div>
    </div>
  );
};

export default TopGreetingSection;
