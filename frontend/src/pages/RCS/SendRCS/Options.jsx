import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import {
    getTemplates,
    getTemplateTypes,
} from "../../../services/Rcs/rcsTemplateService";
import { getRCSBots } from "../../../services/Rcs/rcsBotService";
import { useSendRcStore } from "../../../store/sendRcsStore";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { LoaderIcon } from "../../../utils/ReusableIcons";

export default function DropDownInput() {
    const { t } = useTranslation();

    // zustand store
    const {
        selectedBot,
        setSelectedBot,
        selectedTemplateType,
        setSelectedTemplateType,
        selectedTemplate,
        setSelectedTemplate,
        setTemplate,
        bots,
        setBots,
        templateTypes,
        setTemplateTypes,
        templates,
        setTemplates,
    } = useSendRcStore();

    // Utility function to find selected name
    const findSelectedName = (selectedId, name, dataArray) => {
        const selectedItem = dataArray.find(
            (item) => item.id === parseInt(selectedId)
        );
        switch (name) {
            case "bot":
                setSelectedBot(selectedItem);
                setSelectedTemplate({});
                setTemplate({});
                break;

            case "templateType":
                setSelectedTemplateType(selectedItem);
                setSelectedTemplate({});
                setTemplate({});
                break;

            case "template":
                setSelectedTemplate(selectedItem);

            default:
                break;
        }
        return selectedItem;
    };

    // Fetch bot with react-query
    const {
        isError: isBotFetchingHasError,
        error: errorInBotFetching,
        isPending: isBotFetching,
    } = useQuery({
        queryKey: ["bots"],
        queryFn: async () => {
            const data = await getRCSBots();
            setBots(data);

            return "Success";
        },
    });

    if (isBotFetchingHasError) {
        addToast({
            title: errorInBotFetching.name,
            description: errorInBotFetching.message,
        });
    }

    // Fetch bot with react-query
    const {
        isError: isTemplateFetchingHasError,
        error: errorInTemplateFetching,
        isPending: isTemplateFetching,
    } = useQuery({
        queryKey: ["template"],
        queryFn: async () => {
            const data = await getTemplateTypes();
            setTemplateTypes(data);

            return "Success";
        },
    });

    if (isTemplateFetchingHasError) {
        addToast({
            title: errorInTemplateFetching.name,
            description: errorInTemplateFetching.message,
        });
    }

    // Fetch templates when select user bot  and template type

    const {
        isError: isMainTemplateFetchingHasError,
        error: errorInMainTemplateFetching,
        isPending: isMainTemplateFetching,
    } = useQuery({
        queryKey: ["main-template", selectedBot?.id, selectedTemplateType?.id],
        queryFn: async () => {
            const botId = selectedBot?.id;
            const templateTypeId = selectedTemplateType?.id;
            if (botId && templateTypeId) {
                const data = await getTemplates(botId, templateTypeId);
                setTemplates(data);

                return "success";
            }

            throw `Error in getting "Bot ID" & "Template Type ID"`;
        },
        enabled: !!(selectedBot?.id && selectedTemplateType?.id),
    });

    if (isMainTemplateFetchingHasError) {
        addToast({
            title: errorInMainTemplateFetching.name,
            description: errorInMainTemplateFetching.message,
        });
    }

    return (
        <form>
            <div className="flex justify-between items-center gap-6 w-full">
                {/* Bot */}
                <Select
                    isRequired
                    isDisabled={isBotFetching}
                    radius="sm"
                    label={t("Rcs Bot")}
                    variant="flat"
                    onSelectionChange={(keys) =>
                        findSelectedName(keys.anchorKey, "bot", bots)
                    }
                    startContent={isBotFetching ? <LoaderIcon /> : null}
                >
                    {bots.map((bot) => (
                        <SelectItem key={bot.id}>{bot.name}</SelectItem>
                    ))}
                </Select>

                {/* Template type */}
                <Select
                    isRequired
                    isDisabled={isTemplateFetching}
                    radius="sm"
                    label="Template Type"
                    variant="flat"
                    // placeholder="Select the template type"
                    // selectedKeys={new Set([headerId])}
                    onSelectionChange={(keys) =>
                        findSelectedName(
                            keys.anchorKey,
                            "templateType",
                            templateTypes
                        )
                    }
                    startContent={isTemplateFetching ? <LoaderIcon /> : null}
                >
                    {templateTypes.map((templateType) => (
                        <SelectItem key={templateType.id}>
                            {templateType.name}
                        </SelectItem>
                    ))}
                </Select>

                {/* Template   */}
                <Select
                    isRequired
                    isDisabled={isMainTemplateFetching}
                    radius="sm"
                    label={t("Template")}
                    variant="flat"
                    // placeholder="Select the name"
                    // selectedKeys={new Set([templateNameId])}
                    onSelectionChange={(keys) =>
                        findSelectedName(keys.anchorKey, "template", templates)
                    }
                    startContent={
                        selectedBot?.id &&
                        selectedTemplateType?.id &&
                        isMainTemplateFetching ? (
                            <LoaderIcon />
                        ) : null
                    }
                >
                    {templates.map((template) => (
                        <SelectItem key={template.id}>
                            {template.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>
        </form>
    );
}
