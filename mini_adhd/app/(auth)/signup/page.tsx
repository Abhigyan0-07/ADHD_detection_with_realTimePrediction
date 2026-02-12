"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
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
      if (!res.ok) throw new Error(data?.error || "Signup failed");
      router.push("/adhd-test");
    } catch (err: any) {
      console.error('Signup Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSocialLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md backdrop-blur-lg bg-white/80 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join our adaptive learning community 🌱
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg p-2 text-center"
          >
            {error}
          </motion.p>
        )}

        <div className="space-y-3">
          <input
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="Student">🎓 Student</option>
            <option value="Parent">👨‍👩‍👧 Parent</option>
            <option value="Educator">📚 Educator</option>
          </select>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-200 ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </motion.button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or sign up with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSocialLogin}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl py-3 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-1">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Log in
          </a>
        </p>
      </motion.form>
    </main>
  );
}
