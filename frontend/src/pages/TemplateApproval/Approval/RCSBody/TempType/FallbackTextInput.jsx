import React, { useState } from "react";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { Input } from "@heroui/react";
import AddVar from "../../Buttons/AddVar";
import { t } from "i18next";

const FallbackTextInput = () => {
    const {
        fallbackText,
        fallbackTextVariables,
        setFallbackText,
        setFallbackTextVariables,
    } = useTemplateStore();
    const [charCount, setCharCount] = useState(0);
    const maxChars = 160;
    {
        /* handle fall back text change */
    }
    const handleFallbackTextChange = (newValue) => {
        setFallbackText(newValue);
        setCharCount(newValue.length);
    };

    // Function to add a variable when "Add Variable" is clicked
    const handleAddVar = () => {
        const newVariable = `{{var${fallbackTextVariables?.length + 1}}}`;
        setFallbackTextVariables([...fallbackTextVariables, newVariable]);
        setFallbackText(fallbackText + " " + newVariable);
        setCharCount(fallbackText?.length + newVariable?.length + 1);
    };

    return (
        <div>
            {/* Template Name */}
            <Input
                value={fallbackText}
                type="text"
                radius="sm"
                label={"Fallback Text"}
                variant="flat"
                isInvalid={fallbackText?.length > maxChars}
                color={fallbackText?.length > maxChars ? "danger" : "default"}
                errorMessage={`Fallback Text can only contain ${maxChars} characters.`}
                className=""
                onValueChange={handleFallbackTextChange}
            />
            <div className="flex w-full mt-1 pl-1 justify-end text-xs text-gray-400">
                <AddVar handleAddVar={handleAddVar} />
                <p className="ml-2">
                    {t("Characters used")}: {charCount}/{maxChars}
                </p>
            </div>
        </div>
    );
};

export default FallbackTextInput;
