"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getADHDLevel, getLearningMode, getContentForMode, shouldTriggerAttentionAlert, getAttentionMessage } from '@/lib/adaptiveEngine'
import Toast, { useToast } from '@/components/Toast'

interface UserProfile {
  adhdScore?: number
  preferences: {
    preferredMode?: 'text' | 'visual' | 'audio'
  }
}

const LESSONS = [
  { id: 'math-basics', title: 'Basic Mathematics', topic: 'Addition and Subtraction' },
  { id: 'science-intro', title: 'Science Introduction', topic: 'States of Matter' },
  { id: 'reading-skills', title: 'Reading Comprehension', topic: 'Main Ideas and Details' },
  { id: 'history-basics', title: 'World History', topic: 'Ancient Civilizations' },
  { id: 'writing-skills', title: 'Writing Skills', topic: 'Paragraph Structure' }
]

export default function LearnPage() {
  const router = useRouter()
  const { msg, show } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [currentLesson, setCurrentLesson] = useState(LESSONS[0])
  const [attention, setAttention] = useState(0.8)
  const [mode, setMode] = useState<'text' | 'visual' | 'audio'>('text')
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile?.adhdScore) {
      const adhdLevel = getADHDLevel(profile.adhdScore)
      const recommendedMode = getLearningMode(profile.adhdScore, attention)
      setMode(recommendedMode)
      updateContent(recommendedMode)
    }
  }, [profile, attention])

  useEffect(() => {
    // Attention tracking simulation
    const interval = setInterval(() => {
      setAttention(prev => {
        const newAttention = Math.max(0.1, Math.min(1, prev + (Math.random() - 0.5) * 0.1))
        
        if (profile?.adhdScore && shouldTriggerAttentionAlert(newAttention, getADHDLevel(profile.adhdScore))) {
          show(getAttentionMessage(getADHDLevel(profile.adhdScore)))
          // Switch to more engaging mode
          const newMode = newAttention < 0.3 ? 'visual' : 'audio'
          setMode(newMode)
          updateContent(newMode)
        }
        
        return newAttention
      })
    }, 5000)

    // Time tracking
    const timeInterval = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [profile, show])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      const data = await res.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContent = (newMode: 'text' | 'visual' | 'audio') => {
    const lessonContent = getContentForMode(newMode, currentLesson.topic)
    setContent(lessonContent)
  }

  const handleModeChange = (newMode: 'text' | 'visual' | 'audio') => {
    setMode(newMode)
    updateContent(newMode)
  }

  const handleTextToSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content.body)
      utterance.rate = (profile?.preferences as any)?.speechSpeed || 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleVoiceCommand = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) {
      show('Speech Recognition not supported')
      return
    }

    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase()
      if (transcript.includes('visual')) handleModeChange('visual')
      else if (transcript.includes('audio')) handleModeChange('audio')
      else if (transcript.includes('text')) handleModeChange('text')
      show(`Voice command: ${transcript}`)
    }
    recognition.start()
  }

  const handleLessonComplete = async () => {
    try {
      await fetch('/api/learning/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          timeSpent,
          attention,
          mode
        })
      })
      show('Lesson completed! Great job!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  const adhdLevel = profile?.adhdScore ? getADHDLevel(profile.adhdScore) : 'Low'
  const attentionPercent = Math.round(attention * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Learning Hub</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Focus: <span className="font-semibold text-blue-600">{attentionPercent}%</span>
              </div>
              <div className="text-sm text-gray-600">
                ADHD Level: <span className="font-semibold text-purple-600">{adhdLevel}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {(['text', 'visual', 'audio'] as const).map(modeOption => (
              <button
                key={modeOption}
                onClick={() => handleModeChange(modeOption)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  mode === modeOption
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-6 min-h-[400px]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {currentLesson.title}
                </h2>
                <h3 className="text-lg text-gray-600 mb-4">
                  {currentLesson.topic}
                </h3>
                
                {content && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">{content.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{content.body}</p>
                    
                    {mode === 'visual' && (
                      <div className="bg-blue-100 p-4 rounded-lg">
                        <div className="text-center text-blue-800">
                          📊 Interactive Visual Content
                        </div>
                        <div className="mt-2 text-sm text-blue-600">
                          Charts, diagrams, and visual representations would appear here
                        </div>
                      </div>
                    )}
                    
                    {mode === 'audio' && (
                      <div className="bg-green-100 p-4 rounded-lg">
                        <div className="text-center text-green-800">
                          🎵 Audio Content Ready
                        </div>
                        <div className="mt-2 text-sm text-green-600">
                          Audio narration and sound effects would play here
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleTextToSpeech}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  🔊 Read Aloud
                </button>
                <button
                  onClick={handleVoiceCommand}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  🎤 Voice Command
                </button>
                <button
                  onClick={handleLessonComplete}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  ✅ Complete Lesson
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Lesson Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Time Spent:</span>
                    <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="capitalize">{mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attention:</span>
                    <span>{attentionPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Available Lessons</h3>
                <div className="space-y-2">
                  {LESSONS.map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full text-left p-2 rounded-lg text-sm ${
                        currentLesson.id === lesson.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {lesson.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast message={msg} />
    </div>
  )
}
