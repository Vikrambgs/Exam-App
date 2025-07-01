import {createSlice} from "@reduxjs/toolkit";

// prettier-ignore
const initialState = {
    examQuestions: [],              // Array to hold the questions
    questionOrderIds: [],           // Array to hold the order of questions by question id
    userQuestionActivity : {},      // Objects to track user interactions with each question
    averageTimePerQuestion: 0,      // Average time per question in seconds
    examStartTime: null,            // Timestamp when the exam starts
    examEndTime: null,              // Timestamp when the exam ends
    currentQuestionIndex: 0,        // Index of the current question
    currentlySelectedOption: null,  // Selected option for the current question
    isExamComplete: false,          // Boolean to indicate if the exam is complete
    totalExamTime: 3600,            // Total exam time in seconds (1 hour)
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap
    }
    return array;
}

const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {
        setQuestions: (state, action) => {
            state.examQuestions = action.payload;
            state.averageTimePerQuestion =
                state.totalExamTime / action.payload.length;
            state.examStartTime = Date.now();
            state.currentQuestionIndex = 0;
            state.currentlySelectedOption = null;
            state.isExamComplete = false;
            state.examEndTime = null;

            // shuffle order of questions in state.questionOrderIds
            state.questionOrderIds = action.payload.map((question) => question.id);
            state.questionOrderIds = shuffleArray(state.questionOrderIds);

            // Initialize question status and times
            state.questionOrderIds.forEach((questionId) => {
                state.userQuestionActivity[questionId] = {
                    status: "not-seen",
                    isBookmarked: false,
                    answeredOption: null,
                    timeSpentLog: [],
                };
            });

            // Update first question visited time
            state.userQuestionActivity[state.questionOrderIds[0]] = {
                ...state.userQuestionActivity[state.questionOrderIds[0]],
                status: "seen-only",
                timeSpentLog: [
                    {
                        visitedAt: Date.now(),
                    },
                ],
            };
        },

        setCurrentDisplayedQuestionByIndex: (state, action) => {
            if (state.currentQuestionIndex === action.payload) return;

            const questionIndex = action.payload;

            // Update previous question movedAt time
            state.userQuestionActivity[
                state.questionOrderIds[state.currentQuestionIndex]
            ].timeSpentLog.at(-1).movedAt = Date.now();

            // Update current question visited time
            state.userQuestionActivity[
                state.questionOrderIds[questionIndex]
            ].timeSpentLog.push({
                visitedAt: Date.now(),
            });

            const questionUserActivity =
                state.userQuestionActivity[state.questionOrderIds[questionIndex]];
            if (questionUserActivity.status === "not-seen") {
                questionUserActivity.status = "seen-only";
            }
            state.currentQuestionIndex = questionIndex;
        },

        saveAnswer: (state, action) => {
            const {questionIndex, answerIndex} = action.payload;
            const questionUserActivity =
                state.userQuestionActivity[state.questionOrderIds[questionIndex]];
            questionUserActivity.answeredOption = answerIndex;
            if (questionUserActivity.status === "seen-only") {
                questionUserActivity.status = "answered";
            } else if (questionUserActivity.status === "marked-for-review") {
                questionUserActivity.status = "answered-and-marked-for-review";
            }
        },

        toggleMarkForReview: (state, action) => {
            const questionIndex = action.payload;
            const questionUserActivity =
                state.userQuestionActivity[state.questionOrderIds[questionIndex]];
            if (questionUserActivity.status === "seen-only") {
                questionUserActivity.status = "marked-for-review";
            } else if (questionUserActivity.status === "answered") {
                questionUserActivity.status = "answered-and-marked-for-review";
            } else if (
                questionUserActivity.status === "answered-and-marked-for-review"
            ) {
                questionUserActivity.status = "answered";
            } else if (questionUserActivity.status === "marked-for-review") {
                questionUserActivity.status = "seen-only";
            }
        },

        clearAnswer: (state, action) => {
            const questionIndex = action.payload;
            const questionUserActivity =
                state.userQuestionActivity[state.questionOrderIds[questionIndex]];
            questionUserActivity.answeredOption = null;
            if (questionUserActivity.status === "answered-and-marked-for-review") {
                questionUserActivity.status = "marked-for-review";
            } else if (questionUserActivity.status === "answered") {
                questionUserActivity.status = "seen-only";
            }
        },

        toggleBookmark: (state, action) => {
            const questionIndex = action.payload;
            const questionUserActivity =
                state.userQuestionActivity[state.questionOrderIds[questionIndex]];
            questionUserActivity.isBookmarked = !questionUserActivity.isBookmarked;
        },
        submitExam: (state) => {
            state.isExamComplete = true;
            state.examEndTime = Date.now();
        },

        clearExamState: (state) => {
            state.examStartTime = Date.now();
            state.currentQuestionIndex = 0;
            state.currentlySelectedOption = null;
            state.isExamComplete = false;
            state.examEndTime = null;

            // Initialize question status and times
            state.questionOrderIds.forEach((questionId) => {
                state.userQuestionActivity[questionId] = {
                    status: "not-seen",
                    isBookmarked: false,
                    answeredOption: null,
                    timeSpentLog: [],
                };
            });

            // Update first question visited time
            state.userQuestionActivity[state.questionOrderIds[0]] = {
                ...state.userQuestionActivity[state.questionOrderIds[0]],
                status: "seen-only",
                timeSpentLog: [
                    {
                        visitedAt: Date.now(),
                    },
                ],
            };
        },
    },
});

export const {
    setQuestions,
    setCurrentDisplayedQuestionByIndex,
    saveAnswer,
    toggleMarkForReview,
    clearAnswer,
    toggleBookmark,
    clearExamState,
    submitExam,
} = examSlice.actions;
export default examSlice.reducer;
