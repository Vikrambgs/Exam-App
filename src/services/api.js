// Update the API service to use uploaded questions from Redux store
import { store } from '../store';

export const fetchQuestions = async () => {
  const questions = store.getState().exam.questions;
  
  if (!questions || questions.length === 0) {
    throw new Error('No questions available. Please upload questions first.');
  }
  
  // Transform questions to match the expected format if needed
  const transformedQuestions = questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer
  }));
  
  await new Promise(resolve => setTimeout(resolve, 500));
  return { questions: transformedQuestions };
}
