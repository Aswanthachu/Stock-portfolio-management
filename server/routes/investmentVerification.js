import express from "express";

import { isLogined,isUserAccess } from "../middlewares/index.js";

import {
  verifyInvest,
  getAllInvestmentDetails,
  uploadInvestmentDetails,
  getSingleInvestmentDetails,
  getSingleStockDetails
} from "../controllers/investmentVerification.js";

const router = express.Router();

router.post("/upload-invest-details",isLogined, uploadInvestmentDetails);
router.get("/get-invest-Details",isLogined,isUserAccess, getAllInvestmentDetails);
router.get("/get-single-details/:id",isLogined,isUserAccess, getSingleInvestmentDetails);
router.get("/get-single-stock-details/:id/:type",isLogined,isUserAccess, getSingleStockDetails);
router.patch("/verify-investment/:id",isLogined,isUserAccess, verifyInvest);

export default router;
