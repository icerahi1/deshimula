import { deleteReviewAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") redirect("/login");

  const reviews = all(
    `SELECT r.id, r.title, r.upvotes, r.downvotes, r.created_at, c.name AS company_name, u.name AS author
     FROM reviews r
     LEFT JOIN companies c ON c.id = r.company_id
     LEFT JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC LIMIT 50`,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          View reviews and remove them when needed.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Votes</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {reviews.map((review: any) => (
                <tr key={review.id}>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {review.title}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {review.company_name}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {review.author || "Anonymous"}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    👍 {review.upvotes} | 👎 {review.downvotes}
                  </td>
                  <td className="px-4 py-4">
                    <form action={deleteReviewAction} className="inline-block">
                      <input type="hidden" name="reviewId" value={review.id} />
                      <button
                        type="submit"
                        className="rounded-full bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
