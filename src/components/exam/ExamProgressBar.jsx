import { useState, useEffect } from 'react';

function ExamProgressBar({ startTime, timeLimitSec }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - new Date(startTime).getTime();
            const percentage = Math.min((elapsedTime / (timeLimitSec * 1000)) * 100, 100);
            setProgress(percentage);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, timeLimitSec]);

    return (
        <div className="h-[3px] bg-green-400 w-full">
            <div
                className="h-full bg-red-500"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}

export default ExamProgressBar;
