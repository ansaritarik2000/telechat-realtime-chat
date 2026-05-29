import React, { useState } from "react";
import ActionButtonsIndex from "../ActionButtons/Index";
import { Textarea } from "@heroui/react";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
// import FooterButtons from "../../Buttons/Index";
import AddVar from "../../Buttons/AddVar";
import { extractVariables } from "../utils/extratVariable";
import { useTranslation } from "react-i18next";
import { createTextTemplateService } from "../../../../../services/Rcs/rcsTemplateService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FallbackTextInput from "../TempType/FallbackTextInput";
import FooterButtons from "../Buttons/Index";

export default function Text() {
    const maxChars = 2000;
    const {
        templateName,
        selectedTemplateType,
        selectedBot,
        textMessageContent,
        setTextMessageContent,
        fallbackText,
        fallbackTextVariables,
    } = useTemplateStore();
    const { t } = useTranslation();
    const token = localStorage.getItem("token");
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();

    const handleSmsInput = (e) => {
        const newMessage = e.target.value;
        const variablesInMessage = extractVariables(newMessage); // extract variable from message

        setTextMessageContent({
            ...textMessageContent,
            textMessage: newMessage,
            variables: variablesInMessage, // Update variables based on message content
        });

        setCharCount(newMessage.length);
    };

    // Function to add a variable when "Add Variable" is clicked
    const handleAddVar = () => {
        const newVariable = `{{var${textMessageContent.variables.length + 1}}}`;

        // Add the new variable to the text message and variables array
        setTextMessageContent({
            ...textMessageContent,
            textMessage: textMessageContent.textMessage + " " + newVariable,
            variables: [...textMessageContent.variables, newVariable],
        });

        setCharCount(
            textMessageContent.textMessage.length + newVariable.length + 1
        );
    };

    const createTextTemplateHandller = async () => {
        // create text template
        const response = await createTextTemplateService(token, {
            bot_id: selectedBot?.bot_id,
            template_name: templateName,
            template_type: selectedTemplateType,
            message: textMessageContent.textMessage,
            //   fallbackText: textMessageContent.fallbackText,
            suggestions: textMessageContent.buttons,
            variables: textMessageContent.variables,
            fallbackText,
            fallbackTextVariables,
        });
        if (response.status === "SUCCESS") {
            toast.success("Template created successfully.");
            // navigate("/template-approval");
        } else {
            toast.error("Failed to create template.");
        }
    };

    return (
        <div className="flex flex-col space-y-8">
            {/* fall back text Section */}

            <div>
                <Textarea
                    isRequired
                    value={textMessageContent.textMessage}
                    radius="sm"
                    label={t("Message")}
                    placeholder={t("Type your message here")}
                    className="text-gray-500"
                    minRows="8"
                    maxRows="10"
                    onChange={handleSmsInput}
                />
                <div className="flex w-full mt-1 pl-1 justify-end text-xs text-gray-400">
                    <AddVar handleAddVar={handleAddVar} />
                    <p className="ml-2">
                        {t("Characters used")}: {charCount}/{maxChars}
                    </p>
                </div>
            </div>

            <FallbackTextInput />
            {/* Card Section */}

            {/* Action Buttons */}
            <ActionButtonsIndex actionButtons={textMessageContent?.buttons} />
            {/* Footer Buttonns */}
            <div className="py-10">
                <FooterButtons
                    onSubmitHandller={() => createTextTemplateHandller()}
                    templateName={templateName}
                />
                {/* <FooterButtons onSubmit={createTextTemplateHandller} /> */}
            </div>
        </div>
    );
}
