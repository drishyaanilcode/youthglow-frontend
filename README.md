# Young Glow - Cosmetics Clinic Web App

A full-stack web application for a luxury cosmetics clinic featuring appointment booking, service packages, and customer dashboard.

## 🎨 Tech Stack

**Frontend:**
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Drizzle ORM
- React Context API

**Backend:**
- Node.js API routes
- PostgreSQL (Supabase)
- bcrypt & JWT authentication

## ✨ Features

- User Authentication (bcrypt + session cookies)
- 29 Service Categories, 20+ Treatments
- Smart Appointment Booking (calendar, doctor assignment, health screening)
- Package Plans (1-12 Month with 5-25% discounts)
- Package Management Dashboard
- Shopping Cart
- Payment Methods (Reception or Online)
- Responsive Luxury Design

## 🚀 Getting Started

```bash
git clone https://github.com/drishyaanilcode/youthglow-frontend8.git
cd youthglow-frontend8
npm install
```

Create `.env.local`:
Run:
```bash
npm run dev
# Open http://localhost:3000
```

## 📁 Project Structure

- `src/app/` - Pages (home, book, dashboard, login)
- `src/app/api/` - API routes (auth, bookings, dashboard)
- `src/components/` - React components
- `src/db/` - Drizzle schema
- `public/images/` - Assets

## 🗄️ Database

PostgreSQL with Drizzle ORM tables for patients, services, bookings, packages, etc.

## 🔐 Security

- Bcrypt password hashing
- Session-based authentication
- JWT tokens
- Drizzle ORM prevents SQL injection

## 👨‍💻 Author

Drishya Anil - Full-Stack Developer
- GitHub: [@drishyaanilcode](https://github.com/drishyaanilcode)
- Dubai, UAE

## 📄 License

MIT
