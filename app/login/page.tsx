import { loginAction } from "@/lib/actions";
import Link from "next/link";

export default async function LoginPage() {
  return (
    <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
        <p className="text-slate-600">Log in with your email and password.</p>
      </div>
      <form action={loginAction} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/register" className="text-brand-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
