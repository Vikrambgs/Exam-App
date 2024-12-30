import React from "react";

function OptionsMore({ options }) {
    return (
        <div>
            {options.map((elem, index) => (
                <div
                    key={index}
                    className="flex gap-2 my-0.5 items-center pl-2 border-b bg-slate-200 text-gray-900 font-normal rounded"
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
