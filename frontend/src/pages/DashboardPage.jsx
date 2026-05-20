import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { tradesApi } from "../api/trades";
import { useAuthStore } from "../store/authStore";
import { useDebounce } from "../hooks/useDebounce";
import Layout from "../components/layout/Layout";
import TradeForm from "../components/journal/TradeForm";
import TradeRow from "../components/journal/TradeRow";
import TradeFilters from "../components/journal/TradeFilters";
import StatsCard from "../components/ui/StatsCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import toast from "react-hot-toast";

const defaultFilters = { symbol: "", status: "", assetType: "", tradeType: "" };

const DashboardPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const [trades, setTrades] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState(defaultFilters);
  const [rawSymbol, setRawSymbol] = useState("");
  const debouncedSymbol = useDebounce(rawSymbol, 400);

  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTrades = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (debouncedSymbol) params.symbol = debouncedSymbol;
      if (filters.status) params.status = filters.status;
      if (filters.assetType) params.assetType = filters.assetType;
      if (filters.tradeType) params.tradeType = filters.tradeType;

      const res = await tradesApi.getTrades(params);
      setTrades(res.data.trades);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load trades");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSymbol, filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await tradesApi.getStats();
      setStats(res.data);
    } catch {
      // stats are non-critical, fail silently
    }
  }, []);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSymbol, filters]);

  const handleFilterChange = (key, val) => {
    setFilters((p) => ({ ...p, [key]: val }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setRawSymbol("");
  };

  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await tradesApi.createTrade(payload);
      toast.success("Trade logged!");
      setShowForm(false);
      fetchTrades();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create trade");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingTrade) return;
    setSaving(true);
    try {
      await tradesApi.updateTrade(editingTrade._id, payload);
      toast.success("Trade updated");
      setEditingTrade(null);
      fetchTrades();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update trade");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trade entry?")) return;
    try {
      await tradesApi.deleteTrade(id);
      toast.success("Trade deleted");
      fetchTrades();
      fetchStats();
    } catch {
      toast.error("Failed to delete trade");
    }
  };

  const summary = stats?.summary;
  const totalPnl = summary?.totalPnl ?? 0;
  const winRate =
    summary?.closedTrades > 0
      ? ((summary.winCount / summary.closedTrades) * 100).toFixed(0)
      : null;

  return (
    <Layout>
      {/* stats row */}
      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatsCard label="Total Trades" value={summary.totalTrades ?? 0} />
          <StatsCard
            label="Open Positions"
            value={summary.openTrades ?? 0}
            sub="currently running"
          />
          <StatsCard
            label="Realised P&L"
            value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`}
            color={totalPnl >= 0 ? "text-green-600" : "text-red-600"}
            sub="closed trades only"
          />
          <StatsCard
            label="Win Rate"
            value={winRate !== null ? `${winRate}%` : "—"}
            sub={
              summary.closedTrades
                ? `${summary.closedTrades} closed`
                : "no closed trades"
            }
          />
        </div>
      )}

      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isAdmin ? "All Trades" : "My Journal"}
          </h1>
          <p className="text-sm text-gray-500">
            {pagination?.total ?? 0} entries
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingTrade(null);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Log Trade
        </button>
      </div>

      {/* create form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-800">
            New Trade Entry
          </h2>
          <TradeForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={saving}
          />
        </div>
      )}

      {/* edit form */}
      {editingTrade && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-800">
            Edit Trade
          </h2>
          <TradeForm
            initial={editingTrade}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTrade(null)}
            isLoading={saving}
          />
        </div>
      )}

      {/* filters */}
      <div className="mb-4">
        <TradeFilters
          filters={{ ...filters, symbol: rawSymbol }}
          onSearchChange={setRawSymbol}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* trades table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : trades.length === 0 ? (
          <EmptyState
            title="No trades found"
            description={
              rawSymbol ||
              filters.status ||
              filters.assetType ||
              filters.tradeType
                ? "Try adjusting your filters."
                : 'Click "Log Trade" to record your first trade.'
            }
          />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Exit</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">P&L</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <TradeRow
                  key={trade._id}
                  trade={trade}
                  onEdit={(t) => {
                    setEditingTrade(t);
                    setShowForm(false);
                  }}
                  onDelete={handleDelete}
                  canDelete={isAdmin || trade.user?._id === user?._id}
                />
              ))}
            </tbody>
          </table>
        )}

        {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
      </div>
    </Layout>
  );
};

export default DashboardPage;
