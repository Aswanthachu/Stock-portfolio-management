import mongoose from "mongoose";


const stockRateSchema = mongoose.Schema({
  stock_price: {
    type: Number,
    required: true,
  },
  price_date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  date: {
    type: String,
    required: true,
    default: () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
});

const stockSchema = mongoose.Schema({
  stock_symbol: {
    type: String,
    required: true,
    unique: true,
  },
  percentage_portfolio: {
    type: Number,
    required: true,
  },
  current_Price: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default:true
  },
  stock_rate: [stockRateSchema] ,
  stock_name: {
    type: String,
    required: true,
  },
  logo_url: {
    type: String, 
  },
  exchange: {
    type: String,
    required: true,
  },
  mic_code: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

stockSchema.methods.updateStockPrice = async function (date, stockPrice ) {
  const providedDate = date ? new Date(date) : new Date();
  const year = providedDate.getFullYear();
  const month = String(providedDate.getMonth() + 1).padStart(2, "0");
  const day = String(providedDate.getDate()).padStart(2, "0");
  const providedDateString = `${year}-${month}-${day}`;

  // Check if there is already a stock rate for the provided date
  const existingRate = this.stock_rate.find(
    (rate) => rate.date === providedDateString
  );

  if (existingRate) {
    // If rate for the provided date already exists, update the stock price
    existingRate.stock_price = stockPrice;
  } else {
    // If rate for the provided date doesn't exist, add a new stock rate
    this.stock_rate.push({
      stock_price: stockPrice,
      price_date: providedDate,
      date: providedDateString,
    });
  }

  // Save the updated stock document
  await this.save();
};

const Stocks = mongoose.model("stocks", stockSchema);

export default Stocks;
