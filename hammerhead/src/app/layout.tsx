import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getCurrentUser } from "@/lib/auth";
import { SLOGAN } from "@/lib/utils";

export const metadata: Metadata = {
  title: { default: "HammerHead", template: "%s | HammerHead" },
  description: `HammerHeadWear — ${SLOGAN} Premium casual & professional clothing for men, women and kids. Jeans, shirts, pants & more. Cash on Delivery nationwide.`,
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const safeUser = user ? { name: user.name, role: user.role } : null;
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Header user={safeUser} />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav loggedIn={!!user} isAdmin={user?.role === "admin"} />
        </CartProvider>
      </body>
    </html>
  );
}
