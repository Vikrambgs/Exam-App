import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setQuestions, saveAnswer, markForReview, setCurrentQuestion, completeExam, clearAnswer, toggleBookmark, updateQuestionTime, clearExamState } from '../store/slices/examSlice'
import { fetchQuestions } from '../services/api'
import QuestionNavigation from './QuestionNavigation'
import { format } from 'date-fns'
import classNames from 'classnames'

function ExamTimer({ startTime, timeLimit }) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = timeLimit - elapsed
      setTimeRemaining(remaining)

      if (remaining <= 0) {
        clearInterval(timer)
        // Handle exam completion
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime, timeLimit])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const isLowTime = timeRemaining <= 300 // 5 minutes or less

  return (
    <div className={classNames(
      'flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors',
      isLowTime ? 'bg-red-100 text-red-700' : 'bg-white/10 text-white'
    )}>
      <svg 
        className={classNames(
          "w-5 h-5",
          isLowTime && "animate-pulse"
        )} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span className="font-medium">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

function ConfirmationDialog({ isOpen, onConfirm, onCancel, unansweredCount }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
        <p className="mb-4">
          {unansweredCount > 0 
            ? `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`
            : 'Are you sure you want to submit your exam?'}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  )
}

function HelpPanel({ isOpen, onClose }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-700">Exam Help</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p>• Use arrow keys ←→ to navigate questions</p>
        <p>• Press R to mark question for review</p>
        <p>• Press C to clear your answer</p>
        <p>• Use number keys 1-4 to select options</p>
        <p>• Click the bookmark icon to save questions for later</p>
      </div>
    </div>
  )
}

function QuestionTimeProgress({ questionId, timeSpent, averageTime }) {
  const percentage = (timeSpent / averageTime) * 100
  const isOverTime = timeSpent > 0 && timeSpent > averageTime

  return (
    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={classNames(
          "h-full transition-all duration-300",
          timeSpent === 0 
            ? "bg-gray-300" 
            : isOverTime 
              ? "bg-red-500" 
              : "bg-green-500"
        )}
        style={{ 
          width: timeSpent === 0 ? '0%' : `${Math.min(percentage, 100)}%` 
        }}
      />
    </div>
  )
}

function ClearExamDialog({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Clear Exam State</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to clear all your answers and start fresh? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear State
          </button>
        </div>
      </div>
    </div>
  );
}

