import express from "express";

import { isAdmin,isLogined } from "../middlewares/index.js";

import {
  // stockToBuy,
  addNewStocks,
  getStocks,
  getSingleStock,
  editStocks,
  addNewStocksByCSV,
  // getHoldingsTable,
  // getUserDasboardGraphData,
  deleteStocks,
  editUserStockDetails,
} from "../controllers/portfolio/stocks.js";

const router = express.Router();

router.post("/add-new-stocks", isLogined,isAdmin, addNewStocks);
router.post("/add-new-stocks-csv", isLogined,isAdmin,addNewStocksByCSV); //
router.get("/get-all-stocks", isLogined,isAdmin, getStocks);
router.patch("/edit-stocks/:id", isLogined,isAdmin, editStocks);
router.delete("/delete-stocks/:id", isLogined,isAdmin, deleteStocks);
router.patch("/edit-user-stocks/:id",isLogined,isAdmin, editUserStockDetails);
router.get('/get-stock/:id',isLogined,getSingleStock)

export default router;
