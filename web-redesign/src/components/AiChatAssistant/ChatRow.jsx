import { ClockIcon } from "@heroicons/react/20/solid";
import { Avatar } from "..";
import { cn } from "@/lib/utils";
import formatDate from "@/lib/dateFormat";
import Robot from "../../assets/images/Robot.jpg";

const ChatRow = ({ chat }) => {

  const {username}=JSON.parse(localStorage.getItem("user"));

  function getInitials(username) {
    const words = username.split(' ');
    const initials = words.map(word => word.charAt(0));
    return initials.join(' ');
  }

  return (
    <div
      className={cn(
        "flex gap-4 max-w-[90%] md:max-w-[70%]",
        chat.role === "user" && "ml-auto flex-row-reverse"
      )}
    >
      {chat.role === "assistant" ? (
        <Avatar img={Robot} />
      ) : (
        <Avatar fallback={getInitials(username)} />
      )}
      <div className="mt-2">
        <div
          className={cn(
            "border-2 px-2 md:px-4 py-3 rounded-b-3xl",
            chat.role === "assistant"
              ? "bg-[#4d4a5b] text-white font-light text-sm rounded-tr-3xl"
              : "rounded-tl-3xl"
          )}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: chat.content[0].text.value,
            }}
            className="leading-loose"
          />
        </div>
        <p className="flex mt-1.5 gap-1">
          <ClockIcon className="w-4 text-gray-500/50 ml-3" />
          <p className="text-xs">
            {formatDate(new Date(chat.created_at * 1000))}
          </p>
        </p>
      </div>
    </div>
  );
};

export default ChatRow;

{
  /*
          <div className="flex gap-5">
            <Avatar />
            <div>
              <div className="px-4 py-3 rounded-b-3xl rounded-tr-3xl mt-1 bg-[#4d4a5b] text-white font-light text-sm max-w-[60%]">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      "Hello Aswanth Achu! As an artificial intelligence, I am the result of years of research and development by a team of data scientists, engineers, and machine learning experts who designed algorithms that can understand and process natural language. My underlying technology is based on machine learning models that have been trained on vast amounts of text data, so I can generate responses that are relevant to the questions and statements presented to me.\n\nMy capabilities to interact in this conversation are defined by the programming and the data provided to me by the developers. However, if you have any specific questions about KKSCapitals' services or need help with our application, feel free to ask! If there's something I can't answer, I can guide you to our ticket section for further assistance.",
                  }}
                  className="leading-loose"
                />
              </div>
              <p className="flex mt-1.5 gap-1">
                <ClockIcon className="w-4 text-gray-500/50 ml-3" />
                <p className="text-xs">Today 2.00 PM</p>
              </p>
            </div>
          </div>
          <div className="flex gap-4 ml-auto flex-row-reverse">
            <Avatar />
            <div>
              <div className="border-2 px-4 py-3 rounded-b-3xl rounded-tl-3xl mt-1">
                How KKS Capitals Works?
              </div>
              <p className="flex mt-1.5 gap-1">
                <ClockIcon className="w-4 text-gray-500/50 ml-3" />
                <p className="text-xs">Yesterday 2.00 PM</p>
              </p>
            </div>
          </div>
          <div className="flex gap-5">
            <Avatar />
            <div>
              <div className="px-4 py-3 rounded-b-3xl rounded-tr-3xl mt-1 bg-[#4d4a5b] text-white font-light text-sm max-w-[60%]">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      "Hello Aswanth Achu! As an artificial intelligence, I am the result of years of research and development by a team of data scientists, engineers, and machine learning experts who designed algorithms that can understand and process natural language. My underlying technology is based on machine learning models that have been trained on vast amounts of text data, so I can generate responses that are relevant to the questions and statements presented to me.\n\nMy capabilities to interact in this conversation are defined by the programming and the data provided to me by the developers. However, if you have any specific questions about KKSCapitals' services or need help with our application, feel free to ask! If there's something I can't answer, I can guide you to our ticket section for further assistance.",
                  }}
                  className="leading-loose"
                />
              </div>
              <p className="flex mt-1.5 gap-1">
                <ClockIcon className="w-4 text-gray-500/50 ml-3" />
                <p className="text-xs">Today 2.00 PM</p>
              </p>
            </div>
          </div> */
}
