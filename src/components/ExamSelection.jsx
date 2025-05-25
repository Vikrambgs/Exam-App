import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, AcademicCapIcon, BookOpenIcon, BeakerIcon } from '@heroicons/react/24/outline';

const examTypes = [
    { id: 'mcq', name: 'Multiple Choice', icon: BookOpenIcon, color: 'bg-blue-500' },
    { id: 'coding', name: 'Coding', icon: BeakerIcon, color: 'bg-green-500' },
    { id: 'theory', name: 'Theory', icon: AcademicCapIcon, color: 'bg-purple-500' },
];

const mockExams = [
    {
        id: 1,
        title: 'JavaScript Fundamentals',
        type: 'mcq',
        duration: '60 mins',
        questions: 30,
        difficulty: 'Beginner',
        category: 'Programming',
    },
    {
        id: 2,
        title: 'React Hooks',
        type: 'coding',
        duration: '90 mins',
        questions: 5,
        difficulty: 'Intermediate',
        category: 'Frontend',
    },
    {
        id: 3,
        title: 'Data Structures',
        type: 'theory',
        duration: '45 mins',
        questions: 20,
        difficulty: 'Advanced',
        category: 'Computer Science',
    },
];

function ExamSelection() {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', ...new Set(mockExams.map(exam => exam.category))];

    const filteredExams = mockExams.filter(exam => {
        const matchesType = selectedType === 'all' || exam.type === selectedType;
        const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
        return matchesType && matchesSearch && matchesCategory;
    });

    const handleExamSelect = (examId) => {
        navigate(`/exam/${examId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Select Your Exam
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Choose from our wide range of exams to test your knowledge
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                            placeholder="Search exams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Exam Type Filters */}
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setSelectedType('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                                selectedType === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                        >
                            All Types
                        </button>
                        {examTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                                    selectedType === type.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <type.icon className="h-5 w-5" />
                                {type.name}
                            </button>
                        ))}
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    selectedCategory === category
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Exam Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map((exam) => (
                        <div
                            key={exam.id}
                            onClick={() => handleExamSelect(exam.id)}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {exam.title}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    exam.type === 'mcq' ? 'bg-blue-100 text-blue-800' :
                                    exam.type === 'coding' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                }`}>
                                    {exam.type.toUpperCase()}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Duration:</span>
                                    <span className="ml-2">{exam.duration}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Questions:</span>
                                    <span className="ml-2">{exam.questions}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Difficulty:</span>
                                    <span className="ml-2">{exam.difficulty}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Category:</span>
                                    <span className="ml-2">{exam.category}</span>
                                </div>
                            </div>
                            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                                Start Exam
                            </button>
                        </div>
                    ))}
                </div>

                {filteredExams.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            No exams found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExamSelection; 
