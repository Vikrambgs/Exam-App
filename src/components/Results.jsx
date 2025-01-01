import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import classNames from "classnames";
import OptionsMore from "../TestComponent/OptionsMore";
import MatchUi from "../TestComponent/MatchUi";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function ResultCard({ title, value, description, className }) {
    return (
        <div className={classNames("bg-white rounded-lg shadow-lg p-4", className)}>
            <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
            <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">{value}</p>
                {description && <p className="ml-2 text-sm text-gray-500">{description}</p>}
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
            className={`bg-white rounded-lg shadow p-4 mb-4 ${
                isCorrect
                    ? "border border-green-400 shadow-[inset_0_0_8px_rgba(34,197,94,0.3)]"
                    : isNotAttempted
                    ? ""
                    : "border border-red-400 shadow-[inset_0_0_8px_rgba(220,38,38,0.3)]"
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <span className="font-semibold">Ques. {index + 1}</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Time: {formatTime(timeSpent)}</span>
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
                            "px-2 py-1 rounded-full text-sm font-medium",
                            isNotAttempted
                                ? "bg-gray-200 text-gray-800"
                                : isCorrect
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        )}
                    >
                        {isNotAttempted ? "Not Attempted" : isCorrect ? "Correct" : "Incorrect"}
                    </span>
                </div>
            </div>


            {question.parts.map((part, partIndex) => {
                if (typeof part === "string") {
                    return (
                        <p key={partIndex} className="my-1 text-slate-900">
                            {part}
                        </p>
                    );
                } else if (typeof part === "object") {
                    if (part.pre_o) {
                        return (
                            <div key={partIndex}>
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

            <div className="space-y-2">
                {question.o.map((choice, optionIndex) => (
                    <div
                        key={optionIndex}
                        className={classNames(
                            "p-3 border rounded transition-colors",
                            optionIndex === question.a &&
                                "bg-green-50 border-green-500",
                            !isNotAttempted &&
                                optionIndex === userAnswer &&
                                optionIndex !== question.a &&
                                "bg-red-50 border-red-500",
                            optionIndex !== question.a &&
                                optionIndex !== userAnswer &&
                                "border-gray-200",
                            isNotAttempted &&
                                optionIndex === question.a &&
                                "border-green-500 shadow-sm"
                        )}
                    >
                        <div className="flex items-center">
                            <div className="mr-2">
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
                                {!isNotAttempted &&
                                    optionIndex === userAnswer &&
                                    optionIndex !== question.a && (
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
                            <span
                                className={classNames(
                                    "text-sm",
                                    optionIndex === question.a
                                        ? "text-green-700 font-medium"
                                        : !isNotAttempted && optionIndex === userAnswer
                                        ? "text-red-700"
                                        : "text-gray-700"
                                )}
                            >
                                {choice}
                                {isNotAttempted && optionIndex === question.a && (
                                    <span className="ml-2 text-green-600 text-xs">
                                        (Correct Answer)
                                    </span>
                                )}
                            </span>
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

    // Calculate statistics
    const totalQuestions = questions.length;
    const attemptedQuestions = Object.keys(answers).length;
    const correctAnswers = questions.filter((q) => answers[q.id] === q.a).length;
    const incorrectAnswers = attemptedQuestions - correctAnswers;
    const score = (correctAnswers / totalQuestions) * 100;
    const timeTaken = Math.floor((examEndTime - examStartTime) / 1000); // in seconds
    const hours = Math.floor(timeTaken / 3600);
    const minutes = Math.floor((timeTaken % 3600) / 60);
    const seconds = timeTaken % 60;
    const timeString = `${hours}h ${minutes}m ${seconds}s`;

    const markedForReview = Object.values(questionStatus).filter(
        (status) => status === "marked-review"
    ).length;

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

    // Create a mapping of filtered questions to their original indices
    const questionIndices = questions.reduce((acc, question, index) => {
        acc[question.id] = index + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 py-4">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Exam Results</h1>
                    <p className="text-gray-600 text-center">Here's how you performed in your exam</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <ResultCard
                        title="Total Score"
                        value={`${score.toFixed(1)}%`}
                        className={classNames(
                            score >= 70 ? "bg-green-50" : score >= 50 ? "bg-yellow-50" : "bg-red-50"
                        )}
                    />
                    <ResultCard title="Time Taken" value={timeString} />
                    <ResultCard
                        title="Questions"
                        value={`${attemptedQuestions}/${totalQuestions}`}
                        description="attempted"
                    />
                    <ResultCard
                        title="Accuracy"
                        value={`${((correctAnswers / attemptedQuestions) * 100).toFixed(1)}%`}
                        description="of attempted questions"
                    />
                </div>

                {/* Detailed Statistics */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {correctAnswers}
                            </div>
                            <div className="text-sm text-gray-500">Correct</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {incorrectAnswers}
                            </div>
                            <div className="text-sm text-gray-500">Incorrect</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">
                                {totalQuestions - attemptedQuestions}
                            </div>
                            <div className="text-sm text-gray-500">Unattempted</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {markedForReview}
                            </div>
                            <div className="text-sm text-gray-500">Marked for Review</div>
                        </div>
                    </div>
                </div>

                {/* Add Filter Controls */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Questions
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search question content..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="md:w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Questions</option>
                                <option value="correct">Correct Answers</option>
                                <option value="incorrect">Incorrect Answers</option>
                                <option value="unattempted">Unattempted</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Update Question-wise Analysis section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Question-wise Analysis</h2>
                        <div className="text-sm text-gray-500">
                            Showing {filteredQuestions.length} of {questions.length} questions
                        </div>
                    </div>

                    {filteredQuestions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                            <p className="text-gray-500">No questions match your search criteria</p>
                        </div>
                    ) : (
                        filteredQuestions.map((question) => (
                            <QuestionResult
                                key={question.id}
                                question={question}
                                userAnswer={answers[question.id]}
                                index={questionIndices[question.id] - 1} // Use original question number
                                timeSpent={questionTimes[question.id] || 0}
                                averageTime={averageTimePerQuestion}
                            />
                        ))
                    )}
                </div>

                {/* Update Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Results
                    </button>
                    <button
                        onClick={() => navigate("/upload-questions")}
                        className="flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Take Another Exam
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Results;
