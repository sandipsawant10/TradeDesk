import { Search, X } from "lucide-react";

const TradeFilters = ({ filters, onSearchChange, onFilterChange, onReset }) => {
  const hasActive =
    filters.symbol || filters.status || filters.assetType || filters.tradeType;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search symbol..."
          value={filters.symbol}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={filters.assetType}
        onChange={(e) => onFilterChange("assetType", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="">All Assets</option>
        <option value="stock">Stock</option>
        <option value="crypto">Crypto</option>
        <option value="forex">Forex</option>
        <option value="commodity">Commodity</option>
      </select>

      <select
        value={filters.tradeType}
        onChange={(e) => onFilterChange("tradeType", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="">Buy & Sell</option>
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>

      {hasActive && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>
      )}
    </div>
  );
};

export default TradeFilters;
