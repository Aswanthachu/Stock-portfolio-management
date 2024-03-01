import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
const { ObjectId } = mongoose.Schema;
const AutoIncrement = mongooseSequence(mongoose);
const replySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "user",
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  url: {
    type: String,
  },
  fileFormat: {
    type: String,
  },
  date: {
    type: String,
    default: new Date().toDateString().slice(4),
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  adminUnread: {
    type: Boolean,
  },
  userUnread: {
    type: Boolean,
  },
  read:{
    type:Boolean
  },
  notification: {
    type: String,
  },
});

const ticketSchema = mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    username: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
      required: true,
    },
    date: {
      type: String,
      default: new Date().toDateString().slice(4),
      required: true,
    },
    assignedTo:{
      type:ObjectId,
      required:true,
      ref:'user'
    },
    assignedUsername:{
      type:String,
    
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    adminUnread: {
      type: Boolean,
      default: true,
    },
    userUnread: {
      type: Boolean,
      default: false,
    },
    replies: [replySchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true
  },
  
);

ticketSchema.virtual("user", {
  ref: "user",
  foreignField: "_id",
  localField: "userId",
});

ticketSchema.plugin(AutoIncrement, { inc_field: "ticketId", start_seq: 10001 });

const ticket = mongoose.model("tickets", ticketSchema);
export default ticket;
