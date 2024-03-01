import { OpenAI } from "openai";
import ChatAssistant from "../models/chatAssistant.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant = await openai.beta.assistants.retrieve(
  process.env.OPENAI_ASSISTANT_ID
);

const checkStatusAndGetReply = async (threadId, runId) => {
  let runStatus;

  while (true) {
    runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (runStatus.status === "completed") {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const reply = await openai.beta.threads.messages.list(threadId);
  return reply.data[0];
};

export const askQuestion = async (req, res) => {
  try {
    const { userId } = req;
    const { question, username, thread_id } = req.body;

    if (!question || !username)
      return res
        .status(400)
        .json({ message: "Missing of necessary datas from request body." });

    if (thread_id) {
      await openai.beta.threads.messages.create(thread_id, {
        role: "user",
        content: question,
      });

      const run = await openai.beta.threads.runs.create(thread_id, {
        assistant_id: assistant.id,
        instructions: `you are an assistance to our fintech application . our company is kkscapitals . we are a investment advisory firm and portfolio management for the users. we have  a SAAS application . the subscription fee starts from 2924 inr per month. after subscribing to our application we give users's stock list that includes  company name , current price , percentage of portfolio and amount to invest . we have an expert research team that is researching about companies and giving stock list . we are only giving investment advisory based on US based stocks . and you are an customer support agent . if a user ask question about our company or anything you have to answer and if you don't know the answer , you have to kindly  redirect the user to our ticket section to raise a new  ticket (ticket section link : https://app.kkscapitals.com/tickets)  ( we already have a ticket section where the doubts are cleared by our experts).
    also we have a lifetime free plan where users will get an intro to our dashboard and also 1 to 1 Support &Portfolio Analysis and Professional Advice. we have 3 plans one is the above free plan and the other one is standard plan , the feature user get when subscribing the standard plan is 1 to 1 Support ,Portfolio Management ,List of Stocks to Buy ,Advanced SIPs ,All Featues Available in the Free Plan. and the plan duration is 3 months  and cost for the plan is 2924 for 3 months ( one month 641.3). Other plan is premium plan that is an yearly plan and all the feature available in the standard is available in the premium plan with additional 6 months offer for the premium plan users so the user gets 1 year and 6 month . this is the plan structure of our application . when a user ask about their plans or anything, you have to encourage the user to buy the premium plan as it is a win -win for the user . and if the user wants more information about the company here is our main site where the user can get know about our site and read our blogs as well : https://www.kkscapitals.com/. and please address the user as ${username}.Only reply for kks capitals related questions.`,

        tools: [
          {
            type: "code_interpreter",
          },
          { type: "retrieval" },
        ],
      });

      const reply = await checkStatusAndGetReply(thread_id, run.id);

      if (!reply)
        return res
          .status(400)
          .json({ message: "Error while generating response." });

      res
        .status(200)
        .json({ reply, message: "Successfully generated response" });
    } else {
      const thread = await openai.beta.threads.create();

      const existingChatCreatedUser = await ChatAssistant.findOne({ userId });

      if (existingChatCreatedUser) {
        const addChat = await ChatAssistant.findByIdAndUpdate(
          existingChatCreatedUser._id,
          {
            $push: {
              threads: {
                $each: [{ thread_id: thread.id, status: true }],
              },
            },
          }
        );

        await ChatAssistant.updateOne(
          { userId },
          {
            $set: {
              "threads.$[elem].status": false,
            },
          },
          {
            arrayFilters: [{ "elem.thread_id": { $ne: thread.id } }],
          }
        );

        if (!addChat)
          return res
            .status(400)
            .json({ message: "Error while creating new chat history." });
      } else {
        const newChat = await ChatAssistant.create({
          userId,
          threads: [{ thread_id: thread.id }],
        });

        if (!newChat)
          return res
            .status(400)
            .json({ message: "Error while creating new chat store." });
      }

      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: question,
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        instructions: `you are an assistance to our fintech application . our company is kkscapitals . we are a investment advisory firm and portfolio management for the users. we have  a SAAS application . the subscription fee starts from 2924 inr per month. after subscribing to our application we give users's stock list that includes  company name , current price , percentage of portfolio and amount to invest . we have an expert research team that is researching about companies and giving stock list . we are only giving investment advisory based on US based stocks . and you are an customer support agent . if a user ask question about our company or anything you have to answer and if you don't know the answer , you have to kindly  redirect the user to our ticket section to raise a new  ticket (ticket section link : https://app.kkscapitals.com/tickets)  ( we already have a ticket section where the doubts are cleared by our experts).
    also we have a lifetime free plan where users will get an intro to our dashboard and also 1 to 1 Support &Portfolio Analysis and Professional Advice. we have 3 plans one is the above free plan and the other one is standard plan , the feature user get when subscribing the standard plan is 1 to 1 Support ,Portfolio Management ,List of Stocks to Buy ,Advanced SIPs ,All Featues Available in the Free Plan. and the plan duration is 3 months  and cost for the plan is 2924 for 3 months ( one month 641.3). Other plan is premium plan that is an yearly plan and all the feature available in the standard is available in the premium plan with additional 6 months offer for the premium plan users so the user gets 1 year and 6 month . this is the plan structure of our application . when a user ask about their plans or anything, you have to encourage the user to buy the premium plan as it is a win -win for the user . and if the user wants more information about the company here is our main site where the user can get know about our site and read our blogs as well : https://www.kkscapitals.com/. and please address the user as ${username}.Strictly reply for kks capitals related questions not more than 200 characters.`,
        tools: [
          {
            type: "code_interpreter",
          },
          { type: "retrieval" },
        ],
      });

      const reply = await checkStatusAndGetReply(thread.id, run.id);

      if (!reply)
        return res
          .status(400)
          .json({ message: "Error while generating response." });

      res
        .status(200)
        .json({ reply, message: "Successfully generated response" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getActiveChat = async (req, res) => {
  try {
    const { userId } = req;
    // const { userId } = req.body;

    const allThreads = await ChatAssistant.findOne({ userId });

    if (!allThreads || !allThreads.threads || allThreads.threads.length === 0)
      return res
        .status(200)
        .json({ message: "User not started Ai Chat", messages: [] });

    const lastThread = allThreads.threads[allThreads.threads.length - 1];

    if (!lastThread.status)
      return res
        .status(200)
        .json({ message: "User closed all chats.", messages: [] });

    const messages = await openai.beta.threads.messages.list(
      lastThread.thread_id
    );

    if (!messages)
      return res
        .status(400)
        .json({ message: "Error while fetching messages." });

    res.status(200).json({
      messages: messages.body.data,
      message: "Successfully fetched user message history.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const closeChat = async (req, res) => {
  try {
    const { userId } = req;
    const { thread_id } = req.params;

    await ChatAssistant.updateOne(
      { userId },
      { $set: { "threads.$[].status": false } }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAllChat = async (req, res) => {
  try {
    const data = await ChatAssistant.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          threads: 1,
          createdAt: 1,
          username: "$result.username",
          email: "$result.email",
        },
      },
    ]);
    if (!data || !Array.isArray(data))
      return res
        .status(400)
        .json({ message: "Error while fetching all ai chat details" });

    res
      .status(200)
      .json({ message: "Successfully fetched ai chat details", chat: data });
  } catch (error) {
    console.log(error);
  }
};

export const fetchSingleThreadMessage = async (req, res) => {
  try {
    const { thread_id } = req.params;

    if (!thread_id)
      return res
        .status(400)
        .json({ message: "Thread id is missing from request." });

    const messages = await openai.beta.threads.messages.list(thread_id);

    if (!messages)
      return res
        .status(400)
        .json({
          message: "Error while fetching messages or thread id is not valid.",
        });

    res.status(200).json({
      messages: messages.body.data,
      message: "Successfully fetched user message history.",
    });
  } catch (error) {
    console.log(error);
  }
};
