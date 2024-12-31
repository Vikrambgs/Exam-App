import classNames from "classnames"; // Ensure you have this utility or replace with your own logic
import MatchUi from "./MatchUi";
import OptionsMore from "./OptionsMore";

const QuestionComponent = ({ question, selectedOption, handleOptionSelect }) => {
    return (
        <div className="flex-1">
            {question.parts.map((part, index) => {
                if (typeof(part) == "object") {
                    if (part.pre_o) {
                      return <OptionsMore options={part.pre_o} />;
                    } else if (part.match) {
                      return <MatchUi key={index} match={part.match} />;
                    }
                } else {
                    return (
                        <div key={index} className="text-black leading-[1.15] py-1 text-[1.1rem]">
                            {part}
                        </div>
                    );
                }
            })}

            <div className="space-y-2 mt-3">
                {question.o.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        onKeyDown={(e) => e.key === "Enter" && handleOptionSelect(index)}
                        role="radio"
                        aria-checked={selectedOption === index}
                        tabIndex={0}
                        className={classNames(
                            "p-2 py-2 border border-gray-400 rounded cursor-pointer transition-all",
                            "hover:shadow focus:outline-none focus:ring-1 focus:ring-green-500",
                            selectedOption === index
                                ? "bg-indigo-50 border-green-500 text-green-700"
                                : "hover:bg-gray-50 hover:border-gray-500 text-gray-900 border-gray-200 font-medium"
                        )}
                    >
                        <div className="flex items-center">
                            <div
                                className={classNames(
                                    "w-5 h-5 rounded-full border mr-2 flex items-center justify-center relative",
                                    selectedOption === index
                                        ? "border-green-500 bg-indigo-100 border-2"
                                        : "border-gray-400"
                                )}
                            >
                                {selectedOption === index && (
                                    <svg
                                        className="w-4 h-4 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="3"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm font-medium">{option}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionComponent;
