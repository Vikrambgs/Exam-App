import classNames from "classnames";
import MatchUi from "../../components/QuestionRenderingUI/MatchUi";
import OptionsMore from "../../components/QuestionRenderingUI/OptionsMore";
import { saveAnswer, clearAnswer } from "../../store/slices/examSlice";
import { getCurrentQuestionAllData } from "../../store/selectors/examSelector";
import { useDispatch, useSelector } from "react-redux";

const QuestionComponent = () => {
    const currQuestionData = useSelector(getCurrentQuestionAllData)
    const {
        index: currQuestionIndex,
        answeredOption: savedAnswer,
        ...currentQuestion
    } = currQuestionData || {};

    const dispatch = useDispatch();


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
            <div className="flex-1 overflow-y-auto pb-5 pr-4 bg-slate-900 custom-scrollbar">
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
