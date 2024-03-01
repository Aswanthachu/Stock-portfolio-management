import axios from "axios";
import dotenv from "dotenv";

import GeneratePortfolio from "../../models/generatePortfolio.js";
import portfolioLumpsum from "../../models/portFolioLumpsum.js";
import PortfolioSip from "../../models/portfolioSip.js";
import Stocks from "../../models/stocks.js";
import User from "../../models/user.js";

import { Types } from "mongoose";
import client from "../../lib/reddis-Connection.js";

dotenv.config({ path: "./config.env" });

// fetching stock details from twelve data api.

export async function getStockDeatils(symbol) {
  const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`;
  let value;
  await axios
    .get(url)
    .then((res) => {
      value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return value;
}

export const addWeekendDates = (historicalData) => {
  // Convert date strings to Date objects

  // Find the minimum and maximum dates in the data
  const minDate = new Date(
    Math.min(...historicalData.map((item) => new Date(item.datetime).getTime()))
  );
  const maxDate = new Date();

  // Generate a date range from the minimum to the maximum date
  const dateRange = [];
  let currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const result = dateRange.map((item) => {
    const dataDate = new Date(item);
    const date = item.toISOString().split("T")[0];
    let stockData;
    if (item.getDay() === 6) {
      dataDate.setDate(dataDate.getDate() - 1);
    } else if (item.getDay() === 0) {
      dataDate.setDate(dataDate.getDate() - 2);
    }
    stockData =
      historicalData.find(
        (item) => item.datetime === dataDate.toISOString().split("T")[0]
      ) ||
      historicalData.reduce((prev, current) => {
        const currentDate = new Date(current.datetime)
          .toISOString()
          .split("T")[0];
        if (
          new Date(currentDate) <
            new Date(dataDate.toISOString().split("T")[0]) &&
          (!prev || new Date(prev.datetime) < new Date(currentDate))
        ) {
          return current;
        }
        return prev;
      }, null);

    // Extract the stock_price
    const stockPrice = stockData ? stockData.close : null;
    return { price_date: item, date, stock_price: stockPrice };
  });

  return result;
};

export const updateStockHistory = async (symbol) => {
  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=1565&apikey=${process.env.TWELVE_DATA_API_KEY}`;
    const { data } = await axios.get(url);
    const historicalData = data.values;
    const stock = await Stocks.findOne({ stock_symbol: symbol });
    const historicalDataWithWeekends = addWeekendDates(historicalData);

    for (const data of historicalDataWithWeekends) {
      const existingRateIndex = stock.stock_rate.findIndex(
        (rate) => rate.date === data.date
      );

      if (existingRateIndex !== -1) {
        stock.stock_rate[existingRateIndex].stock_price = Number(
          parseFloat(data.stock_price).toFixed(2)
        );
      } else {
        stock.stock_rate.push({
          stock_price: Number(parseFloat(data.stock_price).toFixed(2)),
          price_date: data.price_date,
          date: data.date,
        });
      }
    }

    await stock.save();

    console.log(`Stock history updated for ${symbol}`);
  } catch (error) {
    console.log(error);
    console.error(`Error updating stock history for ${symbol}:`, error.message);
  }
};

export const getStockDescription = async (symbol) => {
  const { data } = await axios.get(
    `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY2}`
  );
  return data?.Description;
};

export const getStockLogo = async (symbol) => {
  const { data } = await axios.get(
    `https://api.twelvedata.com/logo?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`
  );
  return data?.url;
};

