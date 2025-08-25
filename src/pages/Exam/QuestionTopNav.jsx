import { ArrowLeft, ArrowRight, Bookmark, Crosshair, OctagonX } from "lucide-react";
import QuestionTimeProgress from "./QuestionTimeProgressBar";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentDisplayedQuestionByIndex, clearAnswer, toggleMarkForReview } from "../../store/slices/examSlice";
import { getAllQuestionsCount, getCurrentQuestionAllData } from "../../store/selectors/examSelector";
import classNames from "classnames";

export default function QuestionTopNav() {
    const dispatch = useDispatch();
    const allQuestionCount = useSelector(getAllQuestionsCount);
    const currQuestionData = useSelector(getCurrentQuestionAllData);

    const {
        index: currQuestionIndex,
        status: questionStatus,
        // isBookmarked,
        answeredOption: savedAnswer
    } = currQuestionData || {};

    const handleNavigateQuestion = (direction) => {
        const newIndex = currQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < allQuestionCount) {
            dispatch(setCurrentDisplayedQuestionByIndex(newIndex));

        }
    }

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




    return (
        <div className="mb-2">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start h-8">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Question {currQuestionIndex + 1} of {allQuestionCount}
                    </h2>

                    <div className="flex items-center gap-2">

                        {savedAnswer !== null && savedAnswer !== undefined && (
                            <button
                                onClick={handleClearAnswer}
                                className="p-1.5 bg-red-800 border rounded border-red-700 text-white"
                                title="Clear Answer"
                            >
                                <OctagonX strokeWidth={1} size={20} />
                            </button>
                        )}
                        <button
                            className="p-1.5 bg-gray-800 border rounded border-gray-700 text-white"
                            title="Save Question"
                        >
                            <Bookmark strokeWidth={1} size={20} />
                        </button>

                        <button
                            onClick={handleMarkForReview}
                            title="Mark for Review"
                            className={classNames(
                                "p-1.5 bg-gray-800 border rounded border-gray-700 text-gray-100",
                                questionStatus ===
                                    "marked-for-review" ||
                                    questionStatus ===
                                    "answered-and-marked-for-review"
                                    ? " bg-purple-900 text-blue-400"
                                    : ""
                            )}
                        >

                            <Crosshair strokeWidth={1} size={20} />
                        </button>
                        <div className="flex gap-2 ml-5">
                            <button className="p-1.5 bg-gray-800 border rounded border-gray-700 active:bg-green-800 text-white flex items-center"
                                title="Previous Question"
                                onClick={() => handleNavigateQuestion(-1)}>
                                <ArrowLeft strokeWidth={1} size={20} />
                                <p className="text-sm pl-1">Prev</p>
                            </button>
                            <button className="p-1.5 bg-gray-800 border rounded border-gray-700 text-white active:bg-green-800 flex items-center"
                                title="Next Question"
                                onClick={() => handleNavigateQuestion(1)}>
                                <p className="text-sm pr-1">Next</p>
                                <ArrowRight strokeWidth={1} size={20} />
                            </button>
                        </div>
                    </div>

                </div>
                <div className="w-full">
                    <QuestionTimeProgress />
                </div>
            </div>
        </div>
    )
}
