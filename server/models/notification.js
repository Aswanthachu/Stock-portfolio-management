import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipients: {
      type: Number,
      required: true,
      default: 1,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    date: {
      type: Date,
    },
    pushNotification: {
      type: Boolean,
      default: true,
    },
    pushTitle: {
      type: String,
      default: 'Testt',
    },
    pushMessage: {
      type: String,
      default: 'Testtt',
    },
    pushLink: {
      type: String,
      default: '/login',
    },
  },
  { timestamps: true }
);

const Notifications = mongoose.model("notifications", notificationSchema);
export default Notifications;
