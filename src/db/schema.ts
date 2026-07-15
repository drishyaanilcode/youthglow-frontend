import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

// ============ PATIENTS ============
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ PRODUCTS (online shop) ============
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull().default("Young Glow"),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("5.0"),
  reviewCount: integer("review_count").notNull().default(0),
  image: text("image").notNull(),
  badge: varchar("badge", { length: 30 }),
  emoji: varchar("emoji", { length: 10 }),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ SERVICE CATEGORIES ============
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  emoji: varchar("emoji", { length: 10 }),
  image: text("image"),
  displayOrder: integer("display_order").notNull().default(0),
});

// ============ SERVICES ============
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  image: text("image"),
});

// ============ BRANCHES ============
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  address: text("address").notNull(),
  mapUrl: text("map_url"),
  phone: varchar("phone", { length: 50 }),
  openTime: varchar("open_time", { length: 10 }).notNull().default("09:00"),
  closeTime: varchar("close_time", { length: 10 }).notNull().default("21:00"),
});

// ============ PACKAGE PLANS ============
export const packagePlans = pgTable("package_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  durationMonths: integer("duration_months").notNull(),
  sessionsIncluded: integer("sessions_included").notNull(),
  discountPercent: integer("discount_percent").notNull().default(0),
  description: text("description"),
  badge: varchar("badge", { length: 30 }),
});

// ============ PATIENT PACKAGES (purchased) ============
export const patientPackages = pgTable("patient_packages", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  packagePlanId: integer("package_plan_id").notNull(),
  sessionsUsed: integer("sessions_used").notNull().default(0),
  sessionsTotal: integer("sessions_total").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull().default("reception"),
  status: varchar("status", { length: 30 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ SESSION BOOKINGS ============
export const sessionBookings = pgTable("session_bookings", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  serviceId: integer("service_id").notNull(),
  patientPackageId: integer("patient_package_id"), // NULL for single sessions
  branchId: integer("branch_id").notNull(),
  doctorName: varchar("doctor_name", { length: 255 }),
  sessionDate: date("session_date").notNull(),
  sessionTime: varchar("session_time", { length: 20 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull().default("reception"),
  status: varchar("status", { length: 30 }).notNull().default("confirmed"),
  notes: text("notes"),
  // Health screening answers (JSON-like text)
  healthScreening: text("health_screening"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ CART ITEMS ============
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  itemType: varchar("item_type", { length: 20 }).notNull().default("product"),
  productId: integer("product_id"),
  serviceId: integer("service_id"),
  packagePlanId: integer("package_plan_id"),
  quantity: integer("quantity").notNull().default(1),
  sessionDate: date("session_date"),
  sessionTime: varchar("session_time", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ TESTIMONIALS ============
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  avatar: varchar("avatar", { length: 10 }),
  rating: integer("rating").notNull().default(5),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ SUBSCRIBERS ============
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
