"use server";

import { db } from "@/db";
import { orders, products, type SizeChart } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProductInput = {
  id?: number;
  name: string;
  description: string;
  category: string;
  style: string;
  type: string;
  price: number;
  onSale: boolean;
  discountPct: number;
  stock: number;
  images: string[];
  videoUrl: string;
  sizes: string[];
  sizeChart: SizeChart;
  featured: boolean;
  isNew: boolean;
  colors: string[];
  fabric: string;
};

export type ActionResult = { ok: true; id?: number } | { ok: false; error: string };

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Unauthorized" };
  if (!input.name.trim()) return { ok: false, error: "Product name is required." };
  if (!(input.price > 0)) return { ok: false, error: "Price must be greater than 0." };
  if (input.images.filter(Boolean).length === 0) return { ok: false, error: "Add at least one product image." };
  if (input.sizes.length === 0) return { ok: false, error: "Add at least one size." };

  let slug = slugify(input.name);
  const clash = await db
    .select({ id: products.id })
    .from(products)
    .where(input.id ? and(eq(products.slug, slug), ne(products.id, input.id)) : eq(products.slug, slug))
    .limit(1);
  if (clash.length) slug = `${slug}-${Date.now().toString(36)}`;

  const values = {
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    category: input.category,
    style: input.style,
    type: input.type,
    price: Math.round(input.price),
    onSale: input.onSale,
    discountPct: Math.max(0, Math.min(90, Math.round(input.discountPct || 0))),
    stock: Math.max(0, Math.round(input.stock || 0)),
    images: input.images.filter(Boolean),
    videoUrl: input.videoUrl.trim() || null,
    sizes: input.sizes.map((s) => s.trim()).filter(Boolean),
    sizeChart: input.sizeChart,
    featured: input.featured,
    isNew: input.isNew,
    colors: input.colors.map((s) => s.trim()).filter(Boolean),
    fabric: input.fabric.trim() || null,
  };

  let id = input.id;
  if (input.id) {
    await db.update(products).set(values).where(eq(products.id, input.id));
  } else {
    const [row] = await db.insert(products).values(values).returning({ id: products.id });
    id = row.id;
  }
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { ok: true, id };
}

export async function deleteProduct(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;
  const id = Number(formData.get("id"));
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function quickUpdateStock(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;
  const id = Number(formData.get("id"));
  const stock = Math.max(0, Number(formData.get("stock")));
  await db.update(products).set({ stock }).where(eq(products.id, id));
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return;
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
