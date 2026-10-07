import type { Product, SizeChart } from "@/db/schema";

export const BRAND = "HammerHead";
export const BRAND_FULL = "HammerHeadWear";
export const SLOGAN = "Built Different.";
export const EST_LINE = "Premium Quality • Est. 2024";
export const SHIPPING_FEE = 250;
export const FREE_SHIPPING_OVER = 5000;

export function formatPrice(amount: number) {
  return "Rs. " + amount.toLocaleString("en-PK");
}

export function finalPrice(p: Pick<Product, "price" | "onSale" | "discountPct">) {
  if (p.onSale && p.discountPct > 0) {
    return Math.round(p.price * (1 - p.discountPct / 100));
  }
  return p.price;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function stockLabel(stock: number) {
  if (stock <= 0) return { text: "Out of Stock", tone: "out" as const };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: "low" as const };
  return { text: "In Stock", tone: "in" as const };
}

export const CATEGORIES = [
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
  { key: "kids", label: "Kids" },
] as const;

export const STYLES = [
  { key: "casual", label: "Casual" },
  { key: "formal", label: "Formal" },
] as const;

export const PRODUCT_TYPES = [
  "jeans",
  "pants",
  "shirt",
  "t-shirt",
  "polo",
  "blazer",
  "kurta",
  "dress",
  "jacket",
  "hoodie",
  "shorts",
] as const;

export const DEFAULT_SIZE_CHARTS: Record<string, SizeChart> = {
  men: {
    unit: "inches",
    rows: [
      { size: "S", chest: "36-38", waist: "30-32", length: "27" },
      { size: "M", chest: "38-40", waist: "32-34", length: "28" },
      { size: "L", chest: "40-42", waist: "34-36", length: "29" },
      { size: "XL", chest: "42-44", waist: "36-38", length: "30" },
      { size: "XXL", chest: "44-46", waist: "38-40", length: "31" },
    ],
  },
  women: {
    unit: "inches",
    rows: [
      { size: "XS", chest: "32-33", waist: "25-26", length: "25" },
      { size: "S", chest: "34-35", waist: "27-28", length: "26" },
      { size: "M", chest: "36-37", waist: "29-30", length: "27" },
      { size: "L", chest: "38-39", waist: "31-32", length: "28" },
      { size: "XL", chest: "40-42", waist: "33-35", length: "29" },
    ],
  },
  kids: {
    unit: "inches",
    rows: [
      { size: "2-3Y", chest: "21", waist: "20", length: "15" },
      { size: "4-5Y", chest: "23", waist: "21", length: "17" },
      { size: "6-7Y", chest: "25", waist: "22", length: "19" },
      { size: "8-9Y", chest: "27", waist: "23.5", length: "21" },
      { size: "10-12Y", chest: "29", waist: "25", length: "23" },
    ],
  },
};

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export function genOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HH-${ymd}-${rand}`;
}
