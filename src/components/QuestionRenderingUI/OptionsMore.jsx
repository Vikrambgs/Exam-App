import React from "react";

function OptionsMore({ options }) {
    return (
        <div className="my-1.5">
            {options.map((elem, index) => (
                <div
                    key={index}
                    className="flex gap-2 my-1 items-center pl-1 bg-slate-800 text-gray-200 font-medium"
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
