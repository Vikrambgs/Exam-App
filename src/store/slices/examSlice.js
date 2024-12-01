import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  questionStatus: {}, // not-attempted, viewed, answered, marked-review
  examStartTime: null,
  examEndTime: null,
  questionTimes: {}, // Track time spent on each question
  isExamComplete: false,
  bookmarkedQuestions: [],
  averageTimePerQuestion: 0,
  totalExamTime: 3600, // 1 hour in seconds
}

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload
      state.averageTimePerQuestion = Math.floor(state.totalExamTime / action.payload.length)
      state.examStartTime = Date.now()
      state.currentQuestionIndex = 0
      state.answers = {}
      state.questionStatus = {}
      state.questionTimes = {}
      state.bookmarkedQuestions = []
      state.isExamComplete = false
      state.examEndTime = null
      
      // Initialize question status and times
      action.payload.forEach(q => {
        state.questionStatus[q.id] = 'not-attempted'
        state.questionTimes[q.id] = 0
      })
    },
    setCurrentQuestion: (state, action) => {
      const prevQuestion = state.questions[state.currentQuestionIndex]
      if (prevQuestion && state.questionStatus[prevQuestion.id] === 'not-attempted') {
        state.questionStatus[prevQuestion.id] = 'viewed'
      }
      state.currentQuestionIndex = action.payload
    },
    saveAnswer: (state, action) => {
      const { questionId, answer } = action.payload
      if (answer === null) {
        delete state.answers[questionId]
        // If answer is cleared, set status back to viewed
        state.questionStatus[questionId] = 'viewed'
      } else {
        state.answers[questionId] = answer
        // Only set to answered if not already marked for review
        if (state.questionStatus[questionId] !== 'marked-review') {
          state.questionStatus[questionId] = 'answered'
        }
      }
    },
    markForReview: (state, action) => {
      const questionId = action.payload
      // Mark for review status takes precedence over answered status
      state.questionStatus[questionId] = 'marked-review'
    },
    updateQuestionTime: (state, action) => {
      const { questionId, timeSpent } = action.payload
      // Round to 1 decimal place for smoother updates
      state.questionTimes[questionId] = Math.round(timeSpent * 10) / 10
    },
    completeExam: (state) => {
      state.isExamComplete = true
      state.examEndTime = Date.now()
    },
    clearAnswer: (state, action) => {
      const questionId = action.payload
      delete state.answers[questionId]
      state.questionStatus[questionId] = 'viewed'
    },
    toggleBookmark: (state, action) => {
      const questionId = action.payload
      const index = state.bookmarkedQuestions.indexOf(questionId)
      if (index !== -1) {
        state.bookmarkedQuestions.splice(index, 1)
      } else {
        state.bookmarkedQuestions.push(questionId)
      }
    },
    clearExamState: (state) => {
      // Keep the questions and reinitialize everything else
      const questions = state.questions
      // Use setQuestions logic to reset the state
      state.averageTimePerQuestion = Math.floor(state.totalExamTime / questions.length)
      state.examStartTime = Date.now()
      state.currentQuestionIndex = 0
      state.answers = {}
      state.questionStatus = {}
      state.questionTimes = {}
      state.bookmarkedQuestions = []
      state.isExamComplete = false
      state.examEndTime = null
      
      // Initialize question status and times
      questions.forEach(q => {
        state.questionStatus[q.id] = 'not-attempted'
        state.questionTimes[q.id] = 0
      })
    }
  }
})

export const {
  setQuestions,
  setCurrentQuestion,
  saveAnswer,
  markForReview,
  updateQuestionTime,
  completeExam,
  clearAnswer,
  toggleBookmark,
  clearExamState
} = examSlice.actions

export default examSlice.reducer