export async function getStockDetailsForADate(symbol, date) {
  const start_date = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 3
  )
    .toISOString()
    .split("T")[0];

  const end_date = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  )
    .toISOString()
    .split("T")[0];

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${start_date}&end_date=${end_date}&apikey=${process.env.TWELVE_DATA_API_KEY}`;
  const response = await axios.get(url);

  for (let value in response.data.values) {
    if (
      new Date(date).setUTCHours(0, 0, 0, 0) -
        new Date(response.data.values[value].datetime).setUTCHours(
          0,
          0,
          0,
          0
        ) >=
      0
    ) {
      return Number(response.data.values[value].close).toFixed(2);
    }
  }
}

// ############ function for getting current USD Value  from openexchangerates.org api ##########

export async function getCurrentUSDValue() {
  const { data } = await axios.get(
    `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_APP_ID}&base=USD`
  );
  return data.rates.INR;
}

// ########### funnction for creating portfolio Table data ###########//

export const getTableData = async ({
  stocks,
  // buyed_cost_INR,
  type: investmentType,
}) => {
  const stocksArray = {};
  const stockLogo = {};
  const stockSymbol = {};
  if (investmentType === "sip") {
    // table data for sip users

    for (let i = 0; i < stocks.length; i++) {
      const { stock_symbol, quantity_each_month } = stocks[i];

      const { current_Price, stock_name, logo_url } = await Stocks.findOne({
        stock_symbol,
      });
      stockLogo[stock_name] = logo_url;
      stockSymbol[stock_name] = stock_symbol;
      let latestPrice;
      let companyName;
      if (current_Price && stock_name) {
        latestPrice = current_Price;
        companyName = stock_name;
      } else {
        const { close: price, name } = await getStockDeatils(stock_symbol);
        latestPrice = price;
        companyName = name;
      }

      let totalShares = 0;
      let cost = 0;
      let buyedPricesTotal = 0;

      for (let j = 0; j < quantity_each_month.length; j++) {
        const { quantity, buyed_price, buyed_cost_INR } =
          quantity_each_month[j];

        totalShares += quantity;
        cost += quantity * buyed_price;

        buyedPricesTotal += quantity * buyed_price;
      }

      // #### calculations for table data ######

      const totalCostAverage = cost / quantity_each_month.length;
      const averageOfBuyedPricesTotal =
        buyedPricesTotal / quantity_each_month.length;

      let totalValue = totalShares * latestPrice;

      const totalChange = totalValue - averageOfBuyedPricesTotal;
      const totalChangeInPercentage =
        (totalChange / averageOfBuyedPricesTotal) * 100;

      const tempData = {
        share: Number(totalShares.toFixed(5)),
        totalCostAverage: Number(totalCostAverage.toFixed(3)),
        latestPrice: Number(latestPrice.toFixed(3)),
        totalChange: Number(totalChange.toFixed(3)),
        totalChangeInPercentage: Number(totalChangeInPercentage.toFixed(3)),
        totalValue: Number(totalValue.toFixed(3)),
      };

      if (tempData) {
        stocksArray[companyName] = tempData;
      }
    }
  } else {
    // table data for lumpsum users;

    for (let i = 0; i < stocks.length; i++) {
      const { stock_symbol, quantity, cost, latest_prices } = stocks[i];

      const { current_Price, stock_name, logo_url } = await Stocks.findOne({
        stock_symbol,
      });
      stockLogo[stock_name] = logo_url;
      stockSymbol[stock_name] = stock_symbol;
      let latestPrice;
      let companyName;
      if (current_Price && stock_name) {
        latestPrice = current_Price;
        companyName = stock_name;
      } else {
        const { close: price, name } = await getStockDeatils(stock_symbol);

        latestPrice = price;
        companyName = name;
      }

      let totalValue = quantity * latestPrice;
      const totalChange = totalValue - quantity * latest_prices[0];
      const totalChangeInPercentage =
        (totalChange / quantity) * latest_prices[0] * 100;

      const tempData = {
        share: Number(quantity.toFixed(5)),
        cost: Number(cost.toFixed(3)),
        latestPrice: Number(latestPrice.toFixed(3)),
        totalChange: Number(totalChange.toFixed(3)),
        totalChangeInPercentage: Number(totalChangeInPercentage.toFixed(3)),
        totalValue: Number(totalValue.toFixed(3)),
      };

      if (tempData) {
        stocksArray[companyName] = tempData;
      }
    }
  }

  if (stocksArray)
    return { dashboardTableData: stocksArray, stockLogo, stockSymbol };
};

// ########### funnction for creating portfolio Graph data ###########//

const getGraphData = async ({ stocks, createdAt, type: investmentType }) => {
  let days30 = [];

  let date1 = new Date(createdAt).setUTCHours(0, 0, 0, 0);
  let date2 = new Date(new Date()).setUTCHours(0, 0, 0, 0);
  const timeDiff = new Date(date2).getTime() - new Date(date1).getTime();
  const dateDifference = Math.floor(timeDiff / (1000 * 3600 * 24));
  const currentDate = new Date();

  if (dateDifference > 30) {
    for (let i = -1; i < 29; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i
      );
      days30.push(date);
    }
    days30.reverse();
  } else {
    for (let i = 1; i <= 30; i++) {
      const date = new Date(
        createdAt.getFullYear(),
        createdAt.getMonth(),
        createdAt.getDate() + i
      );
      days30.push(date);
    }
  }
  const sumForPortfolio = stocks.map((stock) => {
    const {
      quantity,
      quantity_each_month,
      latest_prices,
      stock_symbol,
      buyed_date,
    } = stock;

    let sumForTotalSingleStock = [];

    if (quantity_each_month) {
      const lastPurchasedStock = quantity_each_month.slice(-1)[0];
      const prev = quantity_each_month.reduce(
        (acc, { quantity }) => acc + quantity,
        0
      );

      sumForTotalSingleStock.push({
        [stock_symbol]: [prev, [lastPurchasedStock]],
      });
    } else {
      const lastPurchasedStock = latest_prices?.slice(-1)[0];
      const prev = quantity;

      sumForTotalSingleStock.push({
        [stock_symbol]: [prev, [lastPurchasedStock]],
      });
    }

    return sumForTotalSingleStock;
  });

  let totSumArray = [];

  sumForPortfolio.forEach((portfolio) => {
    portfolio.forEach((stock) => {
      const stockSymbol = Object.keys(stock)[0];

      const existingStock = totSumArray.find((obj) =>
        obj.hasOwnProperty(stockSymbol)
      );

      if (existingStock) {
        existingStock[stockSymbol][0] += stock[stockSymbol][0];
        existingStock[stockSymbol][1].push(...stock[stockSymbol][1]);
      } else {
        totSumArray.push(stock);
      }
    });
  });

  const totSumAndDate = days30.map((date) => ({
    [new Date(date.setUTCHours(0, 0, 0, 0))]: 0,
  }));
  const findStock = async (symbol) => {
    const stockDocument = await Stocks.findOne(
      { stock_symbol: symbol },
      { stock_rate: { $slice: -40 }, _id: false }
    );
    if (stockDocument) {
      return stockDocument.stock_rate;
    } else {
      // Handle case where the stock with the given symbol is not found
      return null;
    }
  };

  const areDatesEqual = (date1, date2) => date1.getTime() === date2.getTime();

  for (const obj of totSumArray) {
    const stockSymbol = Object.keys(obj)[0];
    const quantity = Object.values(obj)[0][0];
    const purchaseDates = Object.values(obj)[0][1];

    if (quantity !== 0) {
      const stockRate = await findStock(stockSymbol);

      for (let i = 0; i < totSumAndDate.length; i++) {
        const currentDate = new Date(Object.keys(totSumAndDate[i])[0]);
        const stockData = stockRate.find((stk) =>
          areDatesEqual(new Date(stk.price_date), currentDate)
        );

        if (stockData) {
          const { stock_price, price_date } = stockData;
          totSumAndDate[i][new Date(price_date.setUTCHours(0, 0, 0, 0))] +=
            quantity * stock_price.toFixed(2);
        }
      }

      for (let i = 0; i < purchaseDates.length; i++) {
        let j = new Date(purchaseDates[i][1]);
        while (Math.floor((j - date2) / (1000 * 3600 * 24)) <= 0) {
          const currentDate = new Date(j.setUTCHours(0, 0, 0, 0));
          const stockData = stockRate.find((stk) =>
            areDatesEqual(new Date(stk.price_date), currentDate)
          );

          let stock_price, price_date;

          if (stockData) {
            stock_price = stockData.stock_price;
            price_date = stockData.price_date;
          } else {
            const price = await getStockDetailsForADate(stockSymbol, j);
            stock_price = price;
            price_date = j;
          }

          for (let k = 0; k < totSumAndDate.length; k++) {
            totSumAndDate[k][new Date(price_date.setUTCHours(0, 0, 0, 0))] +=
              Number(purchaseDates[i][0]) * Number(stock_price).toFixed(2);
          }

          j = new Date(j.setDate(j.getDate() + 1));
        }
      }
    }
  }
  const Data = totSumAndDate.map((dateObj) => {
    const date = new Date(Object.keys(dateObj)[0]);
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const value = Number(Object.values(dateObj)[0].toFixed(2));

    return {
      time: formattedDate,
      ...(value !== 0 && { value }),
    };
  });
  // Check if Data is not empty before returning
  if (Data.length > 0) {
    return Data;
  }
};

// Controller for adding new portfolio to existing portfolios

export const addNewPortfolio = async (req, res) => {
  const { userId } = req;

  const {
    installment,
    portfolioname,
    investmentPlan: investmentType,
    frequency,
  } = req.body;

  try {
    if (!installment || !portfolioname || !investmentType)
      return res.status(400).json({ message: "Some datas are missing." });

    // created new portfolio for user.

    let PortfolioId;

    if (investmentType === "sip") {
      const { _id: portfolioId } = await GeneratePortfolio.create({
        userId,
        investmentType,
        initial_investment: installment,
        installment,
        frequency,
        portfolioname,
      });

      PortfolioId = portfolioId;
    } else {
      const { _id: portfolioId } = await GeneratePortfolio.create({
        userId,
        investmentType,
        installment,
        frequency,
        portfolioname,
      });

      PortfolioId = portfolioId;
    }

    if (!PortfolioId)
      return res
        .status(400)
        .json({ message: "Error while generating portfolio" });

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { portfolios: PortfolioId },
      },
      { new: true }
    );

    // Buying stocks and save it into stocksToBuy

    const stocks = await Stocks.find({ active: true });

    if (!stocks)
      return res
        .status(400)
        .json({ message: "Error while fetching stock details." });

    const USD = await getCurrentUSDValue();

    if (!USD)
      return res.status(400).json({ message: "Error in fetching USD Value." });

    const initInvestAfterReduction = installment - (installment * 1.5) / 100;

    const reductedInUsd = initInvestAfterReduction / USD;

    let tempData = {};
    let stocksArray = [];

    for (let i = 0; i < stocks.length; i++) {
      const {
        stock_symbol,
        percentage_portfolio,
        // current_Price: latestPrice,
        stock_rate,
      } = stocks[i];
      const { stock_price: latestPrice } = stock_rate[stock_rate.length - 1];
      // const { close: latestPrice } = await getStockDeatils(stock_symbol);

      const usdForStock = (reductedInUsd * percentage_portfolio) / 100;

      if (investmentType === "lumpsum") {
        const latest_Prices_Array = [];
        latest_Prices_Array.push(latestPrice);

        tempData = {
          stock_symbol,
          quantity: usdForStock / latestPrice,
          cost: usdForStock,
          latest_prices: latest_Prices_Array,
          percentage_of_portfolio: percentage_portfolio,
        };

        if (tempData) {
          stocksArray.push(tempData);
        }
      } else {
        const quantity = [
          {
            quantity: usdForStock / latestPrice,
            buyed_price: latestPrice,
            buyed_cost_INR: USD,
          },
        ];

        tempData = {
          stock_symbol,
          quantity_each_month: quantity,
          percentage_of_portfolio: percentage_portfolio,
        };

        if (tempData) {
          stocksArray.push(tempData);
        }
      }
    }

    let data;

    if (investmentType === "lumpsum") {
      const stockBuyData = await portfolioLumpsum.create({
        generatePortfolioId: PortfolioId,
        stocks: stocksArray,
        buyed_cost_INR: USD,
      });

      if (!stockBuyData)
        return res.status(400).json({
          message: "lumpsum portfolio stock data creation failed",
        });

      const {
        stocks,
        createdAt,
        buyed_cost_INR,
        _id: portfolioRef,
      } = stockBuyData;
      await User.findByIdAndUpdate(userId, {
        investmentVerified: "notVerified",
      });
      await GeneratePortfolio.findByIdAndUpdate(PortfolioId, {
        portfolioRef,
      });

      const { dashboardTableData } = await getTableData({
        stocks,
        createdAt,
        buyed_cost_INR,
        type: "lumpsum",
      });

      const dashboardGraphData = await getGraphData({
        stocks,
        createdAt,
        type: "lumpsum",
      });

      data = { dashboardTableData, dashboardGraphData };
    } else {
      const stockBuyData = await PortfolioSip.create({
        generatePortfolioId: PortfolioId,
        stocks: stocksArray,
      });

      if (!stockBuyData)
        return res
          .status(400)
          .json({ message: "sip portfolio stock data creation failed" });

      const { stocks, createdAt, _id: portfolioRef } = stockBuyData;

      await User.findByIdAndUpdate(userId, {
        investmentVerified: "notVerified",
      });
      await GeneratePortfolio.findByIdAndUpdate(PortfolioId, {
        portfolioRef,
      });

      const { dashboardTableData } = await getTableData({
        stocks,
        createdAt,
        type: "sip",
      });

      const dashboardGraphData = await getGraphData({
        stocks,
        createdAt,
        type: "sip",
      });

      data = { dashboardTableData, dashboardGraphData };
    }

    const portfolio = {
      portfolioId: PortfolioId,
      portfolio_name: portfolioname,
      investmentType,
    };

    if (!data || Object.keys(data).length < 2)
      return res.status(400).json({
        message: "Error while creating portfoliotable or portfoliograph data.",
      });

    res.status(200).json({
      message: "successfully created new portfolio.",
      data,
      portfolio,
    });

    await client.del(userId + "_dashboard");
    await client.del(userId + "_graph");

    const cachedPortfolios = await client.get(`userPortfolios:${userId}`);

    if (cachedPortfolios) {
      const data = JSON.parse(cachedPortfolios);
      const { portfolios } = data;

      const newPortfolio = {
        portfolioId: PortfolioId,
        portfolio_name: portfolioname,
        investmentType,
        investmentVerified: "notVerified",
      };

      const dataToCache = {
        ...data,
        portfolios: [newPortfolio, ...portfolios],
      };

      await client.set(
        `userPortfolios:${userId}`,
        JSON.stringify(dataToCache),
        {
          EX: 3600,
        }
      );
    }
  } catch (error) {
    res.status(500).json({
      message: "portfolio creation failed due to some internal server error",
      error: error.message,
    });
    console.log(error);
  }
};

// controller for getting all portfolio details and fetching first portfolios.

export const getPortfoliosDetails = async (req, res) => {
  const { userId } = req;
  try {
    // Check if data is in the cache
    const cachedData = await client.get(`userPortfolios:${userId}`);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).json(parsedData);
    }

    const result = await User.aggregate([
      { $match: { _id: Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "generateportfolios",
          localField: "portfolios",
          foreignField: "_id",
          as: "port",
        },
      },
      {
        $unwind: {
          path: "$port",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          portfolios: {
            $push: {
              portfolioId: "$port._id",
              portfolio_name: "$port.portfolioname",
              investmentType: "$port.investmentType",
              investmentVerified: "$port.investmentVerified",
            },
          },
        },
      },
      {
        $lookup: {
          from: "usercreatedportfolio",
          localField: "user_created_portfolios",
          foreignField: "_id",
          as: "port",
        },
      },
    ]);

    if (!result)
      return res
        .status(400)
        .json({ message: "Error while fetching portfolio details of user." });

    if (Object.keys(result[0].portfolios[0]).length === 0)
      return res.status(200).json({
        message: "User not created any portfolio yet.",
        data: { dashboardTableData: [], dashboardGraphData: [] },
        portfolios: [],
      });

    const { investmentType, portfolioId } = result[0].portfolios[0];

    if (investmentType && portfolioId) {
      const currentUSDValue = await getCurrentUSDValue();

      let data;
      if (investmentType === "sip") {
        const { stocks, createdAt } = await PortfolioSip.findOne({
          generatePortfolioId: portfolioId,
        });

        const { dashboardTableData, stockLogo, stockSymbol } =
          await getTableData({
            stocks,
            createdAt,
            type: "sip",
          });

        const dashboardGraphData = await getGraphData({
          stocks,
          createdAt,
          type: "sip",
        });

        data = {
          dashboardTableData,
          dashboardGraphData,
          portfolioId,
          currentUSDValue,
          stockLogo,
          stockSymbol,
        };
      } else {
        const { stocks, createdAt, buyed_cost_INR } =
          await portfolioLumpsum.findOne({
            generatePortfolioId: portfolioId,
          });
        const { dashboardTableData, stockLogo, stockSymbol } =
          await getTableData({
            stocks,
            createdAt,
            buyed_cost_INR,
            type: "lumpsum",
          });

        const dashboardGraphData = await getGraphData({
          stocks,
          createdAt,
          type: "lumpsum",
        });

        data = {
          dashboardTableData,
          dashboardGraphData,
          portfolioId,
          currentUSDValue,
          stockLogo,
          stockSymbol,
        };
      }

      if (!data || Object.keys(data).length < 2)
        return res.status(400).json({
          message:
            "Error occured while creating dashboard table and graph data.",
        });

      // Construct the response object

      const response = {
        data,
        portfolios: result[0].portfolios,
        message: "successfully get the portfolio values",
      };
      // Store the data in the cache with an expiration time
      await client.set(`userPortfolios:${userId}`, JSON.stringify(response), {
        EX: 3600,
      }); // Cache for 1 hour
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ message: "No Data" });
    }
  } catch (error) {
    res.status(500).json({
      message: "server error while calculating portfolio details",
      error: error.message,
    });
    console.log(error);
  }
};

// controller for getting only portfolios

export const getAllPortfolios = async (req, res) => {
  try {
    const { userId } = req;

    const result = await User.aggregate([
      { $match: { _id: Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "generateportfolios",
          localField: "portfolios",
          foreignField: "_id",
          as: "port",
        },
      },
      {
        $unwind: {
          path: "$port",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          portfolios: {
            $push: {
              portfolioId: "$port._id",
              portfolio_name: "$port.portfolioname",
              investmentType: "$port.investmentType",
              investmentVerified: "$port.investmentVerified",
            },
          },
        },
      },
      {
        $lookup: {
          from: "usercreatedportfolio",
          localField: "user_created_portfolios",
          foreignField: "_id",
          as: "port",
        },
      },
    ]);

    if (!result)
      return res
        .status(400)
        .json({ message: "Error while fetching portfolios" });

    if (Object.keys(result[0].portfolios[0]).length < 1)
      return res
        .status(200)
        .json({ message: "User not created any portfolios", portfolios: [] });

    res.status(200).json({
      message: "all portfolios fetched successfully.",
      portfolios: result[0].portfolios,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Internal Server Error :- ${error.message}` });
  }
};

