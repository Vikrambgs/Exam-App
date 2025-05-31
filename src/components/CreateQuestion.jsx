import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setQuestions } from "../store/slices/examSlice";
import MatchUi from "./QuestionManagement/MatchUi";
import OptionsMore from "./QuestionManagement/OptionsMore";
import { GoQuestion } from "react-icons/go";
import HelpWindow from "./UploadPage/HelpWindow";

function QuestionPreview({ questionData }) {
    if (!questionData?.questions?.length) return null;

    return (
        <div className="bg-gray-100 w-[calc(100vw-80px)] mx-auto rounded-lg p-4 border-gray-200 border mt-4">
            <h2 className="text-2xl font-medium text-center">Quiz Question Preview</h2>
            <div className="mt-4">
                <p className="text-lg font-semibold">{questionData.examTitle}</p>
                <p className="text-gray-600">
                    Time Limit: {questionData.timeLimit / 60} minutes
                </p>
            </div>
            <div className="mt-10 flex flex-col gap-5">
                {questionData.questions.map((question) => (
                    <div
                        key={question.id}
                        className="border border-gray-400 rounded-md p-4 py-3"
                    >
                        <p className="text-lg leading-tight">
                            <span className="font-semibold pr-2">
                                {question.index + 1}.
                            </span>
                            {question.parts[0]}
                        </p>

                        {question.parts.slice(1).map((part, partIndex) => {
                            if (typeof part === "string") {
                                return (
                                    <p
                                        key={`${question.id}-part-${partIndex}`}
                                        className="mt-2"
                                    >
                                        {part}
                                    </p>
                                );
                            } else if (typeof part === "object") {
                                if (part.pre_o) {
                                    return (
                                        <div
                                            key={`${question.id}-pre_o-${partIndex}`}
                                            className="mt-2"
                                        >
                                            <OptionsMore options={part.pre_o} />
                                        </div>
                                    );
                                } else if (part.match) {
                                    return (
                                        <div
                                            key={`${question.id}-match-${partIndex}`}
                                            className="mt-2"
                                        >
                                            <MatchUi match={part.match} />
                                        </div>
                                    );
                                }
                            }
                        })}

                        {question.o.map((option, optionIndex) => (
                            <div
                                key={`${question.id}-option-${optionIndex}`}
                                className="ml-1 pl-3 py-1 bg-gray-300 rounded my-2"
                                style={
                                    optionIndex === question.a
                                        ? { backgroundColor: "#81ff6b" }
                                        : {}
                                }
                            >
                                <p>{option}</p>
                            </div>
                        ))}
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
            {isShowPreview && <QuestionPreview questionData={parsedQuestions} />}
            <HelpWindow isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </div>
    );
}

export default CreateQuestion;
