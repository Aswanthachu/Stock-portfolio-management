import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, getConfig } from "../Api";
import axios from "axios";

export const getActiveChat = createAsyncThunk(
  "chatAssistant/getActiveChat",
  async () => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/assistant/get-active-chat`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const askQuestion = createAsyncThunk(
  "chatAssistant/askQuestion",
  async (formData) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/assistant/ask-question`,
        formData,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const closeChat = createAsyncThunk(
  "chatAssistant/closeChat",
  async (thread_id) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/assistant/close-chat/${thread_id}`,
        config
      );
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllUsersCreatedChat = createAsyncThunk(
  "chatAssistant/getAllUsersCreatedChat",
  async () => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/assistant/get-all-user-chat`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchSingleThreadMessage = createAsyncThunk(
  "chatAssistant/fetchSingleThreadMessage",
  async (thread_id) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/assistant/get-message-from-thread/${thread_id}`,
        config
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
