import React from "react";

function OptionsMore({ options }) {
    return (
        <div className="my-1.5">
            {options.map((elem, index) => (
                <div
                    key={index}
                    className="flex gap-2 my-0.5 items-center pl-1 border-b bg-slate-200 text-gray-900 font-medium"
                >
                    <p>
                        ({String.fromCharCode(65 + index)})
                    </p>
                    <p>{elem}</p>
                </div>
            ))}
        </div>
    );
}

export default OptionsMore;