// controller for fetching single portfolio details

export const getSinglePortfolio = async (req, res) => {
  const { investmentType, portfolioId } = req.body;
  try {
    if (!investmentType || !portfolioId)
      return res.status(400).json({ message: "Some datas are missing." });

    // Try to fetch data from Redis cache
    const cachedData = await client.get(
      `portfolio:${investmentType}:${portfolioId}`
    );

    if (cachedData) {
      // If data is found in cache, send it directly
      return res.status(200).json({
        data: JSON.parse(cachedData),
        message: "successfully get the portfolio values from cache",
      });
    }

    let data;
    if (investmentType === "sip") {
      const { stocks, createdAt } = await PortfolioSip.findOne({
        generatePortfolioId: portfolioId,
      });

      const { dashboardTableData, stockLogo } = await getTableData({
        stocks,
        createdAt,
        type: "sip",
      });

      const dashboardGraphData = await getGraphData({
        stocks,
        createdAt,
        type: "sip",
      });
      data = { dashboardTableData, dashboardGraphData, portfolioId, stockLogo };
    } else {
      const { stocks, createdAt, buyed_cost_INR } =
        await portfolioLumpsum.findOne({
          generatePortfolioId: portfolioId,
        });

      const { dashboardTableData, stockLogo } = await getTableData({
        stocks,
        createdAt,
        buyed_cost_INR,
        type: "lumpsum",
      });

      const dashboardGraphData = await getGraphData({
        stocks,
        createdAt,
        type: "lumpsum",
      });

      data = { dashboardTableData, dashboardGraphData, portfolioId, stockLogo };
    }

    if (!data || Object.keys(data).length < 2)
      return res
        .status(400)
        .json({ message: "Some error while creating portfolio details." });

    const cacheExpiration = 3600; // Cache expiration time in seconds
    // Store data in Redis cache for future use
    client.set(
      `portfolio:${investmentType}:${portfolioId}`,
      JSON.stringify(data),
      { EX: cacheExpiration }
    ); // Cache for 1 hour

    res.status(200).json({
      data,
      message: "successfully get the portfolio values",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error due to some server error",
      error: error.message,
    });
    console.log(error);
  }
};

