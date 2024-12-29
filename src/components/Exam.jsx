import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    setQuestions,
    saveAnswer,
    markForReview,
    setCurrentQuestion,
    completeExam,
    clearAnswer,
    toggleBookmark,
    updateQuestionTime,
    clearExamState,
} from "../store/slices/examSlice";
import { fetchQuestions } from "../services/api";
import QuestionNavigation from "./QuestionNavigation";
import classNames from "classnames";
import HelpPanel from "./exam/HelpPanel";
import ExamTimer from "./exam/ExamTimer";
import ConfirmationDialog from "./exam/ConfirmSubmit";
import QuestionTimeProgress from "./exam/QuestionTimeProgressBar";
import ClearExamDialog from "./exam/ResetExamDialog";
import QuestionComponent from "../TestComponent/QuestionUi";

function Exam() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const currentQuestionIndex = useSelector((state) => state.exam.currentQuestionIndex);
    const questions = useSelector((state) => state.exam.questions);
    const examStartTime = useSelector((state) => state.exam.examStartTime);
    const answers = useSelector((state) => state.exam.answers);
    const questionStatus = useSelector((state) => state.exam.questionStatus);
    const bookmarkedQuestions = useSelector((state) => state.exam.bookmarkedQuestions);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const questionTimes = useSelector((state) => state.exam.questionTimes);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
    const averageTimePerQuestion = useSelector((state) => state.exam.averageTimePerQuestion);
    const [currentQuestionTimer, setCurrentQuestionTimer] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [showClearConfirmation, setShowClearConfirmation] = useState(false);

    const currentQuestion = questions[currentQuestionIndex] || null;

    const handleNavigateQuestion = (direction) => {
        const newIndex = currentQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < questions.length) {
            dispatch(setCurrentQuestion(newIndex));
        }
    };

    const handleMarkForReview = () => {
        if (currentQuestion) {
            dispatch(markForReview(currentQuestion.id));
        }
    };

    const handleClearAnswer = () => {
        if (currentQuestion) {
            setSelectedOption(null);
            dispatch(clearAnswer(currentQuestion.id));
        }
    };

    const handleOptionSelect = (index) => {
        if (!currentQuestion) return;

        if (selectedOption === index) {
            setSelectedOption(null);
            dispatch(
                saveAnswer({
                    questionId: currentQuestion.id,
                    answer: null,
                })
            );
        } else {
            setSelectedOption(index);
            dispatch(
                saveAnswer({
                    questionId: currentQuestion.id,
                    answer: index,
                })
            );
        }
    };

    const handleSubmitExam = () => {
        dispatch(completeExam());
        navigate("/results");
    };

    const handleToggleBookmark = () => {
        if (currentQuestion) {
            dispatch(toggleBookmark(currentQuestion.id));
        }
    };

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
            navigate("/login");
            return;
        }

        const loadQuestions = async () => {
            if (!questions || questions.length === 0) {
                try {
                    const data = await fetchQuestions();
                    dispatch(setQuestions(data.questions));
                } catch (error) {
                    console.error("Error loading questions:", error);
                }
            }
        };

        loadQuestions();
    }, [dispatch, isAuthenticated, navigate, questions]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === "INPUT") return;

            switch (e.key) {
                case "ArrowLeft":
                    handleNavigateQuestion(-1);
                    break;
                case "ArrowRight":
                    handleNavigateQuestion(1);
                    break;
                case "r":
                case "R":
                    handleMarkForReview();
                    break;
                case "c":
                case "C":
                    if (
                        questionStatus[currentQuestion?.id] === "answered" ||
                        selectedOption !== null
                    ) {
                        handleClearAnswer();
                    }
                    break;
                default:
                    const num = parseInt(e.key);
                    if (num >= 1 && num <= 4) {
                        handleOptionSelect(num - 1);
                    }
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [currentQuestionIndex, questionStatus, selectedOption]);

    useEffect(() => {
        if (currentQuestion) {
            const savedAnswer = answers[currentQuestion.id];
            setSelectedOption(savedAnswer !== undefined ? savedAnswer : null);
        }
    }, [currentQuestion, answers]);

    useEffect(() => {
        if (!currentQuestion) return;

        const questionId = currentQuestion.id;
        const existingTime = questionTimes[questionId] || 0;
        let startTracking = Date.now();

        const timer = setInterval(() => {
            const elapsed = (Date.now() - startTracking) / 1000;
            const totalTime = existingTime + elapsed;

            dispatch(
                updateQuestionTime({
                    questionId,
                    timeSpent: totalTime,
                })
            );
        }, 100);

        return () => {
            clearInterval(timer);
            const finalElapsed = (Date.now() - startTracking) / 1000;
            dispatch(
                updateQuestionTime({
                    questionId,
                    timeSpent: existingTime + finalElapsed,
                })
            );
        };
    }, [currentQuestionIndex, currentQuestion]);

    useEffect(() => {
        const trackInteraction = () => {
            setLastInteractionTime(Date.now());
        };

        window.addEventListener("mousemove", trackInteraction);
        window.addEventListener("keydown", trackInteraction);
        window.addEventListener("click", trackInteraction);

        return () => {
            window.removeEventListener("mousemove", trackInteraction);
            window.removeEventListener("keydown", trackInteraction);
            window.removeEventListener("click", trackInteraction);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (currentQuestionTimer) {
                clearInterval(currentQuestionTimer);
            }
        };
    }, [currentQuestionTimer]);

    if (!questions.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold">Loading questions...</div>
            </div>
        );
    }

    const unansweredCount = questions.filter(
        (q) => questionStatus[q.id] === "not-attempted" || questionStatus[q.id] === "viewed"
    ).length;

    const isBookmarked = currentQuestion ? bookmarkedQuestions.includes(currentQuestion.id) : false;

    return (
        <div className="min-h-screen max-w-[100vw] bg-gray-50 flex flex-col border border-blue-600 ">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-2 px-3 shadow-lg">
                <div className="max-w-full mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-bold text-white uppercase">Ongoing Exam....</h1>
                    <div className="flex items-center gap-4">
                        {examStartTime && <ExamTimer startTime={examStartTime} timeLimit={3600} />}
                        <button
                            onClick={() => setShowClearConfirmation(true)}
                            className="text-white/90 hover:text-white bg-red-500/40 hover:bg-red-500/70 px-3 py-1.5 rounded"
                        >
                            Restart Exam
                        </button>
                        <button
                            onClick={() => setShowHelp(true)}
                            className="text-white/80 hover:text-white"
                            aria-label="Show help"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col max-w-full">
                <div className="flex-1 flex gap-2 p-2 max-w-full">
                    <div className="max-w-[70%] flex-1 flex rounded shadow-2xl ">
                        <div className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-col border border-gray-300">
                            <div className="mb-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start h-8">
                                        <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Question {currentQuestionIndex + 1} of{" "}
                                            {questions.length}
                                        </h2>
                                        <div className="flex items-center gap-2">
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
                                                            questionStatus[currentQuestion?.id] ===
                                                                "marked-review"
                                                                ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200"
                                                                : "text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600"
                                                        )}
                                                    >
                                                        {questionStatus[currentQuestion?.id] ===
                                                        "marked-review"
                                                            ? "Marked for Review"
                                                            : "Mark for Review"}
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

                            <QuestionComponent question={currentQuestion} handleOptionSelect={handleOptionSelect} selectedOption={selectedOption}/>

                            <div className="mt-4 pt-2 border-t">
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleNavigateQuestion(-1)}
                                        disabled={currentQuestionIndex === 0}
                                        className={classNames(
                                            "px-4 py-1 rounded font-medium transition-all",
                                            "focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                            currentQuestionIndex === 0
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
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
                                            "px-4 py-1 rounded font-medium transition-all",
                                            "focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                            currentQuestionIndex === questions.length - 1
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                                        )}
                                        aria-label="Go to next question"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-[30%] min-w-[30%] flex rounded shadow-2xl">
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
    );
}

export default Exam;
