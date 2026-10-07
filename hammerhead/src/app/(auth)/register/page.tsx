import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RegisterForm from "./RegisterForm";

export const metadata = { title: "Create Account" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-20">
      <div className="text-center mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="mx-auto h-20 w-20 rounded-2xl ring-1 ring-gold/40 shadow-xl" />
        <h1 className="font-display text-3xl font-bold mt-4">Join HammerHead</h1>
        <p className="text-sm text-black/55 mt-1">Create your account for faster checkout & order tracking.</p>
      </div>
      <RegisterForm />
      <p className="mt-6 text-sm text-center text-black/60">
        Already have an account? <Link href="/login" className="font-bold text-ink underline underline-offset-4">Login</Link>
      </p>
    </div>
  );
}
