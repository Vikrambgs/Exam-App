import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    setQuestions,
    saveAnswer,
    markForReview,
    clearAnswer,
} from "../store/slices/examSlice";
import { fetchQuestions } from "../services/api";
import classNames from "classnames";
import QuestionNavigation from "./QuestionNavigation";
import QuestionComponent from "../TestComponent/QuestionUi";
import NavBar from "./exam/NavBar";
import ExamProgressBar from "./exam/ExamProgressBar";
import NavigateWithSubmit from "./exam/NavigateWithSubmit";
import QuestionTimeProgress from "./exam/QuestionTimeProgressBar";

function Exam() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const timeLimitInSec = 3600;


    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const currentQuestionIndex = useSelector((state) => state.exam.currentQuestionIndex);
    const questions = useSelector((state) => state.exam.questions);
    const examStartTime = useSelector((state) => state.exam.examStartTime);
    const questionStatus = useSelector((state) => state.exam.questionStatus);
    const answers = useSelector((state) => state.exam.answers);
    const averageTimePerQuestion = useSelector((state) => state.exam.averageTimePerQuestion);
    const currentQuestion = questions[currentQuestionIndex] || null;

    console.log("Rendering Main Exam Component with question :- \n", questionStatus);

    
    
    const [selectedOption, setSelectedOption] = useState(answers[currentQuestion?.id] || null);


    const handleMarkForReview = () => {
        if (currentQuestion) {
            dispatch(markForReview(currentQuestion.id));
        }
    };

    const handleClearAnswer = () => {
        if (currentQuestion) {
            dispatch(clearAnswer(currentQuestion.id));
        }
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
                    dispatch(setQuestions(data));
                } catch (error) {
                    console.error("Error loading questions:", error);
                }
            }
        };

        loadQuestions();
    }, [isAuthenticated, navigate]);

    

    if (!questions.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold">Loading questions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-[100vw] bg-gray-50 flex flex-col">
            <NavBar />
            <ExamProgressBar startTime={examStartTime} timeLimitSec={timeLimitInSec} />

            <div className="flex-1 flex gap-2 p-2 max-w-full">
                <div className="max-w-[70%] flex-1 flex rounded shadow-2xl ">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-col border border-gray-300">
                        <div className="mb-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-start h-8">
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Question {currentQuestionIndex + 1} of {questions.length}
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
                                            <button
                                                onClick={handleMarkForReview}
                                                className={classNames(
                                                    "px-3 py-1 text-sm font-medium rounded-full transition-all",
                                                    questionStatus[currentQuestion?.id] ===
                                                        "marked-review" ||
                                                        questionStatus[currentQuestion?.id] ===
                                                            "answered-marked-review"
                                                        ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200"
                                                        : "text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600"
                                                )}
                                            >
                                                {questionStatus[currentQuestion?.id] ===
                                                    "marked-review" ||
                                                questionStatus[currentQuestion?.id] ===
                                                    "answered-marked-review"
                                                    ? "Marked for Review"
                                                    : "Mark for Review"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <QuestionTimeProgress
                                        averageTime={averageTimePerQuestion}
                                    />
                                </div>
                            </div>
                        </div>

                        <QuestionComponent />
                        <NavigateWithSubmit />
                    </div>
                </div>

                <div className="w-[30%] min-w-[30%] flex rounded shadow-2xl">
                    <QuestionNavigation />
                </div>
            </div>
        </div>
    );
}

export default Exam;
