import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

const CustomSelectItem = ({ value, icon, selectedTab }) => {
  const Icon = React.lazy(() => import(`../../assets/svgs/${icon}.jsx`));
  return (
    <SelectItem
      value={value}
      className={cn(
        selectedTab === value ? "hidden" : "flex",
        "border  p-4 rounded-md px-6 my-2 bg-white shadow-md font-semibold"
      )}
    >
      <Suspense>
        <div className="flex gap-4 items-center">
          <Icon
            className={cn(
              selectedTab === value ? "fill-white" : "fill-black",
              "w-6"
            )}
          />
          <p>{value}</p>
        </div>
      </Suspense>
    </SelectItem>
  );
};

const TabSelect = ({ selectedTab, setSelectedTab, isLoading,portfolios }) => {
  return (
    <div className="md:hidden w-full">
      {!isLoading || portfolios?.length > 0 ? (
        <Select
          onValueChange={(e) => setSelectedTab(e)}
          defaultValue={"Overview"}
        >
          <SelectTrigger
            className="border-none text-sm lg:text-base font-semibold bg-darkGreen text-white py-6 px-6"
            textColor="white"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="shadow-none border-none bg-transparent">
            <CustomSelectItem
              value="Overview"
              icon="OverviewIcon"
              selectedTab={selectedTab}
            />
            <CustomSelectItem
              value="Stock List"
              icon="StocklistIcon"
              selectedTab={selectedTab}
            />
            <CustomSelectItem
              value="Settings"
              icon="SettingsIcon"
              selectedTab={selectedTab}
            />
          </SelectContent>
        </Select>
      ) : (
        <Skeleton className="border px-5 py-3 rounded-md  my-2 bg-white shadow-md font-semibold">
          <div className="w-2/3 h-8 flex gap-2 items-start">
            <Skeleton className="w-8 h-full bg-black/10" />
            <Skeleton className=" grow h-full bg-black/10" />
          </div>
        </Skeleton>
      )}
    </div>
  );
};

export default TabSelect;
