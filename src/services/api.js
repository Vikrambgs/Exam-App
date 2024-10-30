// Mock API service using local JSON data
import questionsData from '../data/questions.json'

export const fetchQuestions = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return questionsData
}
