import React, { useState, useEffect } from "react";
import { Textarea } from "@heroui/react";
import VarSelector from "../../SMS/SendSMS/VarSelector";
import { useSendRcStore } from "../../../store/sendRcsStore";
import { useTranslation } from "react-i18next";
const maxChars = 120;

export default function FallbackTextBox({
    message,
    variables = [],
    csvColumns = [],
    label,
}) {
    const { template, setTemplate } = useSendRcStore();
    const [charCount, setCharCount] = useState(message.length || 0);
    const [isValid, setIsValid] = useState(true);
    const [textAreaMessage, setTextAreaMessage] = useState(message);
    const [selectedColumns, setSelectedColumns] = useState({});
    const { t } = useTranslation();

    const handleCharCount = (e) => {
        const inputText = e.target.value;
        const currentLength = inputText.length;
        if (currentLength > maxChars) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
        setTextAreaMessage(e.target.value);
        setCharCount(currentLength);
    };

    const handleColumnSelect = (varIndex, label, column) => {
        setSelectedColumns((prevSelected) => ({
            ...prevSelected,
            [varIndex]: column,
        }));

        // update template selected variable it's value
        if (
            template.fallbackTextVariables &&
            template.fallbackTextVariables.length > 0
        ) {
            const fallbackTextVars = template.fallbackTextVariables;
            const variableIndex = fallbackTextVars.findIndex(
                (obj) => obj.name === label
            );

            if (variableIndex === -1) {
                return; // If the label is not found, exit
            }

            fallbackTextVars[variableIndex] = {
                ...fallbackTextVars[variableIndex],
                value: column, // Update the value
            };

            setTemplate({
                ...template,
                fallbackTextVariables: fallbackTextVars,
            });
        }
    };

    // Filter columns by removing already selected ones
    const getAvailableColumns = (varIndex) => {
        return csvColumns.filter(
            (col) =>
                !Object.values(selectedColumns).includes(col) ||
                selectedColumns[varIndex] === col
        );
    };

    // this useeffect is used for message length count
    useEffect(() => {
        setTextAreaMessage(message);
        setCharCount(message?.length);
    }, [message]);

    return (
        <div>
            <Textarea
                isRequired
                radius="sm"
                isInvalid={!isValid}
                label={label || t("Message")}
                labelPlacement="inside"
                className="max-w-screen-lg text-left text-gray-500"
                minRows="1"
                maxRows="2"
                onChange={handleCharCount}
                readOnly
                defaultValue={textAreaMessage}
                value={textAreaMessage}
                errorMessage="The message length cannot be more than 360 characters."
            />
            <div className="flex flex-col gap-1 -mt-2">
                {variables.length > 0 && (
                    <div className="flex gap-2 bg-default-100 py-2 border-t-0 border-transparent rounded-b-lg rounded-t-lg">
                        {variables?.map((variable, index) => {
                            const availableColumns = getAvailableColumns(index);
                            return (
                                <VarSelector
                                    label={variable?.name}
                                    key={index}
                                    availableColumns={availableColumns}
                                    onColumnSelect={(label, column) =>
                                        handleColumnSelect(index, label, column)
                                    }
                                />
                            );
                        })}
                    </div>
                )}
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-default-400">
                        {t("Character count")}: {charCount}/{maxChars}
                    </span>
                </div>
            </div>
        </div>
    );
}
