"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }), headers: { "Content-Type": "application/json" } });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") return <p className="text-sm text-gold font-semibold">✓ Welcome to the crew!</p>;

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@gmail.com"
        className="w-full rounded-full bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/40 focus:bg-white/15 ring-1 ring-white/10 focus:ring-gold"
      />
      <button disabled={state === "loading"} className="rounded-full bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink hover:bg-gold-light disabled:opacity-50">
        Join
      </button>
    </form>
  );
}
