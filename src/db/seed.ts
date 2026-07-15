import { db } from "./index";
import { products, testimonials } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  // Clear existing data and re-seed
  await db.execute(sql`DELETE FROM testimonials`);
  await db.execute(sql`DELETE FROM products`);

  await db.insert(products).values([
    {
      name: "Rose Glow Serum",
      brand: "Young Glow",
      category: "skincare",
      description: "A luxurious rose-infused serum that deeply hydrates and gives your skin a radiant, dewy glow.",
      price: "189.00",
      rating: "5.0",
      reviewCount: 324,
      image: "https://images.pexels.com/photos/4841179/pexels-photo-4841179.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      badge: "New",
      emoji: null,
      featured: true,
    },
    {
      name: "Velvet Lip Collection",
      brand: "Young Glow",
      category: "makeup",
      description: "A set of 6 highly-pigmented velvet matte lipsticks in universally flattering shades.",
      price: "159.00",
      originalPrice: "199.00",
      rating: "5.0",
      reviewCount: 218,
      image: "https://images.pexels.com/photos/3539896/pexels-photo-3539896.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      badge: "−20%",
      emoji: null,
      featured: true,
    },
    {
      name: "Luminous Foundation",
      brand: "Young Glow",
      category: "makeup",
      description: "A buildable, medium-to-full coverage foundation with a luminous satin finish.",
      price: "149.00",
      rating: "4.5",
      reviewCount: 156,
      image: "https://images.pexels.com/photos/24602077/pexels-photo-24602077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      badge: "New",
      emoji: null,
      featured: true,
    },
    {
      name: "Night Recovery Cream",
      brand: "Young Glow",
      category: "skincare",
      description: "An intensive overnight treatment cream enriched with Retinol and Peptides.",
      price: "219.00",
      rating: "5.0",
      reviewCount: 289,
      image: "https://images.pexels.com/photos/4841482/pexels-photo-4841482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      emoji: null,
      featured: true,
    },
    {
      name: "Hydra-Boost Moisturizer",
      brand: "Young Glow",
      category: "skincare",
      description: "A lightweight gel-cream moisturizer with Hyaluronic Acid and Aloe Vera for intense hydration.",
      price: "129.00",
      rating: "4.5",
      reviewCount: 198,
      image: "https://images.pexels.com/photos/24602064/pexels-photo-24602064.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      emoji: null,
      featured: false,
    },
    {
      name: "Vitamin C Brightening Serum",
      brand: "Young Glow",
      category: "skincare",
      description: "A potent 20% Vitamin C serum that brightens, firms, and protects against environmental stressors.",
      price: "169.00",
      rating: "5.0",
      reviewCount: 276,
      image: "https://images.pexels.com/photos/4841171/pexels-photo-4841171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      emoji: null,
      featured: false,
    },
    {
      name: "Silk Eye Cream",
      brand: "Young Glow",
      category: "skincare",
      description: "A rich eye cream with Caffeine and Peptides to reduce dark circles, puffiness, and fine lines.",
      price: "139.00",
      rating: "4.5",
      reviewCount: 142,
      image: "https://images.pexels.com/photos/35976902/pexels-photo-35976902.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      emoji: null,
      featured: false,
    },
    {
      name: "Perfect Brow Kit",
      brand: "Young Glow",
      category: "makeup",
      description: "Complete brow grooming kit with pencil, gel, and stencils.",
      price: "89.00",
      rating: "4.5",
      reviewCount: 98,
      image: "https://images.pexels.com/photos/7290611/pexels-photo-7290611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      emoji: null,
      featured: false,
    },
    {
      name: "Glass Skin Primer",
      brand: "Young Glow",
      category: "makeup",
      description: "A silky primer that blurs pores and creates a smooth, glass-like canvas for flawless makeup.",
      price: "119.00",
      rating: "5.0",
      reviewCount: 187,
      image: "https://images.pexels.com/photos/4841178/pexels-photo-4841178.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      emoji: null,
      featured: false,
    },
    {
      name: "Detox Clay Mask",
      brand: "Young Glow",
      category: "skincare",
      description: "A deep-cleansing Kaolin clay mask with Tea Tree and Charcoal to unclog pores and purify skin.",
      price: "99.00",
      rating: "4.5",
      reviewCount: 134,
      image: "https://images.pexels.com/photos/3985338/pexels-photo-3985338.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      emoji: null,
      featured: false,
    },
    {
      name: "Luxury Brush Set",
      brand: "Young Glow",
      category: "essentials",
      description: "A premium 12-piece brush set with ultra-soft synthetic bristles and a stylish rose gold case.",
      price: "249.00",
      rating: "5.0",
      reviewCount: 312,
      image: "https://images.pexels.com/photos/4938511/pexels-photo-4938511.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      emoji: null,
      featured: false,
    },
    {
      name: "SPF 50+ Sunscreen",
      brand: "Young Glow",
      category: "skincare",
      description: "A lightweight, non-greasy SPF 50+ sunscreen with a matte finish. Perfect for the UAE climate.",
      price: "109.00",
      rating: "5.0",
      reviewCount: 445,
      image: "https://images.pexels.com/photos/31251024/pexels-photo-31251024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      emoji: null,
      featured: false,
    },
  ]);

  await db.insert(testimonials).values([
    {
      name: "Fatima Al Rashid",
      location: "Dubai, UAE",
      avatar: "F",
      rating: 5,
      text: "The Rose Glow Serum completely transformed my skin in just two weeks. Absolute game changer!",
    },
    {
      name: "Priya Nair",
      location: "Abu Dhabi, UAE",
      avatar: "P",
      rating: 5,
      text: "Finally a luxury brand that understands skin in the UAE climate. My skin wakes up glowing every morning.",
    },
    {
      name: "Layla Hassan",
      location: "Sharjah, UAE",
      avatar: "L",
      rating: 5,
      text: "Booked an appointment and the team was incredible. My skin felt like glass after the facial!",
    },
    {
      name: "Sarah Mitchell",
      location: "Dubai, UAE",
      avatar: "S",
      rating: 5,
      text: "The Velvet Lip Collection has become my daily essential. The colors are stunning and they last all day.",
    },
    {
      name: "Aisha Khan",
      location: "Al Ain, UAE",
      avatar: "A",
      rating: 5,
      text: "I've tried dozens of foundations but the Luminous Foundation is in a league of its own.",
    },
    {
      name: "Maria Santos",
      location: "Dubai, UAE",
      avatar: "M",
      rating: 5,
      text: "The SPF 50+ sunscreen is perfect for our hot climate. Lightweight, no white cast, and keeps my skin protected.",
    },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
