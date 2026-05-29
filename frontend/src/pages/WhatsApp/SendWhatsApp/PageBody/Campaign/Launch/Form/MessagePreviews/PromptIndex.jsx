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
import { useTranslation } from "react-i18next";
import VarDropdown from "../VarDropdown";
import { useSendSmsStore } from "../../../../../../../../store/sendSmsStore";


const oneCreditChars = 120;
const maxChars = 360;

export default function PromptInputIndex({
   message, data
}) {
  const {
        selectedTemplateTypeSend,
        csvFileContent,
        currentSlide,
        setCurrentSlide,
        selectedTemplateName,
        setVariableMappings, // Add this to your store if not already present
    } = useSendWhatsappStore();

    const [charCount, setCharCount] = useState(0);
    const [isValid, setIsValid] = useState(true);
    const [headerMappings, setHeaderMappings] = useState({});

    let contentType;
    switch (selectedTemplateTypeSend) {
        case "text":
            contentType = "textMessageContent";
            break;
        case "image":
            contentType = "singleImageContent";
            break;
        case "video":
            contentType = "videoContent";
            break;
        case "location":
            contentType = "location";
            break;
        case "document":
            contentType = "documentContent";
            break;
        case "WithExpiration":
        case "WithoutExpiration":
            contentType = "LtoContent";
            break;
        case "carousel":
            contentType = "carouselItems";
            break;
        default:
            contentType = null;
    }

    // Extract variables from the template content
    const mapvar = data[0]?.[contentType]?.variables || [];

    // Filter out phone number column from CSV headers
    const csvHeaders =
        csvFileContent?.columns?.filter((header) => header !== "phonenumber") ||
        [];

    const handleCharCount = (e) => {
        const currentLength = e.target.value.length;
        setIsValid(currentLength <= maxChars);
        setCharCount(currentLength);
    };

    // Update mappings in the store whenever they change
    useEffect(() => {
        if (setVariableMappings) {
            setVariableMappings(headerMappings);
        }
    }, [headerMappings, setVariableMappings]);

    useEffect(() => {
        if (message) {
            const currentLength = message.length;
            setIsValid(currentLength <= maxChars);
            setCharCount(currentLength);
        }
    }, [message]);

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
                        input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
                    }}
                    endContent={
                        <div className="flex items-end gap-2">
                            <Tooltip showArrow content="Send message">
                                <Button
                                    isIconOnly
                                    color={!prompt ? "default" : "primary"}
                                    isDisabled={!prompt}
                                    radius="lg"
                                    size="sm"
                                    variant="solid">
                                    <Icon
                                        className={cn(
                                            "[&>path]:stroke-[2px]",
                                            !prompt
                                                ? "text-default-600"
                                                : "text-primary-foreground"
                                        )}
                                        icon="solar:arrow-up-linear"
                                        width={20}
                                    />
                                </Button>
                            </Tooltip>
                        </div>
                    }
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
                                <VarDropdown
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
                    
                </div>
            </div>
        </div>
    );
}
