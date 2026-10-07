import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { getFeaturedProducts, getNewArrivals, getSaleProducts } from "@/lib/products";
import { SLOGAN } from "@/lib/utils";

const CATEGORY_TILES = [
  {
    href: "/shop?category=men",
    title: "Men",
    sub: "Denim • Shirts • Trousers",
    img: "https://images.pexels.com/photos/30133694/pexels-photo-30133694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=700",
  },
  {
    href: "/shop?category=women",
    title: "Women",
    sub: "Blazers • Co-ords • Jackets",
    img: "https://images.pexels.com/photos/27383816/pexels-photo-27383816.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=700",
  },
  {
    href: "/shop?category=kids",
    title: "Kids",
    sub: "Playful • Smart • Durable",
    img: "https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=700",
  },
];

const STYLE_TILES = [
  {
    href: "/shop?style=casual",
    title: "Casual Wear",
    desc: "Jeans, tees, hoodies & jackets built for everyday freedom.",
    img: "https://images.pexels.com/photos/6764728/pexels-photo-6764728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    tag: "Weekend Ready",
  },
  {
    href: "/shop?style=formal",
    title: "Formal / Professional",
    desc: "Crisp shirts, tailored trousers and sharp blazers for work & events.",
    img: "https://images.pexels.com/photos/7312457/pexels-photo-7312457.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    tag: "Office Sharp",
  },
];

export default async function HomePage() {
  const [featured, sale, fresh] = await Promise.all([getFeaturedProducts(), getSaleProducts(), getNewArrivals()]);

  return (
    <div>
      <Hero />

      {/* Category tiles: Men / Women / Kids */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-10">
        <div className="grid grid-cols-3 gap-2 sm:gap-5">
          {CATEGORY_TILES.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <TiltCard max={8} className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
                <Link href={c.href} className="group relative block aspect-[3/4] sm:aspect-[4/5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 text-white">
                    <h3 className="font-display text-xl sm:text-3xl font-bold">{c.title}</h3>
                    <p className="hidden sm:block text-xs text-white/70 mt-1">{c.sub}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold">
                      Shop <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16 sm:mt-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-6 sm:mb-10">
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gold-dark">Handpicked</p>
              <h2 className="section-title mt-1">Featured Pieces</h2>
            </div>
            <Link href="/shop" className="text-xs sm:text-sm font-bold uppercase tracking-wider underline underline-offset-4 shrink-0">
              View all
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Casual vs Formal */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16 sm:mt-24">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gold-dark">Two moods. One brand.</p>
            <h2 className="section-title mt-1">Casual or Formal?</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {STYLE_TILES.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <TiltCard max={5} className="rounded-3xl overflow-hidden shadow-2xl">
                <Link href={s.href} className="group relative block aspect-[16/11] sm:aspect-[16/10]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 text-white max-w-sm">
                    <span className="inline-block w-fit rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">{s.tag}</span>
                    <h3 className="font-display text-3xl sm:text-4xl font-bold mt-3">{s.title}</h3>
                    <p className="mt-2 text-sm text-white/75">{s.desc}</p>
                    <span className="btn-gold mt-5 w-fit !py-2.5 !px-5 !text-xs">Explore</span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sale strip */}
      {sale.length > 0 && (
        <section className="mt-16 sm:mt-24 bg-ink text-white py-14 sm:py-20 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-gold/20 blur-[100px]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
            <Reveal>
              <div className="flex items-end justify-between gap-4 mb-6 sm:mb-10">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-red-400">Limited time</p>
                  <h2 className="section-title mt-1">
                    The <span className="gold-text">Sale</span> Edit
                  </h2>
                </div>
                <Link href="/shop?sale=1" className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gold underline underline-offset-4 shrink-0">
                  All deals
                </Link>
              </div>
            </Reveal>
            <div className="no-scrollbar flex gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {sale.map((p) => (
                <div key={p.id} className="w-[62vw] xs:w-[48vw] sm:w-[260px] shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New arrivals */}
      {fresh.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16 sm:mt-24">
          <Reveal>
            <div className="flex items-end justify-between gap-4 mb-6 sm:mb-10">
              <div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gold-dark">Just dropped</p>
                <h2 className="section-title mt-1">New Arrivals</h2>
              </div>
              <Link href="/shop" className="text-xs sm:text-sm font-bold uppercase tracking-wider underline underline-offset-4 shrink-0">
                Shop new
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {fresh.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Why HammerHead */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16 sm:mt-24">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gold-dark">{SLOGAN}</p>
            <h2 className="section-title mt-1">Why HammerHead</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            ["💵", "Cash on Delivery", "Pay when your order arrives at your door. No card needed."],
            ["🔁", "7-Day Returns", "Not the right fit? Exchange within 7 days. No cashback, store credit or exchange."],
            ["📏", "True-to-Size Charts", "Every product has a detailed size chart so you order with confidence."],
            ["🧵", "Premium Fabrics", "Reinforced stitching and durable fabrics that last wash after wash."],
          ].map(([icon, t, d], i) => (
            <Reveal key={t} delay={i * 80}>
              <TiltCard max={8} className="card p-4 sm:p-6 h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-xl shadow-lg">{icon}</div>
                <h3 className="mt-4 font-semibold text-sm sm:text-base">{t}</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-black/55 leading-relaxed">{d}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16 sm:mt-24">
        <Reveal>
          <div className="rounded-3xl bg-sand p-6 sm:p-12">
            <div className="text-center mb-8">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gold-dark">Loved by thousands</p>
              <h2 className="section-title mt-1">What Customers Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {[
                ["Ahmed R.", "Lahore", "The slim-fit jeans are the best I've owned. Delivery in 2 days and COD made it super easy."],
                ["Sana K.", "Karachi", "Ordered the black blazer suit for office — the fit is exactly as the size chart said. Premium quality!"],
                ["Bilal M.", "Islamabad", "Bought a suit set for my son's Eid. He looked adorable and the fabric is soft. Highly recommend."],
              ].map(([n, c, q]) => (
                <div key={n} className="card p-5">
                  <div className="text-gold text-sm tracking-widest">★★★★★</div>
                  <p className="mt-3 text-sm leading-relaxed text-black/75">“{q}”</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider">
                    {n} <span className="text-black/40 font-medium normal-case tracking-normal">• {c}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