// controller for getting single portfolio stock details.

export const getSingleStockToBuy = async (req, res) => {
  const { portfolioId, investmentType } = req.body;

  async function findStock(symbol) {
    return await Stocks.findOne({ stock_symbol: symbol });
  }

  // Try to fetch data from Redis cache
  const cachedData = await client.get(
    `stockToBuy:${investmentType}:${portfolioId}`
  );

  if (cachedData) {
    // If data is found in cache, send it directly
    return res.status(200).json({
      userBuyedStock: JSON.parse(cachedData),
      message: "successfully get the portfolio values from cache",
    });
  }

  try {
    if (!portfolioId || !investmentType)
      return res
        .status(400)
        .json({ message: "missing of datas in request body." });

    let userBuyedStock;
    const currentUSDValue = await getCurrentUSDValue();

    if (investmentType === "sip") {
      const { stocks } = await PortfolioSip.findOne({
        generatePortfolioId: portfolioId,
      });

      const stockList = {};
      const stockLogo = {};
      const stockSymbol = {};

      for (let stock of stocks) {
        const { percentage_of_portfolio, stock_symbol, quantity_each_month } =
          stock;

        const { stock_name, stock_rate, logo_url } = await findStock(
          stock_symbol
        );

        let stkDetails = {
          current_Price: stock_rate[stock_rate.length - 1].stock_price,
          percentage_of_portfolio,
          amount_invest: Number(
            quantity_each_month[0].quantity.toFixed(3) *
              stock_rate[stock_rate.length - 1].stock_price
          ).toFixed(3),
        };
        stockList[stock_name] = stkDetails;
        stockLogo[stock_name] = logo_url;
        stockSymbol[stock_name] = stock_symbol;
      }
      userBuyedStock = { stockList, stockLogo, stockSymbol, currentUSDValue };
    } else {
      const { stocks } = await portfolioLumpsum.findOne({
        generatePortfolioId: portfolioId,
      });

      const stockList = {};
      const stockLogo = {};
      const stockSymbol = {};

      for (let stock of stocks) {
        const { percentage_of_portfolio, stock_symbol, quantity } = stock;
        const { stock_name, stock_rate, logo_url } = await findStock(
          stock_symbol
        );

        let stkDetails = {
          current_Price: stock_rate[stock_rate.length - 1].stock_price,
          percentage_of_portfolio,
          amount_invest: Number(
            quantity.toFixed(3) * stock_rate[stock_rate.length - 1].stock_price
          ).toFixed(3),
          amount_invest: Number(
            quantity.toFixed(3) * stock_rate[stock_rate.length - 1].stock_price
          ).toFixed(3),
        };
        stockList[stock_name] = stkDetails;
        stockLogo[stock_name] = logo_url;
        stockSymbol[stock_name] = stock_symbol;
      }
      userBuyedStock = { stockList, stockLogo, stockSymbol, currentUSDValue };
    }

    userBuyedStock
      ? res.status(200).json({
          message: "successfully get single stock to buy data",
          userBuyedStock,
        })
      : res
          .status(400)
          .json({ message: "get single stock to buy data failed." });

    const cacheExpiration = 3600; // Cache expiration time in seconds
    // Store data in Redis cache for future use
    client.set(
      `stockToBuy:${investmentType}:${portfolioId}`,
      JSON.stringify(userBuyedStock),
      { EX: cacheExpiration }
    ); // Cache for 1 hour
  } catch (error) {
    res.status(500).json({
      message:
        "getting single stock to buy details failed due to internal server error",
    });
    console.log(error);
  }
};

