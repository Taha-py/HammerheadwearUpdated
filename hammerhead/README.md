# HammerHeadWear — E-commerce Store

> **Strength in Every Stitch.**

A mobile-first, 3D-animated e-commerce website for casual & professional clothing (jeans, pants, shirts, blazers…) for **Men, Women & Kids**. Built with Next.js (App Router), PostgreSQL + Drizzle ORM and Tailwind CSS.

## Admin Login

| Field    | Value                  |
| -------- | ---------------------- |
| URL      | `/login` → redirects to `/admin` |
| Email    | `admin@hammerhead.com` |
| Password | `Hammer@2024`          |

Change these in `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) **before** the first run. Once logged in, an **⚙ Admin Panel** button appears in the header / mobile menu.

## Features

**Storefront**
- Landing page with 3D parallax hero, Men / Women / Kids tiles, Casual vs Formal section, featured, sale & new arrivals
- Top navigation: Men · Women · Kids · Casual · Formal · Sale + search
- Product page: image gallery + video, sizes, colours, **per-product size chart**, stock badge (In stock / Only X left / Out of stock), sticky mobile add-to-cart
- Cart drawer + free-shipping progress, full cart page
- **Cash-on-Delivery checkout** collecting name, Gmail, phone, address, city, province, postal code, notes
- Order saved in PostgreSQL, stock auto-decremented, **confirmation email + invoice** sent to customer, printable invoice page (`/order/HH-…`), order tracking
- Customer login / register / account with order history
- Policies page: **7-day return policy — no cashback (exchange / store credit only)**, shipping, size guide

**Admin Panel** (`/admin`)
- Dashboard: revenue, orders, low-stock, top sellers
- Products: add / edit / delete, upload **pictures & videos**, price, sale toggle & discount %, **stock quantity** (drives in/out-of-stock display), sizes, colours, fabric, featured/new flags, **editable size chart per product**
- Orders: list, filter by status, update status, WhatsApp customer, invoice
- Customers list

## Email setup (order confirmations)

Add to `.env` a Gmail address with an App Password:

```
GMAIL_USER=yourstore@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

or any SMTP provider (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`). Without these the order still succeeds and the email is logged to the server console.

## Project structure

```
src/
  app/
    page.tsx                 Landing page
    shop/                    Catalogue with filters (category, style, type, sale, sort, search)
    product/[slug]/          Product detail
    cart/  checkout/         Bag & COD checkout (server action in checkout/actions.ts)
    order/[number]/          Invoice / order status
    track/                   Track order
    (auth)/login, register   Auth pages + actions
    account/                 Customer dashboard
    admin/                   Admin panel (layout guards role = admin)
    policies/  contact/
    api/upload, api/media    Media upload & serving; api/newsletter
  components/                Header, Footer, MobileNav, Hero, ProductCard, TiltCard, CartProvider…
  db/schema.ts               users, products, orders, order_items, newsletter
  lib/                       auth, email, products, seed, utils
public/logo.png              Brand logo
uploads/                     Admin-uploaded media (served via /api/media/*)
```

## Database

Schema is pushed with `npx drizzle-kit push`. On first request the app seeds the admin user and a demo catalogue automatically. To use Supabase, set `DATABASE_URL` to your Supabase Postgres connection string and run `npx drizzle-kit push`.
