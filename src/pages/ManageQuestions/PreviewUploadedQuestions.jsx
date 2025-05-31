import React from 'react'
import MatchUi from "../../components/QuestionRenderingUI/MatchUi";
import OptionsMore from "../../components/QuestionRenderingUI/OptionsMore";

export default function PreviewUploadedQuestions({questionData}) {
  
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
