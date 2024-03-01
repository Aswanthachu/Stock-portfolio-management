import { PlusIcon } from "@/assets";
import { NotificationBellIcon } from "..";
import { Button } from "../ui/button";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { DropdownIcon } from "@/assets";
import { Skeleton } from "../ui/skeleton";

const TopSection = ({
  data: portfolios,
  selectedPortfolio,
  setSelectedPortfolio,
  isLoading,
  setIsOpen,
  planStatus
}) => {
  return (
    <div className="w-full flex justify-between items-center border-2 border-darkGreen p-2 md:p-5 rounded-xl text-darkIcon">
      {portfolios?.length !== 0 && planStatus === "active" ? (
        <div className=" w-36 md:w-48  py-1 rounded-lg bg-gray-200">
          <Listbox
            value={selectedPortfolio}
            onChange={(e) => setSelectedPortfolio(e)}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg  py-2 pl-3 pr-10 text-left  border-gray-400 sm:text-sm bg-gray-200">
                <span className="block truncate text-base font-semibold">
                  {selectedPortfolio?.portfolio_name}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <DropdownIcon className="h-3 w-3 fill-black opacity-70" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute my-2 max-h-44 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {portfolios?.map((portfolio, portfolioIdx) => (
                    <Listbox.Option
                      key={portfolioIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={portfolio}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {portfolio.portfolio_name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      ) : portfolios.length === 0 && !isLoading || planStatus !== "active" ? (
        <p className=" text-base md:text-lg font-semibold">Your Portfolios</p>
      ) : (
        <Skeleton className="w-36 md:w-48 h-10 bg-black/10" />
      )}

      <div className="flex items-center md:gap-5 lg:gap-8">
        <NotificationBellIcon className="hidden md:block" />
        {!isLoading || portfolios?.length !== 0 ? (
          <Button
            className="bg-white text-darkGreen hover:bg-white hover:text-darkGreen flex gap-2 border-2 border-darkGreen font-bold"
            onClick={() => setIsOpen(true)}
          >
            <p>Add New </p>
            <span className="hidden md:block">Portfolio</span>
            <PlusIcon className="w-3" />
          </Button>
        ) : (
          <Skeleton className="w-2/12 min-w-[200px] h-10 bg-black/10 ml-auto" />
        )}
      </div>
    </div>
  );
};

export default TopSection;
