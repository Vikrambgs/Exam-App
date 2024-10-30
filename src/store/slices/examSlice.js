import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  questionStatus: {}, // not-attempted, viewed, answered, marked-review
  examStartTime: null,
  examEndTime: null,
  questionTimes: {}, // Track time spent on each question
  isExamComplete: false
}

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload
      state.examStartTime = Date.now()
      // Initialize question status as not-attempted
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
        state.questionStatus[questionId] = 'answered'
      }
    },
    markForReview: (state, action) => {
      const questionId = action.payload
      state.questionStatus[questionId] = 'marked-review'
    },
    updateQuestionTime: (state, action) => {
      const { questionId, timeSpent } = action.payload
      state.questionTimes[questionId] = (state.questionTimes[questionId] || 0) + timeSpent
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
  }
})

export const {
  setQuestions,
  setCurrentQuestion,
  saveAnswer,
  markForReview,
  updateQuestionTime,
  completeExam,
  clearAnswer
} = examSlice.actions

export default examSlice.reducer
