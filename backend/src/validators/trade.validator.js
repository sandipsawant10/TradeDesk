import { body } from "express-validator";

const createTradeRules = [
  body("symbol")
    .trim()
    .notEmpty()
    .withMessage("Symbol is required")
    .isLength({ max: 10 })
    .withMessage("Symbol cannot exceed 10 characters"),

  body("assetType")
    .notEmpty()
    .withMessage("Asset type is required")
    .isIn(["stock", "crypto", "forex", "commodity"])
    .withMessage("Asset type must be stock, crypto, forex, or commodity"),
  body("tradeType")
    .notEmpty()
    .withMessage("Trade type is required")
    .isIn(["buy", "sell"])
    .withMessage("Trade type must be either buy or sell"),
  body("entryPrice")
    .notEmpty()
    .withMessage("Entry price is required")
    .isFloat({ min: 0 })
    .withMessage("Entry price must be a positive number"),

  body("entryPrice")
    .notEmpty()
    .withMessage("Entry price is required")
    .isFloat({ min: 0 })
    .withMessage("Entry price must be a positive number"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isFloat({ min: 0 })
    .withMessage("Quantity must be a positive number"),

  body("tradeDate")
    .notEmpty()
    .withMessage("Trade date is required")
    .isISO8601()
    .withMessage("Trade date must be a valid date"),

  body("exitPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Exit price must be a positive number"),

  body("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),
];

const updateTradeRules = [
  body("symbol")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Symbol cannot exceed 10 characters"),

  body("assetType")
    .optional()
    .isIn(["stock", "crypto", "forex", "commodity"])
    .withMessage("Asset type must be stock, crypto, forex, or commodity"),
  body("tradeType")
    .optional()
    .isIn(["buy", "sell"])
    .withMessage("Trade type must be either buy or sell"),
  body("entryPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Entry price must be a positive number"),

  body("entryPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Entry price must be a positive number"),

  body("quantity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Quantity must be a positive number"),

  body("tradeDate")
    .optional()
    .isISO8601()
    .withMessage("Trade date must be a valid date"),

  body("exitPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Exit price must be a positive number"),

  body("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),
];

export { createTradeRules, updateTradeRules };
