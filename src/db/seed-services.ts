import { db } from "./index";
import { serviceCategories, services, packagePlans } from "./schema";
import { sql } from "drizzle-orm";

const categories = [
  { name: "Face", slug: "face", emoji: "😊", description: "Facial treatments and rejuvenation" },
  { name: "Hair", slug: "hair", emoji: "💇", description: "Hair restoration and treatments" },
  { name: "Body", slug: "body", emoji: "💪", description: "Body contouring and wellness" },
  { name: "Hair Removal", slug: "hair-removal", emoji: "✨", description: "Permanent hair reduction" },
  { name: "Signature Facials", slug: "signature-facials", emoji: "🌸", description: "Our exclusive facial treatments" },
  { name: "Laser Therapies", slug: "laser-therapies", emoji: "💫", description: "Advanced laser treatments" },
  { name: "IV Therapy", slug: "iv-therapy", emoji: "💉", description: "Intravenous vitamin therapy" },
  { name: "Wrinkle Reduction", slug: "wrinkle-reduction", emoji: "🔬", description: "Anti-aging treatments" },
  { name: "Filler - Hyaluronic Acid", slug: "filler-ha", emoji: "💧", description: "Dermal fillers for volume" },
  { name: "Sculptra/Asthefill", slug: "sculptra", emoji: "🎨", description: "Collagen stimulators" },
  { name: "Filler Dissolving", slug: "filler-dissolving", emoji: "🧪", description: "Hyaluronidase treatments" },
  { name: "Skin Boosters", slug: "skin-boosters", emoji: "💎", description: "Deep hydration treatments" },
  { name: "Sunekos", slug: "sunekos", emoji: "☀️", description: "Bio-regenerative treatment" },
  { name: "Profhilo", slug: "profhilo", emoji: "🌊", description: "Bio-remodeling treatment" },
  { name: "Advanced HIFU", slug: "hifu", emoji: "🔊", description: "Ultraformer MPT lifting" },
  { name: "Mesotherapy", slug: "mesotherapy", emoji: "💉", description: "Micro-injections for skin" },
  { name: "PRP/PRF", slug: "prp-prf", emoji: "🩸", description: "Platelet-rich plasma therapy" },
  { name: "MAXXI PRP", slug: "maxxi-prp", emoji: "⚡", description: "Enhanced PRP treatment" },
  { name: "Exosomes", slug: "exosomes", emoji: "🧬", description: "Regenerative cell therapy" },
  { name: "Growth Factors", slug: "growth-factors", emoji: "🌱", description: "Cellular renewal therapy" },
  { name: "Stem Cells", slug: "stem-cells", emoji: "🔬", description: "Advanced regeneration" },
  { name: "Salmon DNA/PDRN", slug: "salmon-dna", emoji: "🐟", description: "Polynucleotide therapy" },
  { name: "DermaPen4 Microneedling", slug: "dermapen", emoji: "📍", description: "Collagen induction therapy" },
  { name: "Microneedling RF", slug: "microneedling-rf", emoji: "⚡", description: "Radiofrequency microneedling" },
  { name: "Photofacial & Laser Toning", slug: "photofacial", emoji: "💡", description: "Light-based skin treatments" },
  { name: "Injection Lipolysis", slug: "lipolysis", emoji: "🔥", description: "Fat dissolving injections" },
  { name: "Lip Treatments", slug: "lip-treatments", emoji: "💋", description: "Lip enhancement & care" },
  { name: "Thread Lift", slug: "thread-lift", emoji: "🧵", description: "Non-surgical face lift" },
  { name: "Peels", slug: "peels", emoji: "🍊", description: "Chemical peel treatments" },
];

