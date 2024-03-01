import mongoose from "mongoose";

const investSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref:"user"
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    screenshot: {
      type: String,
      required:true
    },
    verified: {
      type: Boolean,
      default: false,
    },
    portfolioId:{
      type:String,
      required:true,
      ref:"generateportfolio"
    }
  },
  { timestamps: true }
);

const investmentUpdation = mongoose.model("investmentUpdation", investSchema);
export default investmentUpdation;
