import mongoose from "mongoose";

const upiDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  txnid: {
    type: String,
  },
  upiTransactionId: {
    type: String,
  },
  screenshort: {
    type: String,
  },
  email: {
    type: String,
  },
  amount: {
    type: String,
  },
  plan: {
    type: String,
  },
  username: {
    type: String,
  },
  txnid: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

const upiPayment = mongoose.model("upiPayment", upiDetailsSchema);
export default upiPayment;