function Exam() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const currentQuestionIndex = useSelector((state) => state.exam.currentQuestionIndex)
  const questions = useSelector((state) => state.exam.questions)
  const examStartTime = useSelector((state) => state.exam.examStartTime)
  const answers = useSelector((state) => state.exam.answers)
  const questionStatus = useSelector((state) => state.exam.questionStatus)
  const bookmarkedQuestions = useSelector((state) => state.exam.bookmarkedQuestions)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const questionTimes = useSelector((state) => state.exam.questionTimes)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [questionTimers, setQuestionTimers] = useState({})
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now())
  const totalExamTime = 3600 // 1 hour in seconds
  const averageTimePerQuestion = useSelector((state) => state.exam.averageTimePerQuestion)
  const [currentQuestionTimer, setCurrentQuestionTimer] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || null

  const handleNavigateQuestion = (direction) => {
    const newIndex = currentQuestionIndex + direction
    if (newIndex >= 0 && newIndex < questions.length) {
      dispatch(setCurrentQuestion(newIndex))
    }
  }

  const handleMarkForReview = () => {
    if (currentQuestion) {
      dispatch(markForReview(currentQuestion.id))
    }
  }

  const handleClearAnswer = () => {
    if (currentQuestion) {
      setSelectedOption(null)
      dispatch(clearAnswer(currentQuestion.id))
    }
  }

  const handleOptionSelect = (index) => {
    if (!currentQuestion) return

    if (selectedOption === index) {
      setSelectedOption(null)
      dispatch(saveAnswer({ 
        questionId: currentQuestion.id, 
        answer: null 
      }))
    } else {
      setSelectedOption(index)
      dispatch(saveAnswer({ 
        questionId: currentQuestion.id, 
        answer: index 
      }))
    }
  }

  const handleSubmitExam = () => {
    dispatch(completeExam())
    navigate('/results')
  }

  const handleToggleBookmark = () => {
    if (currentQuestion) {
      dispatch(toggleBookmark(currentQuestion.id))
    }
  }

  const handleClearExamState = () => {
    dispatch(clearExamState());
    setSelectedOption(null);
    setShowClearConfirmation(false);
    setQuestionStartTime(Date.now());
    setCurrentQuestionTimer(null);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadQuestions = async () => {
      if (!questions || questions.length === 0) {
        try {
          const data = await fetchQuestions();
          dispatch(setQuestions(data.questions));
        } catch (error) {
          console.error('Error loading questions:', error);
        }
      }
    };
    
    loadQuestions();
  }, [dispatch, isAuthenticated, navigate, questions]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return

      switch(e.key) {
        case 'ArrowLeft':
          handleNavigateQuestion(-1)
          break
        case 'ArrowRight':
          handleNavigateQuestion(1)
          break
        case 'r':
        case 'R':
          handleMarkForReview()
          break
        case 'c':
        case 'C':
          if (questionStatus[currentQuestion?.id] === 'answered' || selectedOption !== null) {
            handleClearAnswer()
          }
          break
        default:
          const num = parseInt(e.key)
          if (num >= 1 && num <= 4) {
            handleOptionSelect(num - 1)
          }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentQuestionIndex, questionStatus, selectedOption])

  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = answers[currentQuestion.id];
      setSelectedOption(savedAnswer !== undefined ? savedAnswer : null);
    }
  }, [currentQuestion, answers]);

  useEffect(() => {
    if (!currentQuestion) return
    
    const questionId = currentQuestion.id
    const existingTime = questionTimes[questionId] || 0
    let startTracking = Date.now()
    
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTracking) / 1000
      const totalTime = existingTime + elapsed
      
      dispatch(updateQuestionTime({
        questionId,
        timeSpent: totalTime
      }))
    }, 100)
    
    return () => {
      clearInterval(timer)
      const finalElapsed = (Date.now() - startTracking) / 1000
      dispatch(updateQuestionTime({
        questionId,
        timeSpent: existingTime + finalElapsed
      }))
    }
  }, [currentQuestionIndex, currentQuestion])

  useEffect(() => {
    const trackInteraction = () => {
      setLastInteractionTime(Date.now())
    }

    window.addEventListener('mousemove', trackInteraction)
    window.addEventListener('keydown', trackInteraction)
    window.addEventListener('click', trackInteraction)

    return () => {
      window.removeEventListener('mousemove', trackInteraction)
      window.removeEventListener('keydown', trackInteraction)
      window.removeEventListener('click', trackInteraction)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (currentQuestionTimer) {
        clearInterval(currentQuestionTimer)
      }
    }
  }, [currentQuestionTimer])

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading questions...</div>
      </div>
    )
  }

  const unansweredCount = questions.filter(q => 
    questionStatus[q.id] === 'not-attempted' || questionStatus[q.id] === 'viewed'
  ).length

  const isBookmarked = currentQuestion ? bookmarkedQuestions.includes(currentQuestion.id) : false

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-2 px-3 shadow-lg">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold text-white uppercase">Ongoing Exam....</h1>
          <div className="flex items-center gap-4">
            {examStartTime && <ExamTimer startTime={examStartTime} timeLimit={3600} />}
            <button
              onClick={() => setShowClearConfirmation(true)}
              className="text-white/80 hover:text-white bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-full text-sm"
            >
              Clear Exam State
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="text-white/80 hover:text-white"
              aria-label="Show help"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex gap-2 p-3">
          <div className="flex-1 flex">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-col border border-gray-100">
              <div className="mb-4">
                <div className="flex flex-col gap-4 border-b pb-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleBookmark}
                        className={classNames(
                          "p-1.5 rounded-full transition-colors",
                          isBookmarked
                            ? "text-yellow-500 hover:text-yellow-600"
                            : "text-gray-400 hover:text-gray-500"
                        )}
                        aria-label="Bookmark question"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </button>
                      <div className="flex gap-2">
                        {selectedOption !== null && (
                          <button
                            onClick={handleClearAnswer}
                            className="px-3 py-1 text-sm text-red-600 font-medium hover:text-white hover:bg-red-600 border border-red-600 rounded-full transition-all"
                          >
                            Clear Answer
                          </button>
                        )}
                        {selectedOption !== null && (
                          <button
                            onClick={handleMarkForReview}
                            className={classNames(
                              "px-3 py-1 text-sm font-medium rounded-full transition-all",
                              questionStatus[currentQuestion?.id] === 'marked-review'
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200"
                                : "text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600"
                            )}
                          >
                            {questionStatus[currentQuestion?.id] === 'marked-review' 
                              ? "Marked for Review" 
                              : "Mark for Review"
                            }
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <QuestionTimeProgress 
                      questionId={currentQuestion.id}
                      timeSpent={questionTimes[currentQuestion.id] || 0}
                      averageTime={averageTimePerQuestion}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xl text-gray-800">{currentQuestion.question}</p>
              </div>

              <div className="space-y-2 flex-1">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    onKeyPress={(e) => e.key === 'Enter' && handleOptionSelect(index)}
                    role="radio"
                    aria-checked={selectedOption === index}
                    tabIndex={0}
                    className={classNames(
                      'p-2 py-3 border rounded cursor-pointer transition-all',
                      'hover:shadow focus:outline-none focus:ring-1 focus:ring-indigo-500',
                      selectedOption === index 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                        : 'hover:bg-gray-50 hover:border-gray-300 text-gray-700 border-gray-200'
                    )}
                  >
                    <div className="flex items-center">
                      <div className={classNames(
                        'w-4 h-4 rounded-full border mr-2 flex items-center justify-center relative',
                        selectedOption === index 
                          ? 'border-indigo-500 bg-indigo-100' 
                          : 'border-gray-400'
                      )}>
                        {selectedOption === index && (
                          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-indigo-500" />
                        )}
                      </div>
                      <span className="text-sm">{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleNavigateQuestion(-1)}
                    disabled={currentQuestionIndex === 0}
                    className={classNames(
                      'px-4 py-1 rounded font-medium transition-all',
                      'focus:outline-none focus:ring-1 focus:ring-indigo-500',
                      currentQuestionIndex === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    )}
                    aria-label="Go to previous question"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="px-6 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded font-medium transition-all focus:outline-none focus:ring-1 focus:ring-green-500"
                    aria-label="Submit exam"
                  >
                    Submit Exam
                  </button>
                  <button
                    onClick={() => handleNavigateQuestion(1)}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={classNames(
                      'px-4 py-1 rounded font-medium transition-all',
                      'focus:outline-none focus:ring-1 focus:ring-indigo-500',
                      currentQuestionIndex === questions.length - 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    )}
                    aria-label="Go to next question"
                  >
                    Next →
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Keyboard shortcuts: ←→ Navigate questions | R Mark for review | C Clear answer | 1-4 Select options
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3 min-w-1/3 flex">
            <QuestionNavigation />
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={handleSubmitExam}
        onCancel={() => setShowConfirmation(false)}
        unansweredCount={unansweredCount}
      />
      <HelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <ClearExamDialog
        isOpen={showClearConfirmation}
        onConfirm={handleClearExamState}
        onCancel={() => setShowClearConfirmation(false)}
      />
    </div>
  )
}

export default Exam
