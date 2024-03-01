import { fetchSingleThreadMessage } from "@/Redux/Actions/chatAssistant";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const UserTable = ({ data: users, singleMessage }) => {
  const dispatch = useDispatch();

  const [openUser, setOpenUser] = useState(null);
  const [openThread, setOpenThread] = useState(null);

  const handleThreadView = (thread_id) => {
    toggleThread(thread_id);
    dispatch(fetchSingleThreadMessage(thread_id));
  };

  console.log(singleMessage);

  // const users = [
  //   {
  //     id: 1,
  //     name: 'User 1',
  //     threads: ['Thread 1', 'Thread 2'],
  //     messages: {
  //       'Thread 1': 'Message 1 for Thread 1',
  //       'Thread 2': 'Message 1 for Thread 2',
  //     },
  //   },
  //   {
  //     id: 2,
  //     name: 'User 2',
  //     threads: ['Thread 3', 'Thread 4'],
  //     messages: {
  //       'Thread 3': 'Message 1 for Thread 3',
  //       'Thread 4': 'Message 1 for Thread 4',
  //     },
  //   },
  //   {
  //     id: 3,
  //     name: 'User 2',
  //     threads: ['Thread 3', 'Thread 4'],
  //     messages: {
  //       'Thread 3': 'Message 1 for Thread 3',
  //       'Thread 4': 'Message 1 for Thread 4',
  //     },
  //   },
  // ];

  const toggleUser = (userId) => {
    setOpenUser((prevOpenUser) => (prevOpenUser === userId ? null : userId));
    setOpenThread(null);
  };

  const toggleThread = (threadId) => {
    setOpenThread((prevOpenThread) =>
      prevOpenThread === threadId ? null : threadId
    );
  };

  return (
    <div className="flex overflow-hidden border min-h-[calc(100%-16px)] w-full">
      {/* User List */}
      <div className="w-3/12  overflow-y-auto">
        <table className="min-w-full h-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users &&
              users.map((user) => (
                <React.Fragment key={user.userId}>
                  <tr
                    className={`cursor-pointer ${
                      openUser === user.userId && "bg-gray-100"
                    }`}
                    onClick={() => toggleUser(user.userId)}
                  >
                    <td className="px-6 py-4 h-fit  ">
                      <div className="flex items-center">
                        {openUser === user.userId ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        )}
                        <div className="ml-2">{user.username}</div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* User Threads */}
      {openUser !== null && (
        <div className="w-3/12  min-h-full">
          <table className="min-w-full divide-y divide-gray-200 mb-4 border h-[100%]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Threads
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                .filter((obj) => obj.userId === openUser)[0]
                .threads.map((thread) => (
                  <React.Fragment key={thread.thread_id}>
                    <tr
                      className={`cursor-pointer ${
                        openThread === thread.thread_id && "bg-gray-100"
                      }`}
                      onClick={() => handleThreadView(thread.thread_id)}
                    >
                      <td className="px-6 py-4 h-12">
                        <div className="flex items-center">
                          {openThread === thread.thread_id ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <div className="ml-2">{thread.thread_id}</div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Messages */}
      <div className="w-6/12 ml-16 px-4 py-2">
        {openThread !== null && singleMessage && (
          <div className="w-full gap-1 space-y-1">
            {singleMessage &&
              singleMessage
                .slice(0)
                .reverse()
                .map((msg) => (
                  <div key={msg.id} className="w-full ">
                    <p className={cn(msg.role === "user" && "ml-auto"," w-fit max-w-[400px] text-end border p-1 rounded-xl")}>{msg.content?.[0]?.text?.value}</p>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
