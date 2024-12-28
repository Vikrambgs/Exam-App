function HelpPanel({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700">Exam Help</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
                <p>• Use arrow keys ←→ to navigate questions</p>
                <p>• Press R to mark question for review</p>
                <p>• Press C to clear your answer</p>
                <p>• Use number keys 1-4 to select options</p>
                <p>• Click the bookmark icon to save questions for later</p>
            </div>
        </div>
    );
}

export default HelpPanel;
