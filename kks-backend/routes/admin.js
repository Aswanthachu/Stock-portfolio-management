import express from "express";
import {
  getDashboardData,
  getPortfolioTable,
  getRevenueDetails,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  getFeedbacks,
  // deleteUser,
  getAdminNotificationCount,
  getSubadminActivities,
  getUserActivities
} from "../controllers/admin/admin.js";

import { isAdmin, isLogined, isUserAccess } from "../middlewares/index.js";

const router = express.Router();

router.get("/get-dashboard-data", isLogined, isAdmin, getDashboardData);
router.get(
  "/get-user-portfolio-table/:id/:type",
  isLogined,
  isUserAccess,
  getPortfolioTable
);
router.get("/get-revenue-details", isLogined, isAdmin, getRevenueDetails);

router.get("/get-all-user", isLogined, isUserAccess, getAllUsers);
router.get("/get-single-user/:id", isLogined, isUserAccess, getSingleUser);
router.get("/get-sub-admin-activities/:id", isLogined, isUserAccess, getSubadminActivities);
router.get("/get-user-activities/:id", isLogined, isUserAccess, getUserActivities);
router.patch("/update-user-role", isLogined, isAdmin, updateUserRole);
router.get("/get-feedbacks", isLogined, isAdmin, getFeedbacks);
// router.delete("/delete-user/:id", isLogined, isAdmin, deleteUser);
router.get(
  "/get-admin-notification-count",
  // isLogined,
  // isAdmin,
  getAdminNotificationCount
);


export default router;
