import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import otpGenerator from "otp-generator";
import User from "../../models/user.js";
import GeneratePortfolio from "../../models/generatePortfolio.js";
import subscription from "../../models/subscription.js";
import otpModel from "../../models/otpSecret.js";
import ResetAttempt from "../../models/resetAttempt.js";
import UserLogin from "../../models/userLogin.js";

import { updateGoogleSheet } from "../../lib/kks-consultation.js";
import feedback from "../../models/feedback.js";
import { Types } from "mongoose";
import transporter from "../../config/email.js";
import { validateEmail } from "../../lib/emalvalidation.js";

export async function getCurrentUSDValue() {
  const { data } = await axios.get(
    `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_APP_ID}&base=USD`
  );
  return data.rates.INR;
}

export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    // const validated = await validateEmail(email, res);

    // if (!validated) return;

    const existingUser = await User.findOne({ email: email.trim() });

    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already exist,Please Login.." });

    // creating otp using 3 party package called otpGenerator.
    const secret = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));

    if (!secret || !salt)
      return res
        .status(400)
        .json({ message: "Error while creating salt and secret." });

    // storing encrypted otp to otpModel for verifying when otp secret send back at the time of verification.
    //const hadedSecret = bcrypt.hasSync(secret,salt)

    await otpModel.create({
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
        res.status(400).json({
          error,
          message: "Error occured while sending otp through email.",
        });
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ status: true, message: "email send successfully." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server occured while sending Otp through email.",
    });
  }
};

export const verifyMailOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp || !email)
      return res
        .status(400)
        .json({ message: "Session expired Please try again" });

    const otpData = await otpModel.findOne({ email });

    if (!otpData)
      return res.status(400).json({ message: "OTP expired or Invalid OTP" });

    const { secret } = otpData;

    // comparing otp secret coming from req and opt secret in otpModel is that same,if it is same otp is verified,otherwise it is unverified.
    const isValid = await bcrypt.compare(otp, secret);

    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    res
      .status(200)
      .json({ otpVerified: true, message: "OTP verified succssfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server Error Occured while Verifying OTP.",
    });
  }
};

// constroller for getting updated users

export const getUser = async (req, res) => {
  const { id } = req.params; //make it inside the try
  try {
    if (!id) return res.status(400).json({ message: "Missing user id." });

    // //MISSION: Validate id ,  if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid user id." });
    // }

    const userData = await User.findById(id, {
      username: true,
      name: true,
      profilePic: true,
      role: true,
      investmentVerified: true,
      gender: true,
      mob: true,
      feedbackSubmitted: true,
    });
    const data = await GeneratePortfolio.findOne({ userId: id });

    if (!userData)
      //make it above the generat portfolio
      return res
        .status(400)
        .json({ message: "Error occured while fetching user details" });
    //make it like this
    //const existingUser={...userdata._doc,investmentType: data ? data.investmentType : undefined}
    //then we don't need the below things . res.status(200)/json({message}) , existingUser

    //No need of theses
    if (data) {
      res.status(200).json({
        message: "successfully fetched userData",
        existingUser: { ...userData._doc, investmentType: data.investmentType },
      });
    } else {
      res.status(200).json({
        message: "successfully fetched userData",
        existingUser: userData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server Error Occured while fetching user details",
    });
  }
};

// ############ Singup ##############//

// User Signup Controller . three methods used to userSignup - manual,google,facebook .
// referrel code will be generated when a new user creates an account

async function createUser(userData) {
  const existingUser = await User.findOne({ email: userData.email });
  let message = "";
  if (existingUser) message = "User already exists. Please login.";
  // if (message) return { message };
  // else
  return { newUser: await User.create(userData) };
}

// function for generating jwt token.
// @param {string} email - User's email address.
// @param {string} id - User's unique identifier.
function generateToken(email, id) {
  return jwt.sign({ email, id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// function for sending response to front-end.
function sendSuccessResponse(res, userData, token) {
  res.status(200).json({
    userData,
    token,
    message: "User signed up successfully.",
  });
}

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

export const userSignup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      profilePic,
      referredCode,
      otp,
      type,
      phone,
    } = req.body.userData;

    if (!username || !email || (!type && !otp))
      return res
        .status(400)
        .json({ message: "Missing Datas or session expired." });

    // const validated = await validateEmail(email, res);

    // if (!validated) return;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already exist,try to login" });

    let data;

    if (password) {
      // const otpData = await otpModel.findOne({ email });
      const otpDataArray = await otpModel.find({ email });
      if (!otpDataArray || otpDataArray.length === 0)
        return res.status(400).json({ message: "OTP expired or Invalid OTP" });

      let latestValidOtp;

      for (const otpData of otpDataArray) {
        const isValid = await bcrypt.compare(otp, otpData.secret);

        if (isValid) {
          latestValidOtp = otpData.secret;
          break;
        }

        if (latestValidOtp) {
          break; // Break the outer loop if a valid OTP is found
        }
      }
      // comparing otp secret coming from req and opt secret in otpModel is that same,if it is same otp is verified,otherwise it is unverified.

      if (!latestValidOtp)
        return res.status(400).json({ message: "Invalid OTP" });

      const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
      const hashedPassword = bcrypt.hashSync(password, salt);

      if (!salt || !hashedPassword)
        return res
          .status(400)
          .json({ message: "Error while hashing password." });

      data = await createUser({
        username,
        email,
        hashedPassword,
        mob: phone,
        referalCode: generateReferralCode(),
        referedMe: referredCode,
      });
    } else {
      data = await createUser({
        username,
        email,
        profilePic,
        referalCode: generateReferralCode(),
        referedMe: referredCode,
      });
    }

    const { newUser, message } = data;

    if (message) return res.status(400).json({ message: message });

    if (!Object.keys(newUser).length && !message)
      return res
        .status(400)
        .json({ message: "Error while creating new user." });

    const token = generateToken(newUser.email, newUser._id);

    if (!token)
      return res.status(400).json({ message: "Error while generating token" });

    sendSuccessResponse(res, newUser, token);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server while registering new user.",
    });
  }
};

