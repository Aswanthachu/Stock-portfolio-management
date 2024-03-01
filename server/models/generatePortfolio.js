import mongoose from "mongoose";

const generatePortfolioSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref:"user"
  },
  investmentType: {
    type: String,
  },
  initial_investment: {
    type: Number,
  },
  installment: {
    type: Number,
  },
  frequency: {
    type: String,
  },
  portfolioname: {
    type: String,
    default:"Portfolio-1"
  },
  purchaseDate: {
    type: Date,

  },
  screenshot: {
    type: String,
    
  },
  portfolioRef: {
    type: mongoose.Schema.ObjectId,
    // ref: function() {
    //   if (this.investmentType === "sip") {
    //     return 'portfoliosips';
    //   } else {
    //     return 'portfoliolumpsums';
    //   }
    // },
    ref:"portfoliosips"
  },
  investmentVerified: {
    type: String,
    required: true,
    default: "notVerified",
  },
},{ timestamps: true });

const GeneratePortfolio = mongoose.model(
  "generateportfolio",
  generatePortfolioSchema
);

export default GeneratePortfolio;
