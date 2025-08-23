import classNames from "classnames";
import OptionsMore from "../../components/QuestionRenderingUI/OptionsMore";
import MatchUi from "../../components/QuestionRenderingUI/MatchUi";

function QuestionResult({ question }) {
    const isMarkedForReview = question.status === "marked-for-review" || question.status === "answered-and-marked-for-review";
    const timeSpent = question.totalSpentTime;
    const isBookmarked = question.isBookmarked;
    const userAnswer = question.userSelectedOption;
    const questionNo = question.questionNo;
    const isCorrect = userAnswer === question.questionData.a;
    const isNotAttempted = userAnswer === undefined || userAnswer === null;

    const questionData = question.questionData;

    // Helper function to format time spent
    const formatTimeSpent = (miliseconds) => {
        const totalMinutes = Math.floor(miliseconds / 60000);
        const totalSeconds = Math.floor((miliseconds % 60000) / 1000);
        const remainingMs = miliseconds % 1000;
        return `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}:${remainingMs.toString().padStart(3, '0')}`;
    };

    return (
        <div
            className={`bg-gray-white rounded shadow-lg p-5 mb-4 transition-all duration-300 ${isCorrect
                ? "border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white"
                : isNotAttempted
                    ? "bg-gradient-to-r from-gray-50 to-white border-l-4 border-[#d1d5db]"
                    : "border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white"
                } hover:shadow-xl`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-lg text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                        Question : {questionNo}
                    </span>

                    {/* Mark for Review Status */}
                    {isMarkedForReview && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full border border-yellow-300">
                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Marked for Review
                        </span>
                    )}

                    {/* Bookmark Status */}
                    {isBookmarked && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-300">
                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                            Bookmarked
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Time Spent */}
                    {
                        timeSpent > 0 && (
                            <div className="flex items-center gap-1 text-gray-600 text-sm relative group">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{formatTimeSpent(timeSpent)}</span>
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                    <span>minutes : seconds : miliseconds</span>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                                </div>
                            </div>
                        )
                    }
                    {/* Answer Status */}
                    <span
                        className={classNames(
                            "px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300",
                            isNotAttempted
                                ? "bg-blue-100 text-blue-800"
                                : isCorrect
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                        )}
                    >
                        {isNotAttempted ? "Not Attempted" : isCorrect ? "Correct" : "Incorrect"}
                    </span>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-300">
                {questionData.parts.map((part, partIndex) => {
                    if (typeof part === "string") {
                        return (
                            <p key={partIndex} className="my-1 text-lg leading-tight text-slate-900 font-medium">{part}</p>
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
            </div>

            <div className="space-y-2 my-3">
                {questionData.o.map((choice, optionIndex) => (
                    <div
                        key={optionIndex}
                        className={classNames(
                            "p-3 border rounded-md transition-colors",
                            optionIndex === questionData.a && "bg-green-50 border-green-500",
                            !isNotAttempted &&
                            optionIndex === userAnswer &&
                            optionIndex !== questionData.a &&
                            "bg-red-50 border-red-500",
                            optionIndex !== questionData.a &&
                            optionIndex !== userAnswer &&
                            "border-gray-300 hover:border-gray-400",
                            isNotAttempted && optionIndex === questionData.a && "border-green-500 shadow-md"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className={classNames(
                                    "text-sm",
                                    optionIndex === questionData.a
                                        ? "text-green-700 font-medium"
                                        : !isNotAttempted && optionIndex === userAnswer
                                            ? "text-red-700"
                                            : "text-gray-800"
                                )}
                            >
                                {choice}

                            </div>
                            <div className="mr-2 flex items-center gap-2">
                                {isNotAttempted && optionIndex === questionData.a && (
                                    <span className="ml-2 text-green-600 text-xs font-medium">Correct Answer</span>
                                )}
                                {optionIndex === questionData.a && (
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
                                {!isNotAttempted && optionIndex === userAnswer && optionIndex !== questionData.a && (
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

export default QuestionResult; 
