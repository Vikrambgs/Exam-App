import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const QuestionBank = () => {
  const questions = useSelector((state) => state.questions.questions);

  // Calculate statistics
  const stats = {
    multipleChoice: questions.filter(q => q.type === 'multiple-choice').length,
    trueFalse: questions.filter(q => q.type === 'true-false').length,
    matching: questions.filter(q => q.type === 'matching').length,
  };

  const difficultyData = [
    { name: 'Easy', value: questions.filter(q => q.difficulty === 'easy').length },
    { name: 'Medium', value: questions.filter(q => q.difficulty === 'medium').length },
    { name: 'Hard', value: questions.filter(q => q.difficulty === 'hard').length },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Bank</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Question Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Multiple Choice</span>
              <span className="text-blue-600 dark:text-blue-400">{stats.multipleChoice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">True/False</span>
              <span className="text-blue-600 dark:text-blue-400">{stats.trueFalse}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Matching</span>
              <span className="text-blue-600 dark:text-blue-400">{stats.matching}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Difficulty Distribution</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="space-y-2">
            {questions.slice(0, 5).map((question, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                {question.text.substring(0, 50)}...
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank; 
