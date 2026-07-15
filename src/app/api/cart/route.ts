import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems, products, services, serviceCategories, packagePlans } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ items: [], productCount: 0, sessionCount: 0 }, { status: 401 });
  }

  // Get all cart items
  const items = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.patientId, user.id));

  const enrichedItems = [];
  let productCount = 0;
  let sessionCount = 0;

  for (const item of items) {
    if (item.itemType === "product" && item.productId) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
      if (product) {
        enrichedItems.push({
          id: item.id,
          type: "product",
          quantity: item.quantity,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            emoji: product.emoji,
            brand: product.brand,
          },
        });
        productCount += item.quantity;
      }
    } else if ((item.itemType === "single_session" || item.itemType === "package") && item.serviceId) {
      const [service] = await db.select().from(services).where(eq(services.id, item.serviceId)).limit(1);
      if (service) {
        const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, service.categoryId)).limit(1);
        let packagePlan = null;
        if (item.itemType === "package" && item.packagePlanId) {
          const [plan] = await db.select().from(packagePlans).where(eq(packagePlans.id, item.packagePlanId)).limit(1);
          packagePlan = plan;
        }
        enrichedItems.push({
          id: item.id,
          type: item.itemType,
          quantity: item.quantity,
          sessionDate: item.sessionDate,
          sessionTime: item.sessionTime,
          service: {
            id: service.id,
            name: service.name,
            price: service.price,
            duration: service.durationMinutes,
            categoryName: category?.name || "",
            categoryEmoji: category?.emoji || "",
          },
          packagePlan: packagePlan ? {
            id: packagePlan.id,
            name: packagePlan.name,
            sessionsIncluded: packagePlan.sessionsIncluded,
            discountPercent: packagePlan.discountPercent,
          } : null,
        });
        sessionCount += item.quantity;
      }
    }
  }

  return NextResponse.json({
    items: enrichedItems,
    productCount,
    sessionCount,
    totalCount: productCount + sessionCount,
  });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Please login to add items to your bag." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { type, productId, serviceId, packagePlanId, sessionDate, sessionTime } = body;

  if (type === "product") {
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    // Check if already in cart
    const existing = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.patientId, user.id),
          eq(cartItems.itemType, "product"),
          eq(cartItems.productId, productId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(cartItems)
        .set({ quantity: existing[0].quantity + 1 })
        .where(eq(cartItems.id, existing[0].id));
    } else {
      await db.insert(cartItems).values({
        patientId: user.id,
        itemType: "product",
        productId,
        quantity: 1,
      });
    }

    return NextResponse.json({ message: "Added to bag! 🛍️" }, { status: 201 });

  } else if (type === "single_session" || type === "package") {
    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required." }, { status: 400 });
    }
    if (type === "package" && !packagePlanId) {
      return NextResponse.json({ error: "Package plan is required." }, { status: 400 });
    }
    if (!sessionDate || !sessionTime) {
      return NextResponse.json({ error: "Please select date and time." }, { status: 400 });
    }

    await db.insert(cartItems).values({
      patientId: user.id,
      itemType: type,
      serviceId,
      packagePlanId: type === "package" ? packagePlanId : null,
      sessionDate,
      sessionTime,
      quantity: 1,
    });

    return NextResponse.json({ message: "Session added to bag! 📅" }, { status: 201 });

  } else {
    return NextResponse.json({ error: "Invalid item type." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("id");

  if (!itemId) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, parseInt(itemId)), eq(cartItems.patientId, user.id)));

  return NextResponse.json({ message: "Removed from bag" });
}
