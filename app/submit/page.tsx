import { submitReviewAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SubmitPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const companies = all("SELECT id, name FROM companies ORDER BY name");
  const sentiments = all("SELECT id, name FROM review_sentiments ORDER BY id");

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">
          Submit a new review
        </h1>
        <p className="mt-3 text-slate-600">
          Share your experience and help improve transparency in company
          culture.
        </p>
        <form action={submitReviewAction} className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Company
              <select
                name="companyId"
                defaultValue=""
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="" disabled>
                  Select a company
                </option>
                {companies.map((company: any) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Sentiment
              <select
                name="sentiment"
                defaultValue="Neutral"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                {sentiments.map((item: any) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Review title
            </label>
            <input
              name="title"
              type="text"
              placeholder="What happened?"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Share your experience
            </label>
            <textarea
              name="content"
              rows={8}
              placeholder="Write your company experience in English..."
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tags (comma-separated)
            </label>
            <input
              name="tags"
              type="text"
              placeholder="salary, leadership, work-life-balance"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Submit review
          </button>
        </form>
      </section>
    </div>
  );
}
