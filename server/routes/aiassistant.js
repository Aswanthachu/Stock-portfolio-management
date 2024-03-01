import express from "express";

import { isAdmin, isLogined } from "../middlewares/index.js";
import {
  askQuestion,
  getActiveChat,
  closeChat,
  getAllChat,
  fetchSingleThreadMessage
} from "../controllers/aiassistant.js";

const router = express.Router();

router.post("/ask-question", isLogined, askQuestion);
router.get("/get-active-chat", isLogined, getActiveChat);
router.get("/close-chat/:thread_id", isLogined, closeChat);
router.get("/get-all-user-chat", isLogined, isAdmin, getAllChat);
router.get("/get-message-from-thread/:thread_id",isLogined, isAdmin,fetchSingleThreadMessage)

export default router;
