import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login — Young Glow",
  description: "Login to your Young Glow account to book appointments and shop.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-[2rem] shadow-2xl shadow-slate-900/5 overflow-hidden">
            {/* Left - Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute top-10 right-10 w-60 h-60 bg-brand/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
              <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
                <span className="text-6xl mb-6">✦</span>
                <h2
                  className="text-3xl font-bold text-white mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Welcome Back
                  <span className="block mt-1" style={{
                    background: 'linear-gradient(135deg, #c4887a, #e8c4b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Beautiful
                  </span>
                </h2>
                <p className="text-slate-400 max-w-xs mb-8">
                  Login to access your appointments, shopping bag, and personalized beauty recommendations.
                </p>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">50K+</p>
                    <p className="text-xs text-slate-500">Happy Clients</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">4.9★</p>
                    <p className="text-xs text-slate-500">Rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">200+</p>
                    <p className="text-xs text-slate-500">Products</p>
                  </div>
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
                  Login to Your Account
                </h1>
                <p className="text-slate-500">
                  Access your bookings, bag & beauty profile
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
