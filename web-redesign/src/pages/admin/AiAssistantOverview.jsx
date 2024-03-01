import { fetchSingleThreadMessageQuery, getAllUsersCreatedChatQuery } from "@/Redux/hooks/chatAssistant";
import UserTable from "@/components/Admin/ChatTable";

const AiAssistantOverview = () => {
  const { data:allData } = getAllUsersCreatedChatQuery();
  const { data:singleMessage } = fetchSingleThreadMessageQuery();
  return (
    <main className="p-5 h-screen">
      <h1 className="text-xl font-bold mb-2">Ai Assistant Chat Overview</h1>
      <UserTable data={allData} singleMessage={singleMessage}/>
    </main>
  );
};

export default AiAssistantOverview;
