import { redirect } from "next/navigation";

export const metadata = { title: "Track Order" };

async function track(formData: FormData) {
  "use server";
  const n = String(formData.get("number") ?? "").trim().toUpperCase();
  if (n) redirect(`/order/${encodeURIComponent(n)}`);
}

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-7 text-center">
        <div className="text-4xl">📦</div>
        <h1 className="font-display text-2xl font-bold mt-3">Track Your Order</h1>
        <p className="text-sm text-black/55 mt-1">Enter the order number from your confirmation email.</p>
        <form action={track} className="mt-6 space-y-3">
          <input name="number" required placeholder="HH-20260101-AB12" className="input text-center uppercase" />
          <button className="btn-primary w-full">Track</button>
        </form>
      </div>
    </div>
  );
}
