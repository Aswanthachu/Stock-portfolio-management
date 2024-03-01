import Crown from "@/assets/images/crown.png";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";


const SubscribeButton = ({className}) => {
  return (
    <Link
      className={cn(
        buttonVariants({
          variant: "outline",
        }),
        "bg-darkGreen hover:bg-darkGreen text-white hover:text-white  gap-2",
        className
      )}
      to="/plans"
    >
      <p className="text-sm ">Subscribe</p>
      <img src={Crown} alt="crown" className="w-4" />
    </Link>
  );
};

export default SubscribeButton;
