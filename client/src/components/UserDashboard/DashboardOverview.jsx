import { DropdownIcon, PremiumIcon } from "@/assets";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/priceFormat";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import ViewIcon from "./ViewIcon";

export function CardSkeleton({ no }) {
  return (
    <div className="flex flex-col items-center  text-center p-3 md:p-5 bg-lightGrey rounded-xl space-y-2">
      {no > 0 && (
        <Skeleton className="h-4 md:h-5 w-[100px] md:w-[200px] bg-black/10" />
      )}
      {no > 1 && (
        <Skeleton className="h-3 md:h-4 w-[75px] md:w-[150px] bg-black/10" />
      )}
      {no > 2 && (
        <Skeleton className="h-3 md:h-4 w-[75px] md:w-[150px] bg-black/10" />
      )}
    </div>
  );
}

const DashboardOverview = ({ totalGainDetails, isLoading }) => {
  const navigate = useNavigate();

  return (
    <section className=" py-2 md:py-10 flex flex-col">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-14">
        {isLoading ? (
          <div className="flex flex-col w-full lg:w-1/2 gap-3  ">
            <Skeleton className="h-5 w-[100px] bg-black/10 ml-2" />
            <div className="w-full bg-lightGrey  p-6 flex flex-col justify-center items-center text-white font-bold rounded-lg space-y-2">
              <Skeleton className="h-4 w-[250px] bg-black/10" />
              <Skeleton className="h-4 w-[150px] bg-black/10" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full lg:w-1/2 gap-3">
            <p className="text-darkGreen font-bold ml-2">Overview</p>
            <div className="w-full bg-darkGreen p-4 flex flex-col justify-center items-center text-white  rounded-lg">
              <p className="text-lg md:text-xl font-bold">
                {formatPrice({
                  price: totalGainDetails?.totalPortfolio,
                  currencyCode: "INR",
                  locale: "en-IN",
                })}
              </p>
              <p className="text-md md:text-lg font-semibold">
                Current Portfolio Value
              </p>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col w-full lg:w-1/2 gap-3">
            <Skeleton className="w-3/12 h-5 bg-black/10" />
            <div className="w-full bg-lightGrey p-3 flex  justify-between  items-center text-white font-bold rounded-lg">
              <Skeleton className="bg-gray-400/30 p-6 md:p-8  rounded-lg" />
              <div className="w-5/12 p-1 h-full space-y-2 flex flex-col items-center">
                <Skeleton className="w-10/12 h-5 md:h-7 bg-black/10" />
                <Skeleton className="w-11/12 h-4 bg-black/10" />
              </div>
              <Skeleton className=" w-4/12 h-10 bg-black/10" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full lg:w-1/2 gap-3">
            <p className="font-bold ml-2">Current Subscription</p>
            <div className="w-full bg-lightGrey p-3 flex   items-center text-white font-bold rounded-lg">
              <div className="bg-gray-400/40 p-2 py-3 rounded-lg">
                <PremiumIcon />
              </div>
              <div className="flex flex-col text-black grow items-center">
                <p className="text-base md:text-xl">
                  {totalGainDetails?.pln} Plan
                </p>
                <p className="text-xs">
                  Expiring on:{" "}
                  {new Date(totalGainDetails?.End_Date).toLocaleDateString()}
                </p>
              </div>
              <Button
                className="bg-[#353F4E] p-1 md:p-5 text-xs md:text-base"
                onClick={() => navigate("/subscription")}
              >
                View Details
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="pt-10 text-xs md:text-base text-black font-semibold gap-4 md:gap-10 grid grid-cols-2 lg:grid-cols-4 justify-end">
        {isLoading ? (
          <CardSkeleton no={2} />
        ) : (
          <div className="bg-lightGrey p-3 md:p-5  rounded-xl text-center hover:shadow-lg relative">
            <ViewIcon value="Total Investment" />
            <p className="text-sm md:text-lg font-bold">Total Investment</p>
            <p>
              {formatPrice({
                price: totalGainDetails?.sumOfTotalInvestmentINR,
                currencyCode: "INR",
                locale: "en-IN",
              })}
            </p>
          </div>
        )}
        {isLoading ? (
          <CardSkeleton no={3} />
        ) : (
          <div className="bg-lightGrey p-3 md:p-5  rounded-xl text-center flex flex-col items-center hover:shadow-lg relative">
            <ViewIcon value="Capital Gain" />
            <p className="text-sm md:text-lg font-bold">Capital Gain</p>
            <div className="w-fit text-start text-green-500">
              <span className="flex gap-1.5">
                <DropdownIcon
                  className={cn(
                    totalGainDetails?.capitalGain < 0
                      ? "fill-red-600"
                      : "fill-green-500 rotate-180",
                    "w-3"
                  )}
                />
                <p
                  className={cn(
                    totalGainDetails?.capitalGain < 0
                      ? "text-red-600"
                      : "text-green-500"
                  )}
                >
                  {totalGainDetails?.capitalGain}
                </p>
              </span>
              <span className="flex gap-1.5">
                <DropdownIcon
                  className={cn(
                    totalGainDetails?.capitalGain < 0
                      ? "fill-red-600"
                      : "fill-green-500 rotate-180",
                    "w-3"
                  )}
                />
                <p
                  className={cn(
                    totalGainDetails?.capitalGain < 0
                      ? "text-red-600"
                      : "text-green-500"
                  )}
                >
                  {totalGainDetails?.capitalGainPercentage}%
                </p>
              </span>
            </div>
          </div>
        )}
        {isLoading ? (
          <CardSkeleton no={3} />
        ) : (
          <div className="bg-lightGrey p-3 md:p-5  rounded-xl text-center flex flex-col items-center hover:shadow-lg relative">
            <ViewIcon value="Currency Gain" />

            <p className="text-sm md:text-lg font-bold">Currency Gain</p>
            <div className="w-fit text-start">
              <p>
                {formatPrice({
                  price: totalGainDetails?.currencyGain,
                  currencyCode: "INR",
                  locale: "en-IN",
                })}
              </p>
              <span className="flex gap-1.5">
                <DropdownIcon
                  className={cn(
                    totalGainDetails?.capitalGain < 0
                      ? "fill-red-600"
                      : "fill-green-500 rotate-180",
                    "w-3"
                  )}
                />
                <p
                  className={cn(
                    totalGainDetails?.capitalGain < 0
                      ? "text-red-600"
                      : "text-green-500"
                  )}
                >
                  {totalGainDetails?.capitalGainPercentage}%
                </p>
              </span>
            </div>
          </div>
        )}
        {isLoading ? (
          <CardSkeleton no={2} />
        ) : (
          <div className="bg-lightGrey p-3 md:p-5  rounded-xl text-center hover:shadow-lg relative">
            <ViewIcon value="Total Returns" />

            <p className="text-sm md:text-lg font-bold">Total Returns</p>
            <p>
              {formatPrice({
                price:
                  totalGainDetails?.totalPortfolio -
                  totalGainDetails?.sumOfTotalInvestmentINR,
                currencyCode: "INR",
                locale: "en-IN",
              })}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardOverview;
