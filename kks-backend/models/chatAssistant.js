import mongoose from "mongoose";

const chatAssistantSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "user",
    },
    threads: [
      {
        thread_id: {
          type: String,
          required: true,
        },
        status: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const ChatAssistant = mongoose.model("chatAssistant", chatAssistantSchema);
export default ChatAssistant;
