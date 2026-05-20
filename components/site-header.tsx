import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import Link from "next/link";

interface SiteHeaderProps {
  user: User | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold text-brand-700"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
            D
          </span>
          DeshiMula
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <Link
            className="rounded-full px-3 py-2 transition hover:bg-slate-100"
            href="/companies"
          >
            Companies
          </Link>
          <Link
            className="rounded-full px-3 py-2 transition hover:bg-slate-100"
            href="/submit"
          >
            Submit Review
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  className="rounded-full px-3 py-2 transition hover:bg-slate-100"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              )}
              <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-800">
                {user.name}
              </span>
              <Link
                className="rounded-full px-3 py-2 transition hover:bg-slate-100"
                href="/logout"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                className="rounded-full px-3 py-2 transition hover:bg-slate-100"
                href="/login"
              >
                Login
              </Link>
              <Link href="/register">
                <Button type="button">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
