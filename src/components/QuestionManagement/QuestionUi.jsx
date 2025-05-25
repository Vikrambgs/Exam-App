import classNames from "classnames";
import MatchUi from "./MatchUi";
import OptionsMore from "./OptionsMore";
import { saveAnswer, markForReview, clearAnswer } from "../../store/slices/examSlice";
import { useDispatch, useSelector } from "react-redux";
import QuestionTimeProgress from "../exam/QuestionTimeProgressBar"

const QuestionComponent = () => {
    const currQuestionIndex = useSelector((state) => state.exam.currentQuestionIndex);
    const currentQuestion = useSelector((state) => state.exam.questions[currQuestionIndex]);
    const savedAnswer = useSelector((state) => state.exam.answers[currentQuestion?.id]);
    const questionStatus = useSelector((state) => state.exam.questionStatus);
    const questions = useSelector((state) => state.exam.questions);
    const averageTimePerQuestion = useSelector((state) => state.exam.averageTimePerQuestion);

    const dispatch = useDispatch();

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

    const handleOptionSelect = (index) => {
        if (!currentQuestion || !Number.isInteger(index)) return;

        dispatch(
            saveAnswer({
                questionId: currentQuestion.id,
                answer: index,
            })
        );
    };

    return (
        <>
            <div className="mb-2">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start h-8">
                        <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            Question {currQuestionIndex + 1} of {questions.length}
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-2">
                                {savedAnswer !== null && savedAnswer !== undefined && (
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
                                        questionStatus[currentQuestion?.id] === "marked-review" ||
                                            questionStatus[currentQuestion?.id] ===
                                                "answered-marked-review"
                                            ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200"
                                            : "text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600"
                                    )}
                                >
                                    {questionStatus[currentQuestion?.id] === "marked-review"
                                        ? "Marked for Review"
                                        : "Mark for Review"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <QuestionTimeProgress averageTime={averageTimePerQuestion} />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-5">
                {currentQuestion.parts.map((part, index) => {
                    if (typeof part == "object") {
                        if (part.pre_o) {
                            return <OptionsMore key={index} options={part.pre_o} />;
                        } else if (part.match) {
                            return <MatchUi key={index} match={part.match} />;
                        }
                    } else {
                        return (
                            <div
                                key={index}
                                className="text-gray-200 leading-[1.15] py-1 text-[1.1rem]"
                            >
                                {part}
                            </div>
                        );
                    }
                })}

                <div className="space-y-2 mt-3">
                    {currentQuestion.o.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            role="radio"
                            aria-checked={savedAnswer === index}
                            tabIndex={0}
                            className={classNames(
                                "p-2 py-2 border text-white border-gray-600 rounded cursor-pointer transition-all",
                                "focus:outline-none focus:ring-1 focus:ring-green-500",
                                savedAnswer === index
                                    ? "bg-gray-600 text-green-700"
                                    : "hover:bg-gray-600 hover:border-gray-500 text-gray-900 border-gray-200 font-medium"
                            )}
                        >
                            <div className="flex items-center">
                                <div
                                    className={classNames(
                                        "w-5 h-5 rounded-full border mr-2 flex items-center justify-center relative",
                                        savedAnswer === index
                                            ? "border-green-500 bg-indigo-500 border-2"
                                            : "border-gray-400"
                                    )}
                                >
                                    {savedAnswer === index && (
                                        <svg
                                            className="w-4 h-4 text-green-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="3"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm font-medium">{option}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default QuestionComponent;
