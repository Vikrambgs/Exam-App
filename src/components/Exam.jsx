import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    setQuestions,
} from "../store/slices/examSlice";
import { fetchQuestions } from "../services/api";
import QuestionNavigation from "./QuestionNavigation";
import QuestionComponent from "../TestComponent/QuestionUi";
import NavBar from "./exam/NavBar";
import ExamProgressBar from "./exam/ExamProgressBar";
import NavigateWithSubmit from "./exam/NavigateWithSubmit";
import { EyeIcon, EyeOffIcon } from "lucide-react";

function Exam() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const timeLimitInSec = 3600;
    const [showQuestionStatus, setShowQuestionStatus] = useState(true);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const questions = useSelector((state) => state.exam.questions);
    const examStartTime = useSelector((state) => state.exam.examStartTime);


    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const loadQuestions = async () => {
            if (!questions || questions.length === 0) {
                try {
                    const data = await fetchQuestions();
                    dispatch(setQuestions(data));
                } catch (error) {
                    console.error("Error loading questions:", error);
                }
            }
        };

        loadQuestions();
    }, [isAuthenticated, navigate]);

    

    if (!questions.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold">Loading questions...</div>
            </div>
        );
    }

    

    return (
        <div className="min-h-screen max-h-screen max-w-[100vw] bg-gray-50 flex flex-col">
            <NavBar 
                showQuestionStatus={showQuestionStatus} 
                setShowQuestionStatus={setShowQuestionStatus} 
            />
            <ExamProgressBar startTime={examStartTime} timeLimitSec={timeLimitInSec} />

            <div className="flex-1 flex gap-2 p-2 max-w-full overflow-hidden relative">
                <div className={`transition-all duration-300 ease-in-out ${showQuestionStatus ? 'max-w-[70%]' : 'max-w-full'} flex-1 flex rounded shadow-2xl`}>
                    <div className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-col border border-gray-300">
                        <QuestionComponent />
                        <NavigateWithSubmit />
                    </div>
                </div>

                <div 
                    className={`w-[30%] min-w-[30%] flex rounded shadow-2xl transition-all duration-300 ease-in-out ${
                        showQuestionStatus ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}
                    style={{ 
                        position: showQuestionStatus ? 'relative' : 'absolute',
                        right: 0,
                        visibility: showQuestionStatus ? 'visible' : 'hidden'
                    }}
                >
                    <QuestionNavigation />
                </div>
            </div>
        </div>
    );
}

export default Exam;
