import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    setQuestions,
} from "../../store/slices/examSlice";
import { fetchQuestions } from "../../services/api";


import NavBar from "./NavBar";
import QuestionComponent from "./QuestionUi";
import ExamProgressBar from "./ExamProgressBar";
import QuestionNavigation from "./QuestionNavigation";
import NavigateWithSubmit from "./NavigateWithSubmit";

function Exam() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showQuestionStatus, setShowQuestionStatus] = useState(true);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const questions = useSelector((state) => state.exam.examQuestions);
    const examStartTime = useSelector((state) => state.exam.examStartTime);
    const timeLimitInSec = useSelector((state) => state.exam.totalExamTime);


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
        <div className="max-w-[2000px] h-dvh w-dvw lg aspect-[2/1] bg-gray-900 flex flex-col">
            <NavBar
                showQuestionStatus={showQuestionStatus}
                setShowQuestionStatus={setShowQuestionStatus}
            />
            <ExamProgressBar startTime={examStartTime} timeLimitSec={timeLimitInSec} />

            <div className="flex-1 flex gap-2 p-2 max-w-full overflow-hidden relative">
                <div className={`transition-all duration-300 ease-in-out ${showQuestionStatus ? 'max-w-[70%]' : 'max-w-full'} flex-1 flex rounded`}>
                    <div className="bg-slate-900 rounded-lg shadow-lg p-4 w-full flex flex-col border border-gray-600">
                        <QuestionComponent />
                        <NavigateWithSubmit />
                    </div>
                </div>

                <div
                    className={`w-[30%] min-w-[30%] flex rounded shadow-2xl transition-all duration-300 ease-in-out ${showQuestionStatus ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
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
