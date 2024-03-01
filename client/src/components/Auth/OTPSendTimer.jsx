import { useEffect } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { sendEmailOtp } from "@/Redux/Actions/core";
import { useNavigate } from "react-router-dom";

function OTPSendTimer({ timer, setTimer }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authData = JSON.parse(localStorage.getItem("authData"));

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          localStorage.setItem("timer", newTimer.toString());
          return newTimer;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const resetTimer = () => {
    if (authData?.expiresAt && authData?.expiresAt < new Date().getTime()) {
      localStorage.removeItem("authData");
      navigate("/signup");
      
    }
    {
      setTimer(120);
      localStorage.setItem("timer", "120");
      dispatch(sendEmailOtp({ email: authData?.authData?.email }));
    }
  };

  const minutes = Math.floor(timer / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timer % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center text-xl">
      <p className="text-sm md:text-base text-iconColor">
        {minutes} : {seconds}
      </p>
      <Button
        onClick={resetTimer}
        className={cn(
          timer === 0
            ? "text-black hover:text-black"
            : "text-iconColor hover:text-iconColor ",
          "bg-transparent  hover:bg-transparent "
        )}
        disabled={!timer === 0}
      >
        Resend OTP
      </Button>
    </div>
  );
}

export default OTPSendTimer;
