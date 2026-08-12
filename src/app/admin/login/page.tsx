"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DualBrandLockup } from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Incorrect password.");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm card p-8">
        <div className="flex justify-center mb-6">
          <DualBrandLockup />
        </div>
        <h1 className="text-xl font-semibold text-charcoal text-center">Admin access</h1>
        <p className="text-sm text-graytxt text-center mt-1">
          For Transition Leads and Culture &amp; People.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoFocus
            className="w-full px-4 py-2.5 rounded-lg border border-borderc focus-ring outline-none text-sm"
          />
          {error && <p className="text-sm text-orange">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors focus-ring disabled:opacity-60"
          >
            {loading ? "Checking…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
