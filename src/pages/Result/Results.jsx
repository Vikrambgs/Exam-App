import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import MinimalQuizResult from "./ResultDashboard";
import QuestionResult from "./QuestionResult";


function Results() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { questions, answers, questionStatus, examStartTime, examEndTime } = useSelector(
        (state) => state.exam
    );
    const questionTimes = useSelector((state) => state.exam.questionTimes);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'correct', 'incorrect', 'unattempted'
    const [searchQuery, setSearchQuery] = useState('');
    
    // Create refs for each question to be used for scrolling
    const questionRefs = useRef({});
    
    // Pass refs to MinimalQuizResult component
    useEffect(() => {
        // Make refs available to the MinimalQuizResult component through window
        window.questionRefs = questionRefs.current;
    }, [questionRefs]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!questions.length || !examEndTime) {
        navigate("/exam");
        return null;
    }

    const totalExamTime = 3600; // 1 hour in seconds
    const averageTimePerQuestion = Math.floor(totalExamTime / questions.length);

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.parts.some(part => 
            typeof part === 'string' && part.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        const isUnattempted = !answers.hasOwnProperty(question.id);
        const isCorrect = answers[question.id] === question.a;
        const isIncorrect = !isUnattempted && !isCorrect;

        const matchesFilter = 
            filterStatus === 'all' || 
            (filterStatus === 'correct' && isCorrect) ||
            (filterStatus === 'incorrect' && isIncorrect) ||
            (filterStatus === 'unattempted' && isUnattempted);
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-4">
            <div className="max-w-7xl mx-auto px-4">

                <MinimalQuizResult />
                

                {/* Filter Controls */}
                <div className="bg-white rounded-xl shadow-xl p-6 my-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by keyword"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="all">All Questions</option>
                                <option value="correct">Correct Answers</option>
                                <option value="incorrect">Incorrect Answers</option>
                                <option value="unattempted">Unattempted Questions</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filtered Results */}
                <div className="space-y-4">
                    {filteredQuestions.map((question, index) => (
                        <div 
                            key={question.id}
                            ref={el => {
                                // Store the element reference with the question index
                                questionRefs.current[questions.findIndex(q => q.id === question.id)] = el;
                            }}
                        >
                            <QuestionResult
                                question={question}
                                userAnswer={answers[question.id]}
                                index={questions.findIndex(q => q.id === question.id)}
                                timeSpent={questionTimes[question.id]}
                                averageTime={averageTimePerQuestion}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Results;
