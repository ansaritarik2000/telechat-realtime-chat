import React, { useState, useMemo, useContext } from "react";
import {
    addToast,
    Input,
    Select,
    SelectItem,
    Spacer,
    Textarea,
    Tooltip,
} from "@heroui/react";
// import FooterButtons from "./Buttons/Index";
import { Icon } from "@iconify-icon/react";
import { RtdContext } from "./Index";
import { useTemplateStore } from "../../../store/templateApprovalStore";
import AddVar from "./Buttons/AddVar";
import { extractVariables } from "./RCSBody/utils/extratVariable";
import { useTranslation } from "react-i18next";
import FooterButtons from "./RCSBody/Buttons/Index";
import { useMutation } from "@tanstack/react-query";
import { saveTemplateFormService } from "../../../services/Sms/smsTemplateFormService";

export const unicodes = [
    { key: "Yes", label: "Yes" },
    { key: "No", label: "No" },
];

export default function SMSTemplate() {
    const {
        smsselectedTemplateType,
        setSmsSelectedTemplateType,
        smsHeader,
        setSMSHeader,
        templateName,
        setTemplateName,
        textMessageContent,
        setTextMessageContent,
    } = useTemplateStore();

    const { t } = useTranslation();

    // Mutation for saving template form
    const mutation = useMutation({
        mutationFn: saveTemplateFormService,
        onSuccess: (data) => {
            console.log("Template saved successfully:", data);
            addToast({
                title: "Success 🎉",
                description: "Template saved successfully!",
                color: "success",
            });
        },
        onError: (error) => {
            console.error("Error saving template:", error);
            addToast({
                title: "Error",
                description: "Failed to save template.",
                color: "danger",
            });
        },
    });

    const onSubmitHandler = () => {
        const templateJson = {
            type: smsselectedTemplateType,
            header: smsHeader,
            name: templateName,
            message: textMessageContent.textMessage,
            variables: textMessageContent.variables,
        };

        mutation.mutate(templateJson); // Call mutation
    };

    // handle input change
    const handleInputChange = (e) => {
        const newMessage = e.target.value;
        const variablesInMessage = extractVariables(newMessage); // extract variable from message
        setTextMessageContent({
            ...textMessageContent,
            textMessage: newMessage,
            variables: variablesInMessage,
        });
    };

    const { textMessage } = textMessageContent;

    // Function to validate alphanumeric input
    const validateAlphanumeric = (value) => /^[a-zA-Z0-9]*$/.test(value);

    // Function to validate 6-digit numeric input for promotional header
    const validatePromotionalHeader = (value) => /^[0-9]{6}$/.test(value);

    // Function to validate alphabetical input of length 6 and uppercase for transactonal header
    const validateTransactionalHeader = (value) => /^[A-Z]{6}$/.test(value);

    // Memoized boolean indicating if Template Name input is invalid
    const isInvalidTemplate = useMemo(() => {
        if (templateName === "") return false;
        return !validateAlphanumeric(templateName);
    }, [templateName]);

    // Memoized boolean indicating if Header input is invalid
    const isInvalidHeader = useMemo(() => {
        if (smsHeader === "") return false;

        // For promotional, validate as 6-digit numeric
        if (smsselectedTemplateType === "promotional") {
            return !validatePromotionalHeader(smsHeader);
        }

        // For transactional, validate as 6-character alphabetical
        return !validateTransactionalHeader(smsHeader);
    }, [smsHeader, smsselectedTemplateType]);

    // Dynamic error message based on template type
    const headerErrorMessage = useMemo(() => {
        if (smsselectedTemplateType === "promotional") {
            return "Header must be a 6-digit numeric value.";
        } else if (smsselectedTemplateType === "transactional") {
            return "Header must be 6 uppercase alphabetical characters.";
        }
        return "";
    }, [smsselectedTemplateType]);

    // Dynamic info message based on template type
    const headerInfoMessage = useMemo(() => {
        if (smsselectedTemplateType === "promotional") {
            return "Please Enter 6-digit numeric value.";
        } else if (smsselectedTemplateType === "transactional") {
            return "Please Enter 6 uppercase alphabetical characters.";
        }
        return "";
    }, [smsselectedTemplateType]);

    // Handle Template Name input change
    const handleTemplateChange = (newValue) => {
        setTemplateName(newValue);
    };

    // Handle Header input change and enforce uppercase
    const handleHeaderChange = (newValue) => {
        setSMSHeader(newValue.toUpperCase());
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
    };

    // Info Icon
    const infoIcon = (
        <Icon
            icon="fluent:info-24-regular"
            width="1.2em"
            height="1.2em"
            className="text-primary"
        />
    );

    return (
        <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-6">
                {/* Template Type */}
                <Select
                    isRequired
                    radius="sm"
                    label={t("Template Type")}
                    variant="flat"
                    placeholder="Select Campaign Type"
                    onChange={(e) => setSmsSelectedTemplateType(e.target.value)}
                    selectedKeys={[smsselectedTemplateType]}
                    className="col-span-6 md:col-span-2">
                    <SelectItem key="promotional">
                        {t("Promotional")}
                    </SelectItem>
                    <SelectItem key="transactional">
                        {t("Transactional")}
                    </SelectItem>
                </Select>

                {/* Template Name */}
                <div className="col-span-6 md:col-span-2">
                    <Input
                        isRequired
                        value={templateName}
                        type="text"
                        radius="sm"
                        label={t("Template Name")}
                        variant="flat"
                        isInvalid={isInvalidTemplate}
                        color={isInvalidTemplate ? "danger" : "default"}
                        errorMessage="Template Name can only contain letters and numbers."
                        className="max-w-xs"
                        //   description="(Alphanumeric Only e.g TEMPLATE01)"
                        onValueChange={handleTemplateChange}
                    />
                </div>

                {/* Header */}
                <div className="col-span-6 md:col-span-2">
                    <Input
                        isRequired
                        radius="sm"
                        endContent={
                            <Tooltip content={headerInfoMessage}>
                                {infoIcon}
                            </Tooltip>
                        }
                        value={smsHeader}
                        type="text"
                        label={t("Header")}
                        variant="flat"
                        isInvalid={isInvalidHeader}
                        color={isInvalidHeader ? "danger" : "default"}
                        errorMessage={headerErrorMessage}
                        className="max-w-xs"
                        onValueChange={handleHeaderChange}
                    />
                </div>

                {/* Unicode */}
                {/* <div className="col-span-6 md:col-span-2">
                  <Select
                      isRequired
                      radius="sm"
                      label="Unicode"
                      variant="flat"
                      placeholder="Select the unicode"
                      selectedKeys={unicode}
                      className="max-w-xs"
                      onSelectionChange={setUnicode}>
                      {unicodes.map((unicode) => (
                          <SelectItem key={unicode.key}>
                              {unicode.label}
                          </SelectItem>
                      ))}
                  </Select>
              </div> */}
            </div>

            {/* Message */}
            <Textarea
                isRequired
                radius="sm"
                label={t("Message")}
                labelPlacement="outside"
                placeholder={t("Type your message here")}
                className="max-w-screen-lg text-gray-500"
                minRows="8"
                value={textMessage}
                maxRows="10"
                onChange={handleInputChange}
            />
            <div className="flex w-full mt-1 pl-1 justify-end text-xs text-gray-400">
                <AddVar handleAddVar={handleAddVar} />
            </div>

            {/* <h1 className="font-bold text-default-400">Message</h1>

      <Spacer />

      {/* Buttons */}
            <div className="pt-10">
                <FooterButtons
                    redirectPath={"/smsreports"}
                    onSubmitHandller={onSubmitHandler}
                />
            </div>
        </div>
    );
}
