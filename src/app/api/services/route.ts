import { NextResponse } from "next/server";
import { db } from "@/db";
import { serviceCategories, services } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const categories = await db
    .select()
    .from(serviceCategories)
    .orderBy(asc(serviceCategories.displayOrder));

  const result = [];
  for (const cat of categories) {
    const catServices = await db
      .select()
      .from(services)
      .where(eq(services.categoryId, cat.id));
    result.push({
      ...cat,
      services: catServices,
    });
  }

  return NextResponse.json({ categories: result });
}
