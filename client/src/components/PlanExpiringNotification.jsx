import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { selectDataByName } from "@/Redux/Features/dashboard";
import { useSelector } from "react-redux";
import PlanWarning from "@/assets/images/PlanWarning.png";

const PlanExpiringNotification = () => {
  const [isExpiringInOneWeek, setIsExpiringInOneWeek] = useState(false);
  const [remainingDays, setRemainingDays] = useState();

  const data = useSelector((state) =>
    selectDataByName(state, "getDashboardTable")
  );

  useEffect(() => {
    if (data?.totalGainDetails) {
      const today = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      const planExpirationDate = new Date(data?.totalGainDetails?.End_Date);

      setRemainingDays(
        Math.ceil((planExpirationDate - today) / (1000 * 60 * 60 * 24))
      );
      setIsExpiringInOneWeek(planExpirationDate <= oneWeekFromNow);
    }
  }, [data]);

  return (
    <>
      {isExpiringInOneWeek && (
        <div className="w-full -mb-5">
          <div
            className="flex px-5 items-center  w-full mb-4 text-xs md:text-sm  border border-red-300  bg-red-50 py-3.5 rounded-b-lg"
            role="alert"
          >
            <img src={PlanWarning} alt="warning" className=" h-10 w-10 md:h-5 md:w-5 mr-2" />
            <p className="font-semibold">
              Your plan is expiring in {remainingDays}{" "}
              {remainingDays === 1 ? "day" : "days"}. Please{" "}
              <Link
                to={`/plans`}
                className="hover:text-darkBlue cursor-pointer  font-medium"
              >
                <span className="p-1 rounded-md underline text-black font-bold inline-block mt-1 md:mt-0">Renew Subscription</span>
              </Link>
              .
            </p>
          </div>
        </div>
      )}
      {/* {isExpiringInOneWeek && (
        <div className="w-full -mt-5">
      <div
        className="flex px-2 py-1 w-full mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
        role="alert"
      >
        <svg
          aria-hidden="true"
          className="flex-shrink-0 inline w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          ></path>
        </svg>
        <p>
          Your plan is expiring in {remainingDays}{' '}
          {remainingDays === 1 ? 'day' : 'days'}. Please{' '}
          <Link to={`/plans`}
            className="hover:text-darkBlue hover:underline cursor-pointer underline font-medium"
          >
            subscribe
          </Link>
          .
        </p>
      
      </div>
    </div>
      )} */}
    </>
  );
};

export default PlanExpiringNotification;
