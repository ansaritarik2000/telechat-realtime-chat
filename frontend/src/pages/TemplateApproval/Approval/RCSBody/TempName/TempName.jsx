import React, { useState, useMemo } from "react";
import { Input, Select } from "@heroui/react";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

export default function TempName() {
    const { templateName, setTemplateName } = useTemplateStore();
    const { t } = useTranslation();
    // Function to validate alphanumeric input
    const validateAlphanumeric = (value) => /^[a-zA-Z0-9]*$/.test(value);

    // Memoized boolean indicating if Template Name input is invalid
    const isInvalidTemplate = useMemo(() => {
        if (templateName === "") return false;
        return !validateAlphanumeric(templateName);
    }, [templateName]);

    // Handle Template Name input change
    const handleTemplateChange = (newValue) => {
        setTemplateName(newValue);
    };

    return (
        <div>
            {/* Template Name */}
            <Input
                isRequired
                value={templateName}
                type="text"
                radius="sm"
                label={t("Template Name")}
                variant="flat"
                isInvalid={
                    !validateAlphanumeric(templateName) ||
                    templateName?.length > 20
                }
                color={
                    !validateAlphanumeric(templateName) ||
                    templateName?.length > 20
                        ? "danger"
                        : "default"
                }
                errorMessage="Template Name can only contain letters and numbers.(MAX 20 characters)"
                className=""
                onValueChange={handleTemplateChange}
            />
        </div>
    );
}
