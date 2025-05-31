import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoQuestion } from "react-icons/go";

import { setQuestions } from "../../store/slices/examSlice";
import HelpWindow from "./HelpWindow";
import PreviewUploadedQuestions from "./PreviewUploadedQuestions";


function CreateQuestion() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [jsonData, setJsonData] = useState("");
    const [parsedQuestions, setParsedQuestions] = useState(null);
    const [isShowPreview, setIsShowPreview] = useState(false);
    const [isInputDataValid, setIsInputDataValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    const transformQuestions = (rawData) => {
        if (!Array.isArray(rawData)) {
            throw new Error("Input must be an array of questions");
        }

        return {
            examTitle: "Exam",
            timeLimit: 3600,
            questions: rawData,
        };
    };

    const handleClearData = ()=>{
        setJsonData("");
    }

    const validateQuestionFormat = (data) => {
        if (!Array.isArray(data)) {
            throw new Error("Questions must be provided as an array");
        }
    };

    const checkInputData = () => {
        if (jsonData) {
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
        } else {
            setIsInputDataValid(false);
            setErrorMessage(
                "Input data is empty : Please enter some json data or import file"
            );
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
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="flex justify-center items-center w-full min-h-screen">
                <div className="bg-white rounded shadow-lg px-8 py-6 w-[calc(100vw-80px)] h-[calc(100vh-80px)] flex flex-col ">
                    <div className="flex items-center mb-2 justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold">Upload Questions</h1>
                            <button
                                onClick={() => setShowHelp(true)}
                                className="text-gray-600 hover:text-gray-800"
                                aria-label="Show help"
                            >
                                <GoQuestion size={24} />
                            </button>
                        </div>

                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="block text-sm cursor-pointer text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-800 file:cursor-pointer hover:file:bg-blue-300 border"
                        />
                    </div>

                    <textarea
                        spellCheck="false"
                        className="w-full flex-1 bg-gray-50 p-3 border border-gray-400 outline-none font-mono resize-none my-2 transition-all duration-900 focus:ring-2 focus:border-transparent focus:ring-blue-500"
                        value={jsonData}
                        onChange={(e) => setJsonData(e.target.value)}
                        placeholder="Paste your JSON here..."
                    />

                    <div className="flex justify-between gap-3 items-center">
                        <p className="text-red-500 text-sm">
                            {!isInputDataValid && errorMessage}
                        </p>

                        <div className="space-x-3">
                            <button onClick={handleClearData} className="text-gray-900 bg-white border border-gray-400 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-sm text-sm px-5 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                Clear Data
                            </button>

                            <button
                                className="px-4 py-1.5 bg-blue-700 text-white rounded-sm hover:bg-blue-600"
                                onClick={handlePreview}
                            >
                                Preview
                            </button>
                            <button
                                className="px-4 py-1.5 bg-green-700 text-white rounded-sm hover:bg-green-600"
                                onClick={handleStartExam}
                                disabled={!isInputDataValid}
                            >
                                Start Exam
                            </button>

                            <button
                                className="px-4 py-1.5 bg-gray-700 text-white rounded-sm hover:bg-gray-600"
                                onClick={() => navigate("/select-exam")}
                            >
                                Select Exam
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isShowPreview && <PreviewUploadedQuestions questionData={parsedQuestions} />}
            <HelpWindow isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </div>
    );
}

export default CreateQuestion;
