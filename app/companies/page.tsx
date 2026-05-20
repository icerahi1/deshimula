import { CompanyCard } from "@/components/company-card";
import { all } from "@/lib/db";
import Link from "next/link";

export default async function CompaniesPage(props: any) {
  const searchParams = await props.searchParams;
  const query = Array.isArray(searchParams?.q)
    ? searchParams.q[0]
    : searchParams?.q || "";
  const industry = Array.isArray(searchParams?.industry)
    ? searchParams.industry[0]
    : searchParams?.industry || "";

  const filters: string[] = [];
  const params: any[] = [];
  if (query) {
    filters.push("(c.name LIKE ? OR c.description LIKE ?)");
    params.push(`%${query}%`, `%${query}%`);
  }
  if (industry) {
    filters.push("i.name = ?");
    params.push(industry);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const companies = all(
    `SELECT c.id, c.name, c.slug, c.description, c.avg_rating, c.total_reviews, GROUP_CONCAT(i.name, ', ') AS industries
      FROM companies c
      LEFT JOIN company_industries ci ON ci.company_id = c.id
      LEFT JOIN industries i ON i.id = ci.industry_id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.total_reviews DESC, c.avg_rating DESC`,
    params,
  );

  const industries = all("SELECT name FROM industries ORDER BY name");

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200/60 glass-card p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              All companies
            </h1>
            <p className="mt-2 text-slate-600">
              Browse reviews, culture, and experiences for every company.
            </p>
          </div>
          <Link
            href="/submit"
            className="rounded-full bg-brand-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Submit a review
          </Link>
        </div>
        <form
          action="/companies"
          method="get"
          className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]"
        >
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by company name or topic"
            className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <select
            name="industry"
            defaultValue={industry}
            className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All Industries</option>
            {industries.map((item: any) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Search
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.length ? (
          companies.map((company: any) => (
            <CompanyCard
              key={company.id}
              slug={company.slug}
              name={company.name}
              description={company.description}
              industries={
                company.industries
                  ? company.industries.split(", ").filter(Boolean)
                  : []
              }
              avgRating={company.avg_rating}
              totalReviews={company.total_reviews}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">
            No companies found. Please try different filters.
          </div>
        )}
      </section>
    </div>
  );
}
