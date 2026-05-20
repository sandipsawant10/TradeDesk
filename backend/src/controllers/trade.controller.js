import mongoose from "mongoose";
import Trade from "../models/Trade.model.js";
import { sendSuccess } from "../utils/response.js";
import { AppError, asyncHandler } from "../middleware/error.js";

const getTrades = asyncHandler(async (req, res) => {
  const {
    page = "1",
    limit = "10",
    status,
    assetType,
    tradeType,
    symbol,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (req.user.role === "user") filter.user = req.user.userId;

  if (status) filter.status = status;
  if (assetType) filter.assetType = assetType;
  if (tradeType) filter.tradeType = tradeType;
  if (symbol) filter.symbol = new RegExp(symbol.trim(), "i");

  const [trades, total] = await Promise.all([
    Trade.find(filter)
      .populate("user", "name email")
      .sort({ tradeDate: -1 })
      .skip(skip)
      .limit(limitNum),
    Trade.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limitNum));

  sendSuccess(res, "Trades fetched", { trades }, 200, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1,
  });
});

const getTradeById = asyncHandler(async (req, res) => {
  const trade = await Trade.findById(req.params.id).populate(
    "user",
    "name email",
  );
  if (!trade) throw new AppError("Trade not found", 404);

  if (
    req.user.role === "user" &&
    trade.user._id.toString() !== req.user.userId
  ) {
    throw new AppError("Unauthorized", 403);
  }

  sendSuccess(res, "Trade fetched", { trade });
});

const createTrade = asyncHandler(async (req, res) => {
  const {
    symbol,
    assetType,
    tradeType,
    entryPrice,
    exitPrice,
    quantity,
    notes,
    tradeDate,
  } = req.body;

  let pnl = null;
  let status = "open";

  if (exitPrice != null) {
    const multiplier = tradeType === "buy" ? 1 : -1;
    pnl = (exitPrice - entryPrice) * quantity * multiplier;
    status = "closed";
  }

  const trade = await Trade.create({
    symbol,
    assetType,
    tradeType,
    entryPrice,
    exitPrice: exitPrice || null,
    quantity,
    pnl,
    status,
    notes,
    tradeDate: tradeDate ? new Date(tradeDate) : new Date(),
    user: req.user.userId,
  });

  sendSuccess(res, "Trade created", { trade }, 201);
});

const updateTrade = asyncHandler(async (req, res) => {
  const trade = await Trade.findById(req.params.id);
  if (!trade) throw new AppError("Trade not found", 404);

  if (req.user.role === "user" && trade.user.toString() !== req.user.userId) {
    throw new AppError("Unauthorized", 403);
  }

  const {
    symbol,
    assetType,
    tradeType,
    entryPrice,
    exitPrice,
    quantity,
    status,
    notes,
    tradeDate,
  } = req.body;

  if (symbol !== undefined) trade.symbol = symbol;
  if (assetType !== undefined) trade.assetType = assetType;
  if (tradeType !== undefined) trade.tradeType = tradeType;
  if (entryPrice !== undefined) trade.entryPrice = entryPrice;
  if (exitPrice !== undefined) trade.exitPrice = exitPrice;
  if (quantity !== undefined) trade.quantity = quantity;
  if (status !== undefined) trade.status = status;
  if (notes !== undefined) trade.notes = notes;
  if (tradeDate !== undefined) trade.tradeDate = new Date(tradeDate);

  if (exitPrice !== undefined) {
    trade.exitPrice = exitPrice;
    if (exitPrice != null) {
      const ep = entryPrice ?? trade.entryPrice;
      const q = quantity ?? trade.quantity;
      const tt = tradeType ?? trade.tradeType;
      const multiplier = tt === "buy" ? 1 : -1;
      trade.pnl = (exitPrice - ep) * q * multiplier;
      trade.status = "closed";
    }
  }
  await trade.save();
  sendSuccess(res, "Trade updated", { trade });
});

const deleteTrade = asyncHandler(async (req, res) => {
  const trade = await Trade.findById(req.params.id);
  if (!trade) throw new AppError("Trade not found", 404);

  if (req.user.role === "user" && trade.user.toString() !== req.user.userId) {
    throw new AppError("Unauthorized", 403);
  }

  await trade.deleteOne();
  sendSuccess(res, "Trade deleted", { trade });
});

const getTradeStats = asyncHandler(async (req, res) => {
  const matchStage =
    req.user.role === "user"
      ? {
          $match: {
            user: new mongoose.Types.ObjectId(req.user.userId),
          },
        }
      : { $match: {} };

  const [summary] = await Trade.aggregate([
    matchStage,
    {
      $group: {
        _id: null,
        totalTrades: { $sum: 1 },
        openTrades: { $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] } },
        closedTrades: {
          $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] },
        },
        totalPnl: { $sum: { $ifNull: ["$pnl", 0] } },
        winCount: { $sum: { $cond: [{ $gt: ["$pnl", 0] }, 1, 0] } },
      },
    },
  ]);

  const byAssetType = await Trade.aggregate([
    matchStage,
    {
      $group: {
        _id: "$assetType",
        count: { $sum: 1 },
        pnl: { $sum: { $ifNull: ["$pnl", 0] } },
      },
    },
  ]);

  sendSuccess(res, "Stats fetched", { summary: summary || {}, byAssetType });
});

export {
  getTrades,
  getTradeById,
  createTrade,
  updateTrade,
  deleteTrade,
  getTradeStats,
};
