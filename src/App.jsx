import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Login from "./components/Login";
import Exam from "./components/Exam";
import Results from "./components/Results";
import CreateQuestion from "./components/CreateQuestion";
import Settings from "./components/Settings";
import ThemeProvider from "./components/ThemeProvider";
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import { lazy, Suspense } from 'react';

// Lazy load components
const QuestionBank = lazy(() => import('./components/QuestionManagement/QuestionBank'));
const PerformanceDashboard = lazy(() => import('./components/Analytics/PerformanceDashboard'));
const TestUIComponents = lazy(() => import('./components/TestUI/TestUIComponents'));

// Protected Route component to handle authentication
function ProtectedRoute({ children }) {
    const isAuthenticated = store.getState().auth.isAuthenticated;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                        <Router>
                            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                                <main className="">
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/login" />} />
                                        <Route path="/login" element={<Login />} />
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
                                        <Route
                                            path="/settings"
                                            element={
                                                <ProtectedRoute>
                                                    <Settings />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route path="/question-bank" element={<QuestionBank />} />
                                        <Route path="/performance" element={<PerformanceDashboard />} />
                                        <Route path="/test-ui" element={<TestUIComponents />} />
                                    </Routes>
                                </main>
                            </div>
                        </Router>
                    </Suspense>
                </ErrorBoundary>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
