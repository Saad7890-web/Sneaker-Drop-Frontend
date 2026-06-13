import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export type DropSortOption = "newest" | "stock_desc" | "stock_asc";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "ACTIVE" | "SCHEDULED" | "ENDED";
  onStatusChange: (value: "all" | "ACTIVE" | "SCHEDULED" | "ENDED") => void;
  sortBy: DropSortOption;
  onSortChange: (value: DropSortOption) => void;
};

export function DropToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-soft lg:grid-cols-4">
      <div className="lg:col-span-2">
        <Input
          label="Search drops"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-200">Status</span>
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusChange(e.target.value as typeof statusFilter)
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-slate-100 outline-none focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="ACTIVE">Active</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ENDED">Ended</option>
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-200">Sort</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as DropSortOption)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-slate-100 outline-none focus:border-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="stock_desc">Stock: High to Low</option>
          <option value="stock_asc">Stock: Low to High</option>
        </select>
      </label>

      <div className="lg:col-span-4 flex flex-wrap gap-2 pt-1">
        <Badge tone={statusFilter === "all" ? "info" : "neutral"}>
          Status: {statusFilter}
        </Badge>
        <Badge tone={search ? "success" : "neutral"}>
          Search: {search || "None"}
        </Badge>
        <Badge tone="neutral">Sort: {sortBy}</Badge>
      </div>
    </div>
  );
}
