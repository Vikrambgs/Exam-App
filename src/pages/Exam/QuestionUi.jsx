import classNames from "classnames";
import MatchUi from "../../components/QuestionRenderingUI/MatchUi";
import OptionsMore from "../../components/QuestionRenderingUI/OptionsMore";
import { saveAnswer, clearAnswer, toggleMarkForReview } from "../../store/slices/examSlice";
import { getCurrentQuestionAllData, getAllQuestionsCount } from "../../store/selectors/examSelector";
import { useDispatch, useSelector } from "react-redux";

// import QuestionTimeProgress from "./QuestionTimeProgressBar";

const QuestionComponent = () => {
    const currQuestionData = useSelector(getCurrentQuestionAllData)
    const totalQuestionCount = useSelector(getAllQuestionsCount);
    const {
        index: currQuestionIndex,
        status: questionStatus,
        isBookmarked,
        answeredOption: savedAnswer,
        ...currentQuestion
    } = currQuestionData || {};

    const dispatch = useDispatch();


    const handleMarkForReview = () => {
        if (currQuestionData) {
            dispatch(toggleMarkForReview(currQuestionIndex));
        }
    };

    const handleClearAnswer = () => {
        if (currQuestionData) {
            dispatch(clearAnswer(currQuestionIndex));
        }
    };

    const handleOptionSelect = (index) => {
        if (!currQuestionData || !Number.isInteger(index)) return;

        if (currQuestionData.answeredOption == index) {
            // If the answer is already selected, clear it
            dispatch(clearAnswer(currQuestionIndex));
        } else {
            // If a different answer is selected, save it
            dispatch(
                saveAnswer({
                    questionIndex: currQuestionIndex,
                    answerIndex: index,
                })
            );
        }
    };

    return (
        <>
            <div className="mb-2 bg-slate-900">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start h-8">
                        <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            Question {currQuestionIndex + 1} of {totalQuestionCount}
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
                                        questionStatus ===
                                            "marked-for-review" ||
                                            questionStatus ===
                                            "answered-and-marked-for-review"
                                            ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200"
                                            : "text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600"
                                    )}
                                >
                                    {questionStatus ===
                                        "marked-for-review" ||
                                        questionStatus ===
                                        "answered-and-marked-for-review"
                                        ? "Marked for Review"
                                        : "Mark for Review"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        {/* <QuestionTimeProgress averageTime={averageTimePerQuestion} /> */}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-5 bg-slate-900">
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

                <div
                    className={classNames(
                        "grid gap-2 mt-3",
                        currentQuestion.o.length <= 4
                            ? "grid-cols-1 sm:grid-cols-1"
                            : "grid-cols-1"
                    )}
                >
                    {currentQuestion.o.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            role="radio"
                            aria-checked={savedAnswer === index}
                            tabIndex={0}
                            className={classNames(
                                "p-2 py-2 border text-white border-gray-600 rounded cursor-pointer transition-all duration-300 ring-1 ring-transparent ring-inset",
                                "focus:outline-none focus:ring-green-600",
                                savedAnswer === index
                                    ? "bg-gray-700 text-green-700"
                                    : "hover:bg-gray-600 text-gray-900 border-gray-200 font-medium",
                                "flex items-center" // ensures inner layout is always consistent
                            )}
                        >
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
                    ))}
                </div>
            </div>
        </>
    );
};

export default QuestionComponent;
