import express from "express";

import { isLogined } from "../middlewares/index.js";

import {
  createSelfPortfolio,
  getAllSelfCreatePortfoliosAndFirstData,
  getSelfCreatedSinglePortfolio,
  deleteSelfCreatedSinglePortfolio,
  getSelfCreatedSinglePortfolioStocklist,
  getSelfCreatedSinglePortfolioSettings,
  editSelfCreatedSinglePortfolioSettings,
} from "../controllers/selfCreatedPortfolio.js";

const router = express.Router();

router.post(
  "/create-portfolio-with-self-stocks",
  isLogined,
  createSelfPortfolio
);
router.get(
  "/get-self-created-portfolios-and-first-data",
  isLogined,
  getAllSelfCreatePortfoliosAndFirstData
);
router.get(
  "/get-self-created-single-portfolio/:portfolioId",
  isLogined,
  getSelfCreatedSinglePortfolio
);
router.delete(
  "/delete-self-created-single-portfolio/:portfolioId",
  isLogined,
  deleteSelfCreatedSinglePortfolio
);
router.get(
  "/get-self-created-single-portfolio-stocklist/:portfolioId",
  isLogined,
  getSelfCreatedSinglePortfolioStocklist
);
router.get(
  "/get-self-created-portfolio-settings/:portfolioId",
  isLogined,
  getSelfCreatedSinglePortfolioSettings
);
router.patch(
  "/edit-self-created-portfolio-settings",
  isLogined,
  editSelfCreatedSinglePortfolioSettings
);

export default router;
