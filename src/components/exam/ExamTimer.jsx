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
                "flex items-center rounded-full gap-2 px-4 py-1 text-lg transition-colors font-medium font-mono",
                isLowTime ? "bg-red-100 text-red-700" : "bg-white/10 text-white"
            )}
        >
            <PiTimer size={23} />
            <span className="font-medium">
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
}

export default ExamTimer;
