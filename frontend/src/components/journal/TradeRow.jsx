import { Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";

const TradeRow = ({ trade, onEdit, onDelete, canDelete }) => {
  const pnlColor =
    trade.pnl === null
      ? "text-gray-400"
      : trade.pnl >= 0
        ? "text-green-600"
        : "text-red-600";

  const pnlText =
    trade.pnl === null
      ? "—"
      : `${trade.pnl >= 0 ? "+" : ""}$${trade.pnl.toFixed(2)}`;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
        {trade.symbol}
      </td>
      <td className="px-4 py-3">
        <Badge value={trade.assetType} />
      </td>
      <td className="px-4 py-3">
        <Badge value={trade.tradeType} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        ${trade.entryPrice.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {trade.exitPrice != null ? `$${trade.exitPrice.toLocaleString()}` : "—"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{trade.quantity}</td>
      <td className={`px-4 py-3 text-sm font-medium ${pnlColor}`}>{pnlText}</td>
      <td className="px-4 py-3">
        <Badge value={trade.status} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(trade.tradeDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(trade)}
            className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(trade._id)}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TradeRow;
