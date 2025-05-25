import { useEffect, useState } from "react";
import classNames from "classnames";
import { PiTimer } from "react-icons/pi";


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
                "flex items-center rounded gap-2 px-4 transition-colors py-2.5 border border-slate-600",
                isLowTime ? " text-red-700" : " text-white"
            )}
        >
            <PiTimer className="w-6 h-6" />
            <span className="font-semibold font-mono">
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
}

export default ExamTimer;
