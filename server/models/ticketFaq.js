import mongoose from "mongoose";

const ticketFaqSchema = mongoose.Schema({
    category:{
    type:String,
    required:true
  },
  subject:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  }
});

const ticketFaq = mongoose.model("ticketFaq", ticketFaqSchema);
export default ticketFaq;
