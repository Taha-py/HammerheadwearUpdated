import nodemailer from "nodemailer";
import type { Order, OrderItem } from "@/db/schema";
import { formatPrice, BRAND_FULL, SLOGAN } from "./utils";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (host) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user, pass },
    });
  }
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

export function orderEmailHtml(order: Order, items: OrderItem[]) {
  const rows = items
    .map(
      (i) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${i.name}${i.size ? ` <span style="color:#888">(Size ${i.size})</span>` : ""}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.unitPrice * i.quantity)}</td>
      </tr>`
    )
    .join("");
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#fff;color:#111">
    <div style="background:#0a0a0a;padding:24px;text-align:center">
      <h1 style="color:#C9A24A;margin:0;letter-spacing:2px">HAMMERHEAD</h1>
      <p style="color:#bbb;margin:4px 0 0;font-size:12px;letter-spacing:1px">${SLOGAN}</p>
    </div>
    <div style="padding:24px">
      <h2 style="margin-top:0">Thank you, ${order.customerName}!</h2>
      <p>Your order <strong>${order.orderNumber}</strong> has been received and will be delivered via <strong>Cash on Delivery</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead><tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <table style="width:100%;font-size:14px">
        <tr><td>Subtotal</td><td style="text-align:right">${formatPrice(order.subtotal)}</td></tr>
        <tr><td>Shipping</td><td style="text-align:right">${order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</td></tr>
        <tr><td style="font-weight:bold;font-size:16px;padding-top:8px">Total (COD)</td><td style="text-align:right;font-weight:bold;font-size:16px;padding-top:8px">${formatPrice(order.total)}</td></tr>
      </table>
      <h3>Delivery Address</h3>
      <p style="color:#444">${order.address}<br/>${order.city}, ${order.province} ${order.postalCode ?? ""}<br/>Phone: ${order.phone}</p>
      <p style="font-size:12px;color:#888;border-top:1px solid #eee;padding-top:12px">Return policy: 7 days return / exchange. No cash refunds. Keep this email as your invoice.</p>
    </div>
  </div>`;
}

export async function sendOrderConfirmation(order: Order, items: OrderItem[]) {
  const transport = getTransport();
  const html = orderEmailHtml(order, items);
  if (!transport) {
    console.log(`[email] SMTP not configured. Would send confirmation for ${order.orderNumber} to ${order.email}`);
    return false;
  }
  try {
    await transport.sendMail({
      from: `"${BRAND_FULL}" <${process.env.SMTP_FROM || process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: order.email,
      subject: `Order Confirmed • ${order.orderNumber} • ${BRAND_FULL}`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[email] failed", e);
    return false;
  }
}
