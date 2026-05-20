import { CompanyCard } from "@/components/company-card";
import { ReviewCard } from "@/components/review-card";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import Link from "next/link";

function takeSummary(text: string) {
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

export default async function HomePage(props: any) {
  const searchParams:
    | Record<string, string | string[] | undefined>
    | undefined = props.searchParams;
  const currentUser = await getCurrentUser();
  const query = Array.isArray(searchParams?.q)
    ? searchParams.q[0]
    : searchParams?.q || "";

  const popularCompanies = all(
    "SELECT id, name, slug, description, avg_rating, total_reviews FROM companies ORDER BY total_reviews DESC, avg_rating DESC LIMIT 6",
  );
  const recentReviews = all(
    `SELECT r.id, r.title, r.content, r.upvotes, r.downvotes, r.created_at, c.name AS company_name, s.name AS sentiment
     FROM reviews r
     JOIN companies c ON c.id = r.company_id
     JOIN review_sentiments s ON s.id = r.sentiment_id
     ORDER BY r.created_at DESC LIMIT 6`,
  );
  const searchResults = query
    ? all(
        `SELECT r.id, r.title, r.content, c.name AS company_name, s.name AS sentiment, r.upvotes, r.downvotes, r.created_at
         FROM reviews r
         JOIN companies c ON c.id = r.company_id
         JOIN review_sentiments s ON s.id = r.sentiment_id
         WHERE r.title LIKE ? OR r.content LIKE ? OR c.name LIKE ?
         ORDER BY r.created_at DESC LIMIT 8`,
        [`%${query}%`, `%${query}%`, `%${query}%`],
      )
    : [];

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-brand-600">
              DeshiMula
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Bangladesh's company review platform
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600 sm:text-lg">
              Share your company experiences, discover real insights, and help
              create a more transparent workplace for everyone.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/companies"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Browse companies
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-brand-300"
            >
              Write a review
            </Link>
          </div>
        </div>
        <form action="/" method="get" className="mt-8">
          <label htmlFor="q" className="sr-only">
            Search reviews
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="q"
              name="q"
              defaultValue={query}
              placeholder="Search companies or experiences"
              className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {query ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              Search Results for “{query}”
            </h2>
            <Link
              href="/companies"
              className="text-sm text-brand-600 hover:underline"
            >
              Advanced search
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {searchResults.length ? (
              searchResults.map((review: any) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  title={review.title}
                  summary={review.content.slice(0, 180)}
                  companyName={review.company_name}
                  sentiment={review.sentiment}
                  upvotes={review.upvotes}
                  downvotes={review.downvotes}
                  createdAt={review.created_at}
                />
              ))
            ) : (
              <p className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
                No results found. Try a different keyword.
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Popular companies
                </h2>
                <p className="text-sm text-slate-500">
                  See the companies with the most reviews.
                </p>
              </div>
              <Link
                href="/companies"
                className="text-sm text-brand-600 hover:underline"
              >
                Browse all companies
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {popularCompanies.map((company: any) => (
                <CompanyCard
                  key={company.id}
                  slug={company.slug}
                  name={company.name}
                  description={company.description}
                  industries={[]}
                  avgRating={company.avg_rating}
                  totalReviews={company.total_reviews}
                />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Recent reviews
                </h2>
                <p className="text-sm text-slate-500">
                  Honest experiences and company culture reviews.
                </p>
              </div>
              <Link
                href="/review/1"
                className="text-sm text-brand-600 hover:underline"
              >
                View a review
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recentReviews.map((review: any) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  title={review.title}
                  summary={takeSummary(review.content)}
                  companyName={review.company_name}
                  sentiment={review.sentiment}
                  upvotes={review.upvotes}
                  downvotes={review.downvotes}
                  createdAt={review.created_at}
                />
              ))}
            </div>
          </section>
        </>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Share your experience
            </h2>
            <p className="mt-2 text-slate-600">
              Write a polished company review for Bangladeshi job seekers.
            </p>
          </div>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Start reviewing
          </Link>
        </div>
      </section>
    </div>
  );
}
