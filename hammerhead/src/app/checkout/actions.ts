"use server";

import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { sendOrderConfirmation } from "@/lib/email";
import { finalPrice, FREE_SHIPPING_OVER, genOrderNumber, SHIPPING_FEE } from "@/lib/utils";
import { eq, inArray, sql } from "drizzle-orm";

export type CheckoutInput = {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    notes?: string;
  };
  items: { productId: number; size: string; color?: string; quantity: number }[];
};

export type CheckoutResult = { ok: true; orderNumber: string; emailSent: boolean } | { ok: false; error: string };

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const c = input.customer;
  if (!c.name?.trim() || !c.email?.trim() || !c.phone?.trim() || !c.address?.trim() || !c.city?.trim() || !c.province?.trim()) {
    return { ok: false, error: "Please fill all required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return { ok: false, error: "Please enter a valid email address." };
  if (!/^[0-9+\-\s]{10,15}$/.test(c.phone)) return { ok: false, error: "Please enter a valid phone number (e.g. 03001234567)." };
  if (!input.items.length) return { ok: false, error: "Your bag is empty." };

  const ids = [...new Set(input.items.map((i) => i.productId))];
  const dbProducts = await db.select().from(products).where(inArray(products.id, ids));
  const map = new Map(dbProducts.map((p) => [p.id, p]));

  // Validate stock
  const needed = new Map<number, number>();
  for (const it of input.items) {
    const p = map.get(it.productId);
    if (!p) return { ok: false, error: "A product in your bag is no longer available." };
    needed.set(p.id, (needed.get(p.id) ?? 0) + it.quantity);
  }
  for (const [id, q] of needed) {
    const p = map.get(id)!;
    if (p.stock < q) return { ok: false, error: `Only ${p.stock} left in stock for "${p.name}".` };
  }

  const lines = input.items.map((it) => {
    const p = map.get(it.productId)!;
    return {
      productId: p.id,
      name: p.name,
      image: p.images[0] ?? null,
      size: it.size,
      color: it.color ?? null,
      quantity: it.quantity,
      unitPrice: finalPrice(p),
    };
  });
  const subtotal = lines.reduce((a, l) => a + l.unitPrice * l.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const user = await getCurrentUser();

  let orderNumber = genOrderNumber();
  const created = await db.transaction(async (tx) => {
    // retry unique
    for (let i = 0; i < 3; i++) {
      const exists = await tx.select({ id: orders.id }).from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (!exists.length) break;
      orderNumber = genOrderNumber();
    }
    const [o] = await tx
      .insert(orders)
      .values({
        orderNumber,
        userId: user?.id ?? null,
        customerName: c.name.trim(),
        email: c.email.trim().toLowerCase(),
        phone: c.phone.trim(),
        address: c.address.trim(),
        city: c.city.trim(),
        province: c.province.trim(),
        postalCode: c.postalCode?.trim() || null,
        notes: c.notes?.trim() || null,
        subtotal,
        shipping,
        total,
        paymentMethod: "COD",
        status: "pending",
      })
      .returning();
    const items = await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: o.id }))).returning();
    for (const [id, q] of needed) {
      await tx.update(products).set({ stock: sql`${products.stock} - ${q}` }).where(eq(products.id, id));
    }
    return { o, items };
  });

  const emailSent = await sendOrderConfirmation(created.o, created.items);
  if (emailSent) await db.update(orders).set({ emailSent: true }).where(eq(orders.id, created.o.id));

  return { ok: true, orderNumber: created.o.orderNumber, emailSent };
}
