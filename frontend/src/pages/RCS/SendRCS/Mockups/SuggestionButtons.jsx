import React from "react";

const SuggestionButtons = ({ suggestions }) => {
    console.log("suggestion buttons", suggestions);
    return (
        <div className="flex space-x-2 mt-2">
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    className="bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 shadow-sm text-sm">
                    {suggestion}
                </button>
            ))}
        </div>
    );
};

export default SuggestionButtons;
