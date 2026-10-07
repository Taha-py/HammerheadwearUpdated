"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../actions";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="mt-6 space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {state?.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      <div>
        <label className="label">Email</label>
        <input name="email" type="email" required className="input" placeholder="you@gmail.com" autoComplete="email" />
      </div>
      <div>
        <label className="label">Password</label>
        <div className="relative">
          <input name="password" type={show ? "text" : "password"} required className="input pr-16" placeholder="••••••••" autoComplete="current-password" />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase text-black/50">
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <button disabled={pending} className="btn-primary w-full !py-4">{pending ? "Signing in…" : "Login"}</button>
    </form>
  );
}
