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
      } catch (e) {
        console.error("Failed to parse login response:", e);
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
    if (provider === "Google") {
      window.location.href = "/api/auth/google";
    } else {
      console.log(`Login with ${provider} not implemented yet`);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center mesh-gradient p-4 relative overflow-hidden text-white">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-white/60 text-lg">Ready to focus?</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-200 text-sm rounded-2xl flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-white/80 ml-1 group-focus-within:text-primary-300 transition-colors">Email</label>
              <div className="relative">
                <input
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 outline-none focus:bg-white/10 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-400/50 transition-all duration-300 placeholder:text-white/20"
                  placeholder="name@example.com"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-white/80 group-focus-within:text-primary-300 transition-colors">Password</label>
                <Link href="/forgot-password">
                  <span className="text-xs font-semibold text-primary-300 hover:text-primary-200 cursor-pointer hover:underline decoration-2 underline-offset-2">
                    Forgot Password?
                  </span>
                </Link>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 outline-none focus:bg-white/10 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-400/50 transition-all duration-300 placeholder:text-white/20"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-2xl py-4 shadow-lg shadow-primary-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
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

          <div className="mt-10 text-center">
            <p className="text-sm text-white/50 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                <span className="text-primary-300 font-bold hover:text-primary-200 cursor-pointer transition-colors hover:underline decoration-2 underline-offset-2">
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
