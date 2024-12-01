import React, { useState } from "react";

function QuestionPreview({ questionData }) {
  return (
    <div className="bg-gray-100 w-11/12 mx-auto rounded-lg p-4 border-gray-200 border">
      <h2 className="text-2xl text-center">Question Preview</h2>
      <div className="mt-10 flex flex-col gap-5">
        {questionData.map((question, index) => (
          <div key={index} className="border border-gray-400 rounded-md p-4 py-3">
            <p className="text-lg leading-tight">
              <span className="font-semibold pr-2">{index + 1}.</span>
              {question.q}
            </p>
            <div className="mt-4 flex flex-col gap-1">
              {question.o.map((option, optionIndex) => (
                <p
                  key={optionIndex}
                  className={`${
                    optionIndex === question.a ? "bg-green-300" : "bg-gray-200"
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
  const [jsonData, setJsonData] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [isInputDataValid, setIsInputDataValid] = useState(true);


  const checkInputData = () => {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        setIsInputDataValid(true);
      } else {
        setIsInputDataValid(false);
      }
    } catch (error) {
      setIsInputDataValid(false);
    }
  };

  const handlePreview = () => {
    try {
      const data = JSON.parse(jsonData);
      setParsedQuestions(data || []);
      setIsShowPreview(true);
    } catch (error) {
      console.error("Invalid JSON data:", error);
    }
  };

  return (
    <div className="max-w-full">
      <div className="h-screen bg-gray-400 flex items-center justify-center py-4 flex-col">
        <div className="bg-gray-300 rounded-lg shadow-lg p-8 border flex flex-col h-full w-11/12">
          <h1 className="text-2xl font-bold text-center mb-4">Create Questions</h1>
          <div className="mb-4 flex-1 flex flex-col">
            <p className="text-lg text-gray-800 mb-2">JSON Format Question</p>
            <textarea
              spellCheck="false"
              className="flex-1 bg-slate-100 p-3 border border-gray-400 outline-none font-mono resize-none"
              onChange={(e) => setJsonData(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <p className="flex-1 text-teal-700 font-semibold">Total questions are 100</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" onClick={checkInputData}>
              Check valid json
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
              Start Exam
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
              onClick={handlePreview}
            >
              Preview Question
            </button>
          </div>
        </div>
      </div>
      {isShowPreview && <QuestionPreview questionData={parsedQuestions} />}
    </div>
  );
}

export default CreateQuestion;
