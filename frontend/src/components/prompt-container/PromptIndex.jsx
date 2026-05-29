import React, { useEffect, useState } from "react";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownTrigger,
    Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import PromptInput from "./prompt-input";
import DropdownMenu from "../../pages/Email/CreateTemplate/Tabs/Buttons/Dropdown";
import { useTranslation } from "react-i18next";
import { useSendSmsStore } from "../../store/sendSmsStore";
import VarSelector from "../../pages/SMS/SendSMS/VarSelector";
import TestBtn from "../../pages/SMS/SendSMS/Buttons/Test";
import InsertURL from "../../pages/SMS/SendSMS/InsertURL";

const oneCreditChars = 120;
const maxChars = 360;

export default function PromptInputIndex({
    message,
    variables = [],
    csvColumns = [],
}) {
    const [isRegenerating, setIsRegenerating] = React.useState(false);
    const [prompt, setPrompt] = React.useState("");
    const [isValid, setIsValid] = useState(true);
    const [teleCredits, setTeleCredits] = useState(0);
    const [selectedColumns, setSelectedColumns] = useState({});
    const { t } = useTranslation();

    // zustand sms store
    const {
        selectedTemplate,
        setSelectedTemplate,
        smsCharacterCount: charCount,
        setSmsCharacterCount: setCharCount,
    } = useSendSmsStore();

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
        <div className="flex w-full flex-col gap-4">
            <form className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70">
                <PromptInput
                    message={message}
                    isDisabled={!message}
                    value={message}
                    readOnly
                    classNames={{
                        inputWrapper: "!bg-transparent shadow-none",
                        innerWrapper: "relative",
                        input: "pt-1 pl-2 pb-6 !pr-10 text-sm",
                    }}
                    minRows={3}
                    radius="lg"
                    variant="flat"
                    onValueChange={setPrompt}
                />

                <div className="flex w-full flex-wrap items-center justify-between gap-2 px-4 pb-4">
                    <div className="flex flex-wrap gap-3">
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
                    <p className="py-1 text-tiny text-default-400">
                        {t("Character count")}: {charCount}/{maxChars},
                        {t("TeleCredits")}: {teleCredits}
                    </p>
                </div>
            </form>
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <TestBtn />
                    <InsertURL />
                </div>
            </div>
        </div>
    );
}
