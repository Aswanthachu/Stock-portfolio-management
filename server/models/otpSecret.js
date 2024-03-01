import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    secret:{
        type:String,
        required:true
    },
    createdAt: {
         type: Date,
          default: Date.now,
           expires: 300 }
    
  },
 
);

const otpModel = mongoose.model("otpSecret", otpSchema);
export default otpModel
