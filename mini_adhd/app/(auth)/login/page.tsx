"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        /* response not JSON or empty */
      }
      if (!res.ok) throw new Error(data?.error || "Login failed");
      // Check if user has completed ADHD test
      const userRes = await fetch("/api/user/profile");
      const userData = await userRes.json();
      if (userData.adhdScore === null || userData.adhdScore === undefined) {
        router.push("/adhd-test");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Placeholder for actual social login logic
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#F3F4F6] p-4 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 animate-gradient-xy opacity-80" />

      {/* Floating Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -20, 0], 
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[5%] w-[40vw] h-[40vw] rounded-full bg-purple-300/20 blur-[80px]" 
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[10%] w-[35vw] h-[35vw] rounded-full bg-indigo-300/20 blur-[80px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 20, 0],
            y: [0, 10, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-pink-200/20 blur-[80px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 p-8 md:p-12 overflow-hidden relative">
          
          {/* Top Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50" />

          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 text-lg">Ready to focus?</p>
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-red-50/80 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-3 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-gray-700 ml-1 group-focus-within:text-indigo-600 transition-colors">Email</label>
              <div className="relative">
                <input
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 placeholder:text-gray-400"
                  placeholder="name@example.com"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700 group-focus-within:text-indigo-600 transition-colors">Password</label>
                <Link href="/forgot-password">
                  <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer hover:underline decoration-2 underline-offset-2">
                    Forgot Password?
                  </span>
                </Link>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 placeholder:text-gray-400"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl py-4 shadow-lg shadow-indigo-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
            </motion.button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent flex-1" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ y: -3, backgroundColor: "#fff", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl py-3.5 text-gray-700 font-semibold shadow-sm hover:border-gray-200 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </motion.button>
            <motion.button
              whileHover={{ y: -3, backgroundColor: "#fff", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSocialLogin("Facebook")}
              className="flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl py-3.5 text-gray-700 font-semibold shadow-sm hover:border-gray-200 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Facebook
            </motion.button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                <span className="text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer transition-colors hover:underline decoration-2 underline-offset-2">
                  Sign up now
                </span>
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
