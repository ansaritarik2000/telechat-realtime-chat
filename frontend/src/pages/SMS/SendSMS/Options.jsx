import { addToast, Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useSendSmsStore } from "../../../store/sendSmsStore";
import {
    getAllTemplateTypesSerivce,
    getHeadersByTempidService,
    getTemplateBasedOnTypeIdService,
} from "../../../services/Sms/smsTemplateService";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "../../../utils/ReusableIcons";

export default function DropDownInput() {
    const { t } = useTranslation();

    const {
        templateTypes,
        setTemplateTypes,
        templates,
        setTemplates,
        headers,
        setHeaders,
        selectedTemplateType,
        selectedTemplate,
        selectedHeader,
        setSelectedTemplateType,
        setSelectedTemplate,
        setSelectedHeader,
        smsCharacterCount,
        setSmsCharacterCount,
    } = useSendSmsStore();

    // Utility function to find selected name
    const findSelectedName = (selectedId, name, dataArray) => {
        const selectedItem = dataArray.find((item) => item.id === selectedId);

        switch (name) {
            case "templateType":
                setSelectedTemplateType(selectedItem);
                setSmsCharacterCount(0);
                setSelectedTemplate({});
                setSelectedHeader({});
                break;

            case "template":
                setSelectedTemplate(selectedItem);
                setSelectedHeader({});
                setSmsCharacterCount(0);
                break;

            case "header":
                setSelectedHeader(selectedItem);
                setSmsCharacterCount(0);

            default:
                break;
        }
        return selectedItem;
    };

    // Fetch bot with react-query
    const {
        isError: isTemplateTypeFetchingHasError,
        error: errorInTemplateTypeFetching,
        isPending: isTemplateTypeFetching,
    } = useQuery({
        queryKey: ["templatetype"],
        queryFn: async () => {
            const data = await getAllTemplateTypesSerivce();
            setTemplateTypes(data);

            return "Success";
        },
    });

    if (isTemplateTypeFetchingHasError) {
        addToast({
            title: errorInTemplateTypeFetching?.name || "Template types",
            description:
                errorInTemplateTypeFetching?.message ||
                "Error in fetching template types",
        });
    }

    // Fetch templates when a template type is selected
    const {
        isError: isTemplateFetchingHasError,
        error: errorTemplateFetching,
        isPending: isTemplateFetching,
    } = useQuery({
        queryKey: ["templates", selectedTemplateType?.id],
        queryFn: async () => {
            const templateTypeId = selectedTemplateType?.id;
            if (templateTypeId) {
                const data = await getTemplateBasedOnTypeIdService(
                    templateTypeId
                );
                setTemplates(data);

                return "success";
            }

            throw `Error in getting "Template Type ID"`;
        },
        enabled: !!selectedTemplateType?.id,
    });

    if (isTemplateFetchingHasError) {
        addToast({
            title: errorTemplateFetching?.name || "Templates",
            description:
                errorTemplateFetching?.message || "Error in fetching templates",
        });
    }

    // Fetch headers when a template is selected
    const {
        isError: isHeaderFetchingHasError,
        error: errorHeaderFetching,
        isPending: isHeaderFetching,
    } = useQuery({
        queryKey: ["headers", selectedTemplate?.id],
        queryFn: async () => {
            const templateId = selectedTemplate?.id;
            if (templateId) {
                const data = await getHeadersByTempidService(templateId);
                setHeaders(data);
                if (data && data.length > 0) {
                    setSelectedHeader(data[0]); // Set the first header as the selected item
                }
                return "success";
            }

            throw `Error in getting "Template ID"`;
        },
        enabled: !!selectedTemplate?.id,
    });

    if (isHeaderFetchingHasError) {
        addToast({
            title: errorHeaderFetching?.name || "Headers",
            description:
                errorHeaderFetching?.message || "Error in fetching headers",
        });
    }

    return (
        <form>
            <div className="flex justify-between items-center gap-6 w-full">
                {/* Template Type */}
                <Select
                    isRequired
                    radius="sm"
                    label={t("Template Type")}
                    variant="flat"
                    selectedKeys={
                        selectedTemplateType ? [selectedTemplateType.id] : []
                    }
                    isDisabled={isTemplateTypeFetching}
                    onSelectionChange={(keys) =>
                        findSelectedName(
                            keys.anchorKey,
                            "templateType",
                            templateTypes
                        )
                    }
                    startContent={
                        isTemplateTypeFetching ? <LoaderIcon /> : null
                    }>
                    {templateTypes.map((type) => (
                        <SelectItem key={type.id}>{type.name}</SelectItem>
                    ))}
                </Select>

                {/* Template  */}
                <Select
                    isRequired
                    radius="sm"
                    label={t("Template")}
                    variant="flat"
                    selectedKeys={selectedTemplate ? [selectedTemplate.id] : []}
                    isDisabled={isTemplateFetching}
                    onSelectionChange={(keys) =>
                        findSelectedName(keys.anchorKey, "template", templates)
                    }
                    startContent={
                        selectedTemplateType?.id && isTemplateFetching ? (
                            <LoaderIcon />
                        ) : null
                    }>
                    {templates.map((template) => (
                        <SelectItem key={template.id}>
                            {template.name}
                        </SelectItem>
                    ))}
                </Select>

                {/* Header */}
                <Select
                    isRequired
                    radius="sm"
                    label={t("Header")}
                    variant="flat"
                    isDisabled={isHeaderFetching}
                    startContent={
                        selectedTemplate?.id && isHeaderFetching ? (
                            <LoaderIcon />
                        ) : null
                    }
                    selectedKeys={selectedHeader ? [selectedHeader.id] : []}
                    onSelectionChange={(keys) =>
                        findSelectedName(keys.anchorKey, "header", headers)
                    }>
                    {headers.map((header) => (
                        <SelectItem key={header.id}>{header.name}</SelectItem>
                    ))}
                </Select>
            </div>
        </form>
    );
}
