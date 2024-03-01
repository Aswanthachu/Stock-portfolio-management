import cron from "node-cron";

import Stocks from "../models/stocks.js";
import PortfolioSip from "../models/portfolioSip.js";
import GeneratePortfolio from "../models/generatePortfolio.js";
import { getCurrentUSDValue } from "../controllers/user/user.js";


async function buyPendingStocks() {
    // ############# Logic for buying stocks in sip monthly..##################
  
    // Function to calculate the next month's date on the same day
    const getNextMonthSameDay = () => {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth.setUTCHours(0, 0, 0, 0);
    };
  
    const currentDate = new Date().setUTCHours(0, 0, 0, 0);
  
    const collectionsWantsToBuyStocksInSip = await PortfolioSip.find(
      {
        buyingDate: {
          $eq: currentDate,
        },
      } // Start of target date
    );

    if(collectionsWantsToBuyStocksInSip.length === 0) return;
  
    const USD = await getCurrentUSDValue();
  
    for (let i = 0; i < collectionsWantsToBuyStocksInSip.length; i++) {
      const { installment } =
        await GeneratePortfolio.findById(
          //here changed initial installment as initial investment
          collectionsWantsToBuyStocksInSip[i].generatePortfolioId,
          { investmentType: true, installment: true }
        );
  
      USDPRICE = USD; // ### current USD price is set in to global variable USDPRICE ###
  
      let { stocks } = collectionsWantsToBuyStocksInSip[i];
  
      const installmentAfterReduction = installment - (installment * 1.5) / 100;
  
      const reductedInUsd = installmentAfterReduction / USD;
  
      let stocksArray = [];
  
      if (stocks) {
        for (let j = 0; j < stocks.length; j++) {
          const { stock_symbol, percentage_of_portfolio, quantity_each_month } =
            stocks[j];
  
          const { current_Price } = await Stocks.findOne({ stock_symbol });
  
          let latestPrice;
          if (current_Price) latestPrice = current_Price;
          else {
            const { close: price } = await getStockDeatils(stock_symbol);
            latestPrice = price;
          }
  
          const usdForStock = (reductedInUsd * percentage_of_portfolio) / 100; 
          const quantity = [
            ...quantity_each_month,
            {
              quantity: usdForStock / latestPrice,
              buyed_price: latestPrice,
              buyed_cost_INR: USD,
            },
          ];
  
          const tempData = {
            stock_symbol,
            percentage_of_portfolio,
            quantity_each_month: quantity,
          };
  
          if (tempData) {
            stocksArray.push(tempData);
          }
        }
  
        await PortfolioSip.findByIdAndUpdate(
          collectionsWantsToBuyStocksInSip[i]._id,
          { stocks: stocksArray, buyingDate: new Date(getNextMonthSameDay()) }
        );
      }
    }
  }
  
  cron.schedule("0 10 * * *", () => {
    console.log("cron schedule is started.");
    buyPendingStocks();
  });
  