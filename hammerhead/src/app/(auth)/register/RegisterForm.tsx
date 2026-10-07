"use client";

import { useActionState } from "react";
import { registerAction } from "../actions";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  return (
    <form action={action} className="card p-6 space-y-4">
      {state?.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      <div>
        <label className="label">Full Name</label>
        <input name="name" required className="input" placeholder="Ali Khan" />
      </div>
      <div>
        <label className="label">Email (Gmail)</label>
        <input name="email" type="email" required className="input" placeholder="you@gmail.com" />
      </div>
      <div>
        <label className="label">Phone</label>
        <input name="phone" type="tel" className="input" placeholder="03001234567" />
      </div>
      <div>
        <label className="label">Password</label>
        <input name="password" type="password" required minLength={6} className="input" placeholder="Min. 6 characters" />
      </div>
      <button disabled={pending} className="btn-gold w-full !py-4">{pending ? "Creating…" : "Create Account"}</button>
    </form>
  );
}
