import { BookOpen } from "lucide-react";

const EmptyState = ({
  title = "No trades found",
  description = "Log your first trade to get started.",
}) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
    <BookOpen className="mb-4 h-12 w-12 opacity-40" />
    <p className="text-base font-medium text-gray-500">{title}</p>
    <p className="mt-1 text-sm">{description}</p>
  </div>
);

export default EmptyState;
