import { getCurrentUser } from "@/lib/auth";
import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-14">
      <div className="mb-6 sm:mb-10">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-dark font-bold">Secure checkout</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">Checkout</h1>
        <p className="text-sm text-black/55 mt-1">Pay with cash when your order is delivered.</p>
      </div>
      <CheckoutForm user={user ? { name: user.name, email: user.email, phone: user.phone ?? "" } : null} />
    </div>
  );
}
