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
        quantity_each_month: [
          {
            quantity: {
              type: Number,
              required: true,
            },
            buyed_price: {
              type: Number,
              // required: true,
            },
            buyed_cost_INR: {
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
        percentage_of_portfolio: {
          type: Number,
          required: true,
        },
      },
    ],
    buyingDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const PortfolioSip = mongoose.model("portfolioSip", portSchema);

export default PortfolioSip;