const servicesData: { categorySlug: string; services: { name: string; duration: number; price: string; description: string }[] }[] = [
  {
    categorySlug: "face",
    services: [
      { name: "Classic Facial", duration: 45, price: "299", description: "Deep cleansing and hydration" },
      { name: "Anti-Aging Facial", duration: 60, price: "450", description: "Targeted wrinkle reduction" },
      { name: "Hydra Facial", duration: 60, price: "550", description: "Multi-step skin rejuvenation" },
    ],
  },
  {
    categorySlug: "signature-facials",
    services: [
      { name: "Young Glow Signature", duration: 90, price: "899", description: "Our premium signature facial with gold mask" },
      { name: "Rose Glow Treatment", duration: 75, price: "699", description: "Damascus rose & 24K gold infusion" },
      { name: "Diamond Radiance", duration: 60, price: "599", description: "Diamond dust microdermabrasion" },
    ],
  },
  {
    categorySlug: "wrinkle-reduction",
    services: [
      { name: "Botox - Forehead", duration: 30, price: "999", description: "Forehead line treatment" },
      { name: "Botox - Crow's Feet", duration: 30, price: "799", description: "Eye area wrinkle treatment" },
      { name: "Botox - Full Face", duration: 45, price: "1999", description: "Complete facial rejuvenation" },
    ],
  },
  {
    categorySlug: "filler-ha",
    services: [
      { name: "Lip Filler - 1ml", duration: 45, price: "1499", description: "Natural lip enhancement" },
      { name: "Cheek Filler", duration: 45, price: "1999", description: "Volume restoration" },
      { name: "Jawline Contouring", duration: 60, price: "2499", description: "Defined jawline sculpting" },
    ],
  },
  {
    categorySlug: "laser-therapies",
    services: [
      { name: "Laser Skin Resurfacing", duration: 60, price: "1299", description: "Fractional laser treatment" },
      { name: "Laser Pigmentation", duration: 45, price: "899", description: "Dark spot removal" },
      { name: "Laser Acne Scars", duration: 60, price: "1499", description: "Scar reduction therapy" },
    ],
  },
  {
    categorySlug: "iv-therapy",
    services: [
      { name: "Vitamin C Drip", duration: 45, price: "599", description: "Immunity & glow boost" },
      { name: "Glutathione Drip", duration: 45, price: "799", description: "Skin brightening" },
      { name: "Beauty Cocktail IV", duration: 60, price: "999", description: "Complete beauty infusion" },
    ],
  },
  {
    categorySlug: "prp-prf",
    services: [
      { name: "PRP Facial", duration: 60, price: "1299", description: "Vampire facial rejuvenation" },
      { name: "PRP Hair Restoration", duration: 60, price: "1499", description: "Hair growth stimulation" },
      { name: "PRF Under Eyes", duration: 45, price: "999", description: "Dark circle treatment" },
    ],
  },
  {
    categorySlug: "dermapen",
    services: [
      { name: "DermaPen4 Face", duration: 60, price: "799", description: "Collagen induction therapy" },
      { name: "DermaPen4 + PRP", duration: 75, price: "1299", description: "Enhanced with PRP" },
      { name: "DermaPen4 Scarring", duration: 60, price: "899", description: "Scar reduction treatment" },
    ],
  },
  {
    categorySlug: "peels",
    services: [
      { name: "Glycolic Peel", duration: 30, price: "299", description: "Mild exfoliation" },
      { name: "TCA Peel", duration: 45, price: "599", description: "Medium depth peel" },
      { name: "VI Peel", duration: 45, price: "799", description: "Medical grade peel" },
    ],
  },
  {
    categorySlug: "profhilo",
    services: [
      { name: "Profhilo Face", duration: 45, price: "1799", description: "Bio-remodeling treatment" },
      { name: "Profhilo Neck", duration: 45, price: "1499", description: "Neck rejuvenation" },
      { name: "Profhilo Body", duration: 60, price: "1999", description: "Body skin tightening" },
    ],
  },
  {
    categorySlug: "thread-lift",
    services: [
      { name: "PDO Thread Lift - Mid Face", duration: 90, price: "3999", description: "Non-surgical face lift" },
      { name: "PDO Thread Lift - Jawline", duration: 75, price: "2999", description: "Jawline definition" },
      { name: "PDO Threads - Neck", duration: 60, price: "2499", description: "Neck tightening" },
    ],
  },
  {
    categorySlug: "lip-treatments",
    services: [
      { name: "Lip Filler Natural", duration: 45, price: "1299", description: "Subtle enhancement" },
      { name: "Russian Lips", duration: 60, price: "1699", description: "Heart-shaped technique" },
      { name: "Lip Flip", duration: 30, price: "499", description: "Botox lip enhancement" },
    ],
  },
  {
    categorySlug: "hifu",
    services: [
      { name: "HIFU Full Face", duration: 90, price: "2999", description: "Ultraformer MPT lifting" },
      { name: "HIFU Face & Neck", duration: 120, price: "3999", description: "Complete lifting treatment" },
      { name: "HIFU Eye Area", duration: 45, price: "1499", description: "Eye lift treatment" },
    ],
  },
  {
    categorySlug: "hair-removal",
    services: [
      { name: "Laser Hair - Underarms", duration: 15, price: "199", description: "Permanent reduction" },
      { name: "Laser Hair - Full Legs", duration: 60, price: "699", description: "Complete leg treatment" },
      { name: "Laser Hair - Full Body", duration: 180, price: "1999", description: "Complete body package" },
    ],
  },
  {
    categorySlug: "body",
    services: [
      { name: "Body Contouring", duration: 60, price: "999", description: "Non-invasive sculpting" },
      { name: "Cellulite Treatment", duration: 45, price: "699", description: "Skin smoothing therapy" },
      { name: "Skin Tightening - Body", duration: 60, price: "899", description: "RF skin tightening" },
    ],
  },
];

