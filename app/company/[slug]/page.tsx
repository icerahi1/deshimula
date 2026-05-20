import { getCurrentUser } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";

interface CompanyPageProps {
  params: { slug: string };
}

export default async function CompanyDetailPage(props: any) {
  const params: { slug: string } = props.params;
  const currentUser = await getCurrentUser();
  const company = get(
    `SELECT c.*, GROUP_CONCAT(i.name, ', ') AS industries, GROUP_CONCAT(l.name, ', ') AS locations
     FROM companies c
     LEFT JOIN company_industries ci ON ci.company_id = c.id
     LEFT JOIN industries i ON i.id = ci.industry_id
     LEFT JOIN company_location_junction clj ON clj.company_id = c.id
     LEFT JOIN company_locations l ON l.id = clj.location_id
     WHERE c.slug = ?
     GROUP BY c.id`,
    [params.slug],
  );

  if (!company) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
        <h1 className="text-2xl font-semibold">Company not found</h1>
        <p className="mt-2 text-slate-600">
          Please try searching with a different company name.
        </p>
      </div>
    );
  }

  const reviews = all(
    `SELECT r.id, r.title, r.content, r.upvotes, r.downvotes, r.created_at, s.name AS sentiment
     FROM reviews r
     LEFT JOIN review_sentiments s ON s.id = r.sentiment_id
     WHERE r.company_id = ?
     ORDER BY r.created_at DESC`,
    [company.id],
  );

  const related = all(
    `SELECT c.id, c.name, c.slug, c.description, c.avg_rating, c.total_reviews, GROUP_CONCAT(i.name, ', ') AS industries
     FROM companies c
     LEFT JOIN company_industries ci ON ci.company_id = c.id
     LEFT JOIN industries i ON i.id = ci.industry_id
     WHERE c.id != ?
     GROUP BY c.id
     ORDER BY c.total_reviews DESC LIMIT 3`,
    [company.id],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-600">
              Company
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {company.name}
            </h1>
            <p className="mt-4 text-slate-600">
              {company.description || "No description available."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
              <span className="rounded-full bg-slate-100 px-3 py-2">
                Rating: {company.avg_rating.toFixed(1)} ★
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-2">
                Reviews: {company.total_reviews}
              </span>
              {company.industries && (
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  Industries: {company.industries}
                </span>
              )}
              {company.locations && (
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  Locations: {company.locations}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Company details</p>
            <p className="text-sm text-slate-700">Slug: {company.slug}</p>
            <p className="text-sm text-slate-700">ID: {company.id}</p>
            <Link
              href="/submit"
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Review this company
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            {company.total_reviews} reviews
          </h2>
          <span className="text-sm text-slate-500">Latest reviews</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.length ? (
            reviews.map((review: any) => (
              <div
                key={review.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {review.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                    {review.sentiment}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {review.content.slice(0, 170)}...
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>👍 {review.upvotes}</span>
                  <span>👎 {review.downvotes}</span>
                  <span>{formatDate(review.created_at)}</span>
                </div>
                <Link
                  href={`/review/${review.id}`}
                  className="mt-4 inline-flex text-sm font-medium text-brand-600 hover:underline"
                >
                  Read full review
                </Link>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">
              No reviews yet. You can write the first review.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Companies you may like
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((company: any) => (
            <Link
              key={company.id}
              href={`/company/${company.slug}`}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-300"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {company.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {company.industries ? company.industries : "Industry not set"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
