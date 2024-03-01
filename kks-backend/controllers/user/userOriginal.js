import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import transporter from "../../config/email.js";
dotenv.config({ path: "./config.env" });
import otpGenerator from "otp-generator";
import User from "../models/user.js";
import GeneratePortfolio from "../models/generatePortfolio.js";
import payment from "../models/payment.js";
import subscription from "../models/subscription.js";
import PortfolioSip from "../models/portfolioSip.js";
import portfolioLumpsum from "../models/portFolioLumpsum.js";
import ticket from "../models/ticket.js";
import upiPayment from "../models/upiPayment.js";
import otpModel from "../models/otpSecret.js";
import ResetAttempt from "../models/resetAttempt.js";
import Stocks from "../models/stocks.js";
import UserLogin from "../models/userLogin.js";
import { USDPRICE, getStockDeatils } from "./portfolio.js";
import { updateGoogleSheet } from "../lib/kks-consultation.js";
import feedback from "../models/feedback.js";
import { Types } from "mongoose";



//Controller for generating Unique Referrel Code  for each user, each time a new user register , the controller will be called
const generateReferralCode = () => {
  const length = 6; // Change the length of the code as needed
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "email is required" });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exist,Please Login.." });
      } else {
        const secret = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));

        const data = await otpModel.create({
          email,
          secret: bcrypt.hashSync(secret, salt),
        });
        let mailOptions = {
          from: `"KKS Capitals" ${process.env.MAILER_MAIL}`, // sender address
          to: email, //  Receiver
          subject: "Verify Your Email", // Subject line
          html: "<p>Your OTP is:</p><h1>" + secret + "</h1>", // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(400).json(error);
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ status: true });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const verifyMailOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp || !email) {
      res.status(401).json({ message: "Session expired Please try again" });
    } else {
      const otpData = await otpModel
        .find({ email: email })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!otpData[0]) {
        res.status(401).json({ message: "OTP expired or Invalid OTP" });
      } else {
        const { secret } = otpData[0];
        let isValid = await bcrypt.compare(otp, secret);
        if (isValid) {
          res.status(200).json({ otpVerified: true });
        } else {
          // the OTP is invalid
          res.status(401).json({ message: "Invalid OTP" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// User Signup Controller . three methods used to userSignup - manual,google,facebook .
// referrel code will be generated when a new user creates an account

export const userSignup = async (req, res) => {
  const { type } = req.body;

  //manual Signup
  if (type === "manual") {
    const { username, email, password, referredCode } = req.body.userData;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exist,Please Login.." });
      } else {
        const referalCode = generateReferralCode();
        const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = await User.create({
          username,
          email,
          hashedPassword,
          referalCode,
          referedMe: referredCode,
        });

        const token = jwt.sign(
          { email, id: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(200).json({
          userData: newUser,
          token,
          message: "user signed up successfully..",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "server error,manual signup failed." });
      console.log(error);
    }

    //Google Signup
  } else if (type === "google") {
    const { username, email, profilePic, uid, referredCode } =
      req.body.userData;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({ message: "User Email already exist." });
      } else {
        const referalCode = generateReferralCode();
        const newUser = await User.create({
          username,
          email,
          profilePic,
          uid,
          referalCode,
          referedMe: referredCode,
        });

        const token = jwt.sign(
          { email, id: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(200).json({
          userData: newUser,
          token,
          message: "user signed up successfully..",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server Error , google user creation failed " });
      console.log(error);
    }

    //Facebook Signup
  } else if (type === "facebook") {
    const { username, email, profilePic, uid, referredCode } =
      req.body.userData;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({ message: "User already exist." });
      } else {
        const referalCode = generateReferralCode();
        const newUser = await User.create({
          username,
          email,
          profilePic,
          uid,
          referalCode,
          referedMe: referredCode,
        });

        const token = jwt.sign(
          { email, id: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(200).json({
          userData: newUser,
          token,
          message: "user signed up successfully..",
        });
      }
    } catch (error) {
      res.status(401).json({ message: "server error" });
      console.log(error);
    }
  }
};

//UserLogin Controller
export const userLogin = async (req, res) => {
  const { type } = req.body;

  if (type === "manual") {
    const { email, password } = req.body.userData;
    try {
      const existingUser = await User.findOne(
        { email },
        {
          username: true,
          name: true,
          profilePic: true,
          role: true,
          investmentVerified: true,
          gender: true,
          mob: true,
          hashedPassword: true,
        }
      );
      if (!existingUser) {
        return res.status(404).json({ message: "User not exist." });
      }
      const token = jwt.sign(
        { email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const correctUser = await bcrypt.compare(
        password,
        existingUser.hashedPassword
      );

      if (correctUser) {
        let ipAddress = req.ip; // Retrieve IP address from request object

        // If IP address is an array, extract the first element
        if (Array.isArray(ipAddress)) {
          ipAddress = ipAddress[0];
        }
        await UserLogin.findOneAndUpdate(
          { userId: existingUser._id },
          //    { $push: { loginHistory: { timestamp, ipAddress } } },
          //  Login history limited to 50
          {
            $push: { loginHistory: { $each: [{ ipAddress }], $slice: -50 } },
          },
          { upsert: true, new: true }
        );
        if (existingUser.role > 0) {
          return res.status(200).json({
            existingUser,
            token,
            message: "successfully logged in..",
          });
        } else {
          const subscriptions = await subscription.aggregate([
            {
              $match: {
                userId: Types.ObjectId(existingUser._id),
              },
            },
            {
              $addFields: {
                sortOrder: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$status", "active"] }, then: 0 },
                      { case: { $eq: ["$status", "pending"] }, then: 1 },
                      { case: { $eq: ["$status", "expired"] }, then: 2 },
                    ],
                    default: 3,
                  },
                },
              },
            },
            {
              $sort: {
                sortOrder: 1,
              },
            },
            {
              $project: {
                _id: 0,
                status: 1,
              },
            },
          ]);

          let subscribedUser;

          if (subscriptions.length === 0) {
            subscribedUser = "notSubscribed";
          } else {
            const active = subscriptions.map((sub) => sub.status === "active");
            if (active.includes(true)) {
              subscribedUser = "active";
            } else {
              subscribedUser = "expired";
            }
          }

          if (existingUser?.portfolios?.length < 1) {
            return res.status(406).json({
              message: "user not created portfolio first part",
              existingUser,
              token,
              planStatus: subscribedUser,
            });
          } else {
            const userPortfolioCreated = await GeneratePortfolio.findOne({
              userId: existingUser._id,
            });

            if (userPortfolioCreated) {
              if (subscribedUser !== "notSubscribed") {
                if (subscribedUser === "active") {
                  // const { investmentType } = userPortfolioCreated;

                  // let portfolioGeneratedUser = {};

                  // if (investmentType === "sip")
                  //   portfolioGeneratedUser = await PortfolioSip.findOne({
                  //     userId: existingUser._id,
                  //   });
                  // else
                  //   portfolioGeneratedUser = await portfolioLumpsum.findOne({
                  //     userId: existingUser._id,
                  //   });

                  // if (portfolioGeneratedUser) {

                  return res.status(200).json({
                    existingUser: {
                      ...existingUser._doc,
                      investmentType: userPortfolioCreated.investmentType,
                    },
                    token,
                    planStatus: subscribedUser,
                    message: "successfully logged in..",
                  });
                  // } else {
                  //   res.status(401).json({
                  //     existingUser: {
                  //       ...existingUser._doc,
                  //       investmentType: userPortfolioCreated.investmentType,
                  //     },
                  //     token,
                  //     planStatus: status,
                  //     message: "successfully logged in..",
                  //   });
                  // }
                } else {
                  res.status(402).json({
                    message: "Please subscribe to proceed..",
                    token,
                    planStatus: subscribedUser,
                    existingUser: {
                      ...existingUser._doc,
                      investmentType: userPortfolioCreated.investmentType,
                    },
                  });
                }
              } else {
                return res.status(403).json({
                  message: "Please take any plan to get user dashbaord details",
                  token,
                  planStatus: subscribedUser,
                  existingUser: {
                    ...existingUser._doc,
                    investmentType: userPortfolioCreated.investmentType,
                  },
                });
              }
            } else {
              return res.status(405).json({
                message: "please complete portfolio creation",
                token,
                planStatus: subscribedUser,
                existingUser: {
                  ...existingUser._doc,
                },
              });
            }
          }
        }
      } else {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.log(error);
      res.status(450).json({ message: "Some Inetrnal server error" });
    }

    //Google Login
  } else if (type === "google") {
    const { email } = req.body.userData;
    try {
      const existingUser = await User.findOne(
        { email },
        {
          username: true,
          name: true,
          profilePic: true,
          role: true,
          investmentVerified: true,
          gender: true,
        }
      );

      if (!existingUser) {
        res.status(404).json({ message: "User not exist." });
      } else {
        let ipAddress = req.ip; // Retrieve IP address from request object

        // If IP address is an array, extract the first element
        if (Array.isArray(ipAddress)) {
          ipAddress = ipAddress[0];
        }
        await UserLogin.findOneAndUpdate(
          { userId: existingUser._id },
          //    { $push: { loginHistory: { timestamp, ipAddress } } },
          //  Login history limited to 50
          {
            $push: { loginHistory: { $each: [{ ipAddress }], $slice: -50 } },
          },
          { upsert: true, new: true }
        );

        const token = jwt.sign(
          { email, id: existingUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        if (existingUser.role > 0) {
          res.status(200).json({
            existingUser,
            token,
            message: "successfully logged in..",
          });
        } else {
          const subscriptions = await subscription.aggregate([
            {
              $match: {
                userId: Types.ObjectId(existingUser._id),
              },
            },
            {
              $addFields: {
                sortOrder: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$status", "active"] }, then: 0 },
                      { case: { $eq: ["$status", "pending"] }, then: 1 },
                      { case: { $eq: ["$status", "expired"] }, then: 2 },
                    ],
                    default: 3,
                  },
                },
              },
            },
            {
              $sort: {
                sortOrder: 1,
              },
            },
            {
              $project: {
                _id: 0,
                status: 1,
              },
            },
          ]);

          let subscribedUser;

          if (subscriptions.length === 0) {
            subscribedUser = "notSubscribed";
          } else {
            const active = subscriptions.map((sub) => sub.status === "active");
            if (active.includes(true)) {
              subscribedUser = "active";
            } else {
              subscribedUser = "expired";
            }
          }

          // const subscribedUser = await subscription.findOne({
          //   userId: existingUser._id,
          // });

          // let status=0
          // if (subscribedUser) {
          //   const { status:sts } = subscribedUser;
          //   status=sts;
          // }else{
          //   status="notSubscribed"
          // }

          if (existingUser?.portfolios?.length < 1) {
            res.status(406).json({
              message: "user not created portfolio first part",
              existingUser,
              token,
              planStatus: subscribedUser,
            });
          } else {
            const userPortfolioCreated = await GeneratePortfolio.findOne({
              userId: existingUser._id,
            });

            if (userPortfolioCreated) {
              if (subscribedUser !== "notSubscribed") {
                if (subscribedUser === "active") {
                  // const { investmentType } = userPortfolioCreated;

                  // let portfolioGeneratedUser = {};

                  // if (investmentType === "sip")
                  //   portfolioGeneratedUser = await PortfolioSip.findOne({
                  //     userId: existingUser._id,
                  //   });
                  // else
                  //   portfolioGeneratedUser = await portfolioLumpsum.findOne({
                  //     userId: existingUser._id,
                  //   });

                  // if (portfolioGeneratedUser) {
                  res.status(200).json({
                    existingUser: {
                      ...existingUser._doc,
                      investmentType: userPortfolioCreated.investmentType,
                    },
                    token,
                    planStatus: subscribedUser,
                    message: "successfully logged in..",
                  });
                  // } else {
                  //   res.status(401).json({
                  //     existingUser: {
                  //       ...existingUser._doc,
                  //       investmentType: userPortfolioCreated.investmentType,
                  //     },
                  //     token,
                  //     planStatus: status,
                  //     message: "successfully logged in..",
                  //   });
                  // }
                } else {
                  res.status(402).json({
                    message: "Please subscribe to proceed..",
                    token,
                    planStatus: subscribedUser,
                    existingUser: {
                      ...existingUser._doc,
                      investmentType: userPortfolioCreated.investmentType,
                    },
                  });
                }
              } else {
                res.status(403).json({
                  message: "Please take any plan to get user dashbaord details",
                  token,
                  planStatus: subscribedUser,
                  existingUser: {
                    ...existingUser._doc,
                    investmentType: userPortfolioCreated.investmentType,
                  },
                });
              }
            } else {
              res.status(405).json({
                message: "please complete portfolio creation",
                token,
                planStatus: subscribedUser,
                existingUser: {
                  ...existingUser._doc,
                },
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    //Facebook Login
  } else if (type === "facebook") {
    const { email } = req.body.userData;
    try {
      const existingUser = await User.findOne(
        { email },
        {
          username: true,
          name: true,
          profilePic: true,
          role: true,
          investmentVerified: true,
          gender: true,
        }
      );

      if (!existingUser) {
        res.status(404).json({ message: "User not exist." });
      } else {
        let ipAddress = req.ip; // Retrieve IP address from request object

        // If IP address is an array, extract the first element
        if (Array.isArray(ipAddress)) {
          ipAddress = ipAddress[0];
        }
        await UserLogin.findOneAndUpdate(
          { userId: existingUser._id },
          //    { $push: { loginHistory: { timestamp, ipAddress } } },
          //  Login history limited to 50
          {
            $push: { loginHistory: { $each: [{ ipAddress }], $slice: -50 } },
          },
          { upsert: true, new: true }
        );
        const token = jwt.sign(
          { email, id: existingUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        if (existingUser.role > 0) {
          res.status(200).json({
            existingUser,
            token,
            message: "successfully logged in..",
          });
        } else {
          const subscriptions = await subscription.aggregate([
            {
              $match: {
                userId: Types.ObjectId(existingUser._id),
              },
            },
            {
              $addFields: {
                sortOrder: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$status", "active"] }, then: 0 },
                      { case: { $eq: ["$status", "pending"] }, then: 1 },
                      { case: { $eq: ["$status", "expired"] }, then: 2 },
                    ],
                    default: 3,
                  },
                },
              },
            },
            {
              $sort: {
                sortOrder: 1,
              },
            },
            {
              $project: {
                _id: 0,
                status: 1,
              },
            },
          ]);

          let subscribedUser;

          if (subscriptions.length === 0) {
            subscribedUser = "notSubscribed";
          } else {
            const active = subscriptions.map((sub) => sub.status === "active");
            if (active === "active") {
              subscribedUser = active;
            } else {
              subscribedUser = "expired";
            }
          }

          if (!existingUser.gender) {
            res.status(406).json({
              message: "user not created portfolio first part",
              existingUser,
              token,
              planStatus: subscribedUser,
            });
          } else {
            const userPortfolioCreated = await GeneratePortfolio.findOne({
              userId: existingUser._id,
            });

            if (userPortfolioCreated) {
              if (subscribedUser) {
                const { status } = subscribedUser;

                if (status === "pending" || status === "active") {
                  // const { investmentType } = userPortfolioCreated;

                  // let portfolioGeneratedUser = {};

                  // if (investmentType === "sip")
                  //   portfolioGeneratedUser = await PortfolioSip.findOne({
                  //     userId: existingUser._id,
                  //   });
                  // else
                  //   portfolioGeneratedUser = await portfolioLumpsum.findOne({
                  //     userId: existingUser._id,
                  //   });

                  // if (portfolioGeneratedUser) {
                  res.status(200).json({
                    existingUser: {
                      ...existingUser._doc,
                      investmentType: userPortfolioCreated.investmentType,
                    },
                    token,
                    planStatus: subscribedUser,
                    message: "successfully logged in..",
                  });
                  // } else {
                  //   res.status(401).json({
                  //     existingUser: {
                  //       ...existingUser._doc,
                  //       investmentType: userPortfolioCreated.investmentType,
                  //     },
                  //     token,
                  //     message: "successfully logged in..",
                  //   });
                  // }
                } else {
                  res.status(402).json({
                    message: "Please subscribe to proceed..",
                    token,
                    planStatus: subscribedUser,
                    existingUser: {
                      ...existingUser._doc,
                      investmentType: userPortfolioCreated.investmentType,
                    },
                  });
                }
              } else {
                res.status(403).json({
                  message: "Please take any plan to get user dashbaord details",
                  token,
                  planStatus: subscribedUser,
                  existingUser: {
                    ...existingUser._doc,
                    investmentType: userPortfolioCreated.investmentType,
                  },
                });
              }
            } else {
              res
                .status(405)
                .json({ message: "please complete portfolio creation", token });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      res.status(405).json({ message: "login failed due to server error" });
    }
  }
};

//User Generate Portfolio
export const generatePortfolios = async (req, res) => {
  const { userId } = req;
  const {
    gender,
    ageRange,
    working,
    workingSector,
    holding,
    demat,
    investmentPlan,
    frequency,
    initialInvestment,
    installment,
    duration,
  } = req.body.userData;

  try {
    const UserData = await User.findByIdAndUpdate(userId, {
      gender,
      ageRange,
      working,
      working_sector: workingSector,
      sip_mutual_fund_hold: holding,
      demat_Ac: demat,
      how_long_invest: duration,
    });

    const { _id: PortfolioId } = await GeneratePortfolio.create({
      userId,
      investmentType: investmentPlan,
      initial_investment: initialInvestment,
      installment: installment,
      frequency,
    });

    // Buying stocks and save it into stocksToBuy

    const stocks = await Stocks.find({});

    const USD = USDPRICE;

    const initInvestAfterReduction = installment - (installment * 1.5) / 100;

    const reductedInUsd = initInvestAfterReduction / USD;

    let tempData = {};
    let stocksArray = [];

    for (let i = 0; i < stocks.length; i++) {
      const {
        stock_symbol,
        percentage_portfolio,
        // current_Price: latestPrice,
      } = stocks[i];
      const { close: latestPrice } = await getStockDeatils(stock_symbol);

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

    if (investmentPlan === "lumpsum") {
      const stockBuyData = await portfolioLumpsum.create({
        generatePortfolioId: PortfolioId,
        stocks: stocksArray,
        buyed_cost_INR: USD,
      });

      if (stockBuyData) {
        const { _id: portfolioRef } = stockBuyData;

        await GeneratePortfolio.findByIdAndUpdate(PortfolioId, {
          portfolioRef,
        });
      } else
        res.status(400).json({
          message: "lumpsum portfolio stock data creation failed",
        });
    } else {
      const stockBuyData = await PortfolioSip.create({
        generatePortfolioId: PortfolioId,
        stocks: stocksArray,
      });

      if (stockBuyData) {
        const { _id: portfolioRef } = stockBuyData;

        await GeneratePortfolio.findByIdAndUpdate(PortfolioId, {
          portfolioRef,
        });
      } else
        res
          .status(400)
          .json({ message: "sip portfolio stock data creation failed" });
    }

    res.status(200).json({ message: "portfolio created successfully.." });
  } catch (error) {
    console.log(error);
    res.status(405).json({ message: "portfolio creation failed." });
  }
};

export const userDetailsUpdate = async (req, res) => {
  const { userData } = req.body;

  const { userId } = req;

  const {
    username,
    email,
    mob,
    gender,
    ageRange,
    working,
    workingSector,
    investmentPlan,
    profilePic,
  } = userData;

  try {
    const userUpdatedData = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        mob,
        profilePic,
        gender,
        ageRange,
        working,
        working_sector: workingSector,
      },
      { new: true }
    );

    const userDataForSettingPage = {
      username: userUpdatedData.username,
      email: userUpdatedData.email,
      mob: userUpdatedData.mob,
      profilePic: userUpdatedData.profilePic,
      gender: userUpdatedData.gender,
      ageRange: userUpdatedData.ageRange,
      working: userUpdatedData.working,
      workingSector: userUpdatedData.working_sector,
    };

    // await addNewPortfolio(req);

    res.status(200).json({
      message: "user updated successfully..",
      userSettingsData: userDataForSettingPage,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "user profile updation failed" });
  }
};

export const getUserDetails = async (req, res) => {
  const { userId } = req;

  try {
    const userData = await User.findById(userId);
    const userPortfolio = await GeneratePortfolio.findOne({
      userId: Types.ObjectId(userId),
    });
    const userDataForSettingPage = {
      username: userData.username,
      email: userData.email,
      mob: userData.mob,
      profilePic: userData.profilePic,
      gender: userData.gender,
      ageRange: userData.ageRange,
      working: userData.working,
      workingSector: userData.working_sector,
      investmentPlan: userPortfolio ? userPortfolio.investmentType : "",
      investedAmount: userPortfolio ? userPortfolio.initial_investment : "",
      installment: userPortfolio ? userPortfolio.installment : "",
    };
    res.status(200).json({ userSettingsData: userDataForSettingPage });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "user profile data getting failed." });
  }
};

//Forgot password controller . Controller will send email to the respected user's mail with the userId

export const sendMail = async (req, res) => {
  const { email } = req.body;
  // Reset attempt limit per day
  const resetAttemptsLimit = 3;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const now = new Date();

      // Get the start and end of the current day
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      // Check if the user has exceeded the reset attempts limit for the current day
      const resetAttemptsCount = await ResetAttempt.countDocuments({
        email,
        date: { $gte: startOfDay, $lt: endOfDay },
      });

      if (resetAttemptsCount >= resetAttemptsLimit) {
        return res.status(429).json({
          error: "Password reset limit exceeded. Please try again later.",
        });
      }
      const token = jwt.sign(
        { email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      async function mailFunction() {
        const to = email;
        const from = process.env.MAILER_MAIL;
        const subject = "KKS Capitals.";
        const link = `${process.env.CLIENT_URL}/new-password/${token}`;

        const message = `<!DOCTYPE html>
        <html>
        <head>
          <title>Reset Your Password</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Style your email using CSS */
            body {
              font-family: Arial, sans-serif;
              color: #333;
            }
            h1 {
              font-size: 28px;
              color: #666;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            a {
              color: #007BFF;
              text-decoration: none;
            }
            .highlight {
              font-weight: bold;
              color: #f44336;
            }
          </style>
        </head>
        <body>
          <h1>Reset Your Password</h1>
          <p>Dear ${existingUser?.username},</p>
          <p>We have received a request to reset your password. Please click the link below to reset your password:</p>
          <p><a href="${link}">${link}</a></p>
          <p>This link will expire in 10 minutes. Please reset your password within this time limit.</p>
          <p>If you did not initiate this request, please ignore this email. Your password will not be changed.</p>
          <p>Thank you.</p>
        </body>
        </html>`;

    

        const mailOptions = {
          from,
          to,
          subject,
          html: message,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent: " + info.response);
          res.status(200).json({ message: "Mail sent successfully." });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Failed to send email." });
        }
      }

      mailFunction();
      await ResetAttempt.create({ email });
    } else {
      res.status(400).json({ message: "Entered mail is not exist." });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Email can't send" });
  }
};

//Password updation controller .

export const updatePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    let id = "";
    if (token) {
      try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        id = decodedData.id;
      } catch (error) {
        // Token verification failed or expired
        return res.status(401).json({ message: "Token expired or invalid." });
      }
    } else {
      return res.status(404).json({ message: "Invalid Link" });
    }

    const existingUser = await User.findById(id);
    if (existingUser) {
      const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
      const hashedPassword = bcrypt.hashSync(password, salt);
      await User.findByIdAndUpdate(id, { hashedPassword });

      return res
        .status(200)
        .json({ message: "User password updated successfully." });
    } else {
      return res.status(400).json({ message: "There is no user with this id" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "User password updation failed" });
  }
};

//getAllUser is controller for admin. controller checks the role of the user and if the role is 1 then it's verified

// export const getAllUsers = async (req, res) => {
//   const { userId } = req;

//   try {
//     const existingUser = await User.findById(userId);
//     if (existingUser.role === 1 || existingUser.role === 4) {
//       const users = await User.aggregate([
//         {
//           $unwind: {
//             path: "$lastLogin",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $addFields: {
//             lastLogin: {
//               $cond: {
//                 if: {
//                   $eq: ["$lastLogin", null],
//                 },
//                 then: null,
//                 else: {
//                   timestamp: "$lastLogin.timestamp",
//                   ipAddress: "$lastLogin.ipAddress",
//                 },
//               },
//             },
//           },
//         },
//         {
//           $lookup: {
//             from: "subscriptions",
//             localField: "_id",
//             foreignField: "userId",
//             as: "subscription",
//           },
//         },
//         {
//           $unwind: {
//             path: "$subscription",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $match: {
//             role: {
//               $not: {
//                 $gt: 0,
//               },
//             },
//           },
//         },
//         {
//           $lookup: {
//             from: "generateportfolios",
//             localField: "_id",
//             foreignField: "userId",
//             as: "da",
//           },
//         },
//         {
//           $addFields: {
//             unverifiedCount: {
//               $size: {
//                 $filter: {
//                   input: "$da",
//                   cond: {
//                     $eq: ["$$this.investmentVerified", "pending"],
//                   },
//                 },
//               },
//             },
//           },
//         },
//         {
//           $sort: {
//             unverifiedCount: -1,
//           },
//         },
//         {
//           $lookup: {
//             from: "userlogins",
//             let: {
//               userId: "$_id",
//             },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $eq: ["$userId", "$$userId"],
//                   },
//                 },
//               },
//               {
//                 $sort: {
//                   timestamp: -1,
//                 },
//               },
//               {
//                 $limit: 1,
//               },
//             ],
//             as: "lastLogin",
//           },
//         },
//         {
//           $unwind: {
//             path: "$lastLogin",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $project: {
//             "subscription.status": 1,
//             "subscription.plan": 1,
//             username: 1,
//             email: 1,
//             role: 1,
//             unverifiedCount: 1,
//             lastLogin: {
//               $arrayElemAt: [
//                 { $ifNull: ["$lastLogin.loginHistory", []] },
//                 {
//                   $subtract: [
//                     { $size: { $ifNull: ["$lastLogin.loginHistory", []] } },
//                     1,
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//       ]);

//       const subAdmin = await User.aggregate([
//         {
//           $match: {
//             role: {
//               $gt: 2,
//             },
//           },
//         },
//         {
//           $lookup: {
//             from: "userlogins",
//             let: {
//               userId: "$_id",
//             },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $eq: ["$userId", "$$userId"],
//                   },
//                 },
//               },
//               {
//                 $sort: {
//                   timestamp: -1,
//                 },
//               },
//               {
//                 $limit: 1,
//               },
//             ],
//             as: "lastLogin",
//           },
//         },
//         {
//           $unwind: {
//             path: "$lastLogin",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             username: 1,
//             email: 1,
//             role: 1,
//             username: 1,
//             lastLogin: {
//               $arrayElemAt: [
//                 { $ifNull: ["$lastLogin.loginHistory", []] },
//                 {
//                   $subtract: [
//                     { $size: { $ifNull: ["$lastLogin.loginHistory", []] } },
//                     1,
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//       ]);
//       res.status(200).json({ users, subAdmin });
//     } else {
//       res.status(400).json({
//         message:
//           "You are not verified person for fetching details of all users.",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ message: "fetching details of all users failed." });
//   }
// };

export const updateReferral = async (req, res) => {
  try {
    const { userId, newReferalCode } = req.body;
    if (!userId || !newReferalCode) {
      res.status(401).json("Missing Form Data");
    } else {
      const user = await User.findById(userId);

      if (user.referedMe === "") {
        const user = await User.findOne({ referalCode: newReferalCode });

        if (user) {
          await User.updateOne({ _id: userId }, { referedMe: newReferalCode });
          res.status(200).json({ message: "success", user });
        } else {
          res.status(401).json("invalid referrel code");
        }
      } else {
        res.status(400).json("Cannot update Referal code");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error });
  }
};

export const getReferData = async (req, res) => {
  try {
    const { userId } = req;
    const refer = await User.findById(userId);
    res.status(200).json({
      referalCode: refer?.referalCode,
      referedUsers: refer?.referedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

// getting plan details from user
export const getPlanStatus = async (req, res) => {
  const { userId } = req;

  try {
    const subscribedUser = await subscription.findOne({ userId });
    let Status = "";
    if (subscribedUser) {
      const { status } = subscribedUser;
      Status = status;
    } else {
      Status = "expired";
    }
    res.status(200).json({ status: Status });
  } catch (error) {
    console.log(error);
  }
};

//Generate Portfolio personal details update

export const generatePortfolioPart1 = async (req, res) => {
  try {
    const { gender, ageRange, working, workingSector } = req.body;

    const { userId } = req;
    if (!gender || !ageRange || !working) {
      res.status(400).json("missing datas");
    } else {
      const UserData = await User.findByIdAndUpdate(
        userId,
        {
          gender,
          ageRange,
          working,
          working_sector: workingSector,
        },
        { new: true }
      );

      res.status(200).json({
        UserData,
        message: "generate portfolio part one completed successfully..",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// generate portfolio investment details update
export const generatePortfolioPart2 = async (req, res) => {
  try {
    const { userId } = req;
    const {
      initialInvestment: installment,
      frequency,
      investmentPlan,
    } = req.body;
    if (investmentPlan === "sip" && (!installment || !frequency)) {
      res.status(400).json("missing datas");
    } else if (investmentPlan === "lumpsum" && !installment) {
      res.status(400).json("missing datas");
    } else if (!installment) {
      res.status(400).json("missing datas");
    } else {
      const { _id: PortfolioId } = await GeneratePortfolio.create({
        userId,
        investmentType: investmentPlan,
        installment,
        frequency,
      });

      const stocks = await Stocks.find({});

      const USD = USDPRICE;

      const initInvestAfterReduction = installment - (installment * 1.5) / 100;

      const reductedInUsd = initInvestAfterReduction / USD;

      let tempData = {};
      let stocksArray = [];

      for (let i = 0; i < stocks.length; i++) {
        const { stock_symbol, percentage_portfolio } = stocks[i];
        const { close: latestPrice } = await getStockDeatils(stock_symbol);

        const usdForStock = (reductedInUsd * percentage_portfolio) / 100;

        if (investmentPlan === "lumpsum") {
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

      if (investmentPlan === "lumpsum") {
        const stockBuyData = await portfolioLumpsum.create({
          generatePortfolioId: PortfolioId,
          stocks: stocksArray,
          buyed_cost_INR: USD,
        });

        if (stockBuyData) {
          const { _id: portfolioRef } = stockBuyData;

          await GeneratePortfolio.findByIdAndUpdate(PortfolioId, {
            portfolioRef,
          });
          await User.findByIdAndUpdate(userId, {
            $push: { portfolios: PortfolioId },
          });
        } else
          res.status(400).json({
            message: "lumpsum portfolio stock data creation failed",
          });
      } else {
        const stockBuyData = await PortfolioSip.create({
          generatePortfolioId: PortfolioId,
          stocks: stocksArray,
        });

        if (stockBuyData) {
          const { _id: portfolioRef } = stockBuyData;

          await GeneratePortfolio.findByIdAndUpdate(PortfolioId, {
            portfolioRef,
          });
          await User.findByIdAndUpdate(userId, {
            $push: { portfolios: PortfolioId },
          });
        } else
          res
            .status(400)
            .json({ message: "sip portfolio stock data creation failed" });
      }

      res.status(200).json({
        message: "portfolio created successfully..",
        investmentType: investmentPlan,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getPlanDetails = async (req, res) => {
  const { userId } = req;

  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentDate = new Date();

    const data = await subscription.findOne({
      userId,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });
    if (data) {
      const { plan, startDate, endDate } = data;
      const start_Date =
        monthNames[startDate.getMonth()] +
        " " +
        startDate.getDate() +
        "," +
        " " +
        startDate.getFullYear();
      const end_Date =
        monthNames[endDate.getMonth()] +
        " " +
        endDate.getDate() +
        "," +
        " " +
        endDate.getFullYear();

      const pln = plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();

      return res.status(200).json({
        message: "fetching plan detils successfully",
        currentPlanDetails: { start_Date, end_Date, pln },
      });
    } else {
      return res.status(400).json("No active subscription");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "fetching plan details failed due to Internal server error.",
    });
  }
};

// export const getAdminNotificationCount = async (req, res) => {
//   try {
//     const { userId } = req;

//     const ticketnotification = (await ticket.find({ adminUnread: true }))
//       .length;

//     const verifyPaymentCount = (
//       await upiPayment.find({ verified: false, rejected: false })
//     ).length;

//     if (ticketnotification > 0 && verifyPaymentCount > 0) {
//       res
//         .status(200)
//         .json({ ticket: ticketnotification, payment: verifyPaymentCount });
//     } else if (ticketnotification > 0 && verifyPaymentCount === 0) {
//       res.status(200).json({ ticket: ticketnotification });
//     } else if (ticketnotification === 0 && verifyPaymentCount > 0) {
//       res.status(200).json({ payment: verifyPaymentCount });
//     } else {
//       res.status(200).json("ok");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getGeneratePortfolioData = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    } else {
      const user = await User.findById(userId);
      if (user && user?.gender) {
        res.status(200).json({
          status: true,
          userData: {
            gender: user.gender,
            ageRange: user.ageRange,
            working: user.working,
            workingSector: user.working_sector,
            holding: user.sip_mutual_fund_hold,
            demat: user.demat_Ac,
            duration: user.how_long_invest,
          },
        });
      } else {
        res.status(200).json({ status: false });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { userId } = req;
    const { feedbackData, rating } = req.body;
    if (!userId || !feedbackData || !rating) {
      res.status(400).json({ message: "Please enter all fields" });
    } else {
      const createFeedback = await feedback.create({
        feedback: feedbackData,
        userId,
        rating,
      });
      if (!createFeedback) {
        res.status(500).json({
          message: "Failed to submit your feedback, Please Try after sometimes",
        });
      } else {
        await User.findByIdAndUpdate(userId, { feedbackSubmitted: true });
        const userData = await User.findById(userId, {
          username: true,
          name: true,
          profilePic: true,
          role: true,
          investmentVerified: true,
          gender: true,
          feedbackSubmitted: true,
        });
        res.status(200).json({
          status: true,
          userData,
          message: "Thank you for your feedback! Your input is valuable to us.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbackData = await feedback
      .find({}, "feedback createdAt rating")
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    if (!feedbackData) {
      res.status(400).json({ message: "No Feedbacks" });
    } else {
      res.status(200).json({ feedbackData });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const RouteAfterPayment = async (req, res) => {
  const { userId } = req;

  try {
    const subscriptions = await subscription.aggregate([
      {
        $match: {
          userId: Types.ObjectId(userId),
        },
      },
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "active"] }, then: 0 },
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "expired"] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },
      {
        $sort: {
          sortOrder: 1,
        },
      },
      {
        $project: {
          _id: 0,
          status: 1,
        },
      },
    ]);

    let subscribedUser;

    if (subscriptions.length === 0) {
      subscribedUser = "notSubscribed";
    } else {
      const active = subscriptions.map((sub) => sub.status === "active");
      if (active.includes(true)) {
        subscribedUser = "active";
      } else {
        subscribedUser = "expired";
      }
    }

    if (subscribedUser === "active") {
      const user = await User.findById(userId);
      if (!user.gender) {
        res
          .status(400)
          .json({ message: "Please create portfolio first part." });
      } else if (!user.portfolios) {
        res
          .status(401)
          .json({ message: "Please create portfolio second part." });
      } else {
        res.status(200).json({ message: "succesfully routed to home page." });
      }
    } else {
      res.status(405).json({ message: "Please make a payment to continue." });
    }
  } catch (error) {
    console.log(error);
    req.status(500).json({ message: "Something went wrong after payment." });
  }
};

export const getStatus = async (req, res) => {
  try {
    const { userId } = req;
    const subscriptions = await subscription.aggregate([
      {
        $match: {
          userId: Types.ObjectId(userId),
        },
      },
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "active"] }, then: 0 },
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "expired"] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },
      {
        $sort: {
          sortOrder: 1,
        },
      },
      {
        $project: {
          _id: 0,
          status: 1,
        },
      },
    ]);

    let status;
    if (subscriptions.length === 0) {
      status = "notSubscribed";
    } else {
      const active = subscriptions.map((sub) => sub.status === "active");
      if (active.includes(true)) {
        status = "active";
      } else {
        status = "expired";
      }
    }
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ status: true, expireAt: decodedData.exp });
  } catch (error) {
    res.status(200).json({ message: "Token Expired" });
  }
};

export const updatePhone = async (req, res) => {
  const { userId } = req;
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    // Check if the phone number already exists in any other user document
    const phoneNumberExists = await User.exists({ mob: phoneNumber });
    if (phoneNumberExists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const data = await User.findByIdAndUpdate(
      userId,
      { mob: phoneNumber },
      { new: true } // Return the updated document
    );
    if (data) {
      const dateTime = new Date().toLocaleString("en-GB");
      try {
        const success = await updateGoogleSheet(
          data.username,
          data.mob,
          dateTime
        );
      } catch (error) {
        // Handle the error from the updateGoogleSheet function
        console.error("Error updating Google Sheet:", error.message);
        // You may choose to return an error response to the client
        return res.status(500).json({ message: "Something went wrong" });
      }
      return res.status(200).json({
        message:
          "Phone number submitted successfully. Our team will contact you soon.",
        status: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to update. Please try again" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//  ############# admin #############

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const existingUser = await User.findById(id);
    if (existingUser.role === 1) {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully.." });
    } else {
      res.status(401).json({
        message: "You are not a verified person for deleting a user.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Deletion of user failed." });
  }
};

// completed.

//getAllUser is controller for admin. controller checks the role of the user and if the role is 1 then it's verified

export const getAllUsers = async (req, res) => {
  const { userId } = req;

  try {
    const existingUser = await User.findById(userId);

    if (existingUser.role !== 1 || existingUser.role !== 4)
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
          as: "subscription",
        },
      },
      {
        $unwind: {
          path: "$subscription",
          preserveNullAndEmptyArrays: true,
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
          "subscription.status": 1,
          "subscription.plan": 1,
          username: 1,
          email: 1,
          role: 1,
          unverifiedCount: 1,
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

    const subAdmin = await User.aggregate([
      {
        $match: {
          role: {
            $gt: 2,
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
    res
      .status(500)
      .json({
        message: "Internal Server Error: fetching details of all users failed.",
        error: error.message,
      });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req;
    const existingUser = await User.findById(userId);
    if (existingUser.role === 1 || existingUser.role === 4) {
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

      const payments = await payment.find({ userId: id, status: "success" });
      const activeSubscription = await subscription.findOne({
        userId: user._id,
        status: "active",
      });
      const { loginHistory } = await UserLogin.findOne({ userId: id }).then(
        (data) => {
          if (data) {
            return data;
          } else {
            return { loginHistory: [] };
          }
        }
      );
      res.status(200).json({
        user,
        payments,
        subscription: activeSubscription,
        loginHistory: loginHistory.reverse(),
      });
    } else {
      res.status(400).json({
        message:
          "You are not verified person for fetching details of all users.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role, id } = req.body;
    const newrole = await User.findByIdAndUpdate(id, { role: role });
    res.status(200).json(newrole);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// notification for admin.

export const getAdminNotificationCount = async (req, res) => {
  try {
    const { userId } = req;

    const ticketnotification = (await ticket.find({ adminUnread: true }))
      .length;

    const verifyPaymentCount = (
      await upiPayment.find({ verified: false, rejected: false })
    ).length;

    if (ticketnotification > 0 && verifyPaymentCount > 0) {
      res
        .status(200)
        .json({ ticket: ticketnotification, payment: verifyPaymentCount });
    } else if (ticketnotification > 0 && verifyPaymentCount === 0) {
      res.status(200).json({ ticket: ticketnotification });
    } else if (ticketnotification === 0 && verifyPaymentCount > 0) {
      res.status(200).json({ payment: verifyPaymentCount });
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
