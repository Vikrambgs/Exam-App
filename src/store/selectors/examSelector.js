import {createSelector} from "reselect";

export const getCurrentQuestionAllData = createSelector(
    [
        (state) => state.exam.questionOrderIds,
        (state) => state.exam.currentQuestionIndex,
        (state) => state.exam.examQuestions,
        (state) => state.exam.userQuestionActivity,
    ],
    (
        questionOrderIds,
        currentQuestionIndex,
        examQuestions,
        userQuestionActivity
    ) => {
        const questionId = questionOrderIds[currentQuestionIndex];
        const {_, ...questionData} = examQuestions.find((q) => q.id === questionId);
        const activity = userQuestionActivity[questionId];

        return {
            index: currentQuestionIndex,
            status: activity.status,
            isBookmarked: activity.isBookmarked,
            answeredOption: activity.answeredOption,
            ...questionData,
        };
    }
);

export const getAllQuestionStatus = createSelector(
    [
        (state) => state.exam.userQuestionActivity,
        (state) => state.exam.questionOrderIds,
    ],
    (activity, questionOrderIds) => {
        return questionOrderIds.map((questionId) => activity[questionId]?.status);
    }
);

// "seen-only", "not-seen", "answered", "marked-for-review", "answered-and-marked-for-review"
export const getQuestionInteractionStatus = createSelector(
    [(state) => state.exam.userQuestionActivity],
    (userQuestionActivity) => {
        const allStatus = {
            "seen-only": 0,
            "not-seen": 0,
            answered: 0,
            "marked-for-review": 0,
            "answered-and-marked-for-review": 0,
        };

        for (const questionId in userQuestionActivity) {
            allStatus[userQuestionActivity[questionId].status] += 1;
        }

        return allStatus;
    }
);

export const getCurrentQuestionTimeSpent = createSelector(
    [
        (state) => state.exam.userQuestionActivity,
        (state) => state.exam.questionOrderIds,
        (state) => state.exam.currentQuestionIndex,
    ],
    (userQuestionActivity, questionOrderIds, questionIndex) => {
        const questionId = questionOrderIds[questionIndex];
        const activity = userQuestionActivity[questionId];
        return activity.timeSpentLog.reduce(
            (total, log) => total + (log.movedAt ? log.movedAt - log.visitedAt : 0),
            0
        );
    }
);

export const getExamStartTime = (state) => state.exam.examStartTime;

export const getExamEndTime = (state) => state.exam.examEndTime;

export const getAverageTimePerQuestion = (state) => {
    const totalQuestion = state.exam.examQuestions.length;
    return state.exam.totalExamTime / totalQuestion;
};

export const getExamTimeLimit = (state) => state.exam.totalExamTime;

export const getCurrentQuestionIndex = (state) => state.exam.currentQuestionIndex;

export const getAllQuestionsCount = (state) => state.exam.examQuestions.length;

export const getAllQuestionsData = createSelector(
    [
        (state) => state.exam.questionOrderIds,
        (state) => state.exam.userQuestionActivity,
        (state) => state.exam.examQuestions,
    ],
    (orderedIds, userQuestionActivity, examQuestions) => {
        return orderedIds.map((questionId, idx) => {
            const activity = userQuestionActivity[questionId];
            const question = examQuestions.find((q) => q.id === questionId);

            // calculate total spent time : activity.timeSpentLog is an array of object each object has a visitedAt and movedAt on some question there is no any object inside timeSpentLog
            const totalSpentTime = activity.timeSpentLog.reduce(
                (total, log) => total + (log.movedAt - log.visitedAt),
                0
            );

            return {
                questionNo: idx + 1,
                questionId,
                status: activity?.status,
                isBookmarked: activity?.isBookmarked,
                userSelectedOption: activity?.answeredOption,
                questionData: question ? {...question} : null,
                totalSpentTime: totalSpentTime,
            };
        });
    }
);
