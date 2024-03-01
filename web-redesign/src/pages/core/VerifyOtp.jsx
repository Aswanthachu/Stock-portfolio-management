import { VerifyOtpSvg } from "@/assets";
import { Loading, OtpSection, RightSvgBanner} from "@/components";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();

  const authData = JSON.parse(localStorage.getItem("authData"));

  useEffect(() => {
    if (authData?.expiresAt && authData?.expiresAt < new Date().getTime()) {
      localStorage.removeItem("authData");
    }
    if (!authData) {
      navigate("/signup");
    }
  }, []);

  return (
    <>
      {/* {authData && !loading ? ( */}
        <main className="h-full flex flex-col-reverse items-center justify-center md:flex-row ">
          <div className=" w-full bg-white md:bg-lightGreen lg:bg-white  lg:w-1/2 h-fit md:h-full flex flex-col justify-center items-center px-[7%] py-[8%] md:px-[15%] md:py-[15%] lg:px-[8%] lg:py-[6%]">
            <div className="w-full h-fit bg-white md:p-10 lg:p-0 rounded-md space-y-4 md:space-y-10 flex flex-col justify-center lg:justify-start xl:justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">
                Enter Otp
              </h1>
              <div>
                <p className=" text-sm md:text-lg font-semibold">
                  An 6 digit code has been sent to
                </p>
                <p className="text-sm md:text-lg font-semibold">
                  {authData?.authData?.email}
                </p>
              </div>
              <OtpSection />
            </div>
          </div>
          <RightSvgBanner icon={VerifyOtpSvg} />
        </main>
      {/* ) : (
        <Loading />
      )} */}
    </>
  );
};

export default VerifyOtp;
