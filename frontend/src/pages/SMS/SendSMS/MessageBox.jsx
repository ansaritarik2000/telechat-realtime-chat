import React, { useState, useEffect } from "react";
import { Textarea } from "@heroui/react";
import InsertURL from "./InsertURL";
import TestBtn from "./Buttons/Test";
import VarSelector, { VarSelectorEx } from "./VarSelector";
import { useSendSmsStore } from "../../../store/sendSmsStore";
import { useTranslation } from "react-i18next";

const oneCreditChars = 120;
const maxChars = 360;

export default function MessageBox({
    message,
    variables = [],
    csvColumns = [],
}) {
    const [charCount, setCharCount] = useState(0);
    const [isValid, setIsValid] = useState(true);
    const [teleCredits, setTeleCredits] = useState(0);
    const [selectedColumns, setSelectedColumns] = useState({});
    const { t } = useTranslation();

    // zustand sms store
    const { selectedTemplate, setSelectedTemplate, shortURL } =
        useSendSmsStore();

    const handleCharCount = (e) => {
        const inputText = e.target.value;
        const currentLength = inputText.length;

        if (currentLength > maxChars) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }

        setCharCount(currentLength);
    };

    useEffect(() => {
        if (message) {
            setCharCount(message.length || 0);
        }
        if (charCount === 0) {
            setTeleCredits(0);
        } else if (charCount <= oneCreditChars) {
            setTeleCredits(1);
        } else if (
            charCount > oneCreditChars &&
            charCount <= 2 * oneCreditChars
        ) {
            setTeleCredits(2);
        } else {
            setTeleCredits(Math.ceil(message.length || 0) / 120);
        }
    }, [charCount, message]);

    // handle column select and updated this selected value in columns variable
    const handleColumnSelect = (varIndex, label, column) => {
        setSelectedColumns((prevSelected) => ({
            ...prevSelected,
            [varIndex]: column,
        }));

        const messageVars = selectedTemplate.message_vars || [];
        const variableIndex = messageVars.findIndex(
            (obj) => obj.name === label
        );

        if (variableIndex === -1) {
            return; // If the label is not found, exit
        }

        messageVars[variableIndex] = {
            ...messageVars[variableIndex],
            value: column, // Update the value
        };

        setSelectedTemplate({ ...selectedTemplate, message_vars: messageVars });
    };

    // Filter columns by removing already selected ones
    const getAvailableColumns = (varIndex) => {
        return csvColumns.filter(
            (col) =>
                !Object.values(selectedColumns).includes(col) ||
                selectedColumns[varIndex] === col
        );
    };

    return (
        <div className="flex flex-col w-full">
            <Textarea
                isRequired
                radius="sm"
                isInvalid={!isValid}
                label={t("Message Preview1")}
                className=" text-default-500 rounded-t-lg "
                minRows="5"
                maxRows="10"
                onChange={handleCharCount}
                defaultValue={message}
                value={message}
                isDisabled={!message}
                readOnly
                errorMessage="The message length cannot be more than 360 characters."
            />

            <div className="flex flex-col gap-2 -mt-2">
                {variables && variables.length > 0 && (
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

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2 items-center">
                        <TestBtn />
                        <InsertURL />
                    </div>

                    <span className="text-xs text-default-400">
                        {t("Character count")}: {charCount}/{maxChars},
                        {t("TeleCredits")}: {teleCredits}
                    </span>
                </div>
            </div>
        </div>
    );
}
