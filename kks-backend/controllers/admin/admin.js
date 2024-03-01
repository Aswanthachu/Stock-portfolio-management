import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

import User from "../../models/user.js";
import subscription from "../../models/subscription.js";
// import GeneratePortfolio from "../../models/generatePortfolio.js";
import PortfolioSip from "../../models/portfolioSip.js";
import portfolioLumpsum from "../../models/portFolioLumpsum.js";
import Subscription from "../../models/subscription.js";
import upiPayment from "../../models/upiPayment.js";
import payment from "../../models/payment.js";
import UserLogin from "../../models/userLogin.js";
import ticket from "../../models/ticket.js";
import feedback from "../../models/feedback.js";
import { Types } from "mongoose";

import { getStockDeatils, getTableData } from "../portfolio/portfolio.js";
import Stocks from "../../models/stocks.js";

export const getDashboardData = async (req, res) => {
  try {
    const [
      totalIncomeResult,
      totalUsers,
      totalSubscribedUser,
      recentTransactions,
      pCount,
      recentUsers,
      totalTickets
    ] = await Promise.all([
      subscription.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ]),
      User.countDocuments(),
      subscription.countDocuments({ status: "active" }),
      subscription.aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $unwind: "$result",
        },
        {
          $project: {
            email: "$result.email",
            amount: 1,
          },
        },
      ]),
      upiPayment.countDocuments({ verified: false, rejected: false }),
      User.find({}, { email: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .limit(5),
      ticket.countDocuments()
    ]);

    const totalIncome = totalIncomeResult[0]?.totalAmount || 0;

    if (
      !totalIncome ||
      !totalUsers ||
      !totalSubscribedUser ||
      !recentTransactions ||
      !recentUsers ||
      !pCount ||
      !totalTickets
    )
      return res.status(400).json({
        message:
          "Error while fetching datas from database,Some datas are missing.",
      });

    res.status(200).json({
      totalIncome,
      totalUsers,
      totalSubscribedUser,
      recentTransactions,
      recentUsers,
      pCount,
      totalTickets,
      message: "Dashboard data for admin is fetched successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error : Error while fetching dashboard data.",
      error: error.message,
    });
  }
};
//   const { id: userId, type } = req.params;
//   try {
//     if (type) {
//       const stocksArray = [];

//       if (type === "sip") {
//         const { stocks } = await PortfolioSip.findById(userId);

//         for (let i = 0; i < stocks.length; i++) {
//           const { stock_symbol, quantity_each_month } = stocks[i];
//           const { close: latestPrice, name: companyName } =
//             await getStockDeatils(stock_symbol);

//           let totalShares = 0;
//           let cost = 0;
//           let buyedPricesTotal = 0;
//           let totalCostINR = 0;

//           for (let j = 0; j < quantity_each_month.length; j++) {
//             const { quantity, buyed_price, buyed_cost_INR } =
//               quantity_each_month[j];

//             totalShares += quantity;
//             cost += quantity * buyed_price;

//             buyedPricesTotal += quantity * buyed_price;
//             totalCostINR += buyed_cost_INR;
//           }

//           // #### calculations for table data ######

//           const totalCostAverage = cost / quantity_each_month.length;
//           const averageOfBuyedPricesTotal =
//             buyedPricesTotal / quantity_each_month.length;

//           const totalChange = latestPrice - averageOfBuyedPricesTotal;
//           const totalChangeInPercentage =
//             (totalChange / averageOfBuyedPricesTotal) * 100;
//           let totalValue = totalShares * latestPrice;

//           const tempData = {
//             companyName,
//             share: totalShares,
//             totalCostAverage: totalCostAverage,
//             latestPrice,
//             totalChange,
//             totalChangeInPercentage,
//             totalValue,
//             totalCost: cost, //
//             totalCostINR, //
//           };

//           if (tempData) {
//             stocksArray.push(tempData);
//           }
//         }

//         for (let i = 0; i < stocksArray.length; i++) {
//           delete stocksArray[i].totalCostINR;
//           delete stocksArray[i].totalCost;

//           let {
//             share,
//             totalCostAverage,
//             totalChange,
//             totalChangeInPercentage,
//             totalValue,
//           } = stocksArray[i];

//           stocksArray[i] = {
//             ...stocksArray[i],
//             share: share.toFixed(6),
//             totalCostAverage: totalCostAverage.toFixed(6),
//             totalChange: totalChange.toFixed(6),
//             totalChangeInPercentage: totalChangeInPercentage.toFixed(6),
//             totalValue: totalValue.toFixed(6),
//           };
//         }
//       } else {
//         const portfolioData = await portfolioLumpsum.findById(userId);
//         if (portfolioData) {
//           const { stocks, buyed_cost_INR } = portfolioData;

