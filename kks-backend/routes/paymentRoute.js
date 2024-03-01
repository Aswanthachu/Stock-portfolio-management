import express from "express";
import bodyParser from "body-parser";
import {
  payUMoneyPaymentInit,
  payumoneyResponse,
  getTotalRevenue,
  currentMonthRevenue,
  currentWeekRevenue,
  getPendingPayments,
  verifyPendingPayment,
  initStripePayment,
  stripeResponse,
  uploadUpiPaymentDetails,
  getUpiDetails,
  getunVerifiedUpi,
  verifyUpiPayment,
  rejectUpiPayment
} from "../controllers/paymentController.js";

import { isAdmin,isLogined} from "../middlewares/index.js";

const router = express.Router();

router.post("/pay-u-money", isLogined, payUMoneyPaymentInit);
router.post("/payumoney-response", payumoneyResponse);
router.get("/total-revenue",isLogined, isAdmin, getTotalRevenue);
router.get("/current-month-revenue",isLogined, isAdmin, currentMonthRevenue);
router.get("/current-week-revenue",isLogined, isAdmin, currentWeekRevenue);
router.get("/get-pending-payments",isLogined, isAdmin, getPendingPayments);
router.post("/verify-pending-payment", verifyPendingPayment);
router.post('/create-payment-intent',isLogined,initStripePayment)
router.post("/stripe-response", stripeResponse);
router.post('/upload-upi-payment-details',isLogined,uploadUpiPaymentDetails);
router.post('/get-upi-details',isLogined,getUpiDetails)
router.get('/get-un-verified-payments',isLogined,isAdmin,getunVerifiedUpi)
router.post('/reject-upi-payment',isLogined,isAdmin,rejectUpiPayment)
router.post('/verify-upi-payment',isLogined,isAdmin,verifyUpiPayment)
export default router;
