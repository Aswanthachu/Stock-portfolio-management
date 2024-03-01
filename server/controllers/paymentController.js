import bodyParser from "body-parser";
import dotenv from "dotenv";
import PayU from "payu-websdk";
import sha512 from "js-sha512";
import Stripe from "stripe";
import * as uuid from "uuid";
import payment from "../models/payment.js";
import subscription from "../models/subscription.js";
import User from "../models/user.js";
import coupon from "../models/coupon.js";
import upiPayment from "../models/upiPayment.js";
import transporter from "../config/email.js";
import cloudinary from "../lib/cloudinary.js";

dotenv.config({ path: "./config.env" });

// This is your Stripe webhook secret
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const stripe = new Stripe(process.env.StripeSecret);
const payuClient = new PayU(
  {
    key: process.env.PayUMoneyMerchantKey,
    salt: process.env.PayUMoneyMerchantSalt,
  },
  "TEST"
); // Possible value  = TEST/LIVE
// PayUMoney payment initialization


export const payUMoneyPaymentInit = async (req, res) => {
  try {
    const { productinfo, couponCode } = req.body;

    if (!productinfo) {
      res.status(500).json({ message: "Product Information missing" });
    } else {
      const id = uuid.v4().slice(14); // generates a random UUID
      const timestamp = Date.now(); // gets the current timestamp
      const txnid = `TXN-${id}${timestamp}`; // appends the timestamp to the UUID
      const { userId } = req;

      const { username, email } = await User.findById(userId);

      let amount = "0";
      switch (productinfo) {
        case "premium":
          amount = "6915";
          break;
        case "standard":
          amount = "2924";
          break;
       
        default:
          "0";
          break;
      }
      let discount = 0;
      let errorMessage;
      if (couponCode) {
        const valid = await coupon.findOne({ couponCode });
        if (!valid) {
          errorMessage = "Invalid Coupon";
        } else if (valid.couponStatus !== "active") {
          errorMessage = "Coupon Expired";
        } else if (valid.isSingleUse && valid.isCouponUsed.includes(userId)) {
          errorMessage = "Coupon Already Used";
        } else if (valid.couponStatus === "active") {
          const today = new Date();
          const validTillDate = new Date(valid.validTill);
          if (today > validTillDate) {
            errorMessage = "Coupon is expired";
          } else if (valid.maxUsage && valid.usageCount >= valid.maxUsage) {
            errorMessage = "Coupon usage limit reached";
          } else {
            if (valid.couponType === "Percentage") {
              discount = Math.round(
                (parseInt(planDetails.planAmount - planDetails.planDiscount) *
                  valid.couponValue) /
                  100
              );
              amount -= discount;
            } else if (valid.couponType === "Rupees") {
              discount = parseInt(valid.couponValue);
              amount -= discount;
            }
          }
        }
      }

      const hashString =
        process.env.PayUMoneyMerchantKey + // Merchant Key
        "|" +
        txnid +
        "|" +
        amount +
        "|" +
        productinfo +
        "|" +
        username +
        "|" +
        email +
        "|" +
        userId +
        "|" +
        "|||||||||" +
        process.env.PayUMoneyMerchantSalt; // Your salt value
      const hashValue = sha512(hashString);
      await payment.create({
        userId: userId,
        status: "Pending",
        txnid: txnid,
        amount: amount,
        productinfo: productinfo,
        firstname: username,
        email: email,
        hash: hashValue,
        couponCode: couponDetails[0] ? couponDetails[0].couponCode : "",
        couponDiscount: couponDetails[0] ? discount : "",
      });
      res.status(200).json({
        hash: hashValue,
        txnid: txnid,
        amount: amount,
        userId: userId,
        firstname: username,
        email: email,
        errorMessage,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: error });
  }
};
// Handle Payment Response from PayUMoney Server
export const payumoneyResponse = async (req, res) => {
  try {
    const { txnid, status, udf1, productinfo, amount, error_Message } =
      req.body;

    if (
      !txnid ||
      !status ||
      !udf1 ||
      !productinfo ||
      !amount ||
      !error_Message
    ) {
      res.status(500).json({ message: "Missing Datas" });
    } else {
      // Update the payment data to payment collection
      const paymentData = await payment.updateOne({ txnid: txnid }, req.body);
      // Check the response status to determine if the payment was successful or failed
      if (status === "success") {
        // Payment was successful
        const prev = await subscription.find({ txnId: txnid });
        if (prev[0]) {
          res.status(200).redirect(`${process.env.CLIENT_URL}/user/dashboard`);
        } else {
          // For Referal Bonus
          if (productinfo === "premium") {
            const prevSubscription = await subscription.find({
              userId: udf1,
            });
            if (!prevSubscription[0]) {
              const user = await User.find({ _id: udf1 });
             if(user[0].hasOwnProperty('referedMe')) {
                const referal = await User.findOne({
                  referalCode: user[0].referedMe,
                });

                //updating refera
                await User.updateOne(
                  { _id: referal._id },
                  {
                    $push: {
                      referedUsers: {
                        udf1,
                        username: user[0].username,
                        date: new Date().toLocaleDateString("en-GB"),
                      },
                    },
                  }
                );

                const activeSub = await subscription
                  .find({
                    userId: referal._id,
                  })
                  .sort({ createdAt: -1 })
                  .limit(1);
                // check whether any active subscription
                let startdate;
                if (activeSub[0]) {
                  startdate = new Date(activeSub[0].endDate);
                } else {
                  startdate = new Date();
                }
                const subscriptionData = await subscription.create({
                  userId: referal._id,
                  plan: "Referal Bonus Plan",
                  startDate: startdate,
                  amount: "0",
                  status: activeSub[0] ? "pending" : "active",
                });
              }
            }
          }

          // End of Referal Bonus
          const activeSub = await subscription
            .find({
              userId: udf1,
              $or: [
                {
                  status: "active",
                },
                {
                  status: "pending",
                },
              ],
            })
            .sort({ createdAt: -1 })
            .limit(1);
          // check whether any active subscription
          let startdate;
          if (activeSub[0]) {
            startdate = new Date(activeSub[0].endDate);
          } else {
            startdate = new Date();
          }
          const paymentData = await payment.findOne({ txnid: txnid });
          if (paymentData?.couponCode) {
            const Coupon = await coupon.findOne({
              couponCode: paymentData.couponCode,
              couponStatus: "active",
            });
            if (Coupon) {
              Coupon.usageCount++;
              Coupon.isCouponUsed.push(udf1);
              await Coupon.save();
            }
          }
          const subscriptionData = await subscription.create({
            userId: udf1,
            plan: productinfo,
            startDate: startdate,
            amount: amount,
            status: activeSub[0] ? "pending" : "active",
            couponCode: paymentData ? paymentData.couponCode : "",
            discount: paymentData ? paymentData.couponDiscount : "",
            txnId: paymentData.txnid,
          });

          res.redirect(
            `${process.env.CLIENT_URL}/user/payment-status/${status}/${txnid}`
          );
        }
      } else if (status === "failure") {
        res.redirect(
          `${process.env.CLIENT_URL}/user/payment-status/${status}/${txnid}`
        );
      } else {
        res.redirect(`${process.env.CLIENT_URL}/user/plans`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: error });
  }
};
// Get total Revenue
export const getTotalRevenue = async (req, res) => {
  try {
    const revenue = await payment.aggregate([
      {
        $match: {
          status: "success",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $toDouble: "$amount",
            },
          },
        },
      },
    ]);

    res.status(200).json({ totalRevenue: revenue[0].totalAmount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: error });
  }
};
// Get Current Month revenue
export const currentMonthRevenue = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const revenue = await payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $toDouble: "$amount",
            },
          },
        },
      },
    ]);

    res.status(200).json(revenue[0].totalRevenue);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: error });
  }
};
// Get Current Week Revenue
export const currentWeekRevenue = async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - dayOfWeek
    );
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - dayOfWeek + 6
    );
    const revenue = await payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $toDouble: "$amount",
            },
          },
        },
      },
    ]);
    if (revenue[0]) {
      res.status(200).json(revenue[0].totalRevenue);
    } else {
      res.status(200).json("0");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: error });
  }
};

