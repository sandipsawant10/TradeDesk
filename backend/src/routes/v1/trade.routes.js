import express from "express";
import {
  getTrades,
  getTradeById,
  createTrade,
  updateTrade,
  deleteTrade,
  getTradeStats,
} from "../../controllers/trade.controller.js";
import { protect } from "../../middleware/auth.js";
import {
  createTradeRules,
  updateTradeRules,
} from "../../validators/trade.validator.js";
import { validate } from "../../middleware/validate.js";

const router = express.Router();

router.use(protect);

router.get("/stats", getTradeStats);
router.get("/", getTrades);
router.get("/:id", getTradeById);
router.post("/", createTradeRules, validate, createTrade);
router.put("/:id", updateTradeRules, validate, updateTrade);
router.delete("/:id", deleteTrade);

export default router;