//           for (let i = 0; i < stocks.length; i++) {
//             const { stock_symbol, quantity, cost, latest_prices } = stocks[i];

//             const { close: latestPrice, name: companyName } =
//               await getStockDeatils(stock_symbol);

//             const totalChange = latestPrice - latest_prices[0];
//             const totalChangeInPercentage =
//               (totalChange / latest_prices[0]) * 100;

//             let totalValue = quantity * latestPrice;

//             const tempData = {
//               companyName,
//               share: quantity,
//               cost,
//               latestPrice,
//               totalChange,
//               totalChangeInPercentage,
//               totalValue,
//               buyed_cost_INR,
//             };

//             if (tempData) {
//               stocksArray.push(tempData);
//             }
//           }

//           for (let i = 0; i < stocksArray.length; i++) {
//             delete stocksArray[i].buyed_cost_INR;

//             let {
//               share,
//               cost,
//               totalChange,
//               totalChangeInPercentage,
//               totalValue,
//             } = stocksArray[i];

//             stocksArray[i] = {
//               ...stocksArray[i],
//               share: share?.toFixed(6),
//               cost: cost?.toFixed(6),
//               totalChange: totalChange.toFixed(6),
//               totalChangeInPercentage: totalChangeInPercentage.toFixed(6),
//               totalValue: totalValue.toFixed(6),
//             };
//           }
//         } else {
//           return res
//             .status(401)
//             .json({ message: "please create portfolio to continue" });
//         }
//       }

//       stocksArray
//         ? res.status(200).json({
//             message: "getting data for user dashboard page successfully..",
//             tableData: stocksArray,
//           })
//         : res.status(400).json({
//             message: "creation of datas for user dashboard table is failed.",
//           });
//     } else {
//       res.status(400).json({ message: "User not created portfolio data." });
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(450)
//       .json({ message: "Error while creating user dashbaord holdings table." });
//   }
// };

// getting user portfolio details

export const getPortfolioTable = async (req, res) => {
  const { id: portfolioId, type } = req.params;
  try {
    if (!type)
      return res
        .status(400)
        .json({ message: "User not created portfolio data." });

    let stocksArray = [];

    if (type === "sip") {
      const { stocks, createdAt } = await PortfolioSip.findById(portfolioId);

      if (!stocks)
        return res.status(400).json({
          message: "There is no portfolio with this id or type is invalid",
        });

      for (let i = 0; i < stocks.length; i++) {
        const { stock_symbol, quantity_each_month } = stocks[i];

        const { current_Price, stock_name } = await Stocks.findOne({
          stock_symbol,
        });

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
          companyName,
          share: Number(totalShares.toFixed(5)),
          totalCostAverage: Number(totalCostAverage.toFixed(3)),
          latestPrice: Number(latestPrice.toFixed(3)),
          totalChange: Number(totalChange.toFixed(3)),
          totalChangeInPercentage: Number(totalChangeInPercentage.toFixed(3)),
          totalValue: Number(totalValue.toFixed(3)),
        };

        if (tempData) {
          stocksArray.push(tempData);
        }
      }
    } else {
      const portfolioData = await portfolioLumpsum.findById(portfolioId);
      if (!portfolioData)
        return res.status(400).json({
          message: "There is no portfolio with this id or type is invalid",
        });

      const { stocks } = portfolioData;
      
      for (let i = 0; i < stocks.length; i++) {
        const { stock_symbol, quantity, cost, latest_prices } = stocks[i];
  
        const { current_Price, stock_name } = await Stocks.findOne({
          stock_symbol,
        });
  
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
          companyName,
          share: Number(quantity.toFixed(5)),
          cost:Number(cost.toFixed(3)),
          latestPrice:Number(latestPrice.toFixed(3)),
          totalChange:Number(totalChange.toFixed(3)),
          totalChangeInPercentage:Number(totalChangeInPercentage.toFixed(3)),
          totalValue:Number(totalValue.toFixed(3)),
        };
  
        if (tempData) {
          stocksArray.push(tempData);
        }
      }
    }

    if (!stocksArray.length > 0)
      return res.status(400).json({
        message: "Creation of data for the user dashboard table has failed.",
      });
    res.status(200).json({
      message: "Getting data for the user dashboard page successfully...",
      tableData: stocksArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Internal Server Error while creating the user dashboard holdings table.",
      error: error.message,
    });
  }
};

// getting monthly and yearly total revenue.

