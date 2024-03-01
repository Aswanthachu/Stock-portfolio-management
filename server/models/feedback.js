import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref:"user"
    },
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type:String,
      required:true
    },
   adminRead:{
    type:Boolean,
   default:false
   }
  },
  { timestamps: true }
);

const feedback = mongoose.model("feedback", feedbackSchema);
export default feedback;
