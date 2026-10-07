import Link from "next/link";
import { BRAND, EST_LINE, SLOGAN } from "@/lib/utils";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-20 pb-20 lg:pb-0 no-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="HammerHead" className="h-12 w-12 rounded-xl ring-1 ring-gold/40" />
              <div>
                <div className="font-display text-xl tracking-[0.15em] uppercase">{BRAND}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{SLOGAN}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mt-0.5">{EST_LINE}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Casual & professional wear engineered for people who move with purpose. Jeans, shirts, pants and more — crafted with strength in every stitch.
            </p>
            <div className="mt-5 flex gap-3">
              {["instagram", "facebook", "tiktok"].map((s) => (
                <a key={s} href="#" aria-label={s} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs uppercase hover:border-gold hover:text-gold transition">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/shop?category=men" className="hover:text-white">Men</Link></li>
              <li><Link href="/shop?category=women" className="hover:text-white">Women</Link></li>
              <li><Link href="/shop?category=kids" className="hover:text-white">Kids</Link></li>
              <li><Link href="/shop?style=casual" className="hover:text-white">Casual Wear</Link></li>
              <li><Link href="/shop?style=formal" className="hover:text-white">Formal Wear</Link></li>
              <li><Link href="/shop?sale=1" className="hover:text-white text-red-400">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/policies" className="hover:text-white">7-Day Return Policy</Link></li>
              <li><Link href="/policies#shipping" className="hover:text-white">Shipping & COD</Link></li>
              <li><Link href="/policies#size-guide" className="hover:text-white">Size Guide</Link></li>
              <li><Link href="/track" className="hover:text-white">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/login" className="hover:text-white">Login / Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-4">Join the Crew</h4>
            <p className="text-sm text-white/60 mb-4">Get early access to drops and exclusive offers.</p>
            <NewsletterForm />
            <div className="mt-6 flex items-center gap-2 text-xs text-white/50">
              <span className="rounded bg-white/10 px-2 py-1 font-bold">COD</span>
              <span>Cash on Delivery • Pakistan-wide</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40">
          <p>© {new Date().getFullYear()} HammerHeadWear. All rights reserved.</p>
          <p>7-day returns • No cash refunds • Exchange or store credit only</p>
        </div>
      </div>
    </footer>
  );
}
