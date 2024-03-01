import dotenv from "dotenv";
import axios from "axios";

import UserCreatedPortfolio from "../models/userCreatedPortfolio.js";
import User from "../models/user.js";
import mongoose from "mongoose";

import client from "../lib/reddis-Connection.js";
import { getCurrentUSDValue } from "./portfolio/portfolio.js";

dotenv.config({ path: "./config.env" });

async function getStockDeatils(symbol, start_date, end_date) {
  let interval = "1day";
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&start_date=${start_date}&end_date=${end_date}&apikey=${process.env.TWELVE_DATA_API_KEY}`;
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

async function getSingleStockDeatils(symbol) {
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

function search(array, target) {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);

    if (
      new Date(array[middle].datetime).setUTCHours(0, 0, 0, 0) - target ===
      0
    ) {
      return array[middle];
    } else if (
      new Date(array[middle].datetime).setUTCHours(0, 0, 0, 0) - target <
      0
    ) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }

  return 0;
}

function objectSearch(array, target) {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);

    if (
      new Date(Object.keys(array[middle])[0]).setUTCHours(0, 0, 0, 0) -
        target ===
      0
    ) {
      return middle;
    } else if (
      new Date(Object.keys(array[middle])).setUTCHours(0, 0, 0, 0) - target <
      0
    ) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }
}

export const createSelfPortfolio = async (req, res) => {
  const { userId } = req;
  const stockData = req.body;
  try {
    const { savedStocks, portfolioName } = stockData;

    let days30 = [];
    savedStocks.sort(
      (a, b) => new Date(a.purchasedDate) - new Date(b.purchasedDate)
    );

    let date1 = new Date(savedStocks[0].purchasedDate).setUTCHours(0, 0, 0, 0);
    let date2 = new Date(new Date()).setUTCHours(0, 0, 0, 0);
    const timeDiff = new Date(date2).getTime() - new Date(date1).getTime();
    const dateDifference = Math.floor(timeDiff / (1000 * 3600 * 24));
    const currentDate = new Date().setUTCHours(0, 0, 0, 0);

    if (dateDifference > 30) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - i
        ).setUTCHours(0, 0, 0, 0);

        const year = new Date(date).getFullYear();
        const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
        const day = ("0" + new Date(date).getDate()).slice(-2);
        const formattedDate = year + "-" + month + "-" + day;
        days30.push(formattedDate);
      }
      days30.reverse();
    } else {
      for (let i = 1; i <= 30; i++) {
        const date = new Date(
          new Date(savedStocks[0].purchasedDate).getFullYear(),
          new Date(savedStocks[0].purchasedDate).getMonth(),
          new Date(savedStocks[0].purchasedDate).getDate() + i
        ).setUTCHours(0, 0, 0, 0);

        const year = new Date(date).getFullYear();
        const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
        const day = ("0" + new Date(date).getDate()).slice(-2);
        const formattedDate = year + "-" + month + "-" + day;
        days30.push(formattedDate);
      }
    }

    let totSumWithDate = [];

    for (let i = 0; i < days30.length; i++) {
      totSumWithDate.push({ [days30[i]]: 0 });
    }

    const year = new Date(currentDate).getFullYear();
    const month = ("0" + (new Date(currentDate).getMonth() + 1)).slice(-2);
    const day = ("0" + new Date(currentDate).getDate()).slice(-2);
    const formattedSecondDate = year + "-" + month + "-" + day;

    for (let i = 0; i < savedStocks.length; i++) {
      const { purchasedDate, stockname, quantity } = savedStocks[i];

      let first_date;

      if (
        new Date(purchasedDate).setUTCHours(0, 0, 0, 0) -
          new Date(days30[0]).setUTCHours(0, 0, 0, 0) <
        0
      )
        first_date = new Date(days30[0]);
      else first_date = new Date(purchasedDate).setUTCHours(0, 0, 0, 0);

      const getDataFirstDate = new Date(
        new Date(first_date).getFullYear(),
        new Date(first_date).getMonth(),
        new Date(first_date).getDate() - 5
      ).setUTCHours(0, 0, 0, 0);

      const yearForFirstDate = new Date(getDataFirstDate).getFullYear();
      const monthForFirstDate = (
        "0" +
        (new Date(getDataFirstDate).getMonth() + 1)
      ).slice(-2);
      const dayForFirstDate = (
        "0" + new Date(getDataFirstDate).getDate()
      ).slice(-2);
      const formattedFirstDate =
        yearForFirstDate + "-" + monthForFirstDate + "-" + dayForFirstDate;

      const { values } = await getStockDeatils(
        stockname,
        formattedFirstDate,
        formattedSecondDate
      );

      console.log(values);

      if (values?.length) {
        values.reverse();
      }

      for (
        let j = new Date(first_date), l = 1;
        j - currentDate <= 0;
        j = new Date(new Date(j).setDate(new Date(j).getDate() + 1)), l++
      ) {
        if (l >= 10 && l % 5 === 0) {
          values.splice(0, 5);
        }

        let closedPrice;

        if (j - currentDate < 0) {
          const { close } = search(values, j);

          if (!close) {
            let Close = 0;

            for (let k = 1; Close === 0 && k < 5; k++) {
              const data = search(
                values,
                new Date(new Date(j).setDate(new Date(j).getDate() - k))
              );
              data === 0 ? (Close = 0) : (Close = data.close);
            }
            closedPrice = Number(Close);
          } else {
            closedPrice = Number(close);
          }
        } else {
          const { close } = await getSingleStockDeatils(stockname);
          closedPrice = Number(close);
        }

        const index = objectSearch(totSumWithDate, j);
        totSumWithDate[index][Object.keys(totSumWithDate[index])[0]] +=
          quantity * closedPrice;
      }
    }

    const Data = totSumWithDate.map((dateObj) => {
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

    let stockList = [];
    let tableData = {};

    for (let i = 0; i < savedStocks.length; i++) {
      const {
        stockname,
        quantity,
        purchasedDate,
        Total,
        brokerage,
        name,
        price,
        shareprice,
      } = savedStocks[i];

      stockList.push({
        stock_symbol: stockname,
        quantity,
        stock_name: name,
        purchased_date: purchasedDate,
        purchased_price: shareprice,
        total: Total,
        brokerage: brokerage,
      });

      const totalChange = quantity * price - quantity * shareprice;
      const totalChangeInPercentage =
        (totalChange / (quantity * shareprice)) * 100;

      tableData[name] = {
        share: Number(quantity),
        latestPrice: Number(price),
        total: Number(Total),
        totalChange: Number(totalChange),
        totalChangeInPercentage: Number(totalChangeInPercentage),
        cost: Number(quantity * price),
      };
    }

    const { _id: portfolioId } = await UserCreatedPortfolio.create({
      userId,
      portfolio_name: portfolioName,
      stockList,
      stocktype: savedStocks[0].stockType,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { user_created_portfolios: portfolioId },
    });

    res.status(200).json({
      portfolio: {
        portfolioId,
        portfolio_name: portfolioName,
        selfCreated: true,
        newlyCreated: true,
      },
      dashboardGraphData: Data,
      dashboardTableData: tableData,
      portfolioId,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllSelfCreatePortfoliosAndFirstData = async (req, res) => {
  const { userId } = req;

  try {
    const cachedData = await client.get(
      `getAllSelfCreatedPortfolios:${userId}`
    );
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    const { portfolios } = await User.findById(userId);

    const data = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "usercreatedportfolios",
          let: {
            portfolioIds: "$user_created_portfolios",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$portfolioIds"],
                },
              },
            },
          ],
          as: "selfPortfolios",
        },
      },
      {
        $project: {
          selfPortfolios: 1,
        },
      },
    ]);

    const { selfPortfolios } = data[0];

    if (!selfPortfolios || selfPortfolios.length < 1)
      return res
        .status(200)
        .json({ message: "User not created any self created portfolio",allSelfCreatedPortfolios:[] });

    const allSelfCreatedPortfolios = [];

    for (let i = 0; i < selfPortfolios.length; i++) {
      const { portfolio_name, _id: portfolioId, stocktype } = selfPortfolios[i];
      allSelfCreatedPortfolios.push({
        portfolio_name,
        portfolioId,
        stocktype,
        selfCreated: true,
      });
    }

    if (portfolios.length > 0)
      return res.status(200).json({
        message: "self created portfolios fetched successfully.",
        allSelfCreatedPortfolios,
      });

    const { stockList } = selfPortfolios[0];

    let days30 = [];
    stockList.sort(
      (a, b) => new Date(a.purchased_date) - new Date(b.purchased_date)
    );
    let date1 = new Date(stockList[0].purchased_date).setUTCHours(0, 0, 0, 0);
    let date2 = new Date(new Date()).setUTCHours(0, 0, 0, 0);
    const timeDiff = new Date(date2).getTime() - new Date(date1).getTime();
    const dateDifference = Math.floor(timeDiff / (1000 * 3600 * 24));
    const currentDate = new Date().setUTCHours(0, 0, 0, 0);

    if (dateDifference > 30) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - i
        ).setUTCHours(0, 0, 0, 0);

        const year = new Date(date).getFullYear();
        const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
        const day = ("0" + new Date(date).getDate()).slice(-2);
        const formattedDate = year + "-" + month + "-" + day;
        days30.push(formattedDate);
      }
      days30.reverse();
    } else {
      for (let i = 1; i <= 30; i++) {
        const date = new Date(
          new Date(stock_details[0].purchased_date).getFullYear(),
          new Date(stock_details[0].purchased_date).getMonth(),
          new Date(stock_details[0].purchased_date).getDate() + i
        ).setUTCHours(0, 0, 0, 0);

        const year = new Date(date).getFullYear();
        const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
        const day = ("0" + new Date(date).getDate()).slice(-2);
        const formattedDate = year + "-" + month + "-" + day;
        days30.push(formattedDate);
      }
    }

    let totSumWithDate = [];

    for (let i = 0; i < days30.length; i++) {
      totSumWithDate.push({ [days30[i]]: 0 });
    }

    const year = new Date(currentDate).getFullYear();
    const month = ("0" + (new Date(currentDate).getMonth() + 1)).slice(-2);
    const day = ("0" + new Date(currentDate).getDate()).slice(-2);
    const formattedSecondDate = year + "-" + month + "-" + day;

    for (let i = 0; i < stock_details.length; i++) {
      const { purchased_date, stock_symbol, quantity } = stock_details[i];

      let first_date;

      if (
        new Date(purchased_date).setUTCHours(0, 0, 0, 0) -
          new Date(days30[0]).setUTCHours(0, 0, 0, 0) <
        0
      )
        first_date = new Date(days30[0]);
      else first_date = new Date(purchased_date).setUTCHours(0, 0, 0, 0);

      const getDataFirstDate = new Date(
        new Date(first_date).getFullYear(),
        new Date(first_date).getMonth(),
        new Date(first_date).getDate() - 5
      ).setUTCHours(0, 0, 0, 0);

      const yearForFirstDate = new Date(getDataFirstDate).getFullYear();
      const monthForFirstDate = (
        "0" +
        (new Date(getDataFirstDate).getMonth() + 1)
      ).slice(-2);
      const dayForFirstDate = (
        "0" + new Date(getDataFirstDate).getDate()
      ).slice(-2);
      const formattedFirstDate =
        yearForFirstDate + "-" + monthForFirstDate + "-" + dayForFirstDate;

      const { values } = await getStockDeatils(
        stock_symbol,
        formattedFirstDate,
        formattedSecondDate
      );

      values.reverse();

      for (
        let j = new Date(first_date), l = 1;
        j - currentDate <= 0;
        j = new Date(new Date(j).setDate(new Date(j).getDate() + 1)), l++
      ) {
        if (l >= 10 && l % 5 === 0) {
          values.splice(0, 5);
        }

        let closedPrice;

        if (j - currentDate < 0) {
          const { close } = search(values, j);

          if (!close) {
            let Close = 0;

            for (let k = 1; Close === 0 && k < 5; k++) {
              const data = search(
                values,
                new Date(new Date(j).setDate(new Date(j).getDate() - k))
              );
              data === 0 ? (Close = 0) : (Close = data.close);
            }
            closedPrice = Number(Close);
          } else {
            closedPrice = Number(close);
          }
        } else {
          const { close } = await getSingleStockDeatils(stock_symbol);
          closedPrice = Number(close);
        }

        const index = objectSearch(totSumWithDate, j);
        totSumWithDate[index][Object.keys(totSumWithDate[index])[0]] +=
          quantity * closedPrice;
      }
    }

    const Data = totSumWithDate.map((dateObj) => {
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

    let tableData = {};

    for (let i = 0; i < stock_details.length; i++) {
      const { stock_symbol, quantity, purchased_price } = stock_details[i];

      const { name, close: latestPrice } = await getSingleStockDeatils(
        stock_symbol
      );

      const totalChange = quantity * latestPrice - quantity * purchased_price;
      const totalChangeInPercentage =
        (totalChange / (quantity * purchased_price)) * 100;

      tableData[name] = {
        share: Number(quantity.toFixed(5)),
        latestPrice: Number(latestPrice.toFixed(3)),
        total: Number((quantity * latestPrice).toFixed(3)),
        totalChange: Number(totalChange.toFixed(3)),
        totalChangeInPercentage: Number(totalChangeInPercentage.toFixed(3)),
        cost: Number((quantity * purchased_price).toFixed(3)),
      };
    }

    const response = {
      message: "self portfolio dashboard data fetched successfully.",
      allSelfCreatedPortfolios,
      dashboardGraphData: Data,
      dashboardTableData: tableData,
      portfolioId: selfPortfolios[0]._id,
    };

    res.status(200).json(response);

    client.set(
      `getAllSelfCreatedPortfolios:${userId}`,
      JSON.stringify(response),
      { EX: 3600 }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getSelfCreatedSinglePortfolio = async (req, res) => {
  const { portfolioId } = req.params;
  try {
    const cachedData = await client.get(
      `getSelfCreatedSinglePortfolio:${portfolioId}`
    );
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    const portfolio = await UserCreatedPortfolio.findById(portfolioId);

    if (!portfolio)
      return res
        .status(400)
        .json({ message: "There is not portfolio with this id." });

    const { stockList } = portfolio;

    console.log(stockList);

    let days30 = [];
    stockList.sort(
      (a, b) => new Date(a.purchased_date) - new Date(b.purchased_date)
    );
    let date1 = new Date(stockList[0].purchased_date).setUTCHours(0, 0, 0, 0);
    let date2 = new Date(new Date()).setUTCHours(0, 0, 0, 0);
    const timeDiff = new Date(date2).getTime() - new Date(date1).getTime();
    const dateDifference = Math.floor(timeDiff / (1000 * 3600 * 24));
    const currentDate = new Date().setUTCHours(0, 0, 0, 0);

    if (dateDifference > 30) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - i
        ).setUTCHours(0, 0, 0, 0);

        const year = new Date(date).getFullYear();
        const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
        const day = ("0" + new Date(date).getDate()).slice(-2);
        const formattedDate = year + "-" + month + "-" + day;
        days30.push(formattedDate);
      }
      days30.reverse();
    } else {
      for (let i = 1; i <= 30; i++) {
        const date = new Date(
          new Date(stockList[0].purchased_date).getFullYear(),
          new Date(stockList[0].purchased_date).getMonth(),
          new Date(stockList[0].purchased_date).getDate() + i
        ).setUTCHours(0, 0, 0, 0);

        const year = new Date(date).getFullYear();
        const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
        const day = ("0" + new Date(date).getDate()).slice(-2);
        const formattedDate = year + "-" + month + "-" + day;
        days30.push(formattedDate);
      }
    }

    let totSumWithDate = [];

    for (let i = 0; i < days30.length; i++) {
      totSumWithDate.push({ [days30[i]]: 0 });
    }

    const year = new Date(currentDate).getFullYear();
    const month = ("0" + (new Date(currentDate).getMonth() + 1)).slice(-2);
    const day = ("0" + new Date(currentDate).getDate()).slice(-2);
    const formattedSecondDate = year + "-" + month + "-" + day;

    for (let i = 0; i < stockList.length; i++) {
      const { purchased_date, stock_symbol, quantity } = stockList[i];

      let first_date;

      if (
        new Date(purchased_date).setUTCHours(0, 0, 0, 0) -
          new Date(days30[0]).setUTCHours(0, 0, 0, 0) <
        0
      )
        first_date = new Date(days30[0]);
      else first_date = new Date(purchased_date).setUTCHours(0, 0, 0, 0);

      const getDataFirstDate = new Date(
        new Date(first_date).getFullYear(),
        new Date(first_date).getMonth(),
        new Date(first_date).getDate() - 5
      ).setUTCHours(0, 0, 0, 0);

      const yearForFirstDate = new Date(getDataFirstDate).getFullYear();
      const monthForFirstDate = (
        "0" +
        (new Date(getDataFirstDate).getMonth() + 1)
      ).slice(-2);
      const dayForFirstDate = (
        "0" + new Date(getDataFirstDate).getDate()
      ).slice(-2);
      const formattedFirstDate =
        yearForFirstDate + "-" + monthForFirstDate + "-" + dayForFirstDate;

      const { values } = await getStockDeatils(
        stock_symbol,
        formattedFirstDate,
        formattedSecondDate
      );

      values.reverse();

      for (
        let j = new Date(first_date), l = 1;
        j - currentDate <= 0;
        j = new Date(new Date(j).setDate(new Date(j).getDate() + 1)), l++
      ) {
        if (l >= 10 && l % 5 === 0) {
          values.splice(0, 5);
        }

        let closedPrice;

        if (j - currentDate < 0) {
          const { close } = search(values, j);

          if (!close) {
            let Close = 0;

            for (let k = 1; Close === 0 && k < 5; k++) {
              const data = search(
                values,
                new Date(new Date(j).setDate(new Date(j).getDate() - k))
              );
              data === 0 ? (Close = 0) : (Close = data.close);
            }
            closedPrice = Number(Close);
          } else {
            closedPrice = Number(close);
          }
        } else {
          const { close } = await getSingleStockDeatils(stock_symbol);
          closedPrice = Number(close);
        }

        const index = objectSearch(totSumWithDate, j);
        totSumWithDate[index][Object.keys(totSumWithDate[index])[0]] +=
          quantity * closedPrice;
      }
    }

    const Data = totSumWithDate.map((dateObj) => {
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

    let tableData = {};

    for (let i = 0; i < stockList.length; i++) {
      const { stock_symbol, quantity, purchased_price } = stockList[i];

      const { name, close: latestPrice } = await getSingleStockDeatils(
        stock_symbol
      );

      const totalChange = quantity * latestPrice - quantity * purchased_price;
      const totalChangeInPercentage =
        (totalChange / (quantity * purchased_price)) * 100;

      tableData[name] = {
        share: Number(quantity.toFixed(5)),
        latestPrice: Number(latestPrice).toFixed(3),
        total: Number((quantity * latestPrice).toFixed(3)),
        totalChange: Number(totalChange.toFixed(3)),
        totalChangeInPercentage: Number(totalChangeInPercentage.toFixed(3)),
        cost: Number((quantity * purchased_price).toFixed(3)),
      };
    }

    const response = {
      message: "single self portfolio dashboard data fetched successfully.",
      dashboardGraphData: Data,
      dashboardTableData: tableData,
      portfolioId,
    };

    res.status(200).json(response);

    client.set(
      `getSelfCreatedSinglePortfolio:${portfolioId}`,
      JSON.stringify(response),
      { EX: 3600 }
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteSelfCreatedSinglePortfolio = async (req, res) => {
  const { portfolioId } = req.params;
  const { userId } = req;

  if (!portfolioId || !userId)
    return res.status(400).json({
      message: "Missing of portfolioId from request or unauthorized request.",
    });

  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { user_created_portfolios: portfolioId } },
      { new: true }
    );

    await UserCreatedPortfolio.findByIdAndRemove(portfolioId);

    res.status(200).json({
      message: "User created portfolio deleted successfully..",
      portfolioId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Internal server error while deleting user self created portfolio.",
    });
  }
};

export const getSelfCreatedSinglePortfolioStocklist = async (req, res) => {
  const { portfolioId } = req.params;

  try {
    const cachedData = await client.get(
      `getSelfCreatedSinglePortfolio:Stocklist${portfolioId}`
    );
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    const result = await UserCreatedPortfolio.findById(portfolioId, {
      stockList: 1,
      portfolio_name: 1,
    });

    const { portfolio_name, stockList } = result;

    const Total = stockList.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.total;
    }, 0);

    const USD = await getCurrentUSDValue();

    let stockObject = {};

    for (const element of stockList) {
      const { close: current_Price } = await getSingleStockDeatils(
        element.stock_symbol
      );
      stockObject[element.stock_name] = {
        current_Price: Number(current_Price).toFixed(3),
        percentage_of_portfolio: Number(
          ((element.total / Total) * 100).toFixed(3)
        ),
        amount_invest: Number((element.total/USD).toFixed(3)),
      };
    }

    if (!stockObject)
      return res
        .status(400)
        .json({ message: "Error while fetching stock list." });

    const response = {
      message: "user self created portfolio fetched successfully.",
      userBuyedStock: { stockList: stockObject },
    };

    res.status(200).json(response);

    client.set(
      `getSelfCreatedSinglePortfolio:Stocklist${portfolioId}`,
      JSON.stringify(response),
      { EX: 3600 }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "user buyed stock list fetching failed due to internal server error.",
    });
  }
};

export const getSelfCreatedSinglePortfolioSettings = async (req, res) => {
  const { portfolioId } = req.params;
  try {
    const cachedData = await client.get(
      `selfCreatedPortfolioSettings:${portfolioId}`
    );
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    const {
      stockList,
      portfolio_name: portfolioname,
      createdAt,
    } = await UserCreatedPortfolio.findById(portfolioId);

    let Total = 0;

    stockList.forEach((element) => {
      Total += element.total;
    });

    const data = {
      portfolioname,
      createdAt,
      portfolioId,
      Total,
    };

    if (!data)
      return res.status(400).json({
        message: "Error while fetching user created portfolio settings",
      });

    const response = {
      message: "Portfolio details fetched successfully..",
      portfolioSettings: data,
    };

    res.status(200).json(response);

    client.set(
      `selfCreatedPortfolioSettings:${portfolioId}`,
      JSON.stringify(response),
      { EX: 3600 }
    );
  } catch (error) {
    console.log(error);
  }
};

export const editSelfCreatedSinglePortfolioSettings = async (req, res) => {
  const { portfolioname, portfolioId } = req.body;
  try {
    const data = await UserCreatedPortfolio.findByIdAndUpdate(portfolioId, {
      portfolio_name: portfolioname,
    });
    if (!data)
      res.status(400).json({
        message: "Error while updated user created portfolio settings",
      });
    else
      res.status(200).json({
        message: "Portfolio name updated successfully..",
        editedData: { portfolio_name: portfolioname, portfolioId },
      });
  } catch (error) {
    console.log(error);
  }
};