//########## UserLogin Controller ##########

// fetching user from User collection using email.

async function getUserByEmail(email) {
  //TODO: add one error handling here , if the user is not
  return await User.findOne({ email });
}

// updating login history of user in admin dashboard at the time of login.

async function updateUserLoginHistory(existingUser, req) {
  const ipAddress = req.ip;
  const update = {
    $push: { loginHistory: { $each: [{ ipAddress }], $slice: -50 } },
  };
  await UserLogin.findOneAndUpdate({ userId: existingUser._id }, update, {
    upsert: true,
    new: true,
  });
}

// verifying user password,if he logined in manual mode and creating token for user , Otherwise returning token
// for logined user.

async function handleLogin(existingUser, password, req, uid, type) {
  try {
    let token;
    let message = "";
    if (!type) {
      message = "Invalid login.";
      return { token, message };
    }
    if (type === "manual") {
      const correctPassword = await bcrypt.compare(
        password,
        existingUser.hashedPassword
      );

      if (correctPassword) {
        token = generateToken(existingUser.email, existingUser._id);
        await updateUserLoginHistory(existingUser, req);
      } else message = "Password Doesn't match.";
    } else {
      if (type === "google" || type === "facebook") {
        if (!uid)
          message =
            "Invalid login request : No UserId provided when login using google or facebook login";
        else {
          token = generateToken(existingUser.email, existingUser._id);
          await updateUserLoginHistory(existingUser, req);
        }
      } else message = "Invalid login type or missing datas.";
    }
    return { token, message };
  } catch (error) {
    console.log(error.message);
  }
}

// get user subscription status.

async function getPlanStatusOfUser(existingUser) {
  // TODO: we can add it in a try catch blog . in the try-catch blog validate the existingUser if it's null
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
              // { case: { $eq: ["$status", "pending"] }, then: 1 },
              { case: { $eq: ["$status", "cancelled"] }, then: 1 },
              { case: { $eq: ["$status", "expired"] }, then: 2 },
            ],
            default: 3, // Adjust the default value accordingly
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
    // const active = subscriptions.map((sub) => sub.status === "active");
    if (subscriptions[0]?.status === "active") {
      subscribedUser = "active";
    } else {
      if (subscriptions[0]?.status === "cancelled") {
        subscribedUser = "cancelled";
      } else subscribedUser = "expired";
    }
  }

  return subscribedUser;
}

// sending response to the frontend.

function sendUserResponse(res, existingUser, token, planStatus) {
  res.status(200).json({
    existingUser,
    token,
    planStatus,
    message: "Successfully logged in.",
  });
}

export const userLogin = async (req, res) => {
  try {
    const { email, password, uid, type } = req.body.userData;
    // const { type } = req.body;

    const existingUser = await getUserByEmail(email);

    if (!existingUser)
      return res.status(400).json({ message: "User doesn't exist." });

    let data;
    if (password)
      data = await handleLogin(existingUser, password, req, null, type);
    else data = await handleLogin(existingUser, null, req, uid, type);

    if (!data || !data.token)
      return res.status(400).json({
        message: "Invalid email or password.",
      });

    const { token, message } = data;

    if (!token) {
      return res.status(400).json({
        message: message,
      });
    }
    const planStatus = await getPlanStatusOfUser(existingUser);
    console.log(planStatus);

    sendUserResponse(res, existingUser, token, planStatus);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server Error occured while login.",
    });
  }
};