// Get Pending Payment Details
export const getPendingPayments = async (req, res) => {
  try {
    const pendingPayments = await payment.find({ status: "Pending" });
    if (pendingPayments[0]) {
      res.status(200).json(pendingPayments);
    } else {
      res.status(200).json("No pending payments");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: error });
  }
};
// Verify Payment using Transaction Id
export const verifyPendingPayment = async (req, res) => {
  try {
    const { txnid } = req.body;
    const paymentData = await payuClient.verifyPayment(txnid);

    if (paymentData) {
      const updatedPaymentData = await payment.updateOne(
        { txnid: txnid },
        paymentData.transaction_details[txnid]
      );
      if (updatedPaymentData) {
        res.status(200).json(updatedPaymentData);
      }
    } else {
      res.status(200).json("Invalid Transaction Id / Data not Found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: error });
  }
};

// Stripe Payment

export const initStripePayment = async (req, res) => {
  try {
    const { userId } = req;
    const { productinfo, couponCode } = req.body;
    if (!productinfo) {
      res.status(500).json({ message: "Product Information missing" });
    } else {
      const id = uuid.v4().slice(14); // generates a random UUID
      const timestamp = Date.now(); // gets the current timestamp
      const txnid = `TXN-${id}${timestamp}`; // appends the timestamp to the UUID

      const { username, email } = await User.findById(userId);

      let amount = "0";
      switch (productinfo) {
        case "premium":
          amount = "6915";
          break;
        case "standard":
          amount = "2924";
          break;
       
        default:
          "0";
          break;
      }
      let discount = 0;
      let errorMessage;
      let valid;
      if (couponCode) {
        valid = await coupon.findOne({ couponCode });
        if (!valid) {
          errorMessage = "Invalid Coupon";
        } else if (valid.couponStatus !== "active") {
          errorMessage = "Coupon Expired";
        } else if (valid.isSingleUse && valid.isCouponUsed.includes(userId)) {
          errorMessage = "Coupon Already Used";
        } else if (valid.couponStatus === "active") {
          const today = new Date();
          const validTillDate = new Date(valid.validTill);
          if (today > validTillDate) {
            errorMessage = "Coupon is expired";
          } else if (valid.maxUsage && valid.usageCount >= valid.maxUsage) {
            errorMessage = "Coupon usage limit reached";
          } else {
            if (valid.couponType === "Percentage") {
              discount = Math.round(
                (parseInt(amount) / 100) * valid.couponValue
              );
              amount -= discount;
            } else if (valid.couponType === "Rupees") {
              discount = parseInt(valid.couponValue);
              amount -= discount;
            }
          }
        }
      }
      await payment.create({
        userId: userId,
        status: "Pending",
        txnid: txnid,
        amount: parseInt(amount),
        productinfo: productinfo,
        firstname: username,
        email: email,
        couponCode: valid ? valid.couponCode : "",
        couponDiscount: valid ? discount : "",
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: productinfo,
              },
              unit_amount: parseInt(amount) * 100,
            },
            quantity: 1,
          },
        ],
        client_reference_id: txnid,
        customer_email: email,
        metadata: {
          txnid: txnid,
          email: email,
          userId: userId,
          username: username,
          discount: discount * 100,
          product: productinfo,
        },
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/user/payment-status/success/${txnid}`,
        cancel_url: `${process.env.CLIENT_URL}/user/payment-status/failure/${txnid}`,
      });
      res.status(200).json({
        session,
      });
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const stripeResponse = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    if (event.type === "checkout.session.completed") {
      const paymentDetails = req.body.data.object;
      if (paymentDetails.payment_status === "paid") {
        const paymentData = await payment.updateOne(
          { txnid: paymentDetails.metadata.txnid },
          {
            status: "success",
          }
        );
        const prev = await subscription.find({
          txnId: paymentDetails.metadata.txnid,
        });
        if (prev[0]) {
          res.status(200).json("ok");
        } else {
          // For Referal Bonus
          if (paymentDetails.metadata.product === "premium") {
            const prevSubscription = await subscription.find({
              userId: paymentDetails.metadata.userId,
            });
            if (!prevSubscription[0]) {
              const user = await User.find({
                _id: paymentDetails.metadata.userId,
              });
             if(user[0].hasOwnProperty('referedMe')) {
                const referal = await User.findOne({
                  referalCode: user[0].referedMe,
                });

                //updating refera
                await User.updateOne(
                  { _id: referal._id },
                  {
                    $push: {
                      referedUsers: {
                        userId: paymentDetails.metadata.userId,
                        username: user[0].username,
                        date: new Date().toLocaleDateString("en-GB"),
                      },
                    },
                  }
                );

                const activeSub = await subscription
                  .find({
                    userId: referal._id,
                  })
                  .sort({ createdAt: -1 })
                  .limit(1);
                // check whether any active subscription
                let startdate;
                if (activeSub[0]) {
                  startdate = new Date(activeSub[0].endDate);
                } else {
                  startdate = new Date();
                }
                const subscriptionData = await subscription.create({
                  userId: referal._id,
                  plan: "Referal Bonus Plan",
                  startDate: startdate,
                  amount: "0",
                  status: activeSub[0] ? "pending" : "active",
                });
              }
            }
          }

          // End of Referal Bonus
          const activeSub = await subscription
            .find({
              userId: paymentDetails.metadata.userId,
              $or: [
                {
                  status: "active",
                },
                {
                  status: "pending",
                },
              ],
            })
            .sort({ createdAt: -1 })
            .limit(1);
          // check whether any active subscription
          let startdate;
          if (activeSub[0]) {
            startdate = new Date(activeSub[0].endDate);
          } else {
            startdate = new Date();
          }
          const paymentData = await payment.findOne({
            txnid: paymentDetails.metadata.txnid,
          });
          if (paymentData?.couponCode) {
            const Coupon = await coupon.findOne({
              couponCode: paymentData.couponCode,
              couponStatus: "active",
            });
            if (Coupon) {
              Coupon.usageCount++;
              Coupon.isCouponUsed.push(paymentDetails.metadata.userId);
              await Coupon.save();
            }
          }
          const subscriptionData = await subscription.create({
            userId: paymentDetails.metadata.userId,
            plan: paymentData.productinfo,
            startDate: startdate,
            amount: paymentData.amount,
            status: activeSub[0] ? "pending" : "active",
            couponCode: paymentData ? paymentData.couponCode : "",
            discount: paymentData ? paymentData.couponDiscount : "",
            txnId: paymentData.txnid,
          });
          res.status(200).json("ok");
        }
      } else if (paymentDetails.payment_status !== "paid") {
        res.status(200).json("ok");
      } else {
        res.status(200).json("ok");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
};

export const uploadUpiPaymentDetails = async (req, res) => {
  try {
    const { userId } = req;

    const {
      email,
      amount,
      plan,
      upiTransactionId,
      screenshort,
      username,
      txnid,
    } = req.body;

    // upload image to cloudinary
      if(screenshort){
        const data = await cloudinary.uploader.upload(screenshort, {
          folder: "Home/UpiPayment",
          // upload_preset: "UpiPaymentVerification",
          use_filename: true,
        });
        const { secure_url } = data;
        if (secure_url) {
          upiPayment.create({
            email,
            amount,
            upiTransactionId,
            screenshort: secure_url,
            userId,
            username,
            plan,
            txnid,
          });
          res.status(200).json({ status: true });
        } else {
          res.status(400).json({
            status: false,
            message: "Error while uploading image to cloudinary.",
          });
        }
      }else{
        upiPayment.create({
          email,
          amount,
          upiTransactionId,
          screenshort: '',
          userId,
          username,
          plan,
          txnid,
        });
        res.status(200).json({ status: true });
      }
   
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUpiDetails = async (req, res) => {
  try {
    const { productinfo, couponCode } = req.body;

    if (!productinfo) {
      res.status(500).json({ message: "Product Information missing" });
    } else {
      const id = uuid.v4().slice(14); // generates a random UUID
      const timestamp = Date.now(); // gets the current timestamp
      const txnid = `TXN-${id}${timestamp}`; // appends the timestamp to the UUID
      const { userId } = req;

      const { username, email } = await User.findById(userId);

      let amount = "0";
      switch (productinfo) {
        case "premium":
          amount = "6915";
          break;
        case "standard":
          amount = "2924";
          break;
       
        default:
          "0";
          break;
      }
      let discount = 0;
      let errorMessage;
      if (couponCode) {
        const valid = await coupon.findOne({ couponCode });
        if (!valid) {
          errorMessage = "Invalid Coupon";
        } else if (valid.couponStatus !== "active") {
          errorMessage = "Coupon Expired";
        } else if (valid.isSingleUse && valid.isCouponUsed.includes(userId)) {
          errorMessage = "Coupon Already Used";
        } else if (valid.couponStatus === "active") {
          const today = new Date();
          const validTillDate = new Date(valid.validTill);
          if (today > validTillDate) {
            errorMessage = "Coupon is expired";
          } else if (valid.maxUsage && valid.usageCount >= valid.maxUsage) {
            errorMessage = "Coupon usage limit reached";
          } else {
            if (valid.couponType === "Percentage") {
              discount = Math.round(
                (parseInt(amount) * valid.couponValue) / 100
              );
              amount -= discount;
            } else if (valid.couponType === "Rupees") {
              discount = parseInt(valid.couponValue);
              amount -= discount;
            }
          }
        }
      }
      await payment.create({
        userId: userId,
        status: "Pending",
        txnid: txnid,
        amount: amount,
        productinfo: productinfo,
        firstname: username,
        email: email,
        couponCode: couponCode ? couponCode : "",
        couponDiscount: discount,
      });
      res.status(200).json({
        txnid: txnid,
        amount: amount,
        userId: userId,
        firstname: username,
        email: email,
        plan: productinfo,
        errorMessage,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getunVerifiedUpi = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const upi = await upiPayment
      .find({ verified: false, rejected: false })
      .skip(offset)
      .limit(limit);
    res.status(200).json(upi);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const verifyUpiPayment = async (req, res) => {
  try {
    const { id } = req.body;
    const paymentdetails = await upiPayment.findById(id);
    const {
      email,
      amount,
      upiTransactionId,
      screenshort,
      userId,
      username,
      plan,
      txnid,
    } = paymentdetails;
    const prev = await subscription.find({ txnId: txnid });
    if (prev[0]) {
      res.status(400).json("Data already verified");
    } else {
      // For Referal Bonus
      if (plan === "premium") {
        const prevSubscription = await subscription.find({
          userId: userId,
        });
        if (!prevSubscription[0]) {
          const user = await User.find({ _id: userId });
         if(user[0].hasOwnProperty('referedMe')) {
            const referal = await User.findOne({
              referalCode: user[0].referedMe,
            });
            if (referal) {
              //updating refera
              await User.updateOne(
                { _id: referal._id },
                {
                  $push: {
                    referedUsers: {
                      userId,
                      username: user[0].username,
                      date: new Date().toLocaleDateString("en-GB"),
                    },
                  },
                }
              );

              const activeSub = await subscription
                .find({
                  userId: referal._id,
                })
                .sort({ createdAt: -1 })
                .limit(1);
              // check whether any active subscription
              let startdate;
              if (activeSub[0]) {
                startdate = new Date(activeSub[0].endDate);
              } else {
                startdate = new Date();
              }
              const subscriptionData = await subscription.create({
                userId: referal._id,
                plan: "Referal Bonus Plan",
                startDate: startdate,
                amount: "0",
                status: activeSub[0] ? "pending" : "active",
              });
            }
          }
        }
      }

      // End of Referal Bonus
      const activeSub = await subscription
        .find({
          userId: userId,
          $or: [
            {
              status: "active",
            },
            {
              status: "pending",
            },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(1);
      // check whether any active subscription
      let startdate;
      if (activeSub[0]) {
        startdate = new Date(activeSub[0].endDate);
      } else {
        startdate = new Date();
      }
      const paymentData = await upiPayment.findOne({ txnid: txnid });
      if (paymentData?.couponCode) {
        const Coupon = await coupon.findOne({
          couponCode: paymentData.couponCode,
          couponStatus: "active",
        });
        if (Coupon) {
          Coupon.usageCount++;
          Coupon.isCouponUsed.push(userId);
          await Coupon.save();
        }
      }
      const subscriptionData = await subscription.create({
        userId: userId,
        plan: plan,
        startDate: startdate,
        amount: amount,
        status: activeSub[0] ? "pending" : "active",
        couponCode: paymentData ? paymentData.couponCode : "",
        discount: paymentData ? paymentData.couponDiscount : "",
        txnId: paymentData.txnid,
        upiTransactionId: upiTransactionId,
      });

      await upiPayment.findByIdAndUpdate(id, { verified: true });
      const upi = await upiPayment.find({ verified: false, rejected: false });
      const mailOptions = {
        from:  `"KKS Capitals" ${process.env.MAILER_MAIL}`,
        to: email,
        subject: "UPI Payment Verified Successfully",
        html: `<!DOCTYPE html>
      <html>
      <head>
        <title>Payment Verification Success</title>
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
          li {
            margin-top:5px;
            margin-bottom:5px;
            font-size: 18px;
          }
          .highlight {
            font-weight: bold;
            color: #f44336;
          }
        </style>
      </head>
      <body>
        <h1>Payment Verification Success</h1>
        <p>Dear ${username},</p>
        <p>We're pleased to inform you that your payment has been successfully processed.</p>
        <p>Details of your payment:</p>
        <ul>
        <li><span class="highlight">Transaction ID:</span>${
          paymentData.txnid
        }</li>
        <li><span class="highlight">UPI Transaction ID:</span>${upiTransactionId}</li>
        <li><span class="highlight">Plan:</span>${plan}</li>
          <li><span class="highlight">Amount:</span>${amount}</li>
          <li><span class="highlight">Payment Date:</span>${new Date(
            paymentData.createdAt
          ).toLocaleDateString()}</li>
        </ul>
        <p>Thank you for choosing our service. If you have any questions or concerns, please feel free to contact us.</p>
        <p>Best regards,</p>
        <p>KKS Capitals</p>
      </body>
      </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).json(upi);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const rejectUpiPayment = async (req, res) => {
  try {
    const { id } = req.body;
    const paymentdet = await upiPayment.findByIdAndUpdate(id, {
      rejected: true,
    });
    const upi = await upiPayment.find({ verified: false, rejected: false });
    res.status(200).json(upi);
  } catch (error) {
    res.status(500).json(error);
  }
};
