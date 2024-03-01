import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import clearchat from "../../assets/images/clearchat.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { askQuestion } from "@/Redux/Actions/chatAssistant";
import { addUserQuestion,clearMessages } from "@/Redux/Features/chatAssistant";
import generateMessageId from "@/lib/generateMessageId";

const BottomInput = ({ thread_id,scrollToBottom }) => {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState("");

  const { username } = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question || question === "") return;
    const payload = {
      id: generateMessageId(),
      role: "user",
      thread_id,
      created_at: Math.floor(new Date().getTime() / 1000),
      content: [
        {
          type: "text",
          text: {
            value: question,
          },
        },
      ],
    };
    dispatch(addUserQuestion(payload));
    setTimeout(scrollToBottom, 0);
    dispatch(askQuestion({ question, username, thread_id }));
    setQuestion("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full h-fit md:h-[80px] flex flex-col absolute bottom-0 bg-white rounded-b-lg">
      <hr className="border-1 border-gray-400/50 shadow-lg" />
      <div className="grow  h-full flex items-center  p-3 gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                className="bg-transparent p-1 hover:bg-transparent"
                onClick={()=>dispatch(clearMessages())}
              >
                <img
                  src={clearchat}
                  alt="clear chat"
                  className="w-10 hover:cursor-pointer"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-400">
              <p>Clear Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <form
          onSubmit={handleSubmit}
          className=" flex items-center w-full bg-slate-100 px-3 rounded-lg"
        >
          <Input
            className="w-full bg-inherit grow pl-3 py-6  focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon"
                  className="bg-transparent p-1 hover:bg-transparent"
                  type="submit"
                >
                  <PaperAirplaneIcon className="w-8 text-darkGreen -rotate-45" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-400">
                <p>Send Message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </div>
    </div>
  );
};

export default BottomInput;
