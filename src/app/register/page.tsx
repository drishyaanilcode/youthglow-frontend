import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — Young Glow",
  description: "Register to book appointments, shop products, and track your beauty journey.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-[2rem] shadow-2xl shadow-slate-900/5 overflow-hidden">
            {/* Left - Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute top-10 left-10 w-60 h-60 bg-brand/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
              <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
                <span className="text-6xl mb-6">✦</span>
                <h2
                  className="text-3xl font-bold text-white mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Join the Glow
                  <span className="block mt-1" style={{
                    background: 'linear-gradient(135deg, #c4887a, #e8c4b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Community
                  </span>
                </h2>
                <p className="text-slate-400 mb-8 max-w-xs">
                  Create your account to book beauty treatments, shop products, and track your skincare journey.
                </p>
                <div className="space-y-3 text-left">
                  {[
                    "📅 Book appointments instantly",
                    "🛍️ Add products to your bag",
                    "💳 Track your order history",
                    "🌸 Get personalized recommendations",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="p-8 sm:p-12">
              <div className="mb-8">
                <h1
                  className="text-3xl font-bold text-slate-900 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Create Your Account
                </h1>
                <p className="text-slate-500">
                  Start your radiant skin journey today
                </p>
              </div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
