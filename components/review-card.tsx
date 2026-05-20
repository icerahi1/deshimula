import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";

interface ReviewCardProps {
  id: number;
  title: string;
  summary: string;
  companyName: string;
  sentiment: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export function ReviewCard({
  id,
  title,
  summary,
  companyName,
  sentiment,
  upvotes,
  downvotes,
  createdAt,
}: ReviewCardProps) {
  return (
    <Link
      href={`/review/${id}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{summary}</p>
        </div>
        <Badge className={
          sentiment === "Positive" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
          sentiment === "Negative" ? "bg-rose-50 text-rose-700 border border-rose-200" :
          "bg-amber-50 text-amber-700 border border-amber-200"
        }>
          {sentiment}
        </Badge>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{companyName}</span>
        <span>{formatDate(createdAt)}</span>
      </div>
      <div className="mt-4 flex gap-4 text-sm text-slate-600">
        <span>👍 {upvotes}</span>
        <span>👎 {downvotes}</span>
      </div>
    </Link>
  );
}
