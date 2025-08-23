import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import MinimalQuizResult from "./ResultDashboard";
import { getAllQuestionsData } from "../../store/selectors/examSelector";
import QuestionResult from "./QuestionResult";





function Results() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const allData = useSelector(getAllQuestionsData);


    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'correct', 'incorrect', 'unattempted', 'markedForReview'
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default'); // 'default', 'timeAsc', 'timeDesc'

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

    if (!allData.length) {
        navigate("/exam");
        return null;
    }


    const filteredQuestions = allData.filter(question => {
        const matchesSearch = question.questionData.parts.some(part =>
            typeof part === 'string' && part.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const isUnattempted = question.userSelectedOption === null;
        const isCorrect = question.userSelectedOption == question.questionData.a;
        const isIncorrect = !isUnattempted && !isCorrect;
        const isMarkedForReview = question.status === "answered-and-marked-for-review" || question.status === "marked-for-review"

        const matchesFilter =
            filterStatus === 'all' ||
            (filterStatus === 'correct' && isCorrect) ||
            (filterStatus === 'incorrect' && isIncorrect) ||
            (filterStatus === 'unattempted' && isUnattempted) ||
            (filterStatus === 'markedForReview' && isMarkedForReview);

        return matchesSearch && matchesFilter;
    });

    // Sort questions based on time spent
    const sortedQuestions = [...filteredQuestions].sort((a, b) => {
        if (sortBy === 'timeAsc') {
            // Handle null/undefined/0 time values
            const aTime = a.totalSpentTime || 0;
            const bTime = b.totalSpentTime || 0;
            
            // If both have no time spent, maintain original order
            if (aTime === 0 && bTime === 0) return 0;
            
            // If only 'a' has no time spent, put it last
            if (aTime === 0) return 1;
            
            // If only 'b' has no time spent, put it last
            if (bTime === 0) return -1;
            
            // Both have time spent, sort normally
            return aTime - bTime;
        } else if (sortBy === 'timeDesc') {
            return (b.totalSpentTime || 0) - (a.totalSpentTime || 0);
        }
        // Default order (original order)
        return 0;
    });



    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-4">
            <div className="max-w-7xl mx-auto px-4">

                <MinimalQuizResult />


                {/* Filter Controls */}
                <div className="bg-white rounded-xl shadow-xl p-6 my-8">
                    <div className="flex gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by keyword" 
                                className="w-full border-2 h-10 px-3 border-gray-300 outline-none rounded-md transition-all duration-300 focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                            >
                                <option value="all">All Questions</option>
                                <option value="correct">Correct Answers</option>
                                <option value="incorrect">Incorrect Answers</option>
                                <option value="unattempted">Unattempted Questions</option>
                                <option value="markedForReview">Marked for Review</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by Time Spent</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                            >
                                <option value="default">Default Order</option>
                                <option value="timeAsc">Time: Low to High</option>
                                <option value="timeDesc">Time: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filtered Results */}
                <div className="space-y-4">
                    {sortedQuestions.map((question) => (
                        <div
                            key={question.questionId}
                            ref={el => {
                                // Store the element reference with the question index
                                questionRefs.current[allData.findIndex(q => q.questionId === question.questionId)] = el;
                            }}
                        >
                            <QuestionResult
                                question={question}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Results;
