import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import classNames from "classnames";
import OptionsMore from "../TestComponent/OptionsMore";
import MatchUi from "../TestComponent/MatchUi";
import MinimalQuizResult from "./Result/ResultDashboard";

function ResultCard({ title, value, description, className }) {
    return (
        <div className={classNames("bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl shadow-lg p-6", className)}>
            <h3 className="text-sm font-medium text-white uppercase">{title}</h3>
            <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-white">{value}</p>
                {description && <p className="ml-2 text-sm text-gray-200">{description}</p>}
            </div>
        </div>
    );
}

function QuestionResult({ question, userAnswer, index, timeSpent, averageTime }) {
    const isCorrect = userAnswer === question.a;
    const isNotAttempted = userAnswer === undefined || userAnswer === null;

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-lg p-4 mb-4 transition-all duration-300 ${
                isCorrect
                    ? "border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                    : isNotAttempted
                    ? "bg-gradient-to-r from-gray-50 to-gray-100"
                    : "border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-red-100"
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-lg text-gray-800">Ques. {index + 1}</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Time: {formatTime(timeSpent)}</span>
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={classNames(
                                        "h-full",
                                        timeSpent > averageTime ? "bg-red-500" : "bg-blue-500"
                                    )}
                                    style={{
                                        width: `${Math.min((timeSpent / averageTime) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">
                                (Avg: {formatTime(averageTime)})
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isNotAttempted && (
                        <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    )}
                    <span
                        className={classNames(
                            "px-4 py-2 rounded-full text-sm font-medium",
                            isNotAttempted
                                ? "bg-gray-200 text-gray-800"
                                : isCorrect
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                        )}
                    >
                        {isNotAttempted ? "Not Attempted" : isCorrect ? "Correct" : "Incorrect"}
                    </span>
                </div>
            </div>

            {question.parts.map((part, partIndex) => {
                if (typeof part === "string") {
                    return (
                        <p key={partIndex} className="my-1 text-lg  leading-tight text-slate-900">{part}</p>
                    );
                } else if (typeof part === "object") {
                    if (part.pre_o) {
                        return (
                            <div key={partIndex} className="mt-3">
                                <OptionsMore key={partIndex} options={part.pre_o} />
                            </div>
                        );
                    } else if (part.match) {
                        return (
                            <div key={partIndex}>
                                <MatchUi key={partIndex} match={part.match} />
                            </div>
                        );
                    }
                }
            })}

            <div className="space-y-2 my-3">
                {question.o.map((choice, optionIndex) => (
                    <div
                        key={optionIndex}
                        className={classNames(
                            "p-3 border rounded transition-colors",
                            optionIndex === question.a && "bg-green-100 border-green-500",
                            !isNotAttempted &&
                                optionIndex === userAnswer &&
                                optionIndex !== question.a &&
                                "bg-red-100 border-red-500",
                            optionIndex !== question.a &&
                                optionIndex !== userAnswer &&
                                "border-gray-300",
                            isNotAttempted && optionIndex === question.a && "border-green-500 shadow-lg"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className={classNames(
                                    "text-sm",
                                    optionIndex === question.a
                                        ? "text-green-700 font-medium"
                                        : !isNotAttempted && optionIndex === userAnswer
                                        ? "text-red-700"
                                        : "text-gray-800"
                                )}
                            >
                                {choice}
                                
                            </div>
                            <div className="mr-2 flex items-center gap-2">
                            {isNotAttempted && optionIndex === question.a && (
                                <span className="ml-2 text-green-600 text-xs">Correct Answer</span>
                                )}
                                {optionIndex === question.a && (
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                                {!isNotAttempted && optionIndex === userAnswer && optionIndex !== question.a && (
                                    <svg
                                        className="w-5 h-5 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )}
                            </div>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Results() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { questions, answers, questionStatus, examStartTime, examEndTime } = useSelector(
        (state) => state.exam
    );
    const questionTimes = useSelector((state) => state.exam.questionTimes);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'correct', 'incorrect', 'unattempted'
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!questions.length || !examEndTime) {
        navigate("/exam");
        return null;
    }



    const totalExamTime = 3600; // 1 hour in seconds
    const averageTimePerQuestion = Math.floor(totalExamTime / questions.length);

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.parts.some(part => 
            typeof part === 'string' && part.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        const isUnattempted = !answers.hasOwnProperty(question.id);
        const isCorrect = answers[question.id] === question.a;
        const isIncorrect = !isUnattempted && !isCorrect;

        const matchesFilter = 
            filterStatus === 'all' || 
            (filterStatus === 'correct' && isCorrect) ||
            (filterStatus === 'incorrect' && isIncorrect) ||
            (filterStatus === 'unattempted' && isUnattempted);
        
        return matchesSearch && matchesFilter;
    });


    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-4">
            <div className="max-w-7xl mx-auto px-4">

                <MinimalQuizResult />
                

                {/* Filter Controls */}
                <div className="bg-white rounded-xl shadow-xl p-6 my-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by keyword"
                                className="w-full border border-gray-800 rounded p-2"
                            />
                        </div>
                        <div className="w-1/4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full border border-gray-800 rounded p-2"
                            >
                                <option value="all">All</option>
                                <option value="correct">Correct</option>
                                <option value="incorrect">Incorrect</option>
                                <option value="unattempted">Unattempted</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filtered Results */}
                <div className="space-y-4">
                    {filteredQuestions.map((question, index) => (
                        <QuestionResult
                            key={question.id}
                            question={question}
                            userAnswer={answers[question.id]}
                            index={index}
                            timeSpent={questionTimes[question.id]}
                            averageTime={averageTimePerQuestion}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Results;
