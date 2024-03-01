import Payment from "@/assets/images/payment.jpg";
import Warning from "@/assets/images/Warning.png";
import { Button} from "../ui/button";
import { Close } from "@/assets";
import { SubscribeButton } from "..";

const GetSubscribe = ({ status, setIsOpen }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full mx-2 md:mx-0 md:w-1/3 md:h-fit relative">
        <div className="bg-[#FB9830] p-3 rounded-2xl w-fit absolute left-5 -top-6 md:-top-8">
          <img src={Warning} alt="warning" className=" h-7 w-7 md:h-10 md:w-10" />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full p-0 absolute right-5"
          onClick={() => setIsOpen(false)}
        >
          <Close className="w-4 h-4 fill-iconColor text-gray-500 m-0" />
        </Button>
        <img src={Payment} alt="payment" className="w-full" />
        <div className="w-2/3 mx-auto text-center mt-3 space-y-3">
          <h1 className="text-2xl text-darkGreen font-semibold">
            {status === "notSubscribed"
              ? "Subscription Required !"
              : "Stay with us !"}
          </h1>
          <p className="text-sm font-semibold">
            {status === "notSubscribed"
              ? "Please take any subscription for accessing our premium features."
              : "Renew your subscription to get access our premium features."}
          </p>
        </div>
        <div className="w-full flex justify-end mt-8">
          <SubscribeButton />
        </div>
      </div>
    </div>
  );
};

export default GetSubscribe;