export const getRevenueDetails = async (req, res) => {
  try {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const [
      weekSubscriptions,
      monthSubscriptions,
      totalSubscriptions,
      recentTransactions,
    ] = await Promise.all([
      Subscription.find({ createdAt: { $gte: oneWeekAgo } }),
      Subscription.find({ createdAt: { $gte: oneMonthAgo } }),
      Subscription.find({}),
      subscription.aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $unwind: "$result",
        },
        {
          $project: {
            email: "$result.email",
            amount: 1,
          },
        },
      ]),
    ]);

    const totalWeekRevenue = weekSubscriptions.reduce(
      (total, sub) => total + sub.amount,
      0
    );
    const totalMonthRevenue = monthSubscriptions.reduce(
      (total, sub) => total + sub.amount,
      0
    );
    const totalRevenue = totalSubscriptions.reduce(
      (total, sub) => total + sub.amount,
      0
    );

    if (!totalWeekRevenue || !totalMonthRevenue || !totalRevenue)
      return res
        .status(400)
        .json({ message: "Revenue details fetching failed" });

    res.status(200).json({
      message: "Revenue Details fetched successfully...",
      totalWeekRevenue,
      totalMonthRevenue,
      totalRevenue,
      recentTransactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Internal Server Error : Fetching revenue details failed due to internal server error.",
      error: error.message,
    });
  }
};

// controllers from user

//getAllUser is controller for admin. controller checks the role of the user and if the role is 1 then it's verified

