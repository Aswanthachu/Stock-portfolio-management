import { NoData } from "@/assets";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { SubscribeButton } from "..";

const RButton = ({ className, setIsOpen }) => {
  return (
    <Button
      className={cn(
        className,
        "bg-darkGreen text-white hover:bg-darkGreen hover:text-white"
      )}
      onClick={() => setIsOpen(true)}
    >
      Create new portfolio
    </Button>
  );
};

const NoPortfolioData = ({ setIsOpen, planStatus }) => {
  return (
    <section className="w-full flex flex-col lg:flex-row justify-center items-center  gap-8 lg:gap-10 h-[400px] md:min-h-[700px] lg:min-h-[500px]">
      <div className="text-center space-y-5">
        <p className="text-darkGreen font-semibold text-2xl">
          Can’t load any data
        </p>
        <p className="font-semibold">
          {planStatus === "expired"
            ? "Please renew your subscription."
            : "Please create a new portfolio first."}
        </p>
        {planStatus !== "expired" ? (
          <RButton className="hidden lg:block mx-auto" setIsOpen={setIsOpen} />
        ) : (
          <SubscribeButton className="hidden lg:flex"/>
        )}
      </div>
      <NoData className="w-[200px] md:w-[400px]" />
      {planStatus !== "expired" ? (
        <RButton className="block lg:hidden" setIsOpen={setIsOpen} />
      ) : (
        <SubscribeButton className="flex lg:hidden"/>
      )}
    </section>
  );
};

export default NoPortfolioData;
