"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getADHDLevel, getLearningMode } from "@/lib/adaptiveEngine";
import { useMouseTracker } from "@/components/tracking/MouseTracker";
import { useEyeTracker } from "@/components/tracking/EyeTracker";
import HeatmapOverlay from "@/components/visualization/HeatmapOverlay";
import FocusReport from "@/components/reports/FocusReport";
import { attentionEngine, AttentionMetrics } from "@/lib/analysis/AttentionEngine";
import { adhdDetector, ADHDProfile } from "@/lib/analysis/ADHDDetector";

interface UserProfile {
  name: string;
  adhdScore?: number;
  preferences: {
    preferredMode?: "text" | "visual" | "audio";
  };
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Tracking State
  const [attentionMetrics, setAttentionMetrics] = useState<AttentionMetrics>({
    score: 0.8,
    state: 'focused',
    confidence: 0.8,
    factors: { mouse: 0.8, eye: 0.8, activity: 0.5 }
  });
  const [adhdProfile, setAdhdProfile] = useState<ADHDProfile>(adhdDetector['getEmptyProfile']()); // Access private method workaround or expose public
  const [history, setHistory] = useState<AttentionMetrics[]>([]);

  // Gamification State
  const [totalPoints, setTotalPoints] = useState(0);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [level, setLevel] = useState(1);

  // Initialize Trackers
  const mouseMetrics = useMouseTracker();
  
  const { metrics: eyeMetrics } = useEyeTracker();

  // Analysis Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = attentionEngine.calculateAttention(mouseMetrics, eyeMetrics);
      setAttentionMetrics(newMetrics);
      
      // Track focus time for gamification
      if (newMetrics.state === 'focused' || newMetrics.state === 'hyperfocus') {
        setFocusSeconds(prev => {
          const newSeconds = prev + 1;
          // Every 60 seconds of focus, award points
          if (newSeconds >= 60) {
            updateGamification(60, newMetrics.score);
            return 0;
          }
          return newSeconds;
        });
      }

      setHistory(prev => {
        const newHistory = [...prev, newMetrics];
        if (newHistory.length > 60) { // Analyze every minute roughly
           const profile = adhdDetector.analyzeSession(newHistory);
           setAdhdProfile(profile);
        }
        return newHistory.slice(-300); // Keep last 5 mins
      });

    }, 1000); // 1Hz sampling

    // Separate interval for ADHD Analysis (every 30 seconds)
    const analysisInterval = setInterval(() => {
       setHistory(prevHistory => {
          // Analyze the last 30 seconds of data
          // Since we sample at 1Hz, we take the last 30 items
          const recentHistory = prevHistory.slice(-30);
          if (recentHistory.length >= 10) { // Require at least 10 seconds of data
             const newProfile = adhdDetector.analyzeSession(recentHistory);
             setAdhdProfile(newProfile);
          }
          return prevHistory;
       });
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
      clearInterval(analysisInterval);
    };
  }, [mouseMetrics, eyeMetrics]);

  const updateGamification = async (duration: number, attentionScore: number) => {
    try {
      const res = await fetch('/api/gamification/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'focus-session',
          data: { duration, attentionScore }
        })
      });
      const data = await res.json();
      if (data.success) {
        setTotalPoints(data.newTotal);
      }
    } catch (error) {
      console.error("Error updating gamification:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setProfile(data);
      if (data.gamification?.points) {
        setTotalPoints(data.gamification.points);
        setLevel(data.gamification.level || 1);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert("Exporting PDF report... (Feature simulated)");
  };

  if (loading) return <div className="p-8">Loading...</div>;

  const adhdLevel = profile?.adhdScore !== undefined ? getADHDLevel(profile.adhdScore) : "Not Taken";
  const attentionPercent = Math.round(attentionMetrics.score * 100);

  return (
    <main className="min-h-screen mesh-gradient text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <HeatmapOverlay 
          mousePosition={mouseMetrics.position} 
          gazePosition={{ x: eyeMetrics.gazeX, y: eyeMetrics.gazeY }} 
          show={showHeatmap} 
        />

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">{profile?.name || "Learner"}</span>
            </h1>
            <p className="text-blue-100/60 font-medium">Ready to achieve your flow state?</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
             <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <span className="font-bold text-yellow-300">{totalPoints} pts</span>
             </div>
             <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <span className="font-bold text-purple-300">Lvl {level}</span>
             </div>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Hero Metric (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             {/* Placeholder for Hero Gauge - To be implemented next */}
             <div className="glass-card rounded-3xl p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-4">
                   <h2 className="text-2xl font-medium text-white/80">Current Attention</h2>
                   <div className="text-8xl font-bold tracking-tighter bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                      {attentionPercent}%
                   </div>
                   <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                      attentionMetrics.state === 'focused' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      attentionMetrics.state === 'distracted' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                   }`}>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                      </span>
                      {attentionMetrics.state.toUpperCase()}
                   </div>
                </div>
             </div>

             {/* Detailed Report Component */}
             <div className="glass-card rounded-2xl p-6">
                <FocusReport 
                  currentMetrics={attentionMetrics} 
                  adhdProfile={adhdProfile} 
                  onExport={handleExport} 
                />
             </div>
          </div>

          {/* Right Column: Secondary Metrics (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Mouse Activity Card */}
            <motion.div 
               className="glass-card rounded-2xl p-6 border-l-4 border-green-400"
               whileHover={{ scale: 1.02 }}
            >
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                     <span className="text-2xl">🖱️</span>
                  </div>
                  <span className="text-xs font-mono text-green-300 bg-green-500/10 px-2 py-1 rounded">ACTIVITY</span>
               </div>
               <div className="space-y-1">
                  <div className="text-3xl font-bold">{mouseMetrics.isIdle ? 'Idle' : 'Active'}</div>
                  <div className="text-sm text-white/50">Erratic Score: {Math.round(mouseMetrics.erraticScore * 100)}%</div>
               </div>
            </motion.div>

            {/* Eye Contact Card */}
            <motion.div 
               className="glass-card rounded-2xl p-6 border-l-4 border-purple-400"
               whileHover={{ scale: 1.02 }}
            >
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                     <span className="text-2xl">👁️</span>
                  </div>
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded">GAZE</span>
               </div>
               <div className="space-y-1">
                  <div className="text-3xl font-bold">{eyeMetrics.isDistracted ? 'Distracted' : 'Focused'}</div>
                  <div className="text-sm text-white/50">{eyeMetrics.isDistracted ? 'Look at screen' : 'Tracking active'}</div>
               </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
               <h3 className="font-semibold text-lg text-white/90">Quick Actions</h3>
               
               <Link href="/dashboard/gamified" className="group block">
                  <div className="w-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-xl p-4 transition-all flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🎮</span>
                        <span className="font-medium text-yellow-100">Gamified Mode</span>
                     </div>
                     <span className="text-yellow-500/50 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
               </Link>

               <Link href="/dashboard/learning" className="group block">
                  <div className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 rounded-xl p-4 transition-all flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
                        <span className="font-medium text-blue-100">Learning Hub</span>
                     </div>
                     <span className="text-blue-500/50 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
               </Link>

               <button 
                 onClick={() => setShowHeatmap(!showHeatmap)}
                 className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
                   showHeatmap 
                     ? 'bg-red-500/20 border-red-500/30 text-red-100' 
                     : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
                 }`}
               >
                 <span>🔥</span>
                 <span>{showHeatmap ? 'Disable Heatmap' : 'Enable Heatmap'}</span>
               </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
