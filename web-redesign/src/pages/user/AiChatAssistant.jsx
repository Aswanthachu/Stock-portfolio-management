import { selectStatusByName } from "@/Redux/Features/chatAssistant";
import { getActiveChatQuery } from "@/Redux/hooks/chatAssistant";
import { ChatLoading } from "@/assets";
import {
  AiIntroduction,
  AiNavbar,
  AiResponseLoading,
  BottomInput,
  ChatRow,
} from "@/components";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const AiChatAssistant = () => {
  const chatContRef = useRef(null);
  const { data, isLoading, isError } = getActiveChatQuery();

  const thread_id = useSelector((state) => state.chatAssistant.thread_id);
  const status = useSelector((state) =>
    selectStatusByName(state, "askQuestion")
  );

  const scrollToBottom = () => {
    if (chatContRef.current) {
      chatContRef.current.scrollTop = chatContRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (chatContRef.current) {
      chatContRef.current.scrollTop = chatContRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <main className="w-full h-screen flex justify-center md:items-center ">
      <section className=" w-full md:w-[90%] lg:w-[70%] md:h-[97%]  md:rounded-lg  md:border-2 flex flex-col md:shadow-xl relative">
        <AiNavbar thread_id={thread_id} />
        <div
          ref={chatContRef}
          className="w-full h-[calc(100%-80px)] grow rounded-b-lg px-1 py-2 md:px-5 md:py-5 flex flex-col space-y-4 overflow-y-auto styled-scrollbar2 mb-[80px]"
        >
          {data && data.length ? (
            <>
              {data
                .slice(0)
                .reverse()
                .map((chat) => (
                  <ChatRow chat={chat} key={chat.id} />
                ))}
            </>
          ) : (
            <>
              {isLoading ? (
                <ChatLoading className="w-20"/>
              ) : (
                <>{!thread_id && <AiIntroduction />}</>
              )}
            </>
          )}

          {status === "pending" && <AiResponseLoading />}
        </div>

        <BottomInput thread_id={thread_id} scrollToBottom={scrollToBottom} />
      </section>
    </main>
  );
};

export default AiChatAssistant;
