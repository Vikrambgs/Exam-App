import { useEffect, useState } from "react";
import classNames from "classnames";


function ExamTimer({ startTime, timeLimit }) {
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);

    useEffect(() => {
        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = timeLimit - elapsed;
            setTimeRemaining(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
                // Handle exam completion
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime, timeLimit]);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const isLowTime = timeRemaining <= 300; // 5 minutes or less

    return (
        <div
            className={classNames(
                "flex items-center gap-2 px-4 py-1 rounded text-lg transition-colors font-medium font-mono",
                isLowTime ? "bg-red-100 text-red-700" : "bg-white/10 text-white"
            )}
        >
            <svg
                className={classNames("w-5 h-5", isLowTime && "animate-pulse")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span className="font-medium">
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
}

export default ExamTimer;
