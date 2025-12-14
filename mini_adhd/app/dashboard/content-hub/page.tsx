"use client"
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Content {
  _id: string
  title: string
  description: string
  type: 'lesson' | 'exercise' | 'game' | 'assessment' | 'break_activity'
  category: 'math' | 'reading' | 'science' | 'social' | 'attention' | 'memory'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number
  content: {
    text?: string
    images?: string[]
    videos?: string[]
    audio?: string[]
    interactive?: any
  }
  metadata: {
    tags: string[]
    ageRange: { min: number; max: number }
    adhdFriendly: boolean
    attentionLevel: number
    engagementScore: number
    accessibility: {
      visual: boolean
      auditory: boolean
      kinesthetic: boolean
    }
  }
  analytics: {
    totalViews: number
    averageRating: number
    completionRate: number
    averageTimeSpent: number
  }
}

export default function ContentHub() {
  const [content, setContent] = useState<Content[]>([])
  const [filteredContent, setFilteredContent] = useState<Content[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  useEffect(() => {
    filterContent()
  }, [content, selectedCategory, selectedDifficulty, selectedType])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content')
      if (response.ok) {
        const data = await response.json()
        setContent(data.content || [])
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterContent = () => {
    let filtered = content

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    setFilteredContent(filtered)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚'
      case 'exercise': return '💪'
      case 'game': return '🎮'
      case 'assessment': return '📝'
      case 'break_activity': return '🧘'
      default: return '📄'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'math': return '🔢'
      case 'reading': return '📖'
      case 'science': return '🔬'
      case 'social': return '👥'
      case 'attention': return '🎯'
      case 'memory': return '🧠'
      default: return '📚'
    }
  }

  const startContent = async (contentItem: Content) => {
    try {
      // Track content start
      await fetch('/api/realtime/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataType: 'activity',
          value: 1,
          metadata: { 
            source: 'content_start',
            context: `Started: ${contentItem.title}`,
            contentId: contentItem._id
          }
        })
      })

      setSelectedContent(contentItem)
    } catch (error) {
      console.error('Error starting content:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (selectedContent) {
    return (
      <ContentViewer 
        content={selectedContent} 
        onClose={() => setSelectedContent(null)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Hub</h1>
        <button
          onClick={fetchContent}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Content
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Filter Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="math">Math</option>
              <option value="reading">Reading</option>
              <option value="science">Science</option>
              <option value="social">Social</option>
              <option value="attention">Attention</option>
              <option value="memory">Memory</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="lesson">Lessons</option>
              <option value="exercise">Exercises</option>
              <option value="game">Games</option>
              <option value="assessment">Assessments</option>
              <option value="break_activity">Break Activities</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredContent.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => startContent(item)}
            >
              {/* Content Image */}
              {item.content.images && item.content.images.length > 0 && (
                <div className="relative h-48 w-full">
                  <Image
                    src={item.content.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {getTypeIcon(item.type)} {item.type}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱️ {item.estimatedDuration} min</span>
                  <span>👁️ {item.analytics.totalViews} views</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-1">
                    {item.metadata.accessibility.visual && <span title="Visual">👁️</span>}
                    {item.metadata.accessibility.auditory && <span title="Auditory">👂</span>}
                    {item.metadata.accessibility.kinesthetic && <span title="Kinesthetic">✋</span>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🎯 {Math.round(item.metadata.attentionLevel * 100)}%</span>
                    <span>🔥 {Math.round(item.metadata.engagementScore * 100)}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {item.metadata.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Activity
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No content found matching your filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all')
              setSelectedDifficulty('all')
              setSelectedType('all')
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

function ContentViewer({ content, onClose }: { content: Content; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [interactiveState, setInteractiveState] = useState<any>(null)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{content.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content Images */}
          {content.content.images && content.content.images.length > 0 && (
            <div className="mb-6">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src={content.content.images[currentImageIndex]}
                  alt={content.title}
                  fill
                  className="object-cover"
                />
              </div>
              {content.content.images.length > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  {content.content.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Text */}
          {content.content.text && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{content.content.text}</p>
            </div>
          )}

          {/* Interactive Elements */}
          {content.content.interactive && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Interactive Activity</h3>
              <InteractiveComponent 
                interactive={content.content.interactive}
                onStateChange={setInteractiveState}
              />
            </div>
          )}

          {/* Content Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{content.estimatedDuration}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(content.metadata.attentionLevel * 100)}%
              </div>
              <div className="text-sm text-gray-600">Attention Level</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(content.metadata.engagementScore * 100)}%
              </div>
              <div className="text-sm text-gray-600">Engagement</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(content.analytics.completionRate * 100)}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InteractiveComponent({ interactive, onStateChange }: { interactive: any; onStateChange: (state: any) => void }) {
  const [state, setState] = useState<any>({})

  const handleStateChange = (newState: any) => {
    setState(newState)
    onStateChange(newState)
  }

  switch (interactive.type) {
    case 'counting_game':
      return <CountingGame interactive={interactive} state={state} onStateChange={handleStateChange} />
    case 'comprehension_quiz':
      return <ComprehensionQuiz interactive={interactive} state={state} onStateChange={handleStateChange} />
    case 'planet_explorer':
      return <PlanetExplorer interactive={interactive} state={state} onStateChange={handleStateChange} />
    case 'attention_training':
      return <AttentionTraining interactive={interactive} state={state} onStateChange={handleStateChange} />
    case 'memory_palace':
      return <MemoryPalace interactive={interactive} state={state} onStateChange={handleStateChange} />
    default:
      return <div className="p-4 bg-gray-100 rounded-lg">Interactive content not available</div>
  }
}

function CountingGame({ interactive, state, onStateChange }: any) {
  const [count, setCount] = useState(0)
  const [selectedAnimal, setSelectedAnimal] = useState('')

  return (
    <div className="p-6 bg-blue-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Count the Animals!</h4>
      <p className="mb-4">Click on the animals to count them. Target: {interactive.targetCount}</p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {interactive.animals.map((animal: string, index: number) => (
          <button
            key={index}
            onClick={() => {
              setCount(prev => prev + 1)
              setSelectedAnimal(animal)
            }}
            className="px-4 py-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {animal} 🐾
          </button>
        ))}
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">{count}</div>
        <div className="text-sm text-gray-600">
          {count === interactive.targetCount ? '🎉 Perfect!' : 
           count > interactive.targetCount ? 'Too many! Try again.' : 
           'Keep counting!'}
        </div>
      </div>
    </div>
  )
}

function ComprehensionQuiz({ interactive, state, onStateChange }: any) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    if (answerIndex === interactive.questions[currentQuestion].correct) {
      setScore(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < interactive.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
    }
  }

  const question = interactive.questions[currentQuestion]

  return (
    <div className="p-6 bg-green-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Comprehension Quiz</h4>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {interactive.questions.length}</p>
        <p className="font-medium mb-4">{question.question}</p>
        
        <div className="space-y-2">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                selectedAnswer === index
                  ? index === question.correct
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-red-100 border-red-500 text-red-800'
                  : selectedAnswer !== null && index === question.correct
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      {selectedAnswer !== null && (
        <div className="flex justify-between items-center">
          <div className="text-sm">
            Score: {score}/{currentQuestion + 1}
          </div>
          {currentQuestion < interactive.questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next Question
            </button>
          ) : (
            <div className="text-green-600 font-semibold">
              Quiz Complete! Final Score: {score}/{interactive.questions.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PlanetExplorer({ interactive, state, onStateChange }: any) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  return (
    <div className="p-6 bg-purple-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Planet Explorer</h4>
      <p className="mb-4">Click on a planet to learn about it!</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {interactive.planets.map((planet: any, index: number) => (
          <button
            key={index}
            onClick={() => setSelectedPlanet(planet.name)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedPlanet === planet.name
                ? 'border-purple-500 bg-purple-100'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-2"
              style={{ backgroundColor: planet.color }}
            ></div>
            <div className="text-sm font-medium">{planet.name}</div>
          </button>
        ))}
      </div>
      
      {selectedPlanet && (
        <div className="p-4 bg-white rounded-lg">
          {(() => {
            const planet = interactive.planets.find((p: any) => p.name === selectedPlanet)
            return (
              <div>
                <h5 className="font-semibold text-lg mb-2">{planet.name}</h5>
                <div className="space-y-2 text-sm">
                  <p>Distance from Sun: {planet.distance} AU</p>
                  <p>Size compared to Earth: {planet.size}x</p>
                  <p>Color: {planet.color}</p>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function AttentionTraining({ interactive, state, onStateChange }: any) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const startExercise = () => {
    const exercise = interactive.exercises[currentExercise]
    setTimeLeft(exercise.duration)
    setIsActive(true)
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const exercise = interactive.exercises[currentExercise]

  return (
    <div className="p-6 bg-yellow-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Attention Training</h4>
      
      <div className="mb-4">
        <h5 className="font-medium mb-2">{exercise.name}</h5>
        <p className="text-sm text-gray-600 mb-4">{exercise.description}</p>
        
        {isActive ? (
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{timeLeft}</div>
            <p className="text-sm">seconds remaining</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 mb-4">{exercise.duration}s</div>
            <button
              onClick={startExercise}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Start Exercise
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-sm">
        <span>Exercise {currentExercise + 1} of {interactive.exercises.length}</span>
        {currentExercise < interactive.exercises.length - 1 && (
          <button
            onClick={() => setCurrentExercise(prev => prev + 1)}
            className="text-blue-600 hover:text-blue-800"
          >
            Next Exercise →
          </button>
        )}
      </div>
    </div>
  )
}

function MemoryPalace({ interactive, state, onStateChange }: any) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleItemClick = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(prev => prev.filter(i => i !== item))
    } else {
      setSelectedItems(prev => [...prev, item])
    }
  }

  return (
    <div className="p-6 bg-indigo-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Memory Palace</h4>
      <p className="mb-4">Explore different rooms and remember the items in each!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {interactive.rooms.map((room: any, index: number) => (
          <button
            key={index}
            onClick={() => setSelectedRoom(room.name)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedRoom === room.name
                ? 'border-indigo-500 bg-indigo-100'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="text-lg font-medium mb-2">{room.name}</div>
            <div className="text-sm text-gray-600">{room.items.length} items</div>
          </button>
        ))}
      </div>
      
      {selectedRoom && (
        <div className="p-4 bg-white rounded-lg">
          {(() => {
            const room = interactive.rooms.find((r: any) => r.name === selectedRoom)
            return (
              <div>
                <h5 className="font-semibold text-lg mb-4">{room.name}</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {room.items.map((item: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleItemClick(item)}
                      className={`p-2 rounded border transition-colors ${
                        selectedItems.includes(item)
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-800'
                          : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Selected: {selectedItems.length} / {room.items.length}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
