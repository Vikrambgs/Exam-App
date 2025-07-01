import { getQuestionInteractionStatus } from "../../store/selectors/examSelector";
import { useSelector } from "react-redux";


function ConfirmationDialog({ isOpen, onConfirm, onCancel }) {
    const questionStatus = useSelector(getQuestionInteractionStatus)

    if (!isOpen) return null;

    // const unAnsCount = Object.values(questionStatus).filter((val)=> val !== "answered").length
    const unAnsCount = questionStatus["marked-for-review"] + questionStatus["not-seen"] + questionStatus["seen-only"];


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
                <p className="mb-4">
                    {unAnsCount > 0
                        ? `You have ${unAnsCount} unanswered questions. Are you sure you want to submit?`
                        : "Are you sure you want to submit your exam?"}
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Submit Exam
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationDialog;