// controller for getting data to user settings page.

export const getUserDetails = async (req, res) => {
  const { userId } = req ?? {};

  try {
    if (!userId)
      return res
        .status(500)
        .json({ message: "Error to get user id from request." });

    // getting user profile details

    const userData = await User.findById(userId);

    if (!userData)
      return res
        .status(400)
        .json({ message: "Error while fetching user details from database." });

    const userSettingsData = {
      username: userData.username,
      email: userData.email,
      mob: userData.mob,
      profilePic: userData.profilePic,
      gender: userData.gender,
      ageRange: userData.ageRange,
      working: userData.working,
      workingSector: userData.working_sector,
    };

    // fetching plan details of users.

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
      status: "active",
    });

    let currentPlanDetails = {
      start_Date: "",
      end_Date: "",
      pln: "",
    };
    if (data) {
      currentPlanDetails = {
        start_Date:
          monthNames[data.startDate.getMonth()] +
          " " +
          data.startDate.getDate() +
          "," +
          " " +
          data.startDate.getFullYear(),
        end_Date:
          monthNames[data.endDate.getMonth()] +
          " " +
          data.endDate.getDate() +
          "," +
          " " +
          data.endDate.getFullYear(),
        pln:
          data?.plan.charAt(0).toUpperCase() +
          data?.plan.slice(1).toLowerCase(),
      };
    }
    res.status(200).json({
      userSettingsData,
      message: "Successfully fetched user details",
      currentPlanDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : user profile data getting failed.",
      error: error.message,
    });
  }
};

// controller for updating data of user settings page.

export const userDetailsUpdate = async (req, res) => {
  try {
    const { userData } = req.body ?? {};
    const { userId } = req ?? {};

    if (!userData || !userId)
      return res
        .status(400)
        .json({ message: "Missing of datas from request." });

    const {
      username,
      email,
      mob,
      gender,
      ageRange,
      working,
      workingSector,
      profilePic,
    } = userData;

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

    if (!userDetailsUpdate)
      return res
        .status(400)
        .json({ message: "Error while updating user details." });

    const userSettingsData = {
      username: userUpdatedData.username,
      email: userUpdatedData.email,
      mob: userUpdatedData.mob,
      profilePic: userUpdatedData.profilePic,
      gender: userUpdatedData.gender,
      ageRange: userUpdatedData.ageRange,
      working: userUpdatedData.working,
      workingSector: userUpdatedData.working_sector,
    };

    res.status(200).json({
      message: "user profile updated successfully..",
      userSettingsData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : user profile updation failed",
      error: error.message,
    });
  }
};

//Forgot password controller . Controller will send email to the respected user's mail with the userId

export const sendResetPasswordMail = async (req, res) => {
  const { email } = req.body;

  // Reset attempt limit per day
  const resetAttemptsLimit = 3;

  try {
    if (!email)
      return res
        .status(400)
        .json({ message: "Email is missing from request." });

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(400).json({
        message:
          "There is no user with this email or can't fetch user from database.",
      });

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
        if (Object.keys(mailOptions).length < 4)
          return res
            .status(400)
            .json({ message: "Invalid Mail Option,Missing of datas." });
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ message: "Forgot Password Mail sent successfully." });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to send email." });
      }
    }

    mailFunction();
    await ResetAttempt.create({ email });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : Email can't send",
      error: error.message,
    });
  }
};

//Password updation controller .

export const updatePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    let id = "";

    if (!token) return res.status(404).json({ message: "Invalid Link" });
    if (!password)
      return res
        .status(400)
        .json({ message: "Password is missing from request body." });

    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      id = decodedData.id;
    } catch (error) {
      // Token verification failed or expired
      return res.status(401).json({ message: "Token expired or invalid." });
    }

    if (!id)
      return res
        .status(400)
        .json({ message: "userId can't decoded from token" });

    const existingUser = await User.findById(id);

    if (!existingUser)
      return res.status(400).json({ message: "There is no user with this id" });

    const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.findByIdAndUpdate(id, { hashedPassword });

    return res
      .status(200)
      .json({ message: "User password updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error : User password updation failed",
      error: error.message,
    });
  }
};

// getting referal details from backend

