import { useEffect, useState } from "react";
import classNames from "classnames";


function ExamTimer({ startTime, timeLimit }) {
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);

    useEffect(() => {
        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = timeLimit - elapsed;

            if (remaining <= 0) {
                clearInterval(timer);
                setTimeRemaining(0); // Ensure timer shows 00:00
                // Handle exam completion here
            } else {
                setTimeRemaining(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime, timeLimit]);
    ;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const isLowTime = timeRemaining <= 300; // 5 minutes or less

    return (
        <div
            className={classNames(
                "flex items-center gap-2 px-4 transition-colors h-10 border border-slate-600 rounded-full bg-gradient-to-r from-slate-800 to-slate-900",
                isLowTime ? " text-red-700" : " text-white"
            )}
        >
            <p>Time left - </p>
            <span className="font-mono text-yellow-600">
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
}

export default ExamTimer;
