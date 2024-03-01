import { createSlice } from "@reduxjs/toolkit";
import {
  addNewNotification,
  readAllNotifications,
  deleteNotification,
  editNotification,
  getAllNotification,
  getNewNotification,
} from "../Actions/notification";

const initialState = {
  dataByName: {},
  statusByName: {},
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    resetState: () => initialState,
    updateSingleClose: (state, action) => {
      state.dataByName.getNewNotification.notifications =
        state.dataByName.getNewNotification.notifications.filter(
          (item) => item._id !== action.payload
        );
    },
    updateRaed: (state, action) => {
      state.dataByName.getNewNotification.notifications =
        state.dataByName.getNewNotification.notifications
          .map((item) =>
            item._id == action.payload ? { ...item, read: true } : item
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
    updateReadAll: (state, action) => {
      state.dataByName.getNewNotification.notifications =
        state.dataByName.getNewNotification.notifications
          .map((item) => {
            return { ...item, read: true };
          })
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotification.pending, (state, action) => {
        state.statusByName["getAllNotification"] = "pending";
      })
      .addCase(getAllNotification.fulfilled, (state, action) => {
        state.statusByName["getAllNotification"] = "fulfilled";
        state.dataByName["getAllNotification"] = action.payload;
      })
      .addCase(getAllNotification.rejected, (state, action) => {
        state.statusByName["getAllNotification"] = "rejected";
      })
      .addCase(addNewNotification.pending, (state, action) => {
        state.statusByName["addNewNotification"] = "pending";
      })
      .addCase(addNewNotification.fulfilled, (state, action) => {
        state.statusByName["addNewNotification"] = "fulfilled";
        state.dataByName.getAllNotification.notifications.unshift(
          action.payload.newNotification
        );
      })
      .addCase(addNewNotification.rejected, (state, action) => {
        state.statusByName["addNewNotification"] = "rejected";
      })
      .addCase(deleteNotification.pending, (state, action) => {
        state.statusByName["deleteNotification"] = "pending";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.statusByName["deleteNotification"] = "fulfilled";
        state.dataByName.getAllNotification.notifications =
          state.dataByName.getAllNotification.notifications.filter(
            (item) => item._id !== action.payload.deletedNotification?._id
          );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.statusByName["deleteNotification"] = "rejected";
      })
      .addCase(editNotification.pending, (state, action) => {
        state.statusByName["editNotification"] = "pending";
      })
      .addCase(editNotification.fulfilled, (state, action) => {
        state.statusByName["editNotification"] = "fulfilled";
        state.dataByName.getAllNotification.notifications =
          state.dataByName.getAllNotification.notifications.map((item) =>
            item._id == action.payload.editedNotification._id
              ? action.payload.editedNotification
              : item
          );
      })
      .addCase(editNotification.rejected, (state, action) => {
        state.statusByName["editNotification"] = "rejected";
      })
      .addCase(getNewNotification.pending, (state, action) => {
        state.statusByName["getNewNotification"] = "pending";
      })
      .addCase(getNewNotification.fulfilled, (state, action) => {
        state.statusByName["getNewNotification"] = "fulfilled";
        state.dataByName["getNewNotification"] = action.payload;
      })
      .addCase(getNewNotification.rejected, (state, action) => {
        state.statusByName["getNewNotification"] = "rejected";
      })
      .addCase(readAllNotifications.pending, (state, action) => {
        state.statusByName["readAllNotifications"] = "pending";
      })
      .addCase(readAllNotifications.fulfilled, (state, action) => {
        state.statusByName["readAllNotifications"] = "fulfilled";
      })
      .addCase(readAllNotifications.rejected, (state, action) => {
        state.statusByName["readAllNotifications"] = "rejected";
      });
  },
});

export default notificationSlice.reducer;

export const { resetState, updateSingleClose, updateRaed, updateReadAll } =
  notificationSlice.actions;

export const selectStatusByName = (state, name) =>
  state.notification.statusByName[name];
export const selectDataByName = (state, name) =>
  state.notification.dataByName[name];
