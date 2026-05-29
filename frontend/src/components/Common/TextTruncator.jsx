import React from "react";
import { Tooltip } from "@heroui/react";

const TextTruncator = ({ text, maxLength = 20, dots = true, className }) => {
    if (!text) return null;

    let displayText = text;

    if (text.length > maxLength) {
        const lastDotIndex = text.lastIndexOf(".");

        if (lastDotIndex === -1) {
            // No extension
            displayText = text.substring(0, maxLength) + (dots ? "..." : "");
        } else {
            const name = text.substring(0, lastDotIndex);
            const extension = text.substring(lastDotIndex);
            const charsToKeep = Math.max(1, maxLength - 3 - extension.length);
            const truncatedName = name.substring(0, charsToKeep);
            displayText = truncatedName + (dots ? "... " : "") + extension;
        }
    }

    return (
        <Tooltip content={text}>
            <span className={className}>{displayText}</span>
        </Tooltip>
    );
};

export default TextTruncator;
