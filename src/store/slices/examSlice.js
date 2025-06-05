import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    questions: [], // Array to hold the questions
    currentQuestionIndex: 0, // Index of the current question
    currentSelectedOption: null,
    answers: {}, // Object to store answers keyed by question ID
    questionStatus: {}, // Object to track the status of each question (not-attempted, viewed, answered, marked-review)
    examStartTime: null, // Timestamp when the exam starts
    examEndTime: null, // Timestamp when the exam ends
    questionTimes: {}, // Object to track time spent on each question
    isExamComplete: false, // Boolean to indicate if the exam is complete
    bookmarkedQuestions: [], // Array to hold bookmarked question IDs
    averageTimePerQuestion: 0, // Average time per question in seconds
    totalExamTime: 3600, // Total exam time in seconds (1 hour)
};

const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {
        setQuestions: (state, action) => {
            state.questions = action.payload;
            state.averageTimePerQuestion = Math.floor(
                state.totalExamTime / action.payload.length
            );
            state.examStartTime = Date.now();
            state.currentQuestionIndex = 0;
            state.currentSelectedOption = null;
            state.answers = {};
            state.questionStatus = {};
            state.questionTimes = {};
            state.bookmarkedQuestions = [];
            state.isExamComplete = false;
            state.examEndTime = null;

            // Initialize question status and times
            action.payload.forEach((q, index) => {
                if(index == 0){
                    state.questionStatus[q.id] = "viewed";
                    state.questionTimes[q.id] = 0;
                }else{
                    state.questionStatus[q.id] = "not-attempted";
                    state.questionTimes[q.id] = 0;
                }
            });
        },
        setQuestionStatus: (state, action) => {
            const { questionId, status } = action.payload;
            const current = state.questionStatus[questionId];
            if (!current || current === "not-attempted") {
                state.questionStatus[questionId] = status;
            }
        },
        setCurrentQuestion: (state, action) => {
            const prevQuestion = state.questions[state.currentQuestionIndex];
            const nextIndex = action.payload;
            const nextQuestion = state.questions[nextIndex];

            // Mark previous as viewed if it was not attempted
            if (
                prevQuestion &&
                state.questionStatus[prevQuestion.id] === "not-attempted"
            ) {
                state.questionStatus[prevQuestion.id] = "viewed";
            }

            // Also mark current (next) as viewed if clicked again and still "not-attempted"
            if (
                nextQuestion &&
                state.questionStatus[nextQuestion.id] === "not-attempted"
            ) {
                state.questionStatus[nextQuestion.id] = "viewed";
            }

            state.currentQuestionIndex = nextIndex;
        },
        saveAnswer: (state, action) => {
            const { questionId, answer } = action.payload;
            if (answer === null) {
                delete state.answers[questionId];
                // If answer is cleared, set status back to viewed
                state.questionStatus[questionId] = "viewed";
            } else {
                state.answers[questionId] = answer;
                // Check if the question was marked for review
                if (
                    state.questionStatus[questionId] === "marked-review" ||
                    state.questionStatus[questionId] === "answered-marked-review"
                ) {
                    state.questionStatus[questionId] = "answered-marked-review";
                } else {
                    state.questionStatus[questionId] = "answered";
                }
            }
        },
        markForReview: (state, action) => {
            const questionId = action.payload;
            // If the question is already marked for review, unmark it
            if (
                state.questionStatus[questionId] === "marked-review" ||
                state.questionStatus[questionId] === "answered-marked-review"
            ) {
                if (questionId in state.answers) {
                    state.questionStatus[questionId] = "answered";
                } else {
                    state.questionStatus[questionId] = "viewed";
                }
            } else {
                if (questionId in state.answers) {
                    state.questionStatus[questionId] = "answered-marked-review";
                } else {
                    state.questionStatus[questionId] = "marked-review";
                }
            }
        },
        updateQuestionTime: (state, action) => {
            const { questionId, timeSpent } = action.payload;
            // Round to 1 decimal place for smoother updates
            state.questionTimes[questionId] = Math.round(timeSpent * 10) / 10;
        },
        completeExam: (state) => {
            state.isExamComplete = true;
            state.examEndTime = Date.now();
        },
        clearAnswer: (state, action) => {
            const questionId = action.payload;
            delete state.answers[questionId];
            // If it was marked for review, keep it marked
            if (state.questionStatus[questionId] === "answered-marked-review") {
                state.questionStatus[questionId] = "marked-review";
            } else {
                state.questionStatus[questionId] = "viewed";
            }
        },
        toggleBookmark: (state, action) => {
            const questionId = action.payload;
            const index = state.bookmarkedQuestions.indexOf(questionId);
            if (index !== -1) {
                state.bookmarkedQuestions.splice(index, 1);
            } else {
                state.bookmarkedQuestions.push(questionId);
            }
        },
        clearExamState: (state) => {
            // Keep the questions and reinitialize everything else
            const questions = state.questions;
            // Use setQuestions logic to reset the state
            state.averageTimePerQuestion = Math.floor(
                state.totalExamTime / questions.length
            );
            state.examStartTime = Date.now();
            state.currentQuestionIndex = 0;
            state.answers = {};
            state.questionStatus = {};
            state.questionTimes = {};
            state.bookmarkedQuestions = [];
            state.isExamComplete = false;
            state.examEndTime = null;

            // Initialize question status and times
            questions.forEach((q, index) => {
                if (index == 0) {
                    state.questionStatus[q.id] = "viewed";
                    state.questionTimes[q.id] = 0;
                } else {
                    state.questionStatus[q.id] = "not-attempted";
                    state.questionTimes[q.id] = 0;
                }
            });
        },
        getUnansweredCount: (state) => {
            return state.answers;
        },
    },
});

export const {
    setQuestions,
    setCurrentQuestion,
    saveAnswer,
    markForReview,
    updateQuestionTime,
    completeExam,
    clearAnswer,
    toggleBookmark,
    clearExamState,
    getUnansweredCount,
    setQuestionStatus
} = examSlice.actions;

export default examSlice.reducer;
