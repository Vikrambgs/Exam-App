import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { store } from "./store";
import Login from "./pages/Login/Login";
import Exam from "./pages/Exam/Exam";
import Results from "./pages/Result/Results";
import CreateQuestion from "./pages/ManageQuestions/ManageQuestions";
import ExamSelection from "./pages/ManageQuestions/ExamSelection";
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import { Suspense } from 'react';


// Protected Route component to handle authentication
function ProtectedRoute({ children }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <Provider store={store}>
                <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                        <Router>
                            <div className="bg-gray-800 dark:bg-gray-900 transition-colors duration-200">
                                <main className="">
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/login" />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route
                                            path="/select-exam"
                                            element={
                                                <ProtectedRoute>
                                                    <ExamSelection />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/upload-questions"
                                            element={
                                                <ProtectedRoute>
                                                    <CreateQuestion />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/exam"
                                            element={
                                                <ProtectedRoute>
                                                    <Exam />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/results"
                                            element={
                                                <ProtectedRoute>
                                                    <Results />
                                                </ProtectedRoute>
                                            }
                                        />
                                    </Routes>
                                </main>
                            </div>
                        </Router>
                    </Suspense>
                </ErrorBoundary>
        </Provider>
    );
}

export default App;
