import mongoose from "mongoose";

const portSchema = mongoose.Schema(
  {
    generatePortfolioId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "generateportfolios",
    },
    stocks: [
      {
        stock_symbol: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
        //stores each months price ( used for the graph )
        latest_prices: {
          type: Array,
          required: true,
        },
        percentage_of_portfolio: {
          type: Number,
          required: true,
        },
        buyed_date: {
          type: Date,
          required: true,
          default: Date.now(),
        },
      },
    ],
    buyed_cost_INR: {
      type: Number,
      required: true,
    },
    buyingDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const portfolioLumpsum = mongoose.model("portfolioLumpsum", portSchema);

export default portfolioLumpsum;
