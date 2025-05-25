import { X } from "lucide-react";
import React, { useState } from "react";

const ExamSetting = ({onClose}) => {
    const [settings, setSettings] = useState({
        questionProgressBar: true,
        globalProgressBar: true,
        showTimer: true,
    });

    const handleToggle = (setting) => {
        setSettings((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }));
    };

    const ToggleSwitch = ({ isOn, onToggle, label, description }) => (
        <div className="flex items-center justify-between p-4 bg-gray-900/60 rounded-lg border border-gray-700/50 hover:bg-gray-900/70 transition-all duration-300">
            <div className="flex flex-col">
                <span className="text-lg text-white">{label}</span>
                <span className="text-sm text-gray-400">{description}</span>
            </div>
            <button
                onClick={onToggle}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    isOn
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-md shadow-blue-500/30"
                        : "bg-gray-600"
                }`}
            >
                <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        isOn ? "translate-x-6" : ""
                    }`}
                />
            </button>
        </div>
    );

    return (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black/80 z-40 flex items-center justify-center font-roboto">

            <div className="absolute z-50 w-[90%] max-w-4xl h-fit max-h-[90%] overflow-y-auto border border-gray-400/40 bg-gray-900 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-2xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Exam Settings
                    </h1>
                    <button
                    onClick={()=>onClose()}>
                        <X
                            className="text-gray-300 hover:text-red-500 transition"
                            size={28}
                        />
                    </button>
                </div>

                {/* Settings */}
                <div className="space-y-5">
                    <ToggleSwitch
                        isOn={settings.questionProgressBar}
                        onToggle={() => handleToggle("questionProgressBar")}
                        label="Question Progress Bar"
                        description="Show progress for individual questions"
                    />

                    <ToggleSwitch
                        isOn={settings.globalProgressBar}
                        onToggle={() => handleToggle("globalProgressBar")}
                        label="Global Progress Bar"
                        description="Show overall progress across the test"
                    />

                    <ToggleSwitch
                        isOn={settings.showTimer}
                        onToggle={() => handleToggle("showTimer")}
                        label="Timer Display"
                        description="Display timer during the exam session"
                    />
                </div>
            </div>
        </div>

    );
};

export default ExamSetting;
