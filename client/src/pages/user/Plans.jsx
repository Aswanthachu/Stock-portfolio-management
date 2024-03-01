import React from "react";
import PlansCard from "@/components/PlansCard";
const Plans = () => {
  return (
    <div className="my-16">
      <div className="flex justify-center my-8">
        <h3 className="text-darkGreen font-semibold text-4xl ">
          Select a Plan
        </h3>
      </div>
      <div className="max-w-5xl mx-auto mb-20 pb-16  mt-6 lg:mt-12">
        <div className="space-y-4 sm:space-y-0 grid md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          <PlansCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 64 64"
              >
                <path fill="none" d="M0 0h64v64H0z"></path>
                <path
                  d="M11.14 52.53c4.51 4.79 12.47-1.65 19.38 5.9 4.84 5.3 8.35 7.03 12.45 2.42s4.54-23.29 7.96-30.63c1.71-3.67 17.06-22.54 11.29-28.29-6.27-6.25-24.7 9.56-28.38 11.26-7.35 3.41-26.09 3.85-30.71 7.94-4.62 4.09-2.88 7.59 2.42 12.42 7.58 6.89 1.12 14.85 5.92 19.34"
                  fill="#2cb58c"
                ></path>
                <path
                  d="M37.19 36.29 18.96 54.48c3.68-.11 7.77-.17 11.56 3.96.34.37.66.72.98 1.05l7.07-22.37c.06-.18.06-.37 0-.55s-.19-.32-.35-.42-.35-.14-.54-.11c-.19.02-.36.11-.49.25ZM5.57 33.56c4.15 3.77 4.09 7.87 3.98 11.53L27.79 26.9c.13-.13.22-.3.24-.49a.895.895 0 0 0-.11-.53.85.85 0 0 0-.42-.35.772.772 0 0 0-.54-.01L4.54 32.56c.33.32.68.65 1.05.99h-.02Z"
                  fill="#165b46"
                ></path>
              </svg>
            }
            basic
            title="Free"
            platformFees="₹0"
            monthlyFee="Free for a Limited Period"
            // monthlyFee="₹0"
            features={[
              "1 to 1 Support",
              "Portfolio Analysis",
              "Professional Advice",
            ]}
            disabledFeatures={[
              "Portfolio Management",
              "List of Stocks to Buy",
              "Advanced SIPs",
            ]}
            buttonText="Buy Now"
          />
          <PlansCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 64 64"
              >
                <path fill="none" d="M0 0h64v64H0z"></path>
                <path
                  d="m53.76 34.84 8.78 22.53s1.29.26 1-2.35-4.48-25.63-4.48-25.63l-5.3 5.45Zm-29.82 21c-.48 0-.95.07-1.41.19l-6.09-13.08H11.9l7.28 15.65h9.53c-1.05-1.66-2.79-2.75-4.77-2.75Zm12.1 0c-.48 0-.95.07-1.41.19l-6.09-13.08H24l7.28 15.65h9.53c-1.05-1.66-2.79-2.75-4.77-2.75Z"
                  fill="#304e5a"
                ></path>
                <path
                  d="M59.52 29.85a8.11 8.11 0 0 0-2.27-5.25 8.24 8.24 0 0 0-5.89-2.49c-3.73 0-7.18-1.91-8.96-5.15-1.92-3.49-4.75-6.41-8.2-8.44S26.81 5.41 22.79 5.4C10.63 5.39.6 15.15.43 27.19v.55c.15 14.6 15.08 24.53 28.93 19.49 6.49-2.37 16.14-5.93 20.99-7.97a76.49 76.49 0 0 1 3.8-1.48 8.23 8.23 0 0 0 4-3.09 7.993 7.993 0 0 0 1.38-4.83Z"
                  fill="#619bb4"
                ></path>
              </svg>
            }
            standard
            title="Standard"
            platformFees="₹3789.00"
            monthlyFee="Just ₹1263.0 per month"
            features={[
              "1 to 1 Support",
              "Portfolio Management",
              "List of Stocks to Buy",
              "Advanced SIPs",
              "All Featues Available  in the Free Plan",
            ]}
            buttonText="Buy Now"
          />
          <PlansCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 64 64"
              >
                <path fill="none" d="M0 0h64v64H0z"></path>
                <path
                  d="M22.36 59.75h-8.62c-.64 0-1.27-.19-1.8-.55s-.92-.87-1.13-1.46l-5-14.13h19.63v13.18c0 .39-.08.78-.24 1.14s-.38.69-.67.96c-.29.28-.63.49-1 .64-.37.15-.78.23-1.18.23h.01Zm26.43-15.37v13.15c0 .31-.06.63-.19.92a2.43 2.43 0 0 1-1.35 1.3c-.3.12-.62.18-.95.18h-6c-.69 0-1.36-.19-1.94-.54s-1.05-.86-1.34-1.46l-3.12-6.41"
                  fill="#773a29"
                ></path>
                <path
                  fill="#ee7452"
                  d="M29.55 54.25c16 0 28.96-11.07 28.96-24.74S45.54 4.78 29.55 4.78.58 15.86.58 29.52s12.97 24.74 28.96 24.74h.01Z"
                ></path>
                <path
                  fill="#ee7452"
                  d="M53.96 23.6h7.22c.59 0 1.16.23 1.58.63.42.4.66.95.66 1.52v6.41c0 1.53-.63 3-1.76 4.08a6.12 6.12 0 0 1-4.24 1.69h-3.46V23.6ZM56.5 4.98c-1.49-.63-3.12-.94-4.75-.9s-3.23.43-4.69 1.13c-1.46.7-2.74 1.71-3.75 2.94s-1.72 2.67-2.09 4.2-.38 3.12-.04 4.66 1.03 2.98 2.02 4.23 2.25 2.28 3.7 3c1.45.73 3.04 1.14 4.67 1.21L56.5 4.98Z"
                ></path>
              </svg>
            }
            title="Premium"
            platformFees="₹ 8979 "
            monthlyFee="Just ₹ 499 per month"
            features={[
              "Portfolio Management",
              "List of Stocks to Buy",
              "Advanced SIPs",
              "1 to 1 Support",
              "Additional 6 Month Offer",
              "All Features Available in Free Plan",
            ]}
            buttonText="Buy Now"
          />
        </div>
      </div>
    </div>
  );
};

export default Plans;
