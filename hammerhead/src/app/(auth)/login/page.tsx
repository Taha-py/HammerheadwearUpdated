import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "./LoginForm";
import { SLOGAN } from "@/lib/utils";

export const metadata = { title: "Login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const sp = await searchParams;
  if (user) redirect(user.role === "admin" ? "/admin" : "/account");

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-ink text-white items-center justify-center p-16">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-gold/20 blur-[120px]" />
        <div className="relative text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="mx-auto h-40 w-40 rounded-3xl ring-1 ring-gold/40 shadow-[0_0_80px_-10px_rgba(201,162,74,0.6)] animate-float" />
          <h2 className="font-display text-4xl font-bold mt-8 tracking-[0.15em] uppercase">HammerHead</h2>
          <p className="text-gold uppercase tracking-[0.3em] text-xs mt-2">{SLOGAN}</p>
          <p className="text-white/60 mt-6 max-w-sm mx-auto text-sm">Sign in to track your orders, checkout faster and get early access to new drops.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="mx-auto h-20 w-20 rounded-2xl ring-1 ring-gold/40 shadow-xl" />
            <h2 className="font-display text-2xl font-bold mt-3 tracking-[0.15em] uppercase">HammerHead</h2>
            <p className="text-gold-dark uppercase tracking-[0.3em] text-[10px] mt-1">{SLOGAN}</p>
          </div>
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-black/55 mt-1">Login to your account. Admins are redirected to the Admin Panel.</p>
          <LoginForm next={sp.next} />
          <p className="mt-6 text-sm text-center text-black/60">
            New here? <Link href="/register" className="font-bold text-ink underline underline-offset-4">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
