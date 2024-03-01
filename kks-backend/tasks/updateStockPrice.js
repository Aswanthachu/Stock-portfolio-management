import cron from "node-cron";
import dotenv from "dotenv";
import Stocks from "../models/stocks.js";
import axios from "axios";

import { getStockDeatils } from "../controllers/portfolio/portfolio.js";
import { sendEmail } from "../lib/mailFunction.js";

dotenv.config({ path: "./config.env" });

async function fetchDataFromAlPHA(symbol) {
  const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  const response = await axios.get(apiUrl);
  return response.data["Global Quote"]["05. price"];
}

const from = `KKS Capitals ${process.env.MAILER_MAIL}`;

async function UpdateStockRate() {
  try {
    const stocks = await Stocks.find({}, { stock_symbol: true });
    if (stocks.length) {
      for (let index = 0; index < stocks.length; index++) {
        const { stock_symbol } = stocks[index];

        const timeframes = [1, 5, 30, 60];
        const maxRetries = 3;
        let retryCount = 0;
        const emails = process.env.ERROR_NOTIFY_MAILS.split(",");

        while (retryCount < maxRetries) {
          try {
            const { close } = await getStockDeatils(stock_symbol);

            if (close) {
              const date = new Date();
              const nextDay = new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0]
              const stockInstance = await Stocks.findOne({ stock_symbol })
              await stockInstance.updateStockPrice(new Date().toISOString().split('T')[0], Number(parseFloat(close).toFixed(2)))
              await stockInstance.updateStockPrice(nextDay, Number(parseFloat(close).toFixed(2)))
              break;
            } else {
              const text = `Can't fetch stock details for ${stock_symbol}`;
              for (let email of emails) {
                const args = [
                  from,
                  email,
                  "Stock price can't fetch from twelve data api.",
                  text,
                ];
                sendEmail(...args);
              }

              await new Promise((resolve) =>
                setTimeout(resolve, timeframes[retryCount] * 60 * 1000)
              );

              retryCount++;
            }
          } catch (error) {
            console.error(`Error: ${error.message}`);

            const text = `An error occurred while fetching stock details for ${stock_symbol}.\nError: ${error.message}`;

            for (let email of emails) {
              const args = [
                from,
                email,
                "Stock price can't fetch from twelve data api.",
                text,
              ];
              sendEmail(...args);
            }

            await new Promise((resolve) =>
              setTimeout(resolve, timeframes[retryCount] * 60 * 1000)
            );
            retryCount++;
          }
        }

        if (retryCount === 3) {
          try {
            const close = await fetchDataFromAlPHA(stock_symbol);

            if (close) {
              const date = new Date();
              const nextDay = new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0]
              const stockInstance = await Stocks.findOne({ stock_symbol })
              await stockInstance.updateStockPrice(new Date().toISOString().split('T')[0], Number(parseFloat(close).toFixed(2)))
              await stockInstance.updateStockPrice(nextDay, Number(parseFloat(close).toFixed(2)))

              break;
            }
          } catch (error) {
            console.error(error.message);

            const text = `An error occurred while fetching stock details for ${stock_symbol}.\nError: ${error.message}`;

            for (let email of emails) {
              const args = [
                from,
                email,
                "Stock price can't fetch from Alpha Vantage api.",
                text,
              ];
              sendEmail(...args);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("32 18 * * *", () => {
  console.log("NodeCron started.");
  UpdateStockRate();
});
