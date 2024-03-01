import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl, getConfig } from "../Api/index";
import { setApiLimitError} from "../Features/core";

export const addUploadProgress = createAsyncThunk(
  "tickets/addUploadProgress",
  async (data) => {
    return data;
  }
);

export const getTickets = createAsyncThunk(
  "ticket/getTickets",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(`${baseUrl}/ticket/get-tickets`, config);
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const newTicket = createAsyncThunk(
  "ticket/newTicket",
  async (data) => data
);

export const ticketReply = createAsyncThunk(
  "ticket/ticketReply",
  async (replyData, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/ticket/reply-to-ticket`,
        replyData,
        config,
        {
          onUploadProgress: (data) => {
            dispatch(
              addUploadProgress(Math.round((data.loaded / data.total) * 100))
            );
          },
        }
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

export const getSingleTicket = createAsyncThunk(
  "ticket/getSingleTicket",
  async (ticketId, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/ticket/get-single-ticket/${ticketId}`,
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

export const handleNewMessage = createAsyncThunk(
  "ticket/handleNewMessage",
  async (reply, { dispatch }) => {
    try {
      return reply;
    } catch (error) {
      console.log(error);
    }
  }
);
export const handleTicketReply = createAsyncThunk(
  "ticket/handleTicketReply",
  async (data) => data
);

export const closeTicket = createAsyncThunk(
  "ticket/closeTicket",
  async (ticketId, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/ticket/close-ticket/${ticketId}`,
        {},
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

export const reOpenTicket = createAsyncThunk(
  "ticket/reOpenTicket",
  async (ticketId, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/ticket/reopen-ticket/${ticketId}`,
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

export const deleteTicket = createAsyncThunk(
  "ticket/deleteTicket",
  async (ticketId, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.delete(
        `${baseUrl}/ticket/delete-ticket/${ticketId}`,
        config
      );
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const addNewTicket = createAsyncThunk(
  "ticket/addNewTicket",
  async ({ form, showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/ticket/add-new-ticket`,
        form,
        config
      );
      if (data) {
        showToast(
          `Successfully created your Ticket. id:${data?.ticketData?.ticketId} `,
          "success"
        );
        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const updateMessageRead = createAsyncThunk(
  "ticket/updateMessageRead",
  async ({ id }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.patch(
        `${baseUrl}/ticket/update-message-read/${id}`,
        null,
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

export const getTicketNotificationCount = createAsyncThunk(
  "ticket/getTicketNotificationCount",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/ticket/get-ticket-notification-count`,
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

export const addFaq = createAsyncThunk(
  "ticket/addFaq",
  async ({ formData, showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/ticket/add-faq-ticket`,
        formData,
        config
      );
      if (data) {
        // showToast("New FAQ added successfully..",'success')
        //   toast.success("New FAQ added successfully..");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      }
    }
  }
);

export const getTicketFaq = createAsyncThunk(
  "ticket/getTicketFaq",
  async (_,{dispatch}) => {
    try {
      const config = getConfig();
      const { data } = await axios.get(
        `${baseUrl}/ticket/get-faq-tickets`,
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
export const reAssignTicket = createAsyncThunk(
  "ticket/reAssignTicket",
  async ({ ticketData, showToast }, { dispatch }) => {
    try {
      const config = getConfig();
      const { data } = await axios.post(
        `${baseUrl}/ticket/re-assign`,
        ticketData,
        config
      );
      if (data) showToast(data?.message, "success");
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        dispatch(setApiLimitError(true));
      } else showToast("Something went Wrong!", "error");
    }
  }
);
