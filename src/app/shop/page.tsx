import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopContent from "./ShopContent";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;

  let allProducts;
  if (category) {
    allProducts = await db
      .select()
      .from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));
  } else {
    allProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));
  }

  const categories = [
    { label: "All", value: "" },
    { label: "Skincare", value: "skincare" },
    { label: "Makeup", value: "makeup" },
    { label: "Essentials", value: "essentials" },
  ];

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
              Our Collection
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {category
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : "Shop All"}
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto">
              Discover our curated collection of luxury skincare and beauty
              products designed for radiant, healthy skin.
            </p>
          </div>

          <ShopContent
            products={allProducts}
            categories={categories}
            activeCategory={category || ""}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
