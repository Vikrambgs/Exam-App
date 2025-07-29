import { useState } from "react";
import ExamTimer from "./ExamTimer";
import ClearExamDialog from "./ResetExamDialog";
import { Settings, Eye, EyeOff } from "lucide-react";
import ExamSetting from "./ExamSetting";
import { useSelector, useDispatch } from "react-redux";
import { clearExamState, submitExam } from "../../store/slices/examSlice";
import { getExamStartTime, getExamTimeLimit } from "../../store/selectors/examSelector";
import ConfirmationDialog from "./ConfirmSubmit";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function NavBar({ showQuestionStatus, setShowQuestionStatus }) {
    const [showSubmitConfirmation, setshowSubmitConfirmation] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const examStartTime = useSelector(getExamStartTime);
    const timeLimitInSec = useSelector(getExamTimeLimit) / 1000;


    const [showResetConfirmation, setShowResetConfirmation] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSettingsToggle = () => {
        setIsSettingsOpen((prev) => !prev);
    };

    const handleClearExamState = () => {
        // Clear the exam state
        dispatch(clearExamState());
        setShowResetConfirmation(false);
    };

    const handleSubmitExam = useCallback(() => {
        dispatch(submitExam());
        navigate("/results");
    }, [navigate, dispatch]);

    return (
        <div className="bg-gradient-to-r from-slate-800 to-gray-900 py-1.5 px-3 shadow-lg">
            <div className="max-w-full mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold text-white uppercase font-roboto">
                    Exam / Quiz Going....
                </h1>
                <div className="flex items-center gap-4">
                    {examStartTime && (
                        <ExamTimer startTime={examStartTime} timeLimit={timeLimitInSec} />
                    )}


                    <div className="flex items-center space-x-3">
                        {/* Restart Button */}
                        <button
                            onClick={() => setshowSubmitConfirmation(true)}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-green-700 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 rounded-sm"
                        >
                            Submit Exam
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Restart Button */}
                        <button
                            onClick={() => setShowResetConfirmation(true)}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-red-700 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 rounded-sm"
                        >
                            Restart Exam
                        </button>
                    </div>

                    <button
                        onClick={() => setShowQuestionStatus(!showQuestionStatus)}
                        className={`flex items-center justify-center w-10 h-10 border transition-all duration-200 rounded-sm ${showQuestionStatus
                            ? "bg-violet-700 hover:bg-violet-600 border-violet-600 hover:border-violet-500 text-white"
                            : "bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white"
                            }`}
                        title={
                            showQuestionStatus
                                ? "Hide Question Status"
                                : "Show Question Status"
                        }
                    >
                        {showQuestionStatus ? (
                            <Eye className="w-5 h-5" />
                        ) : (
                            <EyeOff className="w-5 h-5" />
                        )}
                    </button>

                    <button
                        className="flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white transition-all duration-200 rounded-sm group"
                        title="Settings"
                        onClick={() => handleSettingsToggle()}
                    >

                        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                </div>
            </div>


            <ClearExamDialog
                isOpen={showResetConfirmation}
                onCancel={() => setShowResetConfirmation(false)}
                onConfirm={handleClearExamState}
            />

            {
                isSettingsOpen && (
                    <ExamSetting onClose={handleSettingsToggle} />
                )
            }

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


NavBar.propTypes = {
    showQuestionStatus: PropTypes.bool.isRequired,
    setShowQuestionStatus: PropTypes.func.isRequired,
};

export default NavBar;
