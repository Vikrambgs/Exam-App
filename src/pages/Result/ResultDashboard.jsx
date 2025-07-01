import { Target, Sparkles, Gauge, Hourglass } from "lucide-react";
import { useSelector } from "react-redux";
import { getAllQuestionsData, getExamStartTime, getExamEndTime } from "../../store/selectors/examSelector";

const MinimalQuizResult = () => {
    const allData = useSelector(getAllQuestionsData);

    const questionsData = allData.map((data) => {
        return {
            questionNo: data.questionNo,
            questionId: data.questionId,
            status: data.status,
            isBookmarked: data.isBookmarked,
            userSelectedOption: data.userSelectedOption,
            correctAnswer: data.questionData.a,
            totalSpentTime: data.totalSpentTime,
        }
    });


    // Function to scroll to a specific question
    const scrollToQuestion = (index) => {
        if (window.questionRefs && window.questionRefs[index]) {
            window.questionRefs[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const totalQuestions = questionsData.length;
    const attemptedQuestions = questionsData.filter((q) => q.userSelectedOption !== null).length;
    const unSeenQuestions = questionsData.filter((q) => q.status === "not-seen").length;
    const unAttempted = questionsData.filter((q) => q.status === "marked-for-review" || q.status === "seen-only").length;
    const correctAnswers = questionsData.filter((q) => q.userSelectedOption === q.correctAnswer).length;
    const timeTaken = Math.floor((useSelector(getExamEndTime) - useSelector(getExamStartTime)) / 1000);
    const maxTime = 3600; // 1 hour in seconds


    const scoreColorMap = {
        A: "#15803d",
        B: "#16a34a",
        C: "#1d4ed8",
        D: "#2563eb",
        E: "#c2410c",
        F: "#b91c1c",
    };


    const padWithZero = (num) => num.toString().padStart(2, "0");
    const timeTakenString = `${padWithZero(Math.floor(timeTaken / 60))}:${padWithZero(
        timeTaken % 60
    )}`;
    const maxTimeString = `${padWithZero(Math.floor(maxTime / 60))}:${padWithZero(maxTime % 60)}`;

    const score = correctAnswers * 5 - (attemptedQuestions - correctAnswers);
    const scorePercentage = (score / (totalQuestions * 5)) * 100;
    const grade =
        scorePercentage >= 90
            ? "A"
            : scorePercentage >= 85
                ? "B"
                : scorePercentage >= 80
                    ? "C"
                    : scorePercentage >= 75
                        ? "D"
                        : scorePercentage >= 60
                            ? "E"
                            : "F";

    const GradeIndicator = ({ grade }) => {
        return (
            <div className="relative">
                <div className="absolute -top-3 -right-3">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: scoreColorMap[grade] }}
                >
                    <span className="text-4xl font-bold text-white">{grade}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="md:flex gap-4 mb-6 rounded-xl">
                {/* Main Score Card */}
                <div className="w-4/6 bg-gradient-to-br from-slate-700 to-slate-600 p-8 rounded border border-green-300 text-white">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">Exam Result</h2>
                            <p className="text-gray-400">Your performance summary</p>
                        </div>
                        <GradeIndicator grade={grade} />
                    </div>

                    <div className="relative h-2 bg-gray-400 rounded-full mb-8">
                        <div
                            className="absolute top-0 left-0 h-full rounded-full bg-blue-600"
                            style={{ width: `${scorePercentage}%` }}
                        />
                        <div
                            className="absolute -top-8 text-green-400 text-lg font-medium"
                            style={{
                                left: `${scorePercentage}%`,
                                transform: "translateX(-50%)",
                            }}
                        >
                            {scorePercentage.toFixed(2)}%
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className=" flex rounded-lg p-5 w-full items-center gap-4 bg-gradient-to-br from-green-800 to-emerald-700 border border-gray-500">
                            <Gauge className="w-10 h-10 text-indigo-400" />
                            <div className="">
                                <p className=" text-gray-300">Final Score</p>
                                <span className="text-xl font-semibold text-gray-100">
                                    {score}/{totalQuestions * 5}
                                </span>
                            </div>
                        </div>
                        <div className=" flex rounded-lg p-5 w-full items-center gap-4 bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500">
                            <Target className="w-10 h-10 text-indigo-400" />
                            <div className="">
                                <p className="text-gray-300">Accuracy</p>
                                <span className="text-xl font-semibold text-gray-100">
                                    {attemptedQuestions != 0
                                        ? ((correctAnswers / attemptedQuestions) * 100).toFixed(2)
                                        : 0}
                                    %
                                </span>
                            </div>
                        </div>
                        <div className=" flex rounded-lg p-5 w-full items-center gap-4 bg-gradient-to-br from-orange-800 to-orange-700 border border-gray-500">
                            <Hourglass className="w-10 h-10 text-indigo-400" />
                            <div className="">
                                <p className=" text-gray-300">Time Taken</p>
                                <span className="text-xl font-semibold text-gray-100">
                                    {timeTakenString}/{maxTimeString}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded">
                    <h3 className="text-xl font-semibold mb-5 text-white">Question Wise Stats</h3>
                    <div className="space-y-2 text-white">
                        <div className="flex justify-between items-center">
                            <span className="font-medium ">Total Questions</span>
                            <span className="text-2xl font-bold">{totalQuestions}</span>
                        </div>
                        <div className="h-px bg-white/30" />
                        <div className="flex justify-between items-center text-green-400">
                            <span className="font-medium">Correct Answer</span>
                            <span className="text-2xl font-bold">{correctAnswers}</span>
                        </div>
                        <div className="h-px bg-white/30" />
                        <div className="flex justify-between items-center text-rose-500">
                            <span className="font-medium">Incorrect Answer</span>
                            <span className="text-2xl font-bold">
                                {attemptedQuestions - correctAnswers}
                            </span>
                        </div>
                        <div className="h-px bg-white/30" />
                        <div className="flex justify-between items-center text-yellow-400">
                            <span className="font-medium">Unattempted</span>
                            <span className="text-2xl font-bold">
                                {unAttempted}
                            </span>
                        </div>
                        <div className="h-px bg-white/30" />
                        <div className="flex justify-between items-center text-gray-300">
                            <span className="font-medium">Unseen Questions</span>
                            <span className="text-2xl font-bold">{unSeenQuestions}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Question answered/unanswered/leaved Status */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {questionsData.map((datas, indx) => {


                    let statusColor = "bg-yellow-500";
                    let statusText = "Unattempted";

                    if (datas.userSelectedOption === datas.correctAnswer) {
                        statusColor = "bg-green-700 text-white";
                        statusText = "Correct";
                    }
                    else if (datas.userSelectedOption !== null && datas.userSelectedOption !== datas.correctAnswer) {
                        statusColor = "bg-red-700 text-white";
                        statusText = "Incorrect";
                    }
                    else if (datas.status === "not-seen") {
                        statusColor = "bg-gray-300 text-gray-800";
                        statusText = "Unseen";
                    }



                    return (
                        <div
                            key={indx}
                            onClick={() => scrollToQuestion(indx)}
                            className={`flex w-11 h-11 items-center justify-center aspect-square rounded cursor-pointer border text-sm font-medium ${statusColor
                                } hover:opacity-90 transition-opacity relative group`}
                            title={`Question ${indx + 1}: ${statusText}`}
                        >
                            {String(indx + 1).padStart(2, "0")}
                            {/* show circle that will hint that this question was marked for review */}
                            {(datas.status === "marked-for-review" || datas.status === "answered-and-marked-for-review") && (
                                <span className="absolute w-4/5 h-4/5 border-2 border-purple-500 rounded-full"></span>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default MinimalQuizResult;
