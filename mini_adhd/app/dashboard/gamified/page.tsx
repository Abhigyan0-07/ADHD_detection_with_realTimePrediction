"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactionGame from '@/components/gamification/ReactionGame'
import FocusModeGame from '@/components/gamification/FocusModeGame'
import ProgressDashboard from '@/components/progress/ProgressDashboard'
import MicroGoals from '@/components/gamification/MicroGoals'
import PatternGame from '@/components/gamification/PatternGame'
import ImprovementChart from '@/components/progress/ImprovementChart'

export default function GamifiedDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'arcade' | 'progress'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/gamification/progress')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }

  const progressData = data?.progress ? {
    modulesCompleted: data.progress.completedActivities || 0,
    totalStudyTime: data.progress.totalLearningTime || 0,
    level: data.progress.level || 1,
    points: data.progress.totalPoints || 0,
    history: data.progress.history || [], // You might need to map this if structure differs
    badges: data.progress.recentAchievements || [],
    recommendations: [] // Populate if API returns recommendations
  } : null

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">🎮 Player One Ready!</h1>
          <p className="text-indigo-100 text-lg">
            Level {data?.progress?.level || 1} • {data?.progress?.totalPoints || 0} Points • 🔥 {data?.progress?.currentStreak || 0} Day Streak
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex space-x-2">
          {['dashboard', 'arcade', 'progress'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-lg scale-105' 
                  : 'bg-indigo-500/50 text-indigo-100 hover:bg-indigo-500/70'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Micro Goals Widget */}
              <MicroGoals />

              {/* Focus Garden Preview */}
              <FocusModeGame />
            </div>

            <div className="space-y-8">
              {/* Trophy Room Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">🏆 Trophy Room</h2>
                <div className="grid grid-cols-3 gap-4">
                  {['🥇', '🥈', '🥉', '🎖️', '🚀', '⭐'].map((emoji, i) => (
                    <div key={i} className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-3xl hover:scale-110 transition-transform cursor-pointer">
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'arcade' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ReactionGame onComplete={(score) => alert(`Game Over! Score: ${score}`)} />
            <PatternGame />
          </div>
        )}

        {activeTab === 'progress' && progressData && (
          <div className="space-y-8">
            <ProgressDashboard data={progressData} />
            {data?.stats && <ImprovementChart data={data.stats} />}
          </div>
        )}
      </motion.div>
    </div>
  )
}
