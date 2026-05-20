import { submitCommentAction, voteReviewAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";

interface ReviewPageProps {
  params: { id: string };
}

export default async function ReviewDetailPage(props: any) {
  const params = await props.params;
  const currentUser = await getCurrentUser();
  const review = get(
    `SELECT r.*, c.name AS company_name, c.slug AS company_slug, s.name AS sentiment, u.name AS author
     FROM reviews r
     LEFT JOIN companies c ON c.id = r.company_id
     LEFT JOIN review_sentiments s ON s.id = r.sentiment_id
     LEFT JOIN users u ON u.id = r.user_id
     WHERE r.id = ?`,
    [Number(params.id)],
  );

  if (!review) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
        <h1 className="text-2xl font-semibold">Review not found</h1>
        <p className="mt-2 text-slate-600">
          It may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  const comments = all(
    `SELECT c.content, c.created_at, u.name AS author FROM comments c LEFT JOIN users u ON u.id = c.user_id WHERE c.review_id = ? ORDER BY c.created_at DESC`,
    [review.id],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200/60 glass-card p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>
              Company: <strong>{review.company_name}</strong>
            </span>
            <span className={`rounded-full px-3 py-1 border text-xs font-semibold ${
              review.sentiment === "Positive" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
              review.sentiment === "Negative" ? "bg-rose-50 text-rose-700 border-rose-200" :
              "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {review.sentiment}
            </span>
            <span>{formatDate(review.created_at)}</span>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {review.title}
          </h1>
          <p className="text-sm text-slate-600">
            Posted by {review.author || "Anonymous"}
          </p>
          <div className="prose max-w-none whitespace-pre-line text-slate-700">
            {review.content}
          </div>
          <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
            <span className="font-medium">👍 {review.upvotes}</span>
            <span className="font-medium">👎 {review.downvotes}</span>
            {currentUser ? (
              <form action={voteReviewAction} className="flex gap-3">
                <input type="hidden" name="reviewId" value={review.id} />
                <button
                  type="submit"
                  name="voteType"
                  value="up"
                  className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
                >
                  Upvote
                </button>
                <button
                  type="submit"
                  name="voteType"
                  value="down"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300"
                >
                  Downvote
                </button>
              </form>
            ) : (
              <p className="text-sm text-slate-500">Log in to vote.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Discussion</h2>
            <div className="mt-4 space-y-4">
              {comments.length ? (
                comments.map((comment: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm text-slate-700">{comment.content}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{comment.author || "Anonymous"}</span>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">
                  No comments yet. Be the first to comment.
                </p>
              )}
            </div>
          </div>

          {currentUser ? (
            <form
              action={submitCommentAction}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                Write a comment
              </h2>
              <input type="hidden" name="reviewId" value={review.id} />
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Your comment
                </label>
                <textarea
                  name="content"
                  rows={5}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <button
                type="submit"
                className="mt-4 rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Add comment
              </button>
            </form>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-600">
                To comment, please
                <a
                  href="/login"
                  className="font-medium text-brand-600 hover:underline"
                >
                  log in
                </a>
                .
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Company</h3>
            <Link
              href={`/company/${review.company_slug}`}
              className="mt-3 block text-brand-600 hover:underline"
            >
              View {review.company_name} page
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            <p>
              Explore the review, comment, and vote to help reflect the truth.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
