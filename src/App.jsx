import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Login from './components/Login'
import Exam from './components/Exam'
import Results from './components/Results'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
