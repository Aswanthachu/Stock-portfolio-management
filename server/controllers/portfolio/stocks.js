import dotenv from "dotenv";

import GeneratePortfolio from "../../models/generatePortfolio.js";
import Stocks from "../../models/stocks.js";
import PortfolioSip from "../../models/portfolioSip.js";
import portfolioLumpsum from "../../models/portFolioLumpsum.js";

import { getStockDeatils,getStockDescription,getStockLogo, updateStockHistory } from "./portfolio.js";

dotenv.config({ path: "./config.env" });

// ######### edit stock details by price when they bought ##########

export const editUserStockDetails = async (req, res) => {
  const { id } = req.params;
  const { csv } = req.body;

  let buyed_date = 2023 - 4 - 21;

  try {
    const { investmentType } = await GeneratePortfolio.findOne({ userId: id });

    if (investmentType === "sip") {
      const newCsv = csv.filter(
        (item) =>
          item.quantity !== "" &&
          item.buyed_price !== "" &&
          item.buyed_cost_INR !== "" &&
          item.stock_symbol !== ""
      );

      const { stocks } = await PortfolioSip.findOne({
        userId: id,
      });

      if (stocks) {
        const newStocks = [];
        for (let i = 0; i < newCsv.length; i++) {
          const { quantity, buyed_price, buyed_cost_INR, stock_symbol } =
            newCsv[i];

          const data = stocks.filter(
            (stk) => stk.stock_symbol === stock_symbol
          );

          const percentage_of_portfolio = data[0]?.percentage_of_portfolio;

          const quantity_each_month = [];
          const stockDetails = {
            quantity,
            buyed_price,
            buyed_cost_INR,
          };

          quantity_each_month.push(stockDetails);

          newStocks.push({
            stock_symbol,
            quantity_each_month,
            percentage_of_portfolio,
          });
        }
        const convertedDate = new Date(buyed_date);

        const portfolioDetails = await PortfolioSip.findOneAndUpdate(
          {
            userId: id,
          },
          { $set: { buyingDate: new Date(convertedDate), stocks: newStocks } },
          { new: true }
        );

        portfolioDetails
          ? res
              .status(200)
              .json({ message: "stock details updated successfully.." })
          : res.status(400).json({ message: "stock details updated failed.." });
      }
    } else {
      let buyed_date = 2023 - 4 - 21;

      const newCsv = csv.filter(
        (item) =>
          item.quantity !== "" &&
          item.cost !== "" &&
          item.latest_price !== "" &&
          item.stock_symbol !== ""
      );

      const { stocks } = await portfolioLumpsum.findOne({
        userId: id,
      });

      if (stocks) {
        const newStocks = [];
        for (let i = 0; i < newCsv.length; i++) {
          const { quantity, buyed_price, cost, stock_symbol } = newCsv[i];

          const data = stocks.filter(
            (stk) => stk.stock_symbol === stock_symbol
          );

          const percentage_of_portfolio = data[0]?.percentage_of_portfolio;

          const latest_prices = [];

          latest_prices.push(buyed_price);

          newStocks.push({
            stock_symbol,
            quantity,
            cost,
            latest_prices,
            percentage_of_portfolio,
          });
        }
        const convertedDate = new Date(buyed_date);

        const portfolioDetails = await portfolioLumpsum.findOneAndUpdate(
          {
            userId: id,
          },
          { $set: { buyingDate: new Date(convertedDate), stocks: newStocks } },
          { new: true }
        );

        portfolioDetails
          ? res
              .status(200)
              .json({ message: "stock details updated successfully.." })
          : res.status(400).json({ message: "stock details updated failed.." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "error in updating stock details.." });
  }
};

// Used for adding new stocks.

export const addNewStocks = async (req, res) => {
  const { stock: stockname, portfolioPercentage: percentageOfProtfolio } = req.body;
  let stockName = stockname.toUpperCase();

  try {
    const { close: latestPrice, name ,currency ,mic_code,exchange} = await getStockDeatils(stockName);
    const logo = await getStockLogo(stockName)
    const description = await getStockDescription(stockName)

    const existingStock = await Stocks.findOne({ stock_symbol: stockName, });
    if (existingStock)
      await Stocks.findOneAndUpdate(
        { stock_symbol: stockName },
        {
          percentage_portfolio: percentageOfProtfolio,
          current_Price: latestPrice,
          active: true,
          logo_url:logo || "",
          currency,
          mic_code,
          exchange,
          description: description || ""
        }
      );
    else{
      const newStockInstance =   await Stocks.create({
        stock_symbol: stockName,
        percentage_portfolio: percentageOfProtfolio,
        current_Price: latestPrice,
        stock_name: name,
        active: true,
        logo_url:logo || "",
        currency,
        mic_code,
        exchange,
        description: description || "Detailed stock description is not available now"
      });
      await updateStockHistory(stockName)
      const date = new Date();
      const nextDay = new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0]
     await newStockInstance.updateStockPrice(nextDay,Number(parseFloat(latestPrice).toFixed(2)))
}
      
     
    const stocks = await Stocks.find({});

    stocks
      ? res.status(200).json({
          message: "stock added successfully..",
          newStock: stocks,
        })
      : res
          .status(400)
          .json({ message: "can`t get stock details from iexcloud." });
  } catch (error) {
    res.status(401).json({ message: "stock adding failed." });
    console.log(error);
  }
};

// adding new stocks using CSV.

export const addNewStocksByCSV = async (req, res) => {

  const { csv } = req.body;

  const newCsv = csv.filter(
    (item) => item.Ticker !== "" && item.Weightage !== ""
  );

  try {
    for (let i = 0; i < newCsv.length; i++) {
      const { Ticker, Weightage } = newCsv[i];

      const existingStock = await Stocks.findOne({
        stock_symbol: Ticker,
      });

      const { close: price, name } = await getStockDeatils(Ticker);

      if (existingStock)
        await Stocks.findOneAndUpdate(
          { stock_symbol: Ticker },
          { percentage_portfolio: Number(Weightage), current_Price: price }
        );
      else
        await Stocks.create({
          stock_symbol: Ticker,
          percentage_portfolio: Number(Weightage),
          current_Price: price,
          stock_name: name,
        });
    }

    // const allStocks = [];
    const stocks = await Stocks.find(
      {},
      { _id: true, stock_symbol: true, percentage_portfolio: true }
    );
    // for (let i = 0; i < stocks.length; i++) {
    //   const { price:latestPrice } = await getStockDeatils(stocks[i].stock_symbol);
    //   const tempData = { ...stocks[i]._doc, latest_price: latestPrice };
    //   allStocks.push(tempData);
    // }

    stocks
      ? res.status(200).json({ message: "stocks added successfully..", stocks })
      : res
          .status(400)
          .json({ message: "getting added stocks facing some problems." });
  } catch (error) {
    res.status(401).json({ message: "stock adding failed" });
  }
};

// fetching stocks details

export const getStocks = async (req, res) => {
  try {
    const stocks = await Stocks.find({}, { stock_rate: false });

    if (stocks.length > 0) {
      res.status(200).json({ stocks });
    } else {
      res.status(400).json({ message: "No stocks available." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Problem retrieving stock details.",
    });
  }
};

export const getSingleStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stock = await Stocks.findOne(
      { stock_symbol: id },
      { stock_rate: { $slice: -1827 } }
    );

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json({ stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Problem retrieving stock details.",
    });
  }
};

// editing stocks details

export const editStocks = async (req, res) => {
  const { id } = req.params;
  const { stock: stockname, portfolioPercentage: percentageOfProtfolio } =
    req.body;
  let stockName = stockname.toUpperCase();
  try {
    const { close: latestPrice, name } = await getStockDeatils(stockName);

    const updatedData = await Stocks.findByIdAndUpdate(
      id,
      {
        stock_symbol: stockName,
        percentage_portfolio: percentageOfProtfolio,
        current_Price: latestPrice,
        stock_name: name,
        active:true
      },
      { new: true }
    );

    updatedData
      ? res.status(200).json({
          message: "stock updated successfully..",
          updatedData,
        })
      : res.status(400).json({ message: "Stock updation failed" });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message:
        "problem at reaching iexcloud.io or problem in getting stock details.",
    });
  }
};

// for deleting a stock.

export const deleteStocks = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStock=await Stocks.findByIdAndUpdate(id, { active: false },{new:true});
    res.status(200).json({ message: "stock details deleted successfully...",deletedStock });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "deleting stock details failed." });
  }
};
