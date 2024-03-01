import { createSlice } from "@reduxjs/toolkit";
import {
  askQuestion,
  fetchSingleThreadMessage,
  getActiveChat,
  getAllUsersCreatedChat,
} from "../Actions/chatAssistant";

const initialState = {
  dataByName: {},
  statusByName: {},
  thread_id: null,
};

const chatAssistantSlice = createSlice({
  name: "chatAssistant",
  initialState,
  reducers: {
    resetState: () => initialState,
    addUserQuestion: (state, action) => {
      state.dataByName["getActiveChat"].unshift(action.payload);
    },
    clearMessages: (state) => {
      state.dataByName["getActiveChat"] = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveChat.pending, (state, action) => {
        state.statusByName["getActiveChat"] = "pending";
        state.dataByName["getDashboardTable"] = action.payload;
      })
      .addCase(getActiveChat.fulfilled, (state, action) => {
        state.statusByName["getActiveChat"] = "fulfilled";
        state.dataByName["getActiveChat"] = action.payload.messages;
        if (action.payload.messages.length)
          state.thread_id = action.payload.messages[0].thread_id;
      })
      .addCase(getActiveChat.rejected, (state, action) => {
        state.statusByName["getActiveChat"] = "rejected";
      })
      .addCase(askQuestion.pending, (state, action) => {
        state.statusByName["askQuestion"] = "pending";
      })
      .addCase(askQuestion.fulfilled, (state, action) => {
        const { reply } = action.payload;
        state.statusByName["askQuestion"] = "fulfilled";
        state.dataByName["getActiveChat"].unshift(reply);
        state.thread_id = reply.thread_id;
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.statusByName["askQuestion"] = "rejected";
      })
      .addCase(getAllUsersCreatedChat.pending, (state, action) => {
        state.statusByName["getAllUsersCreatedChat"] = "pending";
      })
      .addCase(getAllUsersCreatedChat.fulfilled, (state, action) => {
        state.statusByName["getAllUsersCreatedChat"] = "fulfilled";
        state.dataByName["getAllUsersCreatedChat"] = action.payload.chat;
      })
      .addCase(getAllUsersCreatedChat.rejected, (state, action) => {
        state.statusByName["getAllUsersCreatedChat"] = "rejected";
      })
      .addCase(fetchSingleThreadMessage.pending, (state, action) => {
        state.statusByName["fetchSingleThreadMessage"] = "pending";
      })
      .addCase(fetchSingleThreadMessage.fulfilled, (state, action) => {
        state.statusByName["fetchSingleThreadMessage"] = "fulfilled";
        state.dataByName["fetchSingleThreadMessage"] = action.payload.messages;
      })
      .addCase(fetchSingleThreadMessage.rejected, (state, action) => {
        state.statusByName["fetchSingleThreadMessage"] = "rejected";
      });
  },
});

export default chatAssistantSlice.reducer;

export const { resetState, addUserQuestion, clearMessages } =
  chatAssistantSlice.actions;

export const selectStatusByName = (state, name) =>
  state.chatAssistant.statusByName[name];
export const selectDataByName = (state, name) =>
  state.chatAssistant.dataByName[name];
