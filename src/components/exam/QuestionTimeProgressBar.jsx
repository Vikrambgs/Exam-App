import classNames from "classnames";

function QuestionTimeProgress({ timeSpent, averageTime }) {
    const percentage = (timeSpent / averageTime) * 100;
    const isOverTime = timeSpent > 0 && timeSpent > averageTime;

    return (
        <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={classNames(
                    "h-full transition-all duration-300",
                    timeSpent === 0 ? "bg-gray-300" : isOverTime ? "bg-red-500" : "bg-green-500"
                )}
                style={{
                    width: timeSpent === 0 ? "0%" : `${Math.min(percentage, 100)}%`,
                }}
            />
        </div>
    );
}


export default QuestionTimeProgress;
