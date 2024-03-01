import { InfoIcon } from "@/assets";
import { portfolioInfoData } from "@/lib/constants/portfolioInformations";
import { useState } from "react";
import {
  TERipple,
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
} from "tw-elements-react";
import { Button } from "../ui/button";

export default function ViewIcon({value}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="space-x-2">
        <TERipple rippleColor="white">
          <Button
            type="button"
            className="absolute w-fit h-fit top-10 -right-16 md:top-1 md:-right-28 p-0 bg-white hover:bg-white"
            onClick={() => setOpen(true)}
          >
            <InfoIcon className="w-4 md:w-5 font-bold  fill-[#989899] hover:scale-105  hover:cursor-pointer h-fit" />
          </Button>
        </TERipple>
      </div>

      <TEModal show={open} setShow={setOpen} scrollable >
        <TEModalDialog centered className=" h-full  md:h-[90%] md:min-w-[70%] lg:min-w-[50%]">
          <TEModalContent>
            <TEModalHeader>
              {/* <!--Modal title--> */}
              <h5
                className=" leading-normal dark:text-neutral-200 text-2xl font-semibold text-darkGreen"
                id="ModalScrollableLabel"
              >
               {value}
              </h5>
              {/* <!--Close button--> */}
              <Button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none p-0 bg-white hover:bg-white text-black hover:text-black"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </TEModalHeader>
            {/* <!--Modal body--> */}
            <TEModalBody>
              <div className="w-full h-full flex flex-col text-start ">
                <div className="flex  gap-1 items-center ">
                  <h1 className="text-darkGreen">How it is calculated</h1>
                </div>

                <div dangerouslySetInnerHTML={{ __html: portfolioInfoData[value].description }} />
              </div>
            </TEModalBody>
            <TEModalFooter>
              <TERipple rippleColor="light">
                <Button
                  type="button"
                  className="text-white bg-darkGreen hover:bg-darkGreen rounded-full px-4 py-2 font-semibold "
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </TERipple>
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}
