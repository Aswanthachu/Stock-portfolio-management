import { Avatar } from "..";
import ChatLoading from "../../assets/images/ChatLoading.gif";
import Robot from "../../assets/images/Robot.jpg";

const AiResponseLoading = () => {
  return (
    <div className="flex gap-3">
      <Avatar img={Robot}/>
      <div className="overflow-hidden h-12 w-20 flex justify-center items-center bg-[#F3F6F8] rounded-full mt-1">
        <div className="relative flex ">
          <img src={ChatLoading} alt="chat loading" className="w-14  -ml-0.5" />
          <div className="absolute  rotate-90 h-3 -left-[60%] top-[30%] w-full bg-[#F3F6F8]"></div>
        </div>
      </div>
    </div>
  );
};

export default AiResponseLoading;
