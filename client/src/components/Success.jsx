import { SuccessIcon } from "@/assets";
import { buttonVariants } from "./ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Success = ({ title, loadingMessage, ButtonName, buttonLink }) => {
  return (
    <main className="w-full h-full flex flex-col justify-center items-center space-y-3 md:space-y-4 lg:space-y-5 px-10 text-center">
      <SuccessIcon />
      <p className="text-lg font-bold">
        {title}
      </p>
      {loadingMessage && <p>{loadingMessage}</p>}
      {ButtonName && (
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "bg-darkGreen text-white"
          )}
          to={buttonLink}
        >
          Home
        </Link>
      )}
    </main>
  );
};

export default Success;
