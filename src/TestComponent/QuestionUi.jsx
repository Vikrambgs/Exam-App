import classNames from 'classnames'; // Ensure you have this utility or replace with your own logic
import MatchUi from "./MatchUi"
import OptionsMore from './OptionsMore';


const QuestionComponent = ({ question, selectedOption, handleOptionSelect }) => {

  return (
    <div className="flex-1"> {/* Main questions */}
      <p className="text-lg text-black leading-tight mb-1">
        {question.question}
      </p>

      {/* <MatchUi /> */}
      {/* <OptionsMore /> */}

      <div className="space-y-2 mt-3">
        {question.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionSelect(index)}
            onKeyDown={(e) => e.key === "Enter" && handleOptionSelect(index)}
            role="radio"
            aria-checked={selectedOption === index}
            tabIndex={0}
            className={classNames(
              "p-2 py-2 border border-gray-400 rounded cursor-pointer transition-all",
              "hover:shadow focus:outline-none focus:ring-1 focus:ring-indigo-500",
              selectedOption === index
                ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                : "hover:bg-gray-50 hover:border-gray-500 text-gray-900 border-gray-200 font-medium"
            )}
          >
            <div className="flex items-center">
              <div
                className={classNames(
                  "w-4 h-4 rounded-full border mr-2 flex items-center justify-center relative",
                  selectedOption === index
                    ? "border-indigo-500 bg-indigo-100"
                    : "border-gray-400"
                )}
              >
                {selectedOption === index && (
                  <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-indigo-500" />
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
