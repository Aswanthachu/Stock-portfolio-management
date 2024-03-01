import Stocks from "../../models/stocks.js";
import User from "../../models/user.js";
import {
  getCurrentUSDValue,
  getStockDeatils,
  getStockDetailsForADate,
} from "./portfolio.js";
import { Types } from "mongoose";
import subscription from "../../models/subscription.js";

import client from "../../lib/reddis-Connection.js";

// fetch main dashboard datas except graph data through calculation

export const userDashboardData = async (req, res) => {
  const { userId } = req;
  // const { userId } = req.body;
  try {
    // Check if data is cached in Redis
    const cachedData = await client.get(userId + "_dashboard");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).json(parsedData);
    }
    const stockLogo = {}
    const stockSymbol = {}
    const data = await User.aggregate([
      {
        $match: {
          _id: Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "generateportfolios",
          localField: "portfolios",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          investmentType: "$result.investmentType",
        },
      },
      {
        $facet: {
          sips: [
            {
              $lookup: {
                localField: "result.portfolioRef",
                from: "portfoliosips",
                foreignField: "_id",
                as: "newUser",
              },
            },
            {
              $unwind: "$newUser",
            },
            {
              $group: {
                _id: "$_id",
                portfolios: {
                  $push: "$result",
                },
                investments: {
                  $push: "$newUser",
                },
              },
            },
            {
              $project: {
                _id: 0,
                data: {
                  $zip: {
                    inputs: ["$portfolios", "$investments"],
                  },
                },
              },
            },
            {
              $unwind: "$data",
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [
                    {
                      $arrayElemAt: ["$data", 0],
                    },
                    {
                      $arrayElemAt: ["$data", 1],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                userId: 1,
                investmentType: 1,
                initial_investment: 1,
                installment: 1,
                stocks: 1,
                buyingDate: 1,
                buyed_cost_INR: 1,
                createdAt: 1,
              },
            },
          ],
          lumpsums: [
            {
              $lookup: {
                localField: "result.portfolioRef",
                from: "portfoliolumpsums",
                foreignField: "_id",
                as: "newUser",
              },
            },
            {
              $unwind: "$newUser",
            },
            {
              $group: {
                _id: "$_id",
                portfolios: {
                  $push: "$result",
                },
                investments: {
                  $push: "$newUser",
                },
              },
            },
            {
              $project: {
                _id: 0,
                data: {
                  $zip: {
                    inputs: ["$portfolios", "$investments"],
                  },
                },
              },
            },
            {
              $unwind: "$data",
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [
                    {
                      $arrayElemAt: ["$data", 0],
                    },
                    {
                      $arrayElemAt: ["$data", 1],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                userId: 1,
                investmentType: 1,
                installment: 1,
                stocks: 1,
                buyingDate: 1,
                buyed_cost_INR: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          portfolios: {
            $concatArrays: ["$sips", "$lumpsums"],
          },
        },
      },
    ]);

    const { portfolios } = data[0];

    if (portfolios.length === 0) {
      const planDetails = await subscription
        .find({ userId, $or: [{ status: "active" }, { status: "pending" }] })
        .sort({ createdAt: 1 });

      let endDate;
      let plan;
      if (planDetails[0]) {
        plan = planDetails[0]?.plan;
        endDate = planDetails[0]?.endDate;
      }

      return res.status(200).json({
        totalGainDetails: {
          End_Date: endDate,
          pln: plan
            ? plan.charAt(0).toUpperCase() + plan?.slice(1).toLowerCase()
            : "Free",
        },
        tableData: {},
        message: "User not created any portfolios",
      });
    }

    let portfoliosArray = [];
    let gainDetailsArray = [];

    const USDPRICE = await getCurrentUSDValue();

    for (let i = 0; i < portfolios.length; i++) {
      const {
        investmentType,
        initial_investment,
        installment,
        stocks,
        buyed_cost_INR,
      } = portfolios[i];

      let stocksArray = [];
      let totalGainDetails = {};
      if (investmentType === "sip") {
        for (let i = 0; i < stocks.length; i++) {
          const { stock_symbol, quantity_each_month } = stocks[i];

          const stockDetails = await Stocks.findOne({
            stock_symbol,
          });

          stockLogo[stockDetails?.stock_name] = stockDetails?.logo_url
          stockSymbol[stockDetails?.stock_name] = stockDetails?.stock_symbol

          let latestPrice;
          let companyName;
          if (stockDetails.current_Price && stockDetails.stock_name) {
            latestPrice = stockDetails.current_Price;
            companyName = stockDetails.stock_name;
          } else {
            const { close: price, name } = await getStockDeatils(stock_symbol);
            latestPrice = price;
            companyName = name;
          }

          let totalShares = 0;
          let cost = 0;
          let buyedPricesTotal = 0;
          let totalCostINR = 0;

          for (let j = 0; j < quantity_each_month.length; j++) {
            const { quantity, buyed_price, buyed_cost_INR } =
              quantity_each_month[j];

            totalShares += quantity;
            cost += quantity * buyed_price;

            buyedPricesTotal += quantity * buyed_price;
            totalCostINR += buyed_cost_INR;
          }

          // #### calculations for table data ######

          const totalCostAverage = cost / quantity_each_month.length;
          const averageOfBuyedPricesTotal =
            buyedPricesTotal / quantity_each_month.length;

          // const totalChange = latestPrice - averageOfBuyedPricesTotal;

          let totalValue = totalShares * latestPrice;

          const totalChange = totalValue - averageOfBuyedPricesTotal;
          const totalChangeInPercentage =
            (totalChange / averageOfBuyedPricesTotal) * 100;

          const tempData = {
            companyName,
            share: Number(totalShares.toFixed(5)),
            totalCostAverage: Number(totalCostAverage.toFixed(3)),
            latestPrice: Number(latestPrice.toFixed(3)),
            totalChange: Number(totalChange.toFixed(3)),
            totalChangeInPercentage: Number(totalChangeInPercentage.toFixed(3)),
            totalValue: Number(totalValue.toFixed(3)),
            totalCost: Number(cost.toFixed(3)), //
            totalCostINR, //
          };

          if (tempData) {
            stocksArray.push(tempData);
          }
        }

        // ####### calculations for total investment capital gain  currency gain total returns ###########

        // ### Total Investment, capital gain ,total returns ####

        let sumOfTotalInvestmentINR =
          initial_investment ||
          installment +
          (stocks[0].quantity_each_month.length - 1) * installment;

        let sumOfINRcost = 0;
        let totalInvestmentUSD = 0;
        let totalValueForShareUSD = 0;

        for (let i = 0; i < stocksArray.length; i++) {
          const { totalCostINR, totalCost, share, latestPrice } =
            stocksArray[i];
          sumOfINRcost += totalCostINR;
          totalInvestmentUSD += totalCost; // ### sum of total cost in USD ###
          totalValueForShareUSD += share * latestPrice; //### finding total value in USD ###/
        }

        // ### calculation of capital gain ###

        const capitalGain = totalValueForShareUSD - totalInvestmentUSD;
        const capitalGainPercentage = (capitalGain * 100) / totalInvestmentUSD;

        // ### calculation of currency gain ###

        const averageOfTotalINRcost =
          sumOfINRcost / (stocks.length * stocks[0].quantity_each_month.length);

        const currencyGain = USDPRICE - averageOfTotalINRcost;
        const currencyGainInPercentage = (currencyGain / USDPRICE) * 100;

        // ### calculation of total returns ###

        const totalReturns = capitalGain / USDPRICE;
        const totalReturnPercentage =
          (totalReturns / sumOfTotalInvestmentINR) * 100;

        totalGainDetails = {
          sumOfTotalInvestmentINR,
          capitalGain: capitalGain,
          capitalGainPercentage: capitalGainPercentage,
          currencyGain: currencyGain,
          currencyGainInPercentage: currencyGainInPercentage,
          totalReturns: totalReturns,
          totalReturnPercentage: totalReturnPercentage,
          totalPortfolio: totalValueForShareUSD * USDPRICE,
        };

        if (totalGainDetails) {
          gainDetailsArray.push(totalGainDetails);
        }

        for (let i = 0; i < stocksArray.length; i++) {
          delete stocksArray[i].totalCostINR;
          delete stocksArray[i].totalCost;
        }

        if (stocksArray) {
          portfoliosArray.push(stocksArray);
        }
      } else {
        for (let i = 0; i < stocks.length; i++) {
          const { stock_symbol, quantity, cost, latest_prices } = stocks[i];

          const stockDetails = await Stocks.findOne({
            stock_symbol,
          });
          let latestPrice;
          let companyName;
          if (stockDetails.current_Price && stockDetails.stock_name) {
            latestPrice = stockDetails.current_Price;
            companyName = stockDetails.stock_name;
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
            companyName,
            share: Number(quantity).toFixed(5),
            cost: Number(cost).toFixed(3),
            latestPrice: Number(latestPrice).toFixed(3),
            totalChange: Number(totalChange).toFixed(3),
            totalChangeInPercentage: Number(totalChangeInPercentage).toFixed(3),
            totalValue: Number(totalValue).toFixed(3),
            buyed_cost_INR,
          };

          if (tempData) {
            stocksArray.push(tempData);
          }
        }

        // ####### calculations for total investment capital gain  currency gain total returns ###########

        // ### Total Investment, capital gain ,total returns ####

        // let sumOfTotalInvestmentINR = 0;
        let totalInvestmentUSD = 0;
        let totalValueForShareUSD = 0;

        for (let i = 0; i < stocksArray.length; i++) {
          const { cost, share, latestPrice } = stocksArray[i];
          totalInvestmentUSD += parseFloat(cost); // ### sum of total cost in USD ###
          totalValueForShareUSD += parseFloat(share) * parseFloat(latestPrice); //### finding total value in USD ###
        }

        // ### calculation of capital gain ###

        const capitalGain = totalValueForShareUSD - totalInvestmentUSD;
        const capitalGainPercentage = (capitalGain * 100) / totalInvestmentUSD;

        // ### calculation of currency gain ###

        const currencyGain = USDPRICE - buyed_cost_INR;
        const currencyGainInPercentage = (currencyGain / USDPRICE) * 100;

        // ### calculation of total returns ###

        const totalReturns = capitalGain / USDPRICE;
        const totalReturnPercentage = (totalReturns / installment) * 100;

        totalGainDetails = {
          sumOfTotalInvestmentINR: installment,
          capitalGain: capitalGain,
          capitalGainPercentage: capitalGainPercentage,
          currencyGain: currencyGain,
          currencyGainInPercentage: currencyGainInPercentage,
          totalReturns: totalReturns,
          totalReturnPercentage: totalReturnPercentage,
          totalPortfolio: totalValueForShareUSD * USDPRICE,
        };


        if (totalGainDetails) {
          gainDetailsArray.push(totalGainDetails);
        }

        for (let i = 0; i < stocksArray.length; i++) {
          delete stocksArray[i].buyed_cost_INR;

          let {
            share,
            cost,
            totalChange,
            totalChangeInPercentage,
            totalValue,
          } = stocksArray[i];

          stocksArray[i] = {
            ...stocksArray[i],
            share: share,
            cost: cost,
            totalChange: totalChange,
            totalChangeInPercentage: totalChangeInPercentage,
            totalValue: totalValue,
          };
        }

        if (stocksArray) {
          portfoliosArray.push(stocksArray);
        }
      }
    }

    const stockData = {};
    const gainData = {
      sumOfTotalInvestmentINR: 0,
      capitalGain: 0,
      capitalGainPercentage: 0,
      currencyGain: 0,
      currencyGainInPercentage: 0,
      totalReturns: 0,
      totalReturnPercentage: 0,
      totalPortfolio: 0,
    };

    for (let i = 0; i < portfoliosArray.length; i++) {
      for (let j = 0; j < portfoliosArray[i].length; j++) {
        const {
          companyName,
          share,
          totalCostAverage,
          latestPrice,
          totalChange,
          totalChangeInPercentage,
          totalValue,
          cost,
        } = portfoliosArray[i][j];

        if (stockData.hasOwnProperty(`${companyName}`)) {
          stockData[`${companyName}`].share +=
            parseFloat(share);
          if (cost) {
            stockData[`${companyName}`].totalCostAverage +=
              parseFloat(cost);
          } else {
            stockData[`${companyName}`].totalCostAverage +=
              parseFloat(totalCostAverage);
          }
          stockData[`${companyName}`].totalChange +=
            parseFloat(totalChange);
          stockData[`${companyName}`].totalChangeInPercentage +=
            parseFloat(totalChangeInPercentage);
          stockData[`${companyName}`].totalValue +=
            parseFloat(totalValue);
        } else {
          stockData[`${companyName}`] = {
            share: parseFloat(share),
            totalCostAverage: parseFloat(totalCostAverage) || parseFloat(cost),
            latestPrice: parseFloat(latestPrice),
            totalChange: parseFloat(totalChange),
            totalChangeInPercentage: parseFloat(
              totalChangeInPercentage
            ),
            totalValue: parseFloat(totalValue),
          };
        }
      }

      const {
        sumOfTotalInvestmentINR,
        capitalGain,
        capitalGainPercentage,
        currencyGain,
        currencyGainInPercentage,
        totalReturns,
        totalReturnPercentage,
        totalPortfolio,
      } = gainDetailsArray[i];

      (gainData.sumOfTotalInvestmentINR += sumOfTotalInvestmentINR),
        (gainData.capitalGain += capitalGain),
        (gainData.capitalGainPercentage += capitalGainPercentage),
        (gainData.currencyGain += currencyGain),
        (gainData.currencyGainInPercentage += currencyGainInPercentage),
        (gainData.totalReturns += totalReturns),
        (gainData.totalReturnPercentage += totalReturnPercentage),
        (gainData.totalPortfolio += totalPortfolio);
    }

    function roundObjectValues(obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          roundObjectValues(obj[key]); // Recursively process nested objects
        } else if (typeof obj[key] === 'number') {
          obj[key] = Number(obj[key].toFixed(3));
        }
      }
    }

    roundObjectValues(stockData);

    // subscription end date in user dashboard

    const planDetails = await subscription
      .find({ userId, $or: [{ status: "active" }, { status: "pending" }] })
      .sort({ createdAt: 1 });

    let endDate;
    let plan;
    if (planDetails[0]) {
      plan = planDetails[0].plan;
      endDate = planDetails[0].endDate;
    }

    const totalGainDetails = {
      sumOfTotalInvestmentINR: gainData.sumOfTotalInvestmentINR,
      totalPortfolioUSD:
        parseFloat((gainData.sumOfTotalInvestmentINR -
          (gainData.sumOfTotalInvestmentINR * 1.5) / 100) /
          USDPRICE).toFixed(3),
      capitalGain: parseFloat(gainData.capitalGain / portfoliosArray.length).toFixed(3),
      capitalGainPercentage:
        parseFloat(gainData.capitalGainPercentage / portfoliosArray.length).toFixed(3),
      currencyGain: parseFloat(gainData.currencyGain / portfoliosArray.length).toFixed(3),
      currencyGainInPercentage:
        parseFloat(gainData.currencyGainInPercentage / portfoliosArray.length).toFixed(3),
      totalReturns: parseFloat(gainData.totalReturns).toFixed(3),
      totalReturnPercentage: parseFloat(gainData.totalReturnPercentage),
      totalPortfolio: parseFloat(gainData.totalPortfolio).toFixed(3),
      End_Date: endDate,
      pln: plan?.charAt(0).toUpperCase() + plan?.slice(1).toLowerCase(),
    };


    // if (totalGainDetails && stockData) {
    //   res.status(200).json({ totalGainDetails, tableData: stockData });
    // }

    // Cache the computed data in Redis
    const cacheExpiration = 3600; // Cache expiration time in seconds
    const dataToCache = {
      totalGainDetails,
      tableData: stockData,
      stockLogo,
      stockSymbol
    };

    await client.set(userId + "_dashboard", JSON.stringify(dataToCache), {
      EX: cacheExpiration,
    });
    // Send the response
    res.status(200).json(dataToCache);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// fetch main dashboard  graph data through calculation

export const getMainDashboard = async (req, res) => {
  const { userId } = req;

  try {
    // Check if data is cached in Redis
    const cachedData = await client.get(userId + "_graph");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).json(parsedData);
    }

    const data = await User.aggregate([
      [
        {
          $match: {
            _id: Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "generateportfolios",
            localField: "portfolios",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $unwind: {
            path: "$result",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            investmentType: "$result.investmentType",
          },
        },
        {
          $facet: {
            sips: [
              {
                $lookup: {
                  localField: "result.portfolioRef",
                  from: "portfoliosips",
                  foreignField: "_id",
                  as: "newUser",
                },
              },
              {
                $unwind: "$newUser",
              },
              {
                $group: {
                  _id: "$_id",
                  portfolios: {
                    $push: "$result",
                  },
                  investments: {
                    $push: "$newUser",
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  data: {
                    $zip: {
                      inputs: ["$portfolios", "$investments"],
                    },
                  },
                },
              },
              {
                $unwind: "$data",
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      {
                        $arrayElemAt: ["$data", 0],
                      },
                      {
                        $arrayElemAt: ["$data", 1],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  userId: 1,
                  investmentType: 1,
                  initial_investment: 1,
                  installment: 1,
                  stocks: 1,
                  buyingDate: 1,
                  buyed_cost_INR: 1,
                  createdAt: 1,
                },
              },
            ],
            lumpsums: [
              {
                $lookup: {
                  localField: "result.portfolioRef",
                  from: "portfoliolumpsums",
                  foreignField: "_id",
                  as: "newUser",
                },
              },
              {
                $unwind: "$newUser",
              },
              {
                $group: {
                  _id: "$_id",
                  portfolios: {
                    $push: "$result",
                  },
                  investments: {
                    $push: "$newUser",
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  data: {
                    $zip: {
                      inputs: ["$portfolios", "$investments"],
                    },
                  },
                },
              },
              {
                $unwind: "$data",
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      {
                        $arrayElemAt: ["$data", 0],
                      },
                      {
                        $arrayElemAt: ["$data", 1],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  userId: 1,
                  investmentType: 1,
                  installment: 1,
                  stocks: 1,
                  buyingDate: 1,
                  buyed_cost_INR: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            portfolios: {
              $concatArrays: ["$sips", "$lumpsums"],
            },
          },
        },
      ],
    ]);

    const { portfolios } = data[0];

    if (portfolios.length === 0)
      return res.status(200).json({
        dashboardGraphData: [],
        message: "User dashboard graph data updated successfully.",
      });

    let days30 = [];

    portfolios.sort((a, b) => a.createdAt - b.createdAt);
    let date1 = new Date(portfolios[0].createdAt).setUTCHours(0, 0, 0, 0);
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
          portfolios[0].createdAt.getFullYear(),
          portfolios[0].createdAt.getMonth(),
          portfolios[0].createdAt.getDate() + i
        );
        days30.push(date);
      }
    }
    const sumForPortfolio = portfolios.map(({ stocks, investmentType }) => {
      return stocks.map(stock => {
        const {
          quantity_each_month,
          quantity,
          latest_prices,
          stock_symbol,
          buyed_date,
        } = stock;

        let prev = 0;
        let lastPurchasedStock;

        if (investmentType === "sip") {
          prev = quantity_each_month.reduce((acc, { quantity }) => acc + quantity, 0);
          lastPurchasedStock = quantity_each_month.slice(-1)[0];
        } else {
          prev = quantity;
          lastPurchasedStock = { quantity, buyed_date };
        }

        return { [stock_symbol]: [prev, [lastPurchasedStock]] };
      });
    });

    let totSumArray = [];

    sumForPortfolio.forEach((portfolio) => {
      portfolio.forEach((stock) => {
        const stockSymbol = Object.keys(stock)[0];

        const existingStock = totSumArray.find((obj) => obj.hasOwnProperty(stockSymbol));

        if (existingStock) {
          existingStock[stockSymbol][0] += stock[stockSymbol][0];
          existingStock[stockSymbol][1].push(...stock[stockSymbol][1]);
        } else {
          totSumArray.push(stock);
        }
      });
    });

    const totSumAndDate = days30.map(date => ({
      [new Date(date.setUTCHours(0, 0, 0, 0))]: 0
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
    }

    const areDatesEqual = (date1, date2) => date1.getTime() === date2.getTime();

    for (const obj of totSumArray) {
      const [quantity, purchaseDates] = Object.values(obj)[0];

      if (quantity !== 0) {
        const stockRate = await findStock(Object.keys(obj)[0]);

        for (const dateObj of totSumAndDate) {
          const currentDate = new Date(Object.keys(dateObj)[0]);
          const stockPriceData = stockRate.find((stk) =>
            areDatesEqual(new Date(stk.price_date), currentDate)
          );

          if (stockPriceData) {
            const { stock_price, price_date } = stockPriceData;
            dateObj[new Date(price_date.setUTCHours(0, 0, 0, 0))] +=
              quantity * stock_price.toFixed(2);
          }
        }

        for (const purchaseDate of purchaseDates) {
          for (
            let j = new Date(purchaseDate[1]);
            Math.floor((j - date2) / (1000 * 3600 * 24)) <= 0;
            j = new Date(j.setDate(j.getDate() + 1))
          ) {
            const currentDate = new Date(j.setUTCHours(0, 0, 0, 0));
            const stockPriceData = stockRate.find((stk) =>
              areDatesEqual(new Date(stk.price_date), currentDate)
            );

            let stock_price, price_date;

            if (stockPriceData) {
              stock_price = stockPriceData.stock_price;
              price_date = stockPriceData.price_date;
            } else {
              const price = await getStockDetailsForADate(Object.keys(obj)[0], j);
              stock_price = price;
              price_date = j;
            }

            for (const dateObj of totSumAndDate) {
              dateObj[new Date(price_date.setUTCHours(0, 0, 0, 0))] +=
                Number(purchaseDate[0]) * Number(stock_price).toFixed(2);
            }
          }
        }
      }
    }

    const Data = totSumAndDate.map((dateObj) => {
      const date = new Date(Object.keys(dateObj)[0]);
      const formattedDate = date.toISOString().split('T')[0];

      const value = Number(Object.values(dateObj)[0].toFixed(2));

      return {
        time: formattedDate,
        value: value !== 0 ? value : undefined,
      };
    });

    console.log(Data);

    const cacheExpiration = 3600; // Cache expiration time in seconds
    const dataToCache = {
      dashboardGraphData: Data,
      message: "User dashboard graph data fetched successfully.",
    };

    await client.set(userId + "_graph", JSON.stringify(dataToCache), {
      EX: cacheExpiration,
    });
    // Send the response
    res.status(200).json(dataToCache);

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error while creating user main dashboard." });
  }
};
