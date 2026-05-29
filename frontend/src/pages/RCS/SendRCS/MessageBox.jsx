import React, { useState, useEffect } from "react";
import { Textarea } from "@heroui/react";
import VarSelector from "../../SMS/SendSMS/VarSelector";
import TestBtn from "./Buttons/Test";
import { useSendRcStore } from "../../../store/sendRcsStore";
import { useRcsStore } from "../../../store/rcsStore";
import { useTranslation } from "react-i18next";
const oneCreditChars = 120;
const maxChars = 360;

export default function MessageBox({
    message,
    variables = [],
    csvColumns = [],
    label,
}) {
    const { template, setTemplate } = useSendRcStore();
    const { currentSlide } = useRcsStore();
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

        // update template slected variable it's value
        switch (template.type) {
            //  For text type template
            case "text_message": {
                const updatedTemplateContent = [...template.template_contents];
                const messageVars = updatedTemplateContent[0].message_vars;
                const variableIndex = messageVars.findIndex(
                    (obj) => obj.name === label
                );

                if (variableIndex === -1) {
                    break; // If the label is not found, exit
                }

                messageVars[variableIndex] = {
                    ...messageVars[variableIndex],
                    value: column, // Update the value
                };

                updatedTemplateContent[0] = {
                    ...updatedTemplateContent[0],
                    message_vars: messageVars,
                };

                setTemplate({
                    ...template,
                    template_contents: updatedTemplateContent,
                });

                break;
            }

            //  For "singleimg" or "video" or carousel  type templates
            case "singleimg":
            case "imgcarousel":
            case "video": {
                const cardIndex =
                    template.type === "imgcarousel" ? currentSlide : 0;

                const updatedTemplateContent = [...template.template_contents];
                const cardHeadingVars =
                    updatedTemplateContent[cardIndex].card_heading_vars || [];
                const cardSubheadingVars =
                    updatedTemplateContent[cardIndex].card_subheading_vars ||
                    [];

                // Find the index in card_heading_vars
                let variableIndex = cardHeadingVars.findIndex(
                    (obj) => obj.name === label
                );

                if (variableIndex !== -1) {
                    // If the label matches in card_heading_vars, update it
                    cardHeadingVars[variableIndex] = {
                        ...cardHeadingVars[variableIndex],
                        value: column, // Update the value
                    };

                    updatedTemplateContent[cardIndex] = {
                        ...updatedTemplateContent[cardIndex],
                        card_heading_vars: cardHeadingVars,
                    };
                } else {
                    // If not found in card_heading_vars, search in card_subheading_vars
                    variableIndex = cardSubheadingVars.findIndex(
                        (obj) => obj.name === label
                    );

                    if (variableIndex !== -1) {
                        // If the label matches in card_subheading_vars, update it
                        cardSubheadingVars[variableIndex] = {
                            ...cardSubheadingVars[variableIndex],
                            value: column, // Update the value
                        };

                        updatedTemplateContent[cardIndex] = {
                            ...updatedTemplateContent[cardIndex],
                            card_subheading_vars: cardSubheadingVars,
                        };
                    } else {
                        break; // If no match is found in either array, exit
                    }
                }

                // Update the template with the new content
                setTemplate({
                    ...template,
                    template_contents: updatedTemplateContent,
                });

                break;
            }

            default:
                break;
        }
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
                className="w-full text-left text-gray-500"
                minRows="5"
                maxRows="10"
                onChange={handleCharCount}
                readOnly
                defaultValue={textAreaMessage}
                value={textAreaMessage}
                errorMessage="The message length cannot be more than 360 characters."
            />
            <div className="flex flex-col -mt-2">
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

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2 items-center">
                        <TestBtn />
                        {/* <InsertURL /> */}
                    </div>

                    <span className="text-xs text-default-400">
                        {t("Character count")}: {charCount}/{maxChars}
                    </span>
                </div>
            </div>
        </div>
    );
}
