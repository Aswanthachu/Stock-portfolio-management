import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EmailIcon, ForgotPasswordSvg } from "@/assets";
import { InputField, RightSvgBanner } from "@/components";
import Button from '@/components/Button'
import { sendResetPasswordEmail } from "@/Redux/Actions/core";
import { useToast } from "@/components/ToastContext/ToastContext";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {showToast} = useToast()
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const handleChange = (e) => {
    setEmail(e.target.value)
  };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };
  const handleClick = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {

      dispatch(sendResetPasswordEmail({ email, navigate ,showToast}));
    }

  };
  return (
    <>
      <main className="h-full flex flex-col-reverse items-center justify-center md:flex-row  md:bg-lightGreen  lg:bg-white">
        <div className=" w-full lg:w-1/2 h-fit flex flex-col justify-center items-center px-[7%] py-[8%] md:px-[15%] md:py-[15%] lg:px-[8%] lg:py-[6%] ">
          <div className="w-full h-full md:h-fit lg:h-full md:p-10 lg:p-0 rounded-lg space-y-10 lg:space-y-16 flex flex-col justify-center lg:justify-start xl:justify-center bg-white">
            <div>
              <h1 className=" text-2xl md:text-4xl font-bold mb-5">
                Forgot password
              </h1>

              <p className="text-sm md:text-lg font-semibold">
                No worries we send you reset instruction.
              </p>
            </div>
            <div>

              <InputField
                title="Email"
                name="email"
                value={email}
                icon1={<EmailIcon />}
                placeholder="1234@gmail.com"
                type="mail"
                onChange={handleChange}
              />
              {emailError && <p className="text-red-500 text-sm ">{emailError}</p>}

            </div>

            <Button text={'Reset password'} onClick={handleClick}
              className="w-full bg-darkGreen text-white py-3 md:py-6 hover:bg-darkGreen hover:text-white rounded-xl text-sm md:text-lg"
            />

          </div>
        </div>
        <RightSvgBanner icon={ForgotPasswordSvg} />
      </main>

    </>
  );
};

export default ForgotPassword;