export const getAllUsers = async (req, res) => {
  try {
    const { userId } = req;

    const existingUser = await User.findById(userId);

    if (existingUser.role < 1)
      return res.status(400).json({
        message:
          "You are not verified person for fetching details of all users.",
      });

    const users = await User.aggregate([
      {
        $unwind: {
          path: "$lastLogin",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          lastLogin: {
            $cond: {
              if: {
                $eq: ["$lastLogin", null],
              },
              then: null,
              else: {
                timestamp: "$lastLogin.timestamp",
                ipAddress: "$lastLogin.ipAddress",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "userId",
          as: "subscriptions",
        },
      },
      {
        $match: {
          role: {
            $not: {
              $gt: 0,
            },
          },
        },
      },
      {
        $lookup: {
          from: "generateportfolios",
          localField: "_id",
          foreignField: "userId",
          as: "da",
        },
      },
      {
        $addFields: {
          unverifiedCount: {
            $size: {
              $filter: {
                input: "$da",
                cond: {
                  $eq: ["$$this.investmentVerified", "pending"],
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          unverifiedCount: -1,
        },
      },
      {
        $lookup: {
          from: "userlogins",
          let: {
            userId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                },
              },
            },
            {
              $sort: {
                timestamp: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "lastLogin",
        },
      },
      {
        $unwind: {
          path: "$lastLogin",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "subscriptions.status": 1,
          "subscriptions.plan": 1,
          username: 1,
          _id: 1,
          email: 1,
          role: 1,
          unverifiedCount: 1,
          lastSeen: 1,
          lastLogin: {
            $arrayElemAt: [
              {
                $ifNull: ["$lastLogin.loginHistory", []],
              },
              {
                $subtract: [
                  {
                    $size: {
                      $ifNull: ["$lastLogin.loginHistory", []],
                    },
                  },
                  1,
                ],
              },
            ],
          },
        },
      },
    ]);
    const subAdmin = await User.aggregate([
      {
        $match: {
          role: {
            $gt: 1,
          },
        },
      },
      {
        $lookup: {
          from: "userlogins",
          let: {
            userId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                },
              },
            },
            {
              $sort: {
                timestamp: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "lastLogin",
        },
      },
      {
        $unwind: {
          path: "$lastLogin",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          role: 1,
          username: 1,
          lastLogin: {
            $arrayElemAt: [
              { $ifNull: ["$lastLogin.loginHistory", []] },
              {
                $subtract: [
                  { $size: { $ifNull: ["$lastLogin.loginHistory", []] } },
                  1,
                ],
              },
            ],
          },
        },
      },
    ]);

    if (!users || !subAdmin)
      return res
        .status(400)
        .json({ message: "Error occured while fetching user details" });

    res
      .status(200)
      .json({ users, subAdmin, message: "User details fetched successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error: fetching details of all users failed.",
      error: error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const existingUser = await User.findById(userId);
    if (existingUser.role < 1)
      return res.status(400).json({
        message:
          "You are not verified person for fetching details of all users.",
      });

    const user = await User.findById(id)
      .populate("referedUsers")
      .populate({
        path: "portfolios",
        model: "generateportfolio",
        select:
          "investmentVerified portfolioname investmentType portfolioRef frequency initial_investment installment createdAt ",
      })
      .populate({
        path: "user_created_portfolios",
        model: "usercreatedportfolio",
      });

    const cardPayments = await payment.find({ userId: id, status: "success" });
    const upiPayments = await upiPayment.find({ userId: id, verified: true });
    const activeSubscription = await subscription.findOne({
      userId: user._id,
      status: "active",
    });

    const payments = cardPayments.concat(upiPayments);
    payments.sort((a, b) => a.createdAt - b.createdAt);

    const data = await UserLogin.findOne({ userId: id }).limit(5);
    let loginHistory = {};
    if (data && data.loginHistory) {
      loginHistory = data.loginHistory.slice(-5);
    } else {
      loginHistory = [];
    }

    if (!loginHistory)
      return res
        .status(400)
        .json({ message: "Error occured while fetching login history." });

    res.status(200).json({
      user,
      payments,
      subscription: activeSubscription,
      loginHistory: loginHistory.reverse(),
      message: "Successfully fetched User details.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server Error : while getting single user details.",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role, id } = req.body;

    if (!role || !id)
      return res.status(400).json({ message: "Missing of datas." });
    const newrole = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true }
    );
    res
      .status(200)
      .json({ newrole, message: "User role updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server Error : while updating user role.",
    });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbackData = await feedback
      .find({}, "feedback createdAt rating")
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    if (!feedbackData) return res.status(400).json({ message: "No Feedbacks" });

    res
      .status(200)
      .json({ feedbackData, message: "Feedback data fetched successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server Error : while fetching feedbacks of users.",
    });
  }
};

// notification for admin.

export const getAdminNotificationCount = async (req, res) => {
  try {
    const ticketnotification = (await ticket.find({ adminUnread: true }))
      .length;

    const verifyPaymentCount = (
      await upiPayment.find({ verified: false, rejected: false })
    ).length;

    if (ticketnotification > 0 && verifyPaymentCount > 0) {
      res.status(200).json({
        ticket: ticketnotification,
        payment: verifyPaymentCount,
        message: "Notification count datas fetched successfully.",
      });
    } else if (ticketnotification > 0 && verifyPaymentCount === 0) {
      res.status(200).json({
        ticket: ticketnotification,
        message: "Notification count datas fetched successfully.",
      });
    } else if (ticketnotification === 0 && verifyPaymentCount > 0) {
      res.status(200).json({
        payment: verifyPaymentCount,
        message: "Notification count datas fetched successfully.",
      });
    } else {
      res.status(200).json({ message: "No new notifications for Admins" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : while fetching notification for admin",
      error: error.message,
    });
  }
};

export const getSubadminActivities = async (req, res) => {
  try {
    const { id } = req.params;
    // const activities = await ticket.find({assignedTo:id})
    const activities = await ticket.aggregate([
      {
        $match: {
          assignedTo: Types.ObjectId(id),
        },
      },
      {
        $project: {
          numberOfReplies: {
            $size: "$replies",
          },
          ticketId: 1,
          subject: 1,
          date: 1,
          status: 1,
          paymentStatus: 1,
          adminUnread: "$replies.adminUnread",
          userUnread: "$replies.userUnread",
          category: 1,
          assignedTo: 1,
          assignedUsername: 1,
          count: {
            $size: {
              $filter: {
                input: "$replies",
                as: "reply",
                cond: { $eq: ["$$reply.adminUnread", true] },
              },
            },
          },
        },
      },
      {
        $sort: {
          ticketId: -1,
        },
      },
    ]);
    res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : while fetching sub-admin activities",
      error: error.message,
    });
  }
}
export const getUserActivities = async(req,res)=>{
  try {
    const { id } = req.params;
    // const activities = await ticket.find({userId:id})
    const activities = await ticket.aggregate([
      {
        $match: {
          userId: Types.ObjectId(id)
        }
      },
      {
        $project: {
          numberOfReplies: {
            $size: "$replies"
          },
          ticketId: 1,
          subject: 1,
          date: 1,
          status: 1,
          paymentStatus: 1,
          adminUnread: "$replies.adminUnread",
          userUnread: "$replies.userUnread",
          category: 1,
          assignedTo: 1,
          assignedUsername: 1,
          count: {
            $size: {
              $filter: {
                input: "$replies",
                as: "reply",
                cond: { $eq: ["$$reply.adminUnread", true] }
              }
            }
          }
        }
      },
      {
        $sort: {
          ticketId: -1
        }
      }
    ]);
    res.status(200).json(activities)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : while fetching user activities",
      error: error.message,
    });
  }
}

