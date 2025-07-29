import { useSelector, useDispatch } from "react-redux";
import { setCurrentDisplayedQuestionByIndex, } from "../../store/slices/examSlice";
import { getQuestionInteractionStatus, getAllQuestionStatus, getCurrentQuestionIndex } from "../../store/selectors/examSelector";
import classNames from "classnames";

const statusColors = {
    "not-seen": "bg-gray-700 hover:bg-gray-600 text-gray-200",
    "seen-only": "bg-yellow-500 hover:bg-yellow-300 text-yellow-900",
    answered: "bg-green-400 hover:bg-green-300 text-green-900",
    "answered-and-marked-for-review": "bg-green-400 hover:bg-green-300 text-green-900",
    "marked-for-review": "bg-yellow-400 hover:bg-yellow-300 text-yellow-900",
};

function QuestionNavigation() {
    const dispatch = useDispatch();
    const currentIndex = useSelector(getCurrentQuestionIndex);
    const statusCounts = useSelector(getQuestionInteractionStatus);
    const allStatus = useSelector(getAllQuestionStatus)

    return (
        <div className="bg-slate-900 rounded-lg p-4 w-full flex flex-col h-full border border-gray-800">
            <h3 className="font-semibold text-gray-300 text-lg text-center uppercase tracking-wide pb-2.5 mb-2">
                Questions Status
            </h3>
            <div className="flex flex-wrap mb-4 gap-2 justify-center">
                {allStatus.map((status, index) => (
                    <button
                        key={index}
                        onClick={() => dispatch(setCurrentDisplayedQuestionByIndex(index))}
                        className={classNames(
                            "w-[10%] aspect-square rounded flex items-center justify-center text-xs font-medium transition-all duration-200 bg-gray-400 relative",
                            statusColors[status],

                            currentIndex === index
                                ? "ring-2 ring-indigo-100 transform scale-105"
                                : ""
                        )}
                    >
                        {String(index + 1).padStart(2, "0")}
                        {(status === "marked-for-review" ||
                            status === "answered-and-marked-for-review") && (
                                <span className="absolute w-4/5 h-4/5 border-2 border-purple-600 rounded-full"></span>
                            )}
                    </button>
                ))}
            </div>

            <div className="space-y-2 mt-auto pt-2">
                <div className="flex items-center justify-between px-1.5">
                    <div className="flex items-center">
                        <div
                            className={classNames(
                                "w-3 h-3 rounded-full mr-2",
                                statusColors["not-seen"]
                            )}
                        />
                        <span className="text-gray-300 text-sm">Not Viewed</span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                        {statusCounts["not-seen"]}
                    </span>
                </div>
                <div className="flex items-center justify-between px-1.5">
                    <div className="flex items-center">
                        <div
                            className={classNames(
                                "w-3 h-3 rounded-full mr-2",
                                statusColors["seen-only"]
                            )}
                        />
                        <span className="text-gray-300 text-sm">Unattempted</span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                        {statusCounts["seen-only"]}
                    </span>
                </div>
                <div className="flex items-center justify-between px-1.5">
                    <div className="flex items-center">
                        <div
                            className={classNames(
                                "w-3 h-3 rounded-full mr-2",
                                statusColors["answered"]
                            )}
                        />
                        <span className="text-gray-300 text-sm">Answered</span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                        {statusCounts["answered"] + statusCounts["answered-and-marked-for-review"]}
                    </span>
                </div>
                <div className="flex items-center justify-between px-1.5">
                    <div className="flex items-center">
                        <div
                            className={classNames(
                                "w-3 h-3 rounded-full mr-2 bg-purple-500"
                            )}
                        />
                        <span className="text-gray-300 text-sm">Marked for Review</span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                        {statusCounts["marked-for-review"] + statusCounts["answered-and-marked-for-review"]}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default QuestionNavigation;
