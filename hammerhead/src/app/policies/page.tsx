import { SizeChartTable } from "@/components/ProductDetail";
import { DEFAULT_SIZE_CHARTS } from "@/lib/utils";

export const metadata = { title: "Returns, Shipping & Size Guide" };

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-dark font-bold">Customer care</p>
      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-1">Policies</h1>

      <section id="returns" className="card p-6 sm:p-8 mt-8 scroll-mt-32">
        <div className="text-3xl">🔁</div>
        <h2 className="font-display text-2xl font-bold mt-2">7-Day Return & Exchange Policy</h2>
        <div className="mt-4 space-y-3 text-sm text-black/75 leading-relaxed">
          <p>We want you to love what you wear. If something isn&apos;t right, you may return or exchange your item within <strong>7 days of delivery</strong>.</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Items must be <strong>unworn, unwashed</strong> and in original condition with all tags attached.</li>
            <li>Sale items can be exchanged for size only.</li>
            <li>Undergarments and altered items are not eligible for return.</li>
            <li>Return shipping charges are borne by the customer unless the item was damaged or incorrect.</li>
          </ul>
          <div className="rounded-xl border-2 border-gold bg-gold/5 p-4">
            <p className="font-bold text-ink">⚠ No Cashback / No Cash Refunds</p>
            <p className="mt-1">Since all orders are paid via Cash on Delivery, we do not offer cash refunds. Approved returns will be settled as a <strong>product exchange</strong> or <strong>store credit voucher</strong> of equal value, valid for 90 days.</p>
          </div>
          <p>To start a return, WhatsApp us your order number (e.g. HH-20260101-AB12) within 7 days of receiving your parcel.</p>
        </div>
      </section>

      <section id="shipping" className="card p-6 sm:p-8 mt-6 scroll-mt-32">
        <div className="text-3xl">🚚</div>
        <h2 className="font-display text-2xl font-bold mt-2">Shipping & Cash on Delivery</h2>
        <ul className="mt-4 list-disc pl-5 space-y-1.5 text-sm text-black/75">
          <li><strong>Payment method: Cash on Delivery (COD) only.</strong> Please keep the exact amount ready.</li>
          <li>Flat shipping Rs. 250. <strong>FREE</strong> shipping on orders above Rs. 5,000.</li>
          <li>Delivery within 2–5 working days across Pakistan.</li>
          <li>You will receive an order confirmation email with your invoice immediately after checkout.</li>
          <li>Please inspect the parcel at the time of delivery.</li>
        </ul>
      </section>

      <section id="size-guide" className="card p-6 sm:p-8 mt-6 scroll-mt-32">
        <div className="text-3xl">📏</div>
        <h2 className="font-display text-2xl font-bold mt-2">Standard Size Guide</h2>
        <p className="mt-2 text-sm text-black/60">Each product page also has its own detailed size chart.</p>
        {(["men", "women", "kids"] as const).map((k) => (
          <div key={k} className="mt-6">
            <h3 className="font-semibold capitalize mb-2">{k}</h3>
            <SizeChartTable chart={DEFAULT_SIZE_CHARTS[k]} />
          </div>
        ))}
      </section>

      <section id="privacy" className="card p-6 sm:p-8 mt-6 scroll-mt-32">
        <div className="text-3xl">🔒</div>
        <h2 className="font-display text-2xl font-bold mt-2">Privacy</h2>
        <p className="mt-3 text-sm text-black/75">Your name, phone, email and address are collected only to fulfil your order and generate your invoice. We never sell your data.</p>
      </section>
    </div>
  );
}
