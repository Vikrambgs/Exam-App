import React from 'react'

function HelpWindow({ isOpen, onClose }) {
    if (!isOpen) return null;

    const handleCopyPrompt = () => {
        const copyText = `
Your task is to create multiple-choice questions (MCQs) in JSON format. Each question should be represented as an object, and all questions should be stored within an array. The JSON structure must follow one or more of the formats outlined below.

General Guidelines
Each question must have a unique ID represented as "id" (e.g., "Q1").
The "parts" field contains the main body of the question. It may include plain text, a mix of text and special structures (e.g., pre-options or matching lists), or a combination of both.
The "o" field (options) contains an array of possible answers.
The "a" field (answer) represents the index (zero-based) of the correct option in the "o" array.
Ensure that the option order is shuffled for every question. The correct answer must not consistently appear in the same position (e.g., always at index 0).
For matching questions, shuffle the pairs in "list1" and "list2" to ensure variety.
Always try to cover all concepts relevant to the given context or book content.
Include diverse question types (e.g., simple, matching, and pre-options) to comprehensively test the learner's understanding.
Supported Formats
Here are examples of the structures you can use:

Type 1: Simple Questions
Contains a plain text question and multiple answer choices.

{
    "id": "Q1",
    "parts": [
        "The Supreme Court envisaged in the Constitution of India in 1950 included:"
    ],
    "o": [
        "One Chief Justice and 11 Judges",
        "One Chief Justice and 15 Judges",
        "One Chief Justice and 7 Judges",
        "Only 30 Judges"
    ],
    "a": 3
}


Type 2: Pre-Options Embedded
Includes a special "pre_o" structure inside the "parts" for intermediate or dependent sub-options.

{
    "id": "Q2",
    "parts": [
        "Question description with pre option is given",
        {
            "pre_o": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ]
        }
    ],
    "o": [
        "Only B and D",
        "Only A",
        "All of the above",
        "Only A and B"
    ],
    "a": 0
}

Type 3: Matching Lists
Includes a "match" object with "list1" and "list2" for matching questions. and total item in list1 and list2 can go maximum of 6 items in both but not always try to create 6 item maximum time create 4 to 5 items as option

{
    "id": "Q3",
    "parts": [
        "Match listI to List II from the following with some description about question:"
    ],
    "match": {
        "list1": [
            "Item option 1",
            "Item option 2",
            "Item option 3",
            "Item option 4"
        ],
        "list2": [
            "Match option 1",
            "Match option 2",
            "Match option 3",
            "Match option 4"
        ]
    },
    "o": [
        "(A)→(I)    (B)→(IV)  (C)→(III) (D)→(II)",
        "(A)→(II)   (B)→(I)   (C)→(IV)  (D)→(III)",
        "(A)→(III)  (B)→(II)  (C)→(I)   (D)→(IV)",
        "(A)→(III)  (B)→(I)   (C)→(IV)  (D)→(II)"
    ],
    "a": 3
}
Expected Output
An array of JSON objects representing MCQs, adhering to one or more of the above formats, with shuffled options and diverse question types covering all concepts from the given material.
        `

        navigator.clipboard.writeText(copyText);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-3/4 mx-4 shadow-xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Prompt to Generate JSON-Formatted MCQ Questions</h3>
                    <div className="flex gap-5 items-center">
                        <button className="px-5 h-9 bg-green-800 hover:bg-green-700 active:bg-green-600 text-gray-200 rounded font-medium" onClick={handleCopyPrompt}>Copy Prompt</button>
                        <button onClick={onClose} className="bg-red-900 text-red-400 hover:text-red-300 rounded-full w-9 h-9 py-0 flex justify-center items-center">
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="prose prose-sm overflow-y-auto flex-1 custom-scrollbar">
                    
                    <p className="mt-5">Your task is to create multiple-choice questions (MCQs) in JSON format. Each question should be represented as an object, and all questions should be stored within an array. The JSON structure must follow one or more of the formats outlined below.</p>

                    <h4 className="text-md font-semibold mt-2">General Guidelines</h4>
                    <ul className="list-disc list-inside pl-5 pt-1">
                        <li>Each question must have a <strong>unique ID</strong> represented as <code>"id"</code> (e.g., "Q1").</li>
                        <li>The <code>"parts"</code> field contains the main body of the question. It may include plain text, a mix of text and special structures (e.g., pre-options or matching lists), or a combination of both.</li>
                        <li>The <code>"o"</code> field (options) contains an array of possible answers.</li>
                        <li>The <code>"a"</code> field (answer) represents the index (zero-based) of the correct option in the <code>"o"</code> array.</li>
                        <li>Ensure that the <strong>option order is shuffled</strong> for every question. The correct answer must not consistently appear in the same position (e.g., always at index 0).</li>
                        <li>For <strong>matching questions</strong>, shuffle the pairs in <code>"list1"</code> and <code>"list2"</code> to ensure variety.</li>
                        <li>Always try to cover <strong>all concepts</strong> relevant to the given context or book content.</li>
                        <li>Include diverse question types (e.g., simple, matching, and pre-options) to comprehensively test the learner's understanding.</li>
                    </ul>

                    <h4 className="text-md font-semibold mt-2">Supported Formats</h4>
                    <p className="mt-1">Here are examples of the structures you can use:</p>

                    <h5 className="text-sm font-semibold mt-1">Type 1: Simple Questions</h5>
                    <p>Contains a plain text question and multiple answer choices.</p>
                    <pre className="bg-gray-200 p-2 rounded">
                     <code>
                        {`{
    "id": "Q1",
    "parts": [
        "The Supreme Court envisaged in the Constitution of India in 1950 included:"
    ],
    "o": [
        "One Chief Justice and 11 Judges",
        "One Chief Justice and 15 Judges",
        "One Chief Justice and 7 Judges",
        "Only 30 Judges"
    ],
    "a": 3
}`}
                        </code>
                    </pre>


                    <h5 className="text-sm font-semibold mt-3">Type 2: Pre-Options Embedded</h5>
                    <p>Includes a special <code>"pre_o"</code> structure inside the <code>"parts"</code> for intermediate or dependent sub-options.</p>
                    <pre className="bg-gray-200 p-2 rounded">
                        <code>
                        {`{
    "id": "Q2",
    "parts": [
        "Question description with pre option is given",
        {
            "pre_o": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ]
        }
    ],
    "o": [
        "Only B and D",
        "Only A",
        "All of the above",
        "Only A and B"
    ],
    "a": 0
}`}
                        </code>
                    </pre>

                    <h5 className="text-sm font-semibold mt-3">Type 3: Matching Lists</h5>
                    <p>Includes a <code>"match"</code> object with <code>"list1"</code> and <code>"list2"</code> for matching questions. and total item in list1 and list2 can go maximum of 6 items in both but not always try to create 6 item maximum time create 4 to 5 items as option</p>
                    <pre className="bg-gray-200 p-2 rounded">
                        <code>
                        {`{
    "id": "Q3",
    "parts": [
        "Match listI to List II from the following with some description about question:"
    ],
    "match": {
        "list1": [
            "Item option 1",
            "Item option 2",
            "Item option 3",
            "Item option 4"
        ],
        "list2": [
            "Match option 1",
            "Match option 2",
            "Match option 3",
            "Match option 4"
        ]
    },
    "o": [
        "(A)→(I)   (B)→(IV)  (C)→(III) (D)→(II)",
        "(A)→(II)  (B)→(I)   (C)→(IV)  (D)→(III)",
        "(A)→(III) (B)→(II)  (C)→(I)   (D)→(IV)",
        "(A)→(III)  (B)→(I) (C)→(IV)  (D)→(II)"
    ],
    "a": 3
}`}
                        </code>
                    </pre>

                    <h4 className="text-md font-semibold mt-4">Expected Output</h4>
                    <p>An array of JSON objects representing MCQs, adhering to one or more of the above formats, with shuffled options and diverse question types covering all concepts from the given material.</p>
                </div>
            </div>
        </div>
    );
}

export default HelpWindow
