"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BRAND, SLOGAN } from "@/lib/utils";

const CARDS = [
  { src: "https://images.pexels.com/photos/6764725/pexels-photo-6764725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600", label: "Men • Denim", href: "/shop?category=men" },
  { src: "https://images.pexels.com/photos/15666879/pexels-photo-15666879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600", label: "Women • Formal", href: "/shop?category=women" },
  { src: "https://images.pexels.com/photos/30690928/pexels-photo-30690928.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600", label: "Kids • Casual", href: "/shop?category=kids" },
];

export default function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      const g = (e.gamma ?? 0) / 45;
      const b = ((e.beta ?? 45) - 45) / 45;
      el.style.transform = `rotateY(${g * 12}deg) rotateX(${-b * 8}deg)`;
    };
    if (fine) window.addEventListener("mousemove", onMove);
    else window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Background glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-[120px] animate-float-slow" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-[100px] animate-float" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 grid lg:grid-cols-2 gap-10 lg:gap-6 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gold animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> New Season 2026
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight animate-fade-up delay-100">
            Dress with
            <br />
            <span className="gold-text">Purpose.</span>
            <br />
            Move with Power.
          </h1>
          <p className="mt-5 max-w-md mx-auto lg:mx-0 text-sm sm:text-base text-white/65 animate-fade-up delay-200">
            {BRAND} crafts casual & professional wear for men, women and kids — premium denim, sharp shirts and tailored pants.{" "}
            <span className="text-gold font-semibold">{SLOGAN}</span>
          </p>
          <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-3 animate-fade-up delay-300">
            <Link href="/shop" className="btn-gold">Shop Collection</Link>
            <Link href="/shop?sale=1" className="btn-outline !border-white/30 !text-white hover:!bg-white hover:!text-ink">Sale up to 30%</Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm mx-auto lg:mx-0 animate-fade-up delay-500">
            {[
              ["COD", "Cash on Delivery"],
              ["7 Days", "Easy Returns"],
              ["Free", "Delivery 5000+"],
            ].map(([a, b]) => (
              <div key={a} className="rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-center">
                <div className="text-sm sm:text-base font-bold text-gold">{a}</div>
                <div className="text-[10px] sm:text-[11px] text-white/55">{b}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D scene */}
        <div className="order-1 lg:order-2 perspective">
          <div ref={sceneRef} className="preserve-3d relative mx-auto h-[300px] w-[300px] sm:h-[420px] sm:w-[440px] transition-transform duration-300 ease-out">
            {/* rotating ring */}
            <div className="absolute inset-0 m-auto h-[85%] w-[85%] rounded-full border border-gold/30 animate-spin-slow" style={{ transform: "translateZ(-80px) rotateX(70deg)" }} />
            <div className="absolute inset-0 m-auto h-[60%] w-[60%] rounded-full border border-dashed border-gold/40 animate-spin-slow" style={{ animationDirection: "reverse", transform: "translateZ(-40px) rotateX(70deg)" }} />
            {/* logo center */}
            <div className="absolute inset-0 m-auto flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-3xl bg-ink shadow-[0_0_80px_-10px_rgba(201,162,74,0.7)] ring-1 ring-gold/50 animate-float" style={{ transform: "translateZ(60px)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="HammerHead" className="h-full w-full rounded-3xl object-cover" />
            </div>
            {/* floating cards */}
            {CARDS.map((c, i) => {
              const pos = [
                "left-0 top-2 sm:top-6 -rotate-6",
                "right-0 top-10 sm:top-14 rotate-6",
                "left-1/2 -translate-x-1/2 bottom-0 rotate-2",
              ][i];
              const z = [90, 120, 150][i];
              const delay = ["", "delay-300", "delay-500"][i];
              return (
                <Link
                  key={c.label}
                  href={c.href}
                  className={`absolute ${pos} group block w-[118px] sm:w-[160px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20 animate-float ${delay}`}
                  style={{ transform: `translateZ(${z}px)`, animationDelay: `${i * 0.8}s` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={c.label} className="h-[150px] sm:h-[200px] w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink">{c.label}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