const packagePlansData = [
  { name: "1 Month Plan", durationMonths: 1, sessionsIncluded: 4, discountPercent: 5, description: "4 weekly sessions", badge: null },
  { name: "2 Months Plan", durationMonths: 2, sessionsIncluded: 8, discountPercent: 10, description: "8 sessions over 2 months", badge: null },
  { name: "3 Months Plan", durationMonths: 3, sessionsIncluded: 12, discountPercent: 15, description: "12 sessions - Best for results", badge: "Popular" },
  { name: "6 Months Plan", durationMonths: 6, sessionsIncluded: 24, discountPercent: 20, description: "24 sessions - Transformation package", badge: "Best Value" },
  { name: "1 Year Plan", durationMonths: 12, sessionsIncluded: 48, discountPercent: 25, description: "48 sessions - Ultimate commitment", badge: "VIP" },
];

async function seed() {
  // Check if already seeded
  const existing = await db.execute(sql`SELECT count(*) as cnt FROM service_categories`);
  const count = Number((existing.rows[0] as { cnt: string }).cnt);
  if (count > 0) {
    console.log("Services already seeded, skipping.");
    return;
  }

  // Insert categories
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    await db.insert(serviceCategories).values({
      name: cat.name,
      slug: cat.slug,
      emoji: cat.emoji,
      description: cat.description,
      displayOrder: i,
    });
  }
  console.log("✅ Categories seeded");

  // Get category IDs
  const cats = await db.select().from(serviceCategories);
  const catMap = new Map(cats.map(c => [c.slug, c.id]));

  // Insert services
  for (const group of servicesData) {
    const categoryId = catMap.get(group.categorySlug);
    if (!categoryId) continue;
    for (const svc of group.services) {
      await db.insert(services).values({
        categoryId,
        name: svc.name,
        description: svc.description,
        durationMinutes: svc.duration,
        price: svc.price,
      });
    }
  }
  console.log("✅ Services seeded");

  // Insert package plans
  for (const plan of packagePlansData) {
    await db.insert(packagePlans).values(plan);
  }
  console.log("✅ Package plans seeded");

  console.log("✅ All service data seeded successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
