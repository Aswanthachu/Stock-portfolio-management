import Robot from "../../assets/images/Robot.jpg";
import { Button } from "@/components/ui/button";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Avatar } from "..";
import { useDispatch } from "react-redux";
import { closeChat } from "@/Redux/Actions/chatAssistant";
import { resetState } from "@/Redux/Features/chatAssistant";

const AiNavbar = ({thread_id}) => {
  const dispatch = useDispatch();

  const handleNewChat = () => {
    dispatch(resetState());
    dispatch(closeChat(thread_id));
  };

  return (
    <div className="w-full h-[90px] bg-gray-400 md:bg-darkGreen md:rounded-t-lg px-3 md:px-5 py-2 md:py-3  flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Avatar img={Robot} main/>
        <p className="text-white text-xl font-sans font-bold hidden md:block">
          KKS AI ASSISTANT
        </p>
      </div>
      <Button className="gap-3 px-2 py-1" onClick={handleNewChat}>
        <p className="text-sm">New Chat</p>
        <PencilSquareIcon className="w-5" />
      </Button>
    </div>
  );
};

export default AiNavbar;
