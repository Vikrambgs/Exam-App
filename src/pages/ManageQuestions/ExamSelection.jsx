import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hindiExamData from "../../data/CreatedExam/Hindi.json"
import englishExamData from "../../data/CreatedExam/English.json"
import generalTestExamData from "../../data/CreatedExam/GeneralTest.json"
import computerExamData from "../../data/CreatedExam/Computers.json"
import { setQuestions } from '../../store/slices/examSlice';


import { MagnifyingGlassIcon, AcademicCapIcon, BookOpenIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';

const examTypes = [
    { id: 'mcq', name: 'Multiple Choice', icon: BookOpenIcon, color: 'bg-blue-500' },
    { id: 'coding', name: 'Coding', icon: BeakerIcon, color: 'bg-green-500' },
    { id: 'theory', name: 'Theory', icon: AcademicCapIcon, color: 'bg-purple-500' },
];

const mockExams = [
    {
        id: 1,
        title: 'English',
        type: 'mcq',
        duration: '60 mins',
        questions: 50,
        difficulty: 'Medium',
        examData : englishExamData
    },
    {
        id: 2,
        title: 'General Aptitude Test',
        type: 'mcq',
        duration: '60 mins',
        questions: 50,
        difficulty: 'Intermediate',
        examData : generalTestExamData
    },
    {
        id: 3,
        title: 'Computer Science',
        type: 'mcq',
        duration: '60 mins',
        questions: 50,
        difficulty: 'Advanced',
        examData : computerExamData
    },
    {
        id: 4,
        title: 'Hindi Language',
        type: 'mcq',
        duration: '60 mins',
        questions: 50,
        difficulty: 'Easy',
        examData : hindiExamData
    },
];

function ExamSelection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleExamSelect = (examData) => {
        dispatch(setQuestions(examData));
        navigate("/exam")
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Select Your Exam
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Choose from our wide range of exams to test your knowledge
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                            placeholder="Search exams..."
                        />
                    </div>

                    


                </div>

                {/* Exam Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockExams.map((exam) => (
                        <div
                            key={exam.id}
                            onClick={() => handleExamSelect(exam.examData)}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-400"
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
                            
                            </div>
                            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                                Start Exam
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExamSelection; 
