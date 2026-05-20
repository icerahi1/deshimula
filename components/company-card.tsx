import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CompanyCardProps {
  slug: string;
  name: string;
  description: string | null;
  industries: string[];
  avgRating: number;
  totalReviews: number;
}

export function CompanyCard({
  slug,
  name,
  description,
  industries,
  avgRating,
  totalReviews,
}: CompanyCardProps) {
  return (
    <Link
      href={`/company/${slug}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <p className="mt-2 text-sm text-slate-600">
            {description ?? "No description available."}
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <div>{avgRating.toFixed(1)} ★</div>
          <div>{totalReviews} reviews</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {industries.slice(0, 3).map((industry) => (
          <Badge key={industry}>{industry}</Badge>
        ))}
      </div>
    </Link>
  );
}
