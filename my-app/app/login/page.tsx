"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      router.push("/pos");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[--background] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-[--color-border] bg-white p-6 shadow-sm space-y-4"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[--color-muted]">Welcome back</p>
          <h1 className="text-2xl font-semibold text-[--foreground]">Sign in</h1>
          <p className="text-sm text-[--color-muted]">Use your staff credentials to continue.</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="space-y-1 block">
          <span className="text-sm font-medium text-[--foreground]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2 text-[--foreground] outline-none focus:border-[--color-primary]"
            placeholder="you@example.com"
          />
        </label>

        <label className="space-y-1 block">
          <span className="text-sm font-medium text-[--foreground]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[--color-border] bg-white px-3 py-2 text-[--foreground] outline-none focus:border-[--color-primary]"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[--color-primary] px-4 py-3 text-black font-semibold shadow-sm transition hover:bg-[--color-primary-strong] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