// controller for fetching stock settings data.

export const getSingleStockSettings = async (req, res) => {
  const { portfolioId } = req.params;
  try {
    const cachedData = await client.get(`portfolioSettings:${portfolioId}`);

    if (cachedData) {
      // If data is found in cache, send it directly
      return res.status(200).json({
        portfolioSettings: JSON.parse(cachedData),
        message: "successfully get the portfolio values from cache",
      });
    }

    const portfolioSettings = await GeneratePortfolio.findById(portfolioId, {
      __v: false,
    });
    portfolioSettings
      ? res.status(200).json({
          message: "getting portfolio settings data successfully",
          portfolioSettings,
        })
      : res
          .status(400)
          .json({ message: "getting portfolio settings data failed." });

    const cacheExpiration = 3600; // Cache expiration time in seconds
    // Store data in Redis cache for future use
    client.set(
      `portfolioSettings:${portfolioId}`,
      JSON.stringify(portfolioSettings),
      { EX: cacheExpiration }
    ); // Cache for 1 hour
  } catch (error) {
    res.status(500).json({
      message:
        "getting single dashboard settings details failed due to internal server error",
    });
    console.log(error);
  }
};

// controller for deleting portfolio

export const deleteSinglePortfolio = async (req, res) => {
  const { userId } = req;
  const { portfolioId, investmentType } = req.body;
  try {
    await GeneratePortfolio.findByIdAndDelete(portfolioId);
    await User.findByIdAndUpdate(userId, {
      $pull: { portfolios: portfolioId },
    });

    if (investmentType === "sip")
      await PortfolioSip.findOneAndDelete({ portfolioId });
    await portfolioLumpsum.findOneAndDelete({ portfolioId });

    res
      .status(200)
      .json({ message: "successfully deleted portfolio", portfolioId });

    await client.del(`portfolio:${investmentType}:${portfolioId}`);
    await client.del(userId + "_dashboard");
    await client.del(userId + "_graph");

    const cachedPortfolios = await client.get(`userPortfolios:${userId}`);

    if (cachedPortfolios) {
      const data = JSON.parse(cachedPortfolios);

      const { portfolios } = data;

      const editedCache = portfolios.filter(
        (portfolio) => portfolio.portfolioId !== portfolioId
      );

      const dataToCache = { ...data, portfolios: editedCache };

      await client.set(
        `userPortfolios:${userId}`,
        JSON.stringify(dataToCache),
        {
          EX: 3600,
        }
      );
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error : while deleting portfolio." });
    console.log(error);
  }
};

// controller for updatinging portfolio details

export const editPortfolioSettings = async (req, res) => {
  const { portfolioname, portfolioId } = req.body;
  const { userId } = req;

  try {
    const editedPortfolio = await GeneratePortfolio.findByIdAndUpdate(
      portfolioId,
      { portfolioname },
      { new: true }
    );

    editedPortfolio &&
      res.status(200).json({
        message: "portfolio details updated successfully..",
        editedPortfolio,
      });

    const cachedData = await client.get(`userPortfolios:${userId}`);

    if (cachedData) {
      const data = JSON.parse(cachedData);

      const { portfolios } = data;

      const editedCache = portfolios.map((portfolio) =>
        portfolio.portfolioId === portfolioId
          ? { ...portfolio, portfolio_name: portfolioname }
          : portfolio
      );

      const dataToCache = { ...data, portfolios: editedCache };
      await client.set(
        `userPortfolios:${userId}`,
        JSON.stringify(dataToCache),
        {
          EX: 3600,
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: "portfolio details can't edit." });
    console.log(error);
  }
};
