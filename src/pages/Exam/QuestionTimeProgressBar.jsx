import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getCurrentQuestionTimeSpent,
    getAverageTimePerQuestion,
    getCurrentQuestionIndex
} from "../../store/selectors/examSelector";

export default function Progress() {
    const prevTime = useSelector(getCurrentQuestionTimeSpent);
    const averageTime = useSelector(getAverageTimePerQuestion);
    const questionId = useSelector(getCurrentQuestionIndex);

    const [progress, setProgress] = useState(0);
    const intervalTime = 100; // ms

    useEffect(() => {
        // Calculate initial progress
        const initialProgress = (prevTime / averageTime) * 100;
        setProgress(initialProgress);

        // Only start the timer if prevTime hasn't exceeded averageTime yet
        if (prevTime < averageTime) {
            const timer = setInterval(() => {
                const increment = (100 * intervalTime) / averageTime;
                setProgress((prev) => {
                    const newProgress = prev + increment;
                    if (newProgress >= 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    return newProgress;
                });
            }, intervalTime);

            return () => clearInterval(timer);
        }
    }, [prevTime, averageTime, questionId]);

    // Determine bar color based on progress
    const barColor = progress >= 100 ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="w-full bg-gray-200 h-0.5 rounded overflow-hidden">
            <div
                className={`${barColor} h-full transition-colors duration-300`}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
