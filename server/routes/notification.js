import express from "express";
import {
  addNewNotification,
  getAllNotifications,
  deleteNotification,
  editNotification,
  getNewNotification,
  readAllNotifications,
  handleSingleClose,
  updateSingleRead
} from "../controllers/notification.js";

import { isAdmin, isLogined, isUserAccess } from "../middlewares/index.js";

const router = express.Router();

router.post("/add-new-notification", isLogined, isAdmin, addNewNotification);
router.get("/get-all-notification", isLogined, isAdmin, getAllNotifications);
router.delete(
  "/delete-notification/:id",
  isLogined,
  isAdmin,
  deleteNotification
);
router.patch("/edit-notification", isLogined, isAdmin, editNotification);

router.get("/get-new-notifications", isLogined, getNewNotification);
router.delete(
  "/read-all-notification",
  isLogined,
  readAllNotifications
);
router.delete("/single-close-notification/:id",isLogined,handleSingleClose);
router.patch("/single-read-notification",isLogined,updateSingleRead);

export default router;