export const getReferData = async (req, res) => {
  try {
    const { userId } = req;

    const refer = await User.findById(userId);

    if (!refer)
      return res
        .status(400)
        .json({ message: "Error while getting reffered details" });

    res.status(200).json({
      referalCode: refer?.referalCode,
      referedUsers: refer?.referedUsers,
      message: "User refer and earn details fetched successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : While fetching referral data",
      error: error.message,
    });
  }
};

// getting plan details of user
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
    res.status(500).json({
      message: "Internal Server Error While fetching User Subscription Status.",
    });
  }
};

//Generate Portfolio personal details update

export const generatePortfolioPart1 = async (req, res) => {
  try {
    const { gender, ageRange, working, workingSector } = req.body;

    const { userId } = req;
    if (!gender || !ageRange || !working)
      return res.status(400).json({ message: "missing datas" });

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

    if (!UserData)
      return res.status(400).json({ message: "User details updation failed." });

    res.status(200).json({
      UserData,
      message: "generate portfolio part one completed successfully..",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Error while updating user details.",
    });
  }
};

// For submitting feedback.

export const submitFeedback = async (req, res) => {
  try {
    const { userId } = req;
    const { feedbackData, rating } = req.body;
    if (!userId || !feedbackData || !rating)
      return res.status(400).json({ message: "Please enter all fields" });

    const createFeedback = await feedback.create({
      feedback: feedbackData,
      userId,
      rating,
    });

    if (!createFeedback)
      return res.status(400).json({
        message: "Failed to submit your feedback, Please Try after sometimes",
      });

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal Server Error : while sending feedback.",
    });
  }
};

// Routing after payment is successful.

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

    if (!subscriptions)
      return res.status(400).json({
        message: "Error Occured while fetching user's subscription details",
      });

    const hasActiveSubscription = subscriptions.some(
      (sub) => sub.status === "active"
    );

    if (hasActiveSubscription || subscriptions.length === 0)
      return res
        .status(400)
        .json({ message: "Please make a payment to continue." });

    const user = await User.findById(userId);

    if (!user.gender)
      return res
        .status(400)
        .json({ message: "Please create portfolio first part." });

    if (!user.portfolios)
      return res
        .status(401)
        .json({ message: "Please create portfolio second part." });

    res.status(200).json({ message: "successfully routed to home page." });
  } catch (error) {
    console.log(error);
    req.status(500).json({
      message: "Something went wrong after payment.",
      error: error.message,
    });
  }
};

export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    // validating token from user side.

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

    if (!phoneNumber)
      return res.status(400).json({ message: "Phone number is required" });

    // Check if the phone number already exists in any other user document
    const phoneNumberExists = await User.exists({ mob: phoneNumber });

    if (phoneNumberExists)
      return res.status(400).json({ message: "Phone number already exists" });

    const data = await User.findByIdAndUpdate(
      userId,
      { mob: phoneNumber },
      { new: true } // Return the updated document
    );

    if (!data)
      return res
        .status(400)
        .json({ message: "Failed to update. Please try again" });

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error : While updating phone number.",
      error: error.message,
    });
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
                // { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "cancelled"] }, then: 1 },
                { case: { $eq: ["$status", "expired"] }, then: 2 },
              ],
              default: 3, // Adjust the default value accordingly
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
      // const active = subscriptions.map((sub) => sub.status === "active");
      if (subscriptions[0]?.status === "active") {
        status = "active";
      } else {
        if (subscriptions[0]?.status === "cancelled") {
          status = "cancelled";
        } else status = "expired";
      }
    }

    res.status(200).json({
      status,
      message: "User subscription status successfully fetched.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message:
        "Internal Server Error : While getting users subscription status.",
    });
    console.log(error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req;
    const { newPassword } = req.body;
    if (!userId || !newPassword)
      return res.status(400).json({ message: "Invalid request" });

    const existingUser = await User.findById(userId);

    if (!existingUser)
      return res.status(400).json({ message: "There is no user with this id" });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUND);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { hashedPassword });

    return res
      .status(201)
      .json({ message: "User password updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
      message: "Internal Server Error: While updating user password.",
    });
  }
};

export const validateUserSubStatus = async (req, res) => {

  try {
    const { email, apiKey } = req.query;
    if (!email || !apiKey)
      return res
        .status(200)
        .json({ message: "email or api key is missing from request." });
    if (apiKey !== process.env.PORT_API_KEY)
      return res.status(200).json({ message: "Invalid api key" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({ message: "This user is not registered." });

    const Subscription = await subscription.findOne({
      userId:user._id,
      status: "active",
    });
    if (!Subscription)
      res
        .status(200)
        .json({ message: "User not subscribed yet.", subscribed: false });

    res.status(200).json({ message: "User subscribed", subscribed: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error while verifying user subscription status" });
  }
};
