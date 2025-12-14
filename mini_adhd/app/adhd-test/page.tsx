"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ADHD_QUESTIONS = [
  {
    id: 1,
    question: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 2,
    question: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 3,
    question: "How often do you have problems remembering appointments or obligations?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 4,
    question: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 5,
    question: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 6,
    question: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 7,
    question: "How often do you make careless mistakes when you have to work on a boring or difficult project?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 8,
    question: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 9,
    question: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  },
  {
    id: 10,
    question: "How often do you misplace or have difficulty finding things at home or at work?",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 },
      { text: "Very Often", value: 4 }
    ]
  }
]

export default function ADHDTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < ADHD_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitTest()
    }
  }

  const submitTest = async () => {
    setLoading(true)
    try {
      const totalScore = answers.reduce((sum, answer) => sum + (answer || 0), 0)
      const adhdScore = Math.round((totalScore / (ADHD_QUESTIONS.length * 4)) * 100)
      
      const res = await fetch('/api/user/adhd-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adhdScore })
      })
      
      if (res.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
    } finally {
      setLoading(false)
    }
  }

  const progress = ((currentQuestion + 1) / ADHD_QUESTIONS.length) * 100
  const currentQ = ADHD_QUESTIONS[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ADHD Screening Assessment</h1>
            <p className="text-gray-600">This assessment helps us personalize your learning experience</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {ADHD_QUESTIONS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQ.question}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : currentQuestion === ADHD_QUESTIONS.length - 1 ? 'Complete Test' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
