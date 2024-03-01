import React, { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { TabSelect } from "..";
import { Skeleton } from "../ui/skeleton";
import { useSelector } from "react-redux";

const TabButton = ({ icon, title, selectedTab, setSelectedTab }) => {
  const Icon = React.lazy(() => import(`../../assets/svgs/${icon}.jsx`));

  const handleSelect = () => {
    setSelectedTab(title);
  };

  return (
    <Button
      className={cn(
        selectedTab === title
          ? "bg-darkGreen hover:bg-darkGreen text-white hover:text-white"
          : "bg-lightGrey hover:bg-lightGrey text-black hover:text-black",
        " w-full grow md:w-1/3 gap-4 md:py-6 font-semibold text-lg"
      )}
      onClick={handleSelect}
    >
      <Suspense>
        <Icon
          className={cn(
            selectedTab === title ? "fill-white" : "fill-black",
            "w-6"
          )}
        />
      </Suspense>
      <p>{title}</p>
    </Button>
  );
};

const TabSkelton = () => {
  return (
    <Skeleton className="w-full grow md:w-1/3 gap-4 md:py-2 font-semibold text-lg bg-lightGrey flex items-center justify-center">
      <div className="w-2/3 h-8 flex gap-2">
        <Skeleton className="w-8 h-full bg-black/10"/>
        <Skeleton className=" grow h-full bg-black/10" />
      </div>
    </Skeleton>
  );
};

const Tabs = ({ selectedTab, setSelectedTab, isLoading }) => {

  const portfolios=useSelector(state=>state.portfolio?.portfolios);

  return (
    <div className="pt-8 lg:py-10">
      <div className="hidden md:flex gap-16 ">
        {!isLoading || portfolios.length > 0 ? (
          <>
            <TabButton
              title="Overview"
              icon="OverviewIcon"
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <TabButton
              title="Stock List"
              icon="StocklistIcon"
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <TabButton
              title="Settings"
              icon="SettingsIcon"
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </>
        ) : (
          <>
            <TabSkelton />
            <TabSkelton />
            <TabSkelton />
          </>
        )}
      </div>
      <TabSelect selectedTab={selectedTab} setSelectedTab={setSelectedTab} isLoading={isLoading} portfolios={portfolios}/>
    </div>
  );
};

export default Tabs;
