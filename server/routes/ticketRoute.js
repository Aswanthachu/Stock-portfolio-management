import express from "express";
import {
  addNewTicket,
  getTickets,
  replyToTicket,
  updateMessageRead,
  getSingleTicket,
  closeTicket,
  reOpenTicket,
  getTicketNotificationCount,
  reassignTicket,
  // deleteTicket,
  // getSubAdminResponses,
  updateAdminRead,
} from "../controllers/Tickets/ticketController.js";

import { isAdmin, isLogined } from "../middlewares/index.js";
import { addFaqTicket, getFaqTickets } from "../controllers/Tickets/faqController.js";

const router = express.Router();

router.post("/add-new-ticket", isLogined, addNewTicket);
router.post("/reply-to-ticket", isLogined, replyToTicket);
router.patch("/update-message-read/:id", isLogined, updateMessageRead);
router.get("/get-tickets", isLogined, getTickets);
router.get("/get-single-ticket/:ticketId", isLogined, getSingleTicket);
router.patch("/close-ticket/:ticketId", isLogined, isAdmin, closeTicket);
router.patch("/reopen-ticket/:ticketId", isLogined, reOpenTicket);
router.get(
  "/get-ticket-notification-count",
  isLogined,
  getTicketNotificationCount
);

router.post("/add-faq-ticket", isLogined, isAdmin,addFaqTicket);
router.get("/get-faq-tickets",isLogined,getFaqTickets);

// router.get("/get-sub-admin-activity", getSubAdminResponses);
router.post("/update-admin-read", isLogined, isAdmin, updateAdminRead);
router.post("/re-assign", isLogined, isAdmin, reassignTicket);
// router.delete("/delete-ticket/:ticketId", isLogined, deleteTicket);


export default router;
