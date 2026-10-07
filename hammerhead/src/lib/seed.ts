import { db } from "@/db";
import { products, users } from "@/db/schema";
import { hashPassword } from "./auth";
import { DEFAULT_SIZE_CHARTS } from "./utils";
import { eq } from "drizzle-orm";

const img = (id: number, ext = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800`;

const MEN_SIZES = ["S", "M", "L", "XL", "XXL"];
const WOMEN_SIZES = ["XS", "S", "M", "L", "XL"];
const KID_SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"];

const SEED_PRODUCTS = [
  {
    name: "Indigo Slim-Fit Stretch Jeans",
    slug: "indigo-slim-fit-stretch-jeans",
    description:
      "Premium 12oz stretch denim with a modern slim taper. Deep indigo wash, reinforced stitching and signature HammerHead rivets. Built for everyday strength and comfort.",
    category: "men", style: "casual", type: "jeans", price: 4290, onSale: true, discountPct: 20, stock: 24,
    images: [img(6764725), img(10004179)], sizes: ["30", "32", "34", "36", "38"], featured: true, isNew: false,
    colors: ["Indigo", "Black"], fabric: "98% Cotton, 2% Elastane",
  },
  {
    name: "Classic Denim Shirt",
    slug: "classic-denim-shirt",
    description: "A rugged yet refined mid-wash denim shirt with pearl-snap buttons and double chest pockets. Layer it or wear it solo.",
    category: "men", style: "casual", type: "shirt", price: 3490, onSale: false, discountPct: 0, stock: 18,
    images: [img(30133694), img(6764728)], sizes: MEN_SIZES, featured: true, isNew: true,
    colors: ["Mid Blue"], fabric: "100% Cotton Denim",
  },
  {
    name: "Executive White Dress Shirt",
    slug: "executive-white-dress-shirt",
    description: "Crisp Egyptian cotton formal shirt with a spread collar and French placket. Wrinkle-resistant finish keeps you sharp from boardroom to dinner.",
    category: "men", style: "formal", type: "shirt", price: 3990, onSale: false, discountPct: 0, stock: 30,
    images: [img(7312457), img(23879365)], sizes: MEN_SIZES, featured: true, isNew: false,
    colors: ["White", "Sky Blue"], fabric: "100% Egyptian Cotton",
  },
  {
    name: "Charcoal Tailored Trousers",
    slug: "charcoal-tailored-trousers",
    description: "Flat-front formal trousers with a tapered leg and Italian-inspired cut. Stretch wool blend for all-day comfort.",
    category: "men", style: "formal", type: "pants", price: 4590, onSale: true, discountPct: 15, stock: 4,
    images: [img(31303535), img(37825460)], sizes: ["30", "32", "34", "36", "38"], featured: false, isNew: false,
    colors: ["Charcoal", "Navy"], fabric: "70% Wool, 28% Polyester, 2% Elastane",
  },
  {
    name: "Monochrome Oxford Shirt & Tie Set",
    slug: "monochrome-oxford-shirt-tie-set",
    description: "Formal oxford shirt paired with a slim silk-blend tie. A complete professional look in one box.",
    category: "men", style: "formal", type: "shirt", price: 5290, onSale: false, discountPct: 0, stock: 12,
    images: [img(23914243), img(35171075)], sizes: MEN_SIZES, featured: false, isNew: true,
    colors: ["White/Black"], fabric: "Cotton Oxford",
  },
  {
    name: "Power Black Blazer Suit",
    slug: "power-black-blazer-suit",
    description: "Sharp-shouldered blazer with matching straight-leg trousers. Fully lined, structured and unapologetically confident.",
    category: "women", style: "formal", type: "blazer", price: 8990, onSale: true, discountPct: 25, stock: 9,
    images: [img(15666879), img(37276968)], sizes: WOMEN_SIZES, featured: true, isNew: false,
    colors: ["Black"], fabric: "Poly-Viscose Suiting",
  },
  {
    name: "Smart Casual Office Blazer",
    slug: "smart-casual-office-blazer",
    description: "Lightweight unstructured blazer that transitions effortlessly from work to weekend.",
    category: "women", style: "formal", type: "blazer", price: 6490, onSale: false, discountPct: 0, stock: 15,
    images: [img(37830401), img(7139594, "png")], sizes: WOMEN_SIZES, featured: false, isNew: true,
    colors: ["Beige", "Red"], fabric: "Linen Blend",
  },
  {
    name: "Ivory Relaxed Top & Black Trousers",
    slug: "ivory-relaxed-top-black-trousers",
    description: "An effortless co-ord: breezy ivory top with high-waist wide-leg black trousers. Weekend-ready comfort.",
    category: "women", style: "casual", type: "pants", price: 4790, onSale: false, discountPct: 0, stock: 20,
    images: [img(4127611), img(20220083)], sizes: WOMEN_SIZES, featured: true, isNew: false,
    colors: ["Ivory/Black"], fabric: "Viscose Crepe",
  },
  {
    name: "Camel Faux-Leather Jacket",
    slug: "camel-faux-leather-jacket",
    description: "Buttery-soft vegan leather jacket in warm camel. Cropped fit with silver hardware.",
    category: "women", style: "casual", type: "jacket", price: 7490, onSale: true, discountPct: 10, stock: 7,
    images: [img(27383816), img(34234848)], sizes: WOMEN_SIZES, featured: false, isNew: true,
    colors: ["Camel"], fabric: "PU Leather",
  },
  {
    name: "Everyday Grey Hoodie & Denim Shorts",
    slug: "everyday-grey-hoodie-denim-shorts",
    description: "Cozy fleece hoodie with raw-hem denim shorts. The ultimate off-duty uniform.",
    category: "women", style: "casual", type: "hoodie", price: 3690, onSale: false, discountPct: 0, stock: 0,
    images: [img(6995867), img(5622838)], sizes: WOMEN_SIZES, featured: false, isNew: false,
    colors: ["Grey"], fabric: "Cotton Fleece",
  },
  {
    name: "Little Gentleman Black Jacket",
    slug: "little-gentleman-black-jacket",
    description: "A sleek black jacket for the young style icon. Soft lining, easy zip and durable for playtime.",
    category: "kids", style: "casual", type: "jacket", price: 2990, onSale: true, discountPct: 30, stock: 16,
    images: [img(30690928), img(30690920)], sizes: KID_SIZES, featured: true, isNew: false,
    colors: ["Black"], fabric: "Poly Cotton",
  },
  {
    name: "Junior Formal Suit Set",
    slug: "junior-formal-suit-set",
    description: "Three-piece formal suit with bow tie for weddings, Eid and special events. Fully lined and easy-care.",
    category: "kids", style: "formal", type: "blazer", price: 5490, onSale: false, discountPct: 0, stock: 10,
    images: [img(36909815), img(30690921)], sizes: KID_SIZES, featured: true, isNew: true,
    colors: ["Black"], fabric: "Poly Viscose",
  },
  {
    name: "Street Cool Grey Set",
    slug: "street-cool-grey-set",
    description: "Comfy grey tee and jogger set with a matching cap. Made for adventures.",
    category: "kids", style: "casual", type: "t-shirt", price: 2490, onSale: false, discountPct: 0, stock: 3,
    images: [img(18545044), img(19664810)], sizes: KID_SIZES, featured: false, isNew: true,
    colors: ["Grey"], fabric: "100% Cotton Jersey",
  },
  {
    name: "Moody Studio Denim Jacket",
    slug: "moody-studio-denim-jacket",
    description: "Heavyweight trucker jacket in a vintage wash. Boxy fit with brass buttons.",
    category: "men", style: "casual", type: "jacket", price: 5990, onSale: false, discountPct: 0, stock: 11,
    images: [img(5910473), img(5325554)], sizes: MEN_SIZES, featured: false, isNew: true,
    colors: ["Vintage Blue"], fabric: "14oz Denim",
  },
];

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@hammerhead.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Hammer@2024";
    const [admin] = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    if (!admin) {
      await db.insert(users).values({
        name: "HammerHead Admin",
        email: adminEmail,
        passwordHash: hashPassword(adminPassword),
        role: "admin",
      });
    }
    const existing = await db.select({ id: products.id }).from(products).limit(1);
    if (existing.length === 0) {
      await db.insert(products).values(
        SEED_PRODUCTS.map((p) => ({
          ...p,
          sizeChart: DEFAULT_SIZE_CHARTS[p.category],
        }))
      );
    }
    seeded = true;
  } catch (e) {
    console.error("[seed] failed", e);
  }
}
