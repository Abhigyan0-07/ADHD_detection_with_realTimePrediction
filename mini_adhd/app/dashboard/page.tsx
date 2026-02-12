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
    <div className="space-y-6 relative">
      <HeatmapOverlay 
        mousePosition={mouseMetrics.position} 
        gazePosition={{ x: eyeMetrics.gazeX, y: eyeMetrics.gazeY }} 
        show={showHeatmap} 
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome, {profile?.name || "Learner"}
          </h1>
          <div className="mt-2 flex items-center space-x-4">
            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showHeatmap ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showHeatmap ? '👁️ Heatmap On' : '👁️ Heatmap Off'}
            </button>
            {attentionMetrics.state === 'distracted' && (
              <span className="text-red-600 font-bold animate-pulse">
                ⚠️ Distraction Detected!
              </span>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500 flex flex-col items-end space-y-2">
          <div className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 font-bold flex items-center">
            <span className="mr-1">🪙</span> {totalPoints}
          </div>
          <div className="bg-purple-100 px-3 py-1 rounded-full text-purple-800 font-bold flex items-center">
            <span className="mr-1">⭐</span> Lvl {level}
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right">
                <div className="text-xs text-gray-400">Screening Result</div>
                {adhdLevel === "Not Taken" ? (
                  <Link href="/adhd-test" className="text-sm font-semibold text-blue-600 hover:underline">
                    Take Test
                  </Link>
                ) : (
                  <div className="font-semibold text-blue-600">{adhdLevel}</div>
                )}
             </div>
             <div className="text-right border-l pl-4 border-gray-300 dark:border-gray-700">
                <div className="text-xs text-gray-400">Real-time Risk</div>
                <div className={`font-semibold ${adhdProfile.riskLevel === 'high' ? 'text-red-500' : adhdProfile.riskLevel === 'moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {adhdProfile.riskLevel.toUpperCase()}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500"
          animate={{ scale: attentionMetrics.state === 'hyperfocus' ? 1.05 : 1 }}
        >
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Real-time Attention</div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {attentionPercent}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Based on Mouse & Eye
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Mouse Activity</div>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400">
            {mouseMetrics.isIdle ? 'Idle' : 'Active'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Erratic Score: {Math.round(mouseMetrics.erraticScore * 100)}%
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Eye Contact</div>
          <div className={`text-4xl font-bold ${eyeMetrics.isDistracted ? 'text-red-500' : 'text-purple-600'} dark:text-purple-400`}>
            {eyeMetrics.isDistracted ? 'Distracted' : 'Focused'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {eyeMetrics.isDistracted ? 'Please look at screen' : 'Gaze Tracking Active'}
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Focus State</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 capitalize">
            {attentionMetrics.state}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            AI Detected
          </div>
        </motion.div>
      </div>

      {/* Detailed Report */}
      <FocusReport 
        currentMetrics={attentionMetrics} 
        adhdProfile={adhdProfile} 
        onExport={handleExport} 
      />

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link href="/dashboard/gamified" className="block p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium text-yellow-800 dark:text-yellow-200">🎮 Gamified Dashboard</span>
                <span className="text-yellow-600">→</span>
              </div>
            </Link>
            <Link href="/dashboard/learning" className="block p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-800 dark:text-green-200">📚 Learning Hub</span>
                <span className="text-green-600">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
