import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl, getConfig } from "../Api/index.js";
import toast from "react-hot-toast";
import { setApiLimitError } from "../Features/core.js";

export const addNewNotification = createAsyncThunk(
  "notification/addNewNotification",
  async (formData, { dispatch }) => {
    const { toastId } = formData;
    delete formData.toastId;
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/notification/add-new-notification`,
        formData,
        config
      );
      if (data) {
        toast.success("Notification created successfully...", {
          id: toastId,
        });
        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else
        toast.error(
          `Error in creating notification... ${error?.response?.data?.message}`,
          { id: toastId }
        );
    }
  }
);

export const getAllNotification = createAsyncThunk(
  "notification/getAllNotification",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/notification/get-all-notification`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else
        toast.error(
          `Error while fetching notifications.. ${error?.response?.data?.message}`
        );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async ({ id, t }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.delete(
        `${baseUrl}/notification/delete-notification/${id}`,
        config
      );
      if (data) {
        toast.success("Your notification successfully deleted.", { id: t });
        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else
        toast.error(
          `Error while deleting notification.. ${error?.response?.data?.message}`
        );
    }
  }
);

export const editNotification = createAsyncThunk(
  "notification/editNotification",
  async (formData, { dispatch }) => {
    const { toastId } = formData;
    delete formData.toastId;
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/notification/edit-notification`,
        formData,
        config
      );
      if (data) {
        toast.success("Notification edited successfully...", {
          id: toastId,
        });
        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else
        toast.error(
          `Error while editing notification... ${error?.response?.data?.message}`,
          { id: toastId }
        );
    }
  }
);

export const getNewNotification = createAsyncThunk(
  "notification/getDashboardNotifications",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/notification/get-new-notifications`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const readAllNotifications = createAsyncThunk(
  "notification/readAllNotifications",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.delete(
        `${baseUrl}/notification/read-all-notification`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const handleSingleClose = createAsyncThunk(
  "notification/handleSingleClose",
  async (id, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.delete(
        `${baseUrl}/notification/single-close-notification/${id}`,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const updateSingleRead = createAsyncThunk(
  "notification/updateSingleRead",
  async (id, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/notification/single-read-notification`,
        { id },
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);
