import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Login from "./components/Login";
import Exam from "./components/Exam";
import Results from "./components/Results";
import CreateQuestion from "./components/CreateQuestion";
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import { Suspense } from 'react';


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
