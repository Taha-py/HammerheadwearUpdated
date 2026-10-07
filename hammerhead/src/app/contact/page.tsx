export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-dark font-bold">We&apos;re here to help</p>
      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-1">Contact HammerHead</h1>
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          ["💬", "WhatsApp", "+92 300 0000000", "https://wa.me/923000000000"],
          ["✉️", "Email", "support@hammerheadwear.com", "mailto:support@hammerheadwear.com"],
          ["🕒", "Hours", "Mon–Sat, 10am – 8pm", "#"],
        ].map(([i, t, v, h]) => (
          <a key={t} href={h} className="card p-6 text-center hover:border-gold transition">
            <div className="text-3xl">{i}</div>
            <p className="font-bold mt-2">{t}</p>
            <p className="text-sm text-black/60 mt-1">{v}</p>
          </a>
        ))}
      </div>
      <div className="card p-6 sm:p-8 mt-6">
        <h2 className="font-semibold text-lg">Send us a message</h2>
        <form action="mailto:support@hammerheadwear.com" method="post" encType="text/plain" className="mt-4 grid sm:grid-cols-2 gap-4">
          <input name="name" required placeholder="Your name" className="input" />
          <input name="email" type="email" required placeholder="Your email" className="input" />
          <textarea name="message" required placeholder="How can we help?" className="input sm:col-span-2 min-h-[120px]" />
          <button className="btn-primary sm:col-span-2">Send Message</button>
        </form>
      </div>
    </div>
  );
}
