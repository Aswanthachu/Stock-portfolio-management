import express from "express";

import {
  userSignup,
  userLogin,
  // generatePortfolios,
  userDetailsUpdate,
  getUserDetails,
  // deleteUser,
  sendResetPasswordMail,
  updatePassword,
  // getAllUsers,
  // updateReferral,
  // getSingleUser,
  // updateUserRole,
  getReferData,
  // getPlanStatus,
  generatePortfolioPart1,
  // generatePortfolioPart2,
  // getPlanDetails,
  // getAdminNotificationCount,
  // getUser,
  sendEmailOtp,
  verifyMailOtp,
  // getGeneratePortfolioData,
  submitFeedback,
  // getFeedbacks,
  RouteAfterPayment,
  getStatus,
  validateResetToken,
  updatePhone,
  changePassword,
  validateUserSubStatus,
} from "../controllers/user/user.js";

import { isLogined, userValidation } from "../middlewares/index.js";

const router = express.Router();

router.post("/signup", userValidation, userSignup);
router.post("/login", userLogin);
router.post("/send-reset-password-mail", sendResetPasswordMail);
router.post("/update-password/:token", updatePassword);
router.get("/get-status", isLogined, getStatus);
router.get("/get-profile", isLogined, getUserDetails);
router.patch("/update-profile", isLogined, userDetailsUpdate);
router.get("/get-refer-data", isLogined, getReferData);
router.post("/update-portfolio-part1", isLogined, generatePortfolioPart1);
router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyMailOtp);
router.post("/submit-feedback", isLogined, submitFeedback);
router.get("/routing-after-payment", isLogined, RouteAfterPayment);
router.post("/validate-reset-password-token", validateResetToken);
router.post("/update-phone", isLogined, updatePhone);
router.post("/change-password", isLogined, changePassword);

router.get("/validate-user-subscription-status",validateUserSubStatus)

export default router;
