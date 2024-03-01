import mongoose from "mongoose";

const userCreatedPortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    portfolio_name: {
      type: String,
      required: true,
    },
    stockList: [
      {
        stock_symbol: {
          type: String,
          required: true,
        },
        stock_name:{
          type:String,
          required:true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        purchased_price: {
          type: Number,
          required: true,
        },
        purchased_date: {
          type: Date,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
        brokerage: {
          type: Number,
          required: true,
        },
      },
    ],
    stocktype: {
      type: String,
      enum: ["indian", "us"],
      required: true,
    },
  },
  { timestamps: true }
);

const UserCreatedPortfolio = mongoose.model(
  "usercreatedportfolio",
  userCreatedPortfolioSchema
);

export default UserCreatedPortfolio;
