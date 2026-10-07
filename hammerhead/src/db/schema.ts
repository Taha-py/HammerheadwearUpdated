import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

export type SizeChartRow = { size: string; chest: string; waist: string; length: string };
export type SizeChart = { unit: string; rows: SizeChartRow[] };

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 40 }),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull().default(""),
  category: varchar("category", { length: 20 }).notNull(), // men | women | kids
  style: varchar("style", { length: 20 }).notNull().default("casual"), // casual | formal
  type: varchar("type", { length: 40 }).notNull().default("shirt"), // jeans | pants | shirt | ...
  price: integer("price").notNull(), // in PKR
  onSale: boolean("on_sale").notNull().default(false),
  discountPct: integer("discount_pct").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  videoUrl: text("video_url"),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  sizeChart: jsonb("size_chart").$type<SizeChart>(),
  featured: boolean("featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  fabric: text("fabric"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
  userId: integer("user_id"),
  customerName: text("customer_name").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: varchar("postal_code", { length: 20 }),
  notes: text("notes"),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull(),
  paymentMethod: varchar("payment_method", { length: 20 }).notNull().default("COD"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  emailSent: boolean("email_sent").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id"),
  name: text("name").notNull(),
  image: text("image"),
  size: varchar("size", { length: 20 }),
  color: varchar("color", { length: 40 }),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
