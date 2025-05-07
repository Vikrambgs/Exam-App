import React from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceDashboard = () => {
  const examResults = useSelector((state) => state.exam.results);

  // Calculate average score
  const averageScore = examResults.length > 0
    ? (examResults.reduce((acc, result) => acc + result.score, 0) / examResults.length).toFixed(1)
    : 0;

  // Calculate total time spent
  const totalTimeSpent = examResults.reduce((acc, result) => acc + result.timeSpent, 0);
  const hoursSpent = (totalTimeSpent / 3600).toFixed(1);

  // Calculate total questions attempted
  const totalQuestionsAttempted = examResults.reduce((acc, result) => acc + result.totalQuestions, 0);

  // Prepare data for the performance trend chart
  const performanceData = examResults.map(result => ({
    date: new Date(result.date).toLocaleDateString(),
    score: result.score,
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Average Score</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{averageScore}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Time Spent</h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{hoursSpent} hrs</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">This month</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Questions Attempted</h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalQuestionsAttempted}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard; 
