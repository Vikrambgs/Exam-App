import React from "react";

function OptionsMore({ options }) {
    options = [
        "Common Law Admission Test (CLAT)",
        "Law School Admission Test (LSAT)",
        "All India Law Entrance Examination (AILET)  All India Law Entrance Examination (AILET)  All India Law Entrance Examination (AILET) ",
        "All India Bar Examination (AIVE)",
    ];
    return (
        <div>
            {options.map((option, index) => (
                <div
                    key={index}
                    className="flex gap-2 my-0.5 items-center pl-2 border-b bg-gray-100"
                >
                    <p className="text-gray-600">
                        ({String.fromCharCode(65 + index)})
                    </p>
                    <p className="text-gray-800">{option}</p>
                </div>
            ))}
        </div>
    );
}

export default OptionsMore;
