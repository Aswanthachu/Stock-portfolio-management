import mongoose from "mongoose";

const pushNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (if you have one)
    required: true,
  },
  subscription: {
    endpoint: {
      type: String,
      required: true,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PushNotification = mongoose.model('PushNotification', pushNotificationSchema);

export default PushNotification;