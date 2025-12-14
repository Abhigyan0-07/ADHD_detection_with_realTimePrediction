import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center space-y-4">
        <h1 className="text-2xl text-gray-900 font-semibold">FocusFlow</h1>
        <p className="text-slate-600">AI Tutor for Neurodivergent Learners</p>
        <div className="flex gap-4 justify-center">
          <Link
            className="px-4 py-2 rounded-xl bg-primary-600 text-white"
            href="/signup"
          >
            Get Started
          </Link>
          <Link
            className="px-4 py-2 rounded-xl border text-gray-900 border-slate-300"
            href="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
