import { X, Moon, Sun, Clock, Volume2, VolumeX, Type, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

// Reusable block component for settings
const SettingBlock = ({ icon, title, subtitle, children }) => (
    <div className="my-3 p-2 px-4 bg-gray-700/40 border border-gray-600 rounded flex items-center justify-between hover:bg-gray-700 transition-all">
        <div>
            <p className="flex items-center gap-2 mb-1.5">
                {icon}
                {title}
            </p>
            <p className="text-sm text-gray-300">{subtitle}</p>
        </div>
        {children}
    </div>
);

const ExamSetting = ({ onClose }) => {
    const [settings, setSettings] = useState({
        timer: false,
        showProgress: false,
        globalProgress: false,
        sound: false,
        showStatus: false,
    });

    const toggle = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center font-roboto">
            <div className="relative w-full max-w-5xl max-h-[95vh] bg-gray-900 border border-gray-700 rounded shadow-2xl text-white overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4 bg-gray-800">
                    <h2 className="text-xl font-semibold">Settings</h2>
                    <button onClick={onClose} className="hover:text-red-400 transition-colors">
                        <X />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto h-[70vh] space-y-4">
                    <h3 className="text-lg font-semibold mb-2">Appearance</h3>

                    <SettingBlock
                        icon={<Moon className="w-5 h-5" />}
                        title="Theme"
                        subtitle="Choose between light or dark mode"
                    >
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-gray-200 text-black rounded-md flex items-center gap-1 hover:bg-white">
                                <Sun className="w-4 h-4" /> Light
                            </button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-md flex items-center gap-1 hover:bg-blue-500">
                                <Moon className="w-4 h-4" /> Dark
                            </button>
                        </div>
                    </SettingBlock>

                    <SettingBlock
                        icon={<Type className="w-5 h-5" />}
                        title="Font Size"
                        subtitle="Adjust the font size"
                    >
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500">
                                Small
                            </button>
                            <button className="px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-500">
                                Medium
                            </button>
                            <button className="px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500">
                                Large
                            </button>
                        </div>
                    </SettingBlock>

                    <SettingBlock
                        icon={<Clock className="w-5 h-5" />}
                        title="Show Timer"
                        subtitle="Display a timer during the exam"
                    >
                        <ToggleSwitch checked={settings.timer} onClick={() => toggle("timer")} />
                    </SettingBlock>

                    <SettingBlock
                        icon={<Eye className="w-5 h-5" />}
                        title="Question Progress Bar"
                        subtitle="Show progress for each question"
                    >
                        <ToggleSwitch
                            checked={settings.showProgress}
                            onClick={() => toggle("showProgress")}
                        />
                    </SettingBlock>

                    <SettingBlock
                        icon={<Eye className="w-5 h-5" />}
                        title="Global Time Progress"
                        subtitle="Show overall exam progress"
                    >
                        <ToggleSwitch
                            checked={settings.globalProgress}
                            onClick={() => toggle("globalProgress")}
                        />
                    </SettingBlock>

                    <SettingBlock
                        icon={<Volume2 className="w-5 h-5" />}
                        title="Sound Effects"
                        subtitle="Play sounds during actions"
                    >
                        <ToggleSwitch checked={settings.sound} onClick={() => toggle("sound")} />
                    </SettingBlock>

                    <SettingBlock
                        icon={<EyeOff className="w-5 h-5" />}
                        title="Question Status"
                        subtitle="Show status panel by default"
                    >
                        <ToggleSwitch
                            checked={settings.showStatus}
                            onClick={() => toggle("showStatus")}
                        />
                    </SettingBlock>
                </div>
            </div>
        </div>
    );
};

// Toggle Switch UI
const ToggleSwitch = ({ checked, onClick }) => (
    <button
        onClick={onClick}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors border-2 ${
            checked ? "bg-blue-600 border-blue-500" : "bg-gray-600 border-gray-500"
        }`}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${
                checked ? "translate-x-6" : "translate-x-0.5"
            }`}
        />
    </button>
);

export default ExamSetting;
