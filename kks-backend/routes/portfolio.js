import express from "express";

import {
  addNewPortfolio,
  getPortfoliosDetails,
  getSinglePortfolio,
  getSingleStockToBuy,
  getSingleStockSettings,
  deleteSinglePortfolio,
  editPortfolioSettings,
  getAllPortfolios
} from "../controllers/portfolio/portfolio.js";

import {
  getMainDashboard,
  userDashboardData,
} from "../controllers/portfolio/portfolioDashboard.js";

import { isLogined } from "../middlewares/index.js";

const router = express.Router();

router.post("/add-new-portfolio", isLogined, addNewPortfolio);
router.get(
  "/getAllPortfolios-and-first-portfolio-data",
  isLogined,
  getPortfoliosDetails
);
router.get("/get-all-portfolios",isLogined,getAllPortfolios)
router.post("/get-single-portfolio", isLogined, getSinglePortfolio);
router.post("/get-single-stocktobuy", isLogined, getSingleStockToBuy);
router.get(
  "/get-single-settings/:portfolioId",
  isLogined,
  getSingleStockSettings
);
router.put("/delete-portfolio", isLogined, deleteSinglePortfolio);
router.patch("/edit-portfolio", isLogined, editPortfolioSettings);

// main dashboard

router.get("/get-dashboard", isLogined, userDashboardData);
router.get("/get-dashboard-graph-data", isLogined, getMainDashboard);

// router.post("/get-single-portfolio",  getSinglePortfolio);

export default router;
