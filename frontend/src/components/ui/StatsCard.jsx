const StatsCard = ({ label, value, sub, color = "text-gray-900" }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
  </div>
);

export default StatsCard;
