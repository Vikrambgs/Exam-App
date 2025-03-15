import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import HelpPanel from "./HelpPanel";
import ExamTimer from "./ExamTimer";
import { GoQuestion } from "react-icons/go";
import { clearExamState } from "../../store/slices/examSlice";
import ClearExamDialog from "./ResetExamDialog";
import { EyeIcon, EyeOffIcon } from "lucide-react";

function NavBar({ showQuestionStatus, setShowQuestionStatus }) {
    const dispatch = useDispatch();
    const examStartTime = useSelector((state) => state.exam.examStartTime);
    const timeLimitInSec = 3600;
    const [showHelp, setShowHelp] = useState(false); // control the visibility of the help panel
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);


    const handleClearExamState = () => {
        // Clear the exam state
        dispatch(clearExamState());
        setShowResetConfirmation(false);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-1.5 px-3 shadow-lg">
            <div className="max-w-full mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold text-white uppercase">Ongoing exam....</h1>
                <div className="flex items-center gap-4">
                    
                    
                    {examStartTime && (
                        <ExamTimer startTime={examStartTime} timeLimit={timeLimitInSec} />
                    )}
                    <button
                        onClick={() => setShowResetConfirmation(true)}
                        className="text-white/90 hover:text-white bg-red-600/80 hover:bg-red-500/90 px-3 py-1.5 rounded"
                    >
                        Restart Exam
                    </button>

                    {/* Question Status Toggle */}
                    <button
                        onClick={() => setShowQuestionStatus(!showQuestionStatus)}
                        className="flex w-36 items-center gap-1.5 text-white/90 hover:text-white bg-indigo-600/80 hover:bg-indigo-500/90 px-3 py-2 rounded transition-colors"
                        title={showQuestionStatus ? "Hide question status" : "Show question status"}
                    >
                        {showQuestionStatus ? (
                            <>
                                <EyeOffIcon size={18} />
                                <span className="text-sm font-medium">Hide Status</span>
                            </>
                        ) : (
                            <>
                                <EyeIcon size={18} />
                                <span className="text-sm font-medium">Show Status</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <HelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />


            <ClearExamDialog
                isOpen={showResetConfirmation}
                onCancel={() => setShowResetConfirmation(false)}
                onConfirm={handleClearExamState}
            />
        </div>
    );
}

export default NavBar;
