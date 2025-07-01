import classNames from "classnames";
import OptionsMore from "../../components/QuestionRenderingUI/OptionsMore";
import MatchUi from "../../components/QuestionRenderingUI/MatchUi";

function QuestionResult({ question, userAnswer, index }) {


    const isCorrect = userAnswer === question.a;
    const isNotAttempted = userAnswer === undefined || userAnswer === null;

    return (
        <div
            className={`bg-gray-white rounded shadow-lg p-5 mb-4 transition-all duration-300 ${isCorrect
                ? "border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white"
                : isNotAttempted
                    ? "bg-gradient-to-r from-gray-50 to-white border-l-4 border-blue-400"
                    : "border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white"
                } hover:shadow-xl`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-lg text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                        Question {index + 1}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isNotAttempted && (
                        <svg
                            className="w-5 h-5 text-blue-500"
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
                                ? "bg-blue-100 text-blue-800"
                                : isCorrect
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                        )}
                    >
                        {isNotAttempted ? "Not Attempted" : isCorrect ? "Correct" : "Incorrect"}
                    </span>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                {question.parts.map((part, partIndex) => {
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
                {question.o.map((choice, optionIndex) => (
                    <div
                        key={optionIndex}
                        className={classNames(
                            "p-3 border rounded-md transition-colors",
                            optionIndex === question.a && "bg-green-50 border-green-500",
                            !isNotAttempted &&
                            optionIndex === userAnswer &&
                            optionIndex !== question.a &&
                            "bg-red-50 border-red-500",
                            optionIndex !== question.a &&
                            optionIndex !== userAnswer &&
                            "border-gray-300 hover:border-gray-400",
                            isNotAttempted && optionIndex === question.a && "border-green-500 shadow-md"
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
                                    <span className="ml-2 text-green-600 text-xs font-medium">Correct Answer</span>
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

export default QuestionResult; 
