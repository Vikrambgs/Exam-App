import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setQuestions } from "../store/slices/examSlice";

function QuestionPreview({ questionData }) {
    if (!questionData?.questions?.length) return null;

    return (
        <div className="bg-gray-100 w-11/12 mx-auto rounded-lg p-4 border-gray-200 border mt-4">
            <h2 className="text-2xl text-center">Question Preview</h2>
            <div className="mt-4">
                <p className="text-lg font-semibold">{questionData.examTitle}</p>
                <p className="text-gray-600">Time Limit: {questionData.timeLimit / 60} minutes</p>
            </div>
            <div className="mt-10 flex flex-col gap-5">
                {questionData.questions.map((question, index) => (
                    <div key={index} className="border border-gray-400 rounded-md p-4 py-3">
                        <p className="text-lg leading-tight">
                            <span className="font-semibold pr-2">{index + 1}.</span>
                            {question.question}
                        </p>
                        <div className="mt-4 flex flex-col gap-1">
                            {question.options.map((option, optionIndex) => (
                                <p
                                    key={optionIndex}
                                    className={`${
                                        optionIndex === question.correctAnswer ? "bg-green-300" : "bg-gray-200"
                                    } px-3 py-0.5 rounded border border-gray-300`}
                                >
                                    {option}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CreateQuestion() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [jsonData, setJsonData] = useState("");
    const [parsedQuestions, setParsedQuestions] = useState(null);
    const [isShowPreview, setIsShowPreview] = useState(false);
    const [isInputDataValid, setIsInputDataValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const transformQuestions = (rawData) => {
        if (!Array.isArray(rawData)) {
            throw new Error("Input must be an array of questions");
        }

        return {
            examTitle: "Exam",
            timeLimit: 3600,
            questions: rawData.map((item, index) => ({
                id: item.id || `Q${index + 1}`,
                question: item.q,
                options: item.o,
                correctAnswer: item.a
            }))
        };
    };

    const validateQuestionFormat = (data) => {
        if (!Array.isArray(data)) {
            throw new Error("Questions must be provided as an array");
        }

        data.forEach((q, index) => {
            if (!q.id || typeof q.id !== "string") {
                throw new Error(`Question ${index + 1}: Invalid ID format.`);
            }
            if (!q.q || typeof q.q !== "string") {
                throw new Error(`Question ${index + 1}: Missing or invalid question text`);
            }
            if (!Array.isArray(q.o) || q.o.length !== 4) {
                throw new Error(`Question ${index + 1}: Must have exactly 4 options`);
            }
            if (typeof q.a !== "number" || q.a < 0 || q.a >= q.o.length) {
                throw new Error(`Question ${index + 1}: Invalid answer index`);
            }
        });
    };

    const checkInputData = () => {
        try {
            const data = JSON.parse(jsonData);
            validateQuestionFormat(data);
            setIsInputDataValid(true);
            setErrorMessage("");
            return true;
        } catch (error) {
            setIsInputDataValid(false);
            setErrorMessage(error.message);
            return false;
        }
    };

    const handlePreview = () => {
        if (checkInputData()) {
            const rawData = JSON.parse(jsonData);
            const transformedData = transformQuestions(rawData);
            setParsedQuestions(transformedData);
            setIsShowPreview(true);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                const data = JSON.parse(content);
                validateQuestionFormat(data);
                setJsonData(JSON.stringify(data, null, 2));
                const transformedData = transformQuestions(data);
                setParsedQuestions(transformedData);
                setIsShowPreview(true);
                setIsInputDataValid(true);
                setErrorMessage("");
            } catch (error) {
                setIsInputDataValid(false);
                setErrorMessage(error.message);
            }
        };
        reader.readAsText(file);
    };

    const handleStartExam = () => {
        if (checkInputData()) {
            const rawData = JSON.parse(jsonData);
            const transformedData = transformQuestions(rawData);
            dispatch(setQuestions(transformedData.questions));
            navigate("/exam");
        }
    };

    return (
        <div className="max-w-full">
            <div className="min-h-screen bg-gray-100 py-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
                        <h1 className="text-2xl font-bold text-center mb-6">Upload Questions</h1>
                        <div className="mb-4">
                            <div className="flex justify-between mb-2 items-center">
                                <p className="text-lg text-gray-800">Enter JSON Format Questions</p>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileChange}
                                    className="block text-sm cursor-pointer text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <textarea
                                spellCheck="false"
                                className="w-full h-64 bg-gray-50 p-3 border border-gray-300 rounded-md outline-none font-mono resize-none"
                                value={jsonData}
                                onChange={(e) => setJsonData(e.target.value)}
                                placeholder="Paste your JSON here..."
                            />
                            {!isInputDataValid && (
                                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                onClick={checkInputData}
                            >
                                Validate JSON
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handlePreview}
                            >
                                Preview
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={handleStartExam}
                                disabled={!isInputDataValid}
                            >
                                Start Exam
                            </button>
                        </div>
                    </div>
                    {isShowPreview && <QuestionPreview questionData={parsedQuestions} />}
                </div>
            </div>
        </div>
    );
}

export default CreateQuestion;
