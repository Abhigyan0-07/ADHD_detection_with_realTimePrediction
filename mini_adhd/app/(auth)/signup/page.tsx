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
