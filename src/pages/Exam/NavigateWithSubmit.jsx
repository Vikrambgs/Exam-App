import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentQuestion, completeExam } from "../../store/slices/examSlice";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import ConfirmationDialog from "./ConfirmSubmit";

function NavigateWithSubmit() {
    const currentQuestionIndex = useSelector((state) => state.exam.currentQuestionIndex ?? 0);
    const allQuestionCount = useSelector((state) => state.exam.questions?.length ?? 0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showSubmitConfirmation, setshowSubmitConfirmation] = useState(false);

    const handleNavigateQuestion = useCallback(
        (direction) => {
            const newIndex = currentQuestionIndex + direction;
            if (newIndex >= 0 && newIndex < allQuestionCount) {
                dispatch(setCurrentQuestion(newIndex));
            }
        },
        [currentQuestionIndex, allQuestionCount, dispatch]
    );

    const handleSubmitExam = useCallback(() => {
        dispatch(completeExam());
        navigate("/results");
    }, [dispatch, navigate]);

    return (
        <div className="mt-4 pt-2 border-t">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => handleNavigateQuestion(-1)}
                    disabled={currentQuestionIndex === 0}
                    className={classNames(
                        "px-4 py-1 rounded font-medium transition-all",
                        "focus:outline-none focus:ring-1 focus:ring-indigo-500",
                        currentQuestionIndex === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                    )}
                    aria-label="Go to previous question"
                >
                    ← Previous
                </button>
                <button
                    onClick={() => setshowSubmitConfirmation(true)}
                    className="px-6 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded font-medium transition-all focus:outline-none focus:ring-1 focus:ring-green-500"
                    aria-label="Submit exam"
                >
                    Submit Exam
                </button>
                <button
                    onClick={() => handleNavigateQuestion(1)}
                    disabled={currentQuestionIndex === allQuestionCount - 1}
                    className={classNames(
                        "px-4 py-1 rounded font-medium transition-all",
                        "focus:outline-none focus:ring-1 focus:ring-indigo-500",
                        currentQuestionIndex === allQuestionCount - 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                    )}
                    aria-label="Go to next question"
                >
                    Next →
                </button>
            </div>

            {showSubmitConfirmation && (
                <ConfirmationDialog
                    isOpen={showSubmitConfirmation}
                    onConfirm={handleSubmitExam}
                    onCancel={() => setshowSubmitConfirmation(false)}
                />
            )}
        </div>
    );
}

export default NavigateWithSubmit;
