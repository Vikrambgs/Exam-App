import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setQuestions, saveAnswer, markForReview, setCurrentQuestion, completeExam, clearAnswer } from '../store/slices/examSlice'
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

  return (
    <div className="text-lg font-semibold text-indigo-700">
      Time Remaining: {format(timeRemaining * 1000, 'mm:ss')}
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

function Exam() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const currentQuestionIndex = useSelector((state) => state.exam.currentQuestionIndex)
  const questions = useSelector((state) => state.exam.questions)
  const examStartTime = useSelector((state) => state.exam.examStartTime)
  const answers = useSelector((state) => state.exam.answers)
  const questionStatus = useSelector((state) => state.exam.questionStatus)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions()
        dispatch(setQuestions(data.questions))
      } catch (error) {
        console.error('Error loading questions:', error)
      }
    }
    
    loadQuestions()
  }, [dispatch, isAuthenticated, navigate])

  // Reset selected option when changing questions
  useEffect(() => {
    const currentAnswer = answers[questions[currentQuestionIndex]?.id]
    setSelectedOption(currentAnswer !== undefined ? currentAnswer : null)
  }, [currentQuestionIndex, answers, questions])

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading questions...</div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const unansweredCount = questions.filter(q => 
    questionStatus[q.id] === 'not-attempted' || questionStatus[q.id] === 'viewed'
  ).length

  const handleOptionSelect = (index) => {
    // If clicking the same option, deselect it
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

  const handleMarkForReview = () => {
    dispatch(markForReview(currentQuestion.id))
  }

  const handleNavigateQuestion = (direction) => {
    const newIndex = currentQuestionIndex + direction
    if (newIndex >= 0 && newIndex < questions.length) {
      dispatch(setCurrentQuestion(newIndex))
    }
  }

  const handleSubmitExam = () => {
    dispatch(completeExam())
    navigate('/results')
  }

  const handleClearAnswer = () => {
    setSelectedOption(null)
    dispatch(clearAnswer(currentQuestion.id))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-2 px-3 shadow-lg">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold text-white uppercase">React Programming Test</h1>
          {examStartTime && <div className="bg-white bg-opacity-20 rounded px-3 py-0.5">
            <ExamTimer startTime={examStartTime} timeLimit={3600} />
          </div>}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex gap-2 p-3">
          <div className="flex-1 flex">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-col border border-gray-100">
              <div className="mb-4 flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <div className="flex gap-2">
                  {(questionStatus[currentQuestion.id] === 'answered' || selectedOption !== null) && (
                    <button
                      onClick={handleClearAnswer}
                      className="px-3 py-1 text-red-600 font-medium hover:text-white hover:bg-red-600 border border-red-600 rounded transition-all"
                      aria-label="Clear selected answer"
                    >
                      Clear Answer
                    </button>
                  )}
                  <button
                    onClick={handleMarkForReview}
                    className="px-3 py-1 font-medium text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded transition-all"
                    aria-label="Mark question for review"
                  >
                    Mark for Review
                  </button>
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
    </div>
  )
}

export default Exam
