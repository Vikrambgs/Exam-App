import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { updateQuestionTime } from "../../store/slices/examSlice";
import { useNavigate } from "react-router-dom";

function QuestionTimeProgress({ averageTime }) {
    const currQuestionIndex = useSelector((state) => state.exam.currentQuestionIndex);
    const questionTimes = useSelector((state) => state.exam.questionTimes);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [localTimeSpent, setLocalTimeSpent] = useState(0); // Local time state
    const intervalRef = useRef(null); // Ref for interval management

    // Retrieve the time spent from Redux
    const prevTimeSpent = questionTimes[currQuestionIndex] || 0;

    // Calculate percentage and overtime flag
    const percentage = (localTimeSpent / averageTime) * 100;
    const isOverTime = localTimeSpent > averageTime;

    useEffect(() => {
        // Initialize local time with Redux time
        setLocalTimeSpent(prevTimeSpent);

        // Start timer
        const start = Date.now();
        intervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - start) / 1000; // Time in seconds
            setLocalTimeSpent(prevTimeSpent + elapsed);
        }, 50); // Update every 50ms

        return () => {
            // Cleanup interval on unmount or question change
            if (intervalRef.current) clearInterval(intervalRef.current);

            // Persist final time to Redux
            const finalElapsed = (Date.now() - start) / 1000;
            dispatch(
                updateQuestionTime({
                    questionId: currQuestionIndex,
                    timeSpent: prevTimeSpent + finalElapsed,
                })
            );
        };
    }, [currQuestionIndex, dispatch, prevTimeSpent, navigate]);


    return (
        <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={classNames(
                    "h-full transition-all duration-100",
                    localTimeSpent === 0
                        ? "bg-gray-300"
                        : isOverTime
                        ? "bg-red-500"
                        : "bg-green-500"
                )}
                style={{
                    width: localTimeSpent === 0 ? "0%" : `${Math.min(percentage, 100)}%`,
                }}
            />
        </div>
    );
}

export default QuestionTimeProgress;
