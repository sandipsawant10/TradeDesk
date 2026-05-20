import { useState } from "react";

const defaultForm = {
  symbol: "",
  assetType: "stock",
  tradeType: "buy",
  entryPrice: "",
  exitPrice: "",
  quantity: "",
  tradeDate: "",
  notes: "",
};

const TradeForm = ({ initial, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState(
    initial
      ? {
          symbol: initial.symbol,
          assetType: initial.assetType,
          tradeType: initial.tradeType,
          entryPrice: initial.entryPrice,
          exitPrice: initial.exitPrice ?? "",
          quantity: initial.quantity,
          tradeDate: initial.tradeDate?.slice(0, 10) ?? "",
          notes: initial.notes ?? "",
        }
      : defaultForm,
  );

  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.symbol.trim()) e.symbol = "Symbol is required";
    if (!form.entryPrice) e.entryPrice = "Entry price is required";
    if (parseFloat(form.entryPrice) <= 0) e.entryPrice = "Must be positive";
    if (!form.quantity) e.quantity = "Quantity is required";
    if (parseFloat(form.quantity) <= 0) e.quantity = "Must be positive";
    if (!form.tradeDate) e.tradeDate = "Trade date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      symbol: form.symbol.toUpperCase(),
      assetType: form.assetType,
      tradeType: form.tradeType,
      entryPrice: parseFloat(form.entryPrice),
      quantity: parseFloat(form.quantity),
      tradeDate: form.tradeDate,
    };
    if (form.exitPrice) payload.exitPrice = parseFloat(form.exitPrice);
    if (form.notes.trim()) payload.notes = form.notes.trim();

    onSubmit(payload);
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Symbol *
          </label>
          <input
            className={inputClass("symbol")}
            placeholder="e.g. AAPL, BTC"
            value={form.symbol}
            onChange={(e) => set("symbol", e.target.value)}
          />
          {errors.symbol && (
            <p className="mt-1 text-xs text-red-500">{errors.symbol}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Asset Type *
          </label>
          <select
            className={inputClass("assetType")}
            value={form.assetType}
            onChange={(e) => set("assetType", e.target.value)}
          >
            <option value="stock">Stock</option>
            <option value="crypto">Crypto</option>
            <option value="forex">Forex</option>
            <option value="commodity">Commodity</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Trade Type *
          </label>
          <select
            className={inputClass("tradeType")}
            value={form.tradeType}
            onChange={(e) => set("tradeType", e.target.value)}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Trade Date *
          </label>
          <input
            type="date"
            className={inputClass("tradeDate")}
            value={form.tradeDate}
            onChange={(e) => set("tradeDate", e.target.value)}
          />
          {errors.tradeDate && (
            <p className="mt-1 text-xs text-red-500">{errors.tradeDate}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Entry Price *
          </label>
          <input
            type="number"
            step="any"
            min="0"
            className={inputClass("entryPrice")}
            placeholder="0.00"
            value={form.entryPrice}
            onChange={(e) => set("entryPrice", e.target.value)}
          />
          {errors.entryPrice && (
            <p className="mt-1 text-xs text-red-500">{errors.entryPrice}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Exit Price
          </label>
          <input
            type="number"
            step="any"
            min="0"
            className={inputClass("exitPrice")}
            placeholder="Leave blank if open"
            value={form.exitPrice}
            onChange={(e) => set("exitPrice", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Quantity *
          </label>
          <input
            type="number"
            step="any"
            min="0"
            className={inputClass("quantity")}
            placeholder="0"
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
          />
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          className={inputClass("notes")}
          rows={2}
          placeholder="Strategy, reasons, observations..."
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? "Saving..." : initial ? "Update Trade" : "Log Trade"}
        </button>
      </div>
    </form>
  );
};

export default TradeForm;
