import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({

  Symbol: {
    type: String,
    required: [true, "Symbol is required"],
    uppercase: true,
    trim: true,
    maxlength: [20, 'Symbol cannot be more than 20 characters long'],
  }, 
  assetType: {
    type: String,
    enum: ['stock', 'crypto', 'forex', 'commodity'],
    required: [true, "Asset type is required"],
  }, 
  tradeType: {
    type: String,
    enum: ['buy', 'sell'],
    required: [true, "Trade type is required"],
  },
  entryPrice: {
    type: Number,
    required: [true, "Entry price is required"],
    min: [0, "Entry price cannot be negative"],
  },
  exitPrice: {
    type: Number,
    required: [true, "Exit price is required"],
    min: [0, "Exit price cannot be negative"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  pnl: {
    type: Number,
    default: null,
  }, 
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters long'],
  },
  tradeDate: {
    type: Date,
    required: [true, "Trade date is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User reference is required"],
  }
}, {timestamps: true});

tradeSchema.index({ user: 1, Symbol: 1, tradeDate: -1 });
tradeSchema.index({ symbol: 'text' });

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;