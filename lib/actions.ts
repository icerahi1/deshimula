import {
  createSessionToken,
  getCurrentUser,
  setSessionCookie,
} from "@/lib/auth";
import { get, run, transaction } from "@/lib/db";
import { sentimentScore } from "@/lib/helpers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    throw new Error("Please provide email and password.");
  }

  const user = get(
    "SELECT id, name, email, password, role FROM users WHERE email = ?",
    [email],
  );
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  const token = createSessionToken(user.id, user.role);
  await setSessionCookie(token);
  redirect("/");
}

export async function registerAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password || password.length < 6) {
    throw new Error(
      "Name, email, and a password of at least 6 characters are required.",
    );
  }

  const existing = get("SELECT id FROM users WHERE email = ?", [email]);
  if (existing) {
    throw new Error("Email is already registered.");
  }

  const result = run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
  );
  const token = createSessionToken(result.lastInsertRowid as number, "user");
  await setSessionCookie(token);
  redirect("/");
}

export async function submitReviewAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const companyId = Number(formData.get("companyId")) || 0;
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const sentiment = String(formData.get("sentiment") || "Neutral");
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  if (!companyId || !title || !content) {
    throw new Error("Company, title, and content are required.");
  }

  const company = get(
    "SELECT id, slug, avg_rating, total_reviews FROM companies WHERE id = ?",
    [companyId],
  );
  if (!company) {
    throw new Error("Company not found.");
  }

  const sentimentRecord =
    get("SELECT id FROM review_sentiments WHERE name = ?", [sentiment]) ||
    get("SELECT id FROM review_sentiments WHERE name = ?", ["Neutral"]);
  const sentimentId = sentimentRecord.id as number;
  const reviewScore = sentimentScore(sentiment);

  const insertReview = transaction(() => {
    const result = run(
      "INSERT INTO reviews (guid, title, content, company_id, user_id, sentiment_id, upvotes, downvotes) VALUES (?, ?, ?, ?, ?, ?, 0, 0)",
      [crypto.randomUUID(), title, content, company.id, user.id, sentimentId],
    );

    const newTotal = company.total_reviews + 1;
    const newAverage =
      (company.avg_rating * company.total_reviews + reviewScore) / newTotal;

    run("UPDATE companies SET avg_rating = ?, total_reviews = ? WHERE id = ?", [
      newAverage,
      newTotal,
      company.id,
    ]);

    tags.forEach((tag) => {
      const existing = get("SELECT id FROM tags WHERE name = ?", [tag]);
      let tagId = existing?.id;
      if (!tagId) {
        const tagResult = run("INSERT INTO tags (name) VALUES (?)", [tag]);
        tagId = tagResult.lastInsertRowid as number;
      }
      run(
        "INSERT OR IGNORE INTO review_tags (review_id, tag_id) VALUES (?, ?)",
        [result.lastInsertRowid as number, tagId],
      );
    });

    run(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
      [
        user.id,
        "create_review",
        "review",
        result.lastInsertRowid as number,
        `Review submitted for company ${company.id}`,
      ],
    );
    return result.lastInsertRowid as number;
  });

  const reviewId = insertReview();
  redirect(`/review/${reviewId}`);
}

export async function submitCommentAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reviewId = Number(formData.get("reviewId")) || 0;
  const content = String(formData.get("content") || "").trim();
  if (!reviewId || !content) throw new Error("Comment content is required.");

  run("INSERT INTO comments (review_id, user_id, content) VALUES (?, ?, ?)", [
    reviewId,
    user.id,
    content,
  ]);
  run(
    "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
    [user.id, "comment", "review", reviewId, "User commented on review"],
  );
  redirect(`/review/${reviewId}`);
}

export async function voteReviewAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reviewId = Number(formData.get("reviewId")) || 0;
  const voteType = String(formData.get("voteType") || "up");
  if (!reviewId || !["up", "down"].includes(voteType)) {
    throw new Error("Invalid vote.");
  }

  const review = get(
    "SELECT id, upvotes, downvotes FROM reviews WHERE id = ?",
    [reviewId],
  );
  if (!review) throw new Error("Review not found.");

  transaction(() => {
    const existing = get(
      "SELECT id, vote_type FROM votes WHERE review_id = ? AND user_id = ?",
      [reviewId, user.id],
    );
    if (!existing) {
      run(
        "INSERT INTO votes (review_id, user_id, vote_type) VALUES (?, ?, ?)",
        [reviewId, user.id, voteType],
      );
      if (voteType === "up") {
        run("UPDATE reviews SET upvotes = upvotes + 1 WHERE id = ?", [
          reviewId,
        ]);
      } else {
        run("UPDATE reviews SET downvotes = downvotes + 1 WHERE id = ?", [
          reviewId,
        ]);
      }
    } else if (existing.vote_type !== voteType) {
      run("UPDATE votes SET vote_type = ? WHERE id = ?", [
        voteType,
        existing.id,
      ]);
      if (voteType === "up") {
        run(
          "UPDATE reviews SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = ?",
          [reviewId],
        );
      } else {
        run(
          "UPDATE reviews SET downvotes = downvotes + 1, upvotes = upvotes - 1 WHERE id = ?",
          [reviewId],
        );
      }
    }
  })();

  redirect(`/review/${reviewId}`);
}

export async function deleteReviewAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/login");

  const reviewId = Number(formData.get("reviewId")) || 0;
  if (!reviewId) throw new Error("Invalid review id.");

  const review = get("SELECT id, company_id FROM reviews WHERE id = ?", [
    reviewId,
  ]);
  if (!review) throw new Error("Review not found.");

  const company = get(
    "SELECT avg_rating, total_reviews FROM companies WHERE id = ?",
    [review.company_id],
  );
  run("DELETE FROM review_tags WHERE review_id = ?", [reviewId]);
  run("DELETE FROM votes WHERE review_id = ?", [reviewId]);
  run("DELETE FROM comments WHERE review_id = ?", [reviewId]);
  run("DELETE FROM reports WHERE review_id = ?", [reviewId]);
  run("DELETE FROM reviews WHERE id = ?", [reviewId]);

  if (company && company.total_reviews > 1) {
    const newTotal = company.total_reviews - 1;
    const newAverage = Math.max(
      0,
      (company.avg_rating * company.total_reviews - 3) / newTotal,
    );
    run("UPDATE companies SET avg_rating = ?, total_reviews = ? WHERE id = ?", [
      newAverage,
      newTotal,
      review.company_id,
    ]);
  } else {
    run("UPDATE companies SET avg_rating = 0, total_reviews = 0 WHERE id = ?", [
      review.company_id,
    ]);
  }

  run(
    "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
    [user.id, "delete_review", "review", reviewId, "Admin deleted a review"],
  );
  redirect("/dashboard");
}
