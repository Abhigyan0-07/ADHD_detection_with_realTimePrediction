"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import EyeTrackerDebug from "@/components/tracking/EyeTracker";
import { EyeTrackerProvider } from "@/components/tracking/EyeTrackerContext";
import { 
  LayoutDashboard, 
  Gamepad2, 
  Target, 
  Library, 
  LineChart, 
  GraduationCap, 
  ClipboardCheck, 
  Eye, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Gamified Dashboard", href: "/dashboard/gamified", icon: Gamepad2 },
    { name: "Interactive Learning", href: "/dashboard/interactive-learning", icon: Target },
    { name: "Content Hub", href: "/dashboard/content-hub", icon: Library },
    { name: "Real-Time Analytics", href: "/dashboard/realtime", icon: LineChart },
    { name: "Learning Hub", href: "/learn", icon: GraduationCap },
    { name: "ADHD Test", href: "/adhd-test", icon: ClipboardCheck },
    { name: "Attention Tracker", href: "/dashboard/attention", icon: Eye },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <EyeTrackerProvider>
      <div className="min-h-screen flex bg-black mesh-bg text-white font-sans selection:bg-cyan-500/30">
        {/* Glassmorphic Sidebar */}
        <aside className="w-64 fixed inset-y-0 left-0 z-50 glass-panel border-r border-white/10 flex flex-col backdrop-blur-xl">
           <div className="p-6 flex items-center justify-center border-b border-white/5">
              <Link href="/" className="group">
                 <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 neon-text group-hover:scale-105 transition-transform">
                    FocusFlow
                 </h1>
              </Link>
           </div>

           <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {navItems.map((item) => {
                 const isActive = pathname === item.href;
                 const Icon = item.icon;
                 return (
                    <Link
                       key={item.href}
                       href={item.href}
                       className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive 
                             ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)] border border-cyan-500/30" 
                             : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                       }`}
                    >
                       {isActive && (
                          <motion.div
                             layoutId="sidebar-active"
                             className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                             initial={false}
                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                       )}
                       <span className={`transition-transform group-hover:scale-110 ${isActive ? "scale-110" : ""}`}>
                          <Icon size={20} className={isActive ? "text-cyan-400" : ""} />
                       </span>
                       <span className={`font-medium relative z-10 ${isActive ? "text-cyan-100" : ""}`}>
                          {item.name}
                       </span>
                       {isActive && (
                          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                       )}
                    </Link>
                 );
              })}
           </nav>

           <div className="p-4 border-t border-white/5 bg-black/20">
              <button
                 onClick={handleLogout}
                 className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all group"
              >
                 <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                 <span className="font-medium">Disconnect</span>
              </button>
           </div>
        </aside>

        {/* Main Content Area - Offset for fixed sidebar */}
        <main className="flex-1 ml-64 min-h-screen relative">
           {/* Background Grid Elements */}
           <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]"></div>
           </div>
           
           <div className="relative z-10 p-8 md:p-12 max-w-7xl mx-auto">
              {children}
           </div>
        </main>

        <EyeTrackerDebug />
      </div>
    </EyeTrackerProvider>
  );
}
