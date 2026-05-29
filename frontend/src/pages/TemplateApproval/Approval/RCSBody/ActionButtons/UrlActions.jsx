import React, { useState } from "react";
import { Input } from "@heroui/react";
import SuggestionFields from "./Suggestions/SuggestionFields";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

const maxChars = 2048;

export default function UrlActions({ action, cardId }) {
    const [textCharCount, setTextCharCount] = useState(0);
    const [url, setUrl] = useState("");
    const [textIsValid, setTextIsValid] = useState(true);
    const { t } = useTranslation();

    const {
        textMessageContent,
        setTextMessageContent,
        selectedTemplateType,
        singleImageContent,
        setSingleImageContent,
        videoContent,
        setVideoContent,
        carouselItems,
        setCarouselItems,
    } = useTemplateStore();

    // handle onchange input
    const handleTextInput = (e) => {
        const inputLen = e.target.value.length;
        setTextCharCount(inputLen);
        const { value, name } = e.target;
        setUrl(value);
        switch (selectedTemplateType) {
            case "text_message": {
                setTextMessageContent({
                    ...textMessageContent,
                    buttons: textMessageContent.buttons.map((item, index) => {
                        return item?.id === action.id
                            ? { ...item, [name]: value }
                            : item;
                    }),
                });
                break;
            }
            case "singleimg": {
                setSingleImageContent({
                    ...singleImageContent,
                    buttons: singleImageContent.buttons.map((item, index) => {
                        return item?.id === action.id
                            ? { ...item, [name]: value }
                            : item;
                    }),
                });
                break;
            }

            case "video": {
                setVideoContent({
                    ...videoContent,
                    buttons: videoContent.buttons.map((item, index) => {
                        return item?.id === action.id
                            ? { ...item, [name]: value }
                            : item;
                    }),
                });
                break;
            }

            case "imgcarousel": {
                setCarouselItems(
                    carouselItems.map((carouselItem) =>
                        carouselItem.id === cardId
                            ? {
                                  ...carouselItem,
                                  buttons: carouselItem.buttons.map((button) =>
                                      button?.id === action.id
                                          ? {
                                                ...button,
                                                [name]: value,
                                            }
                                          : button
                                  ),
                              }
                            : carouselItem
                    )
                );
                break;
            }

            default:
                break;
        }

        if (inputLen <= maxChars) {
            setTextIsValid(true);
        } else {
            setTextIsValid(false);
        }
    };

    return (
        <div className="flex gap-3 flex-col">
            {/* Suggestion Fields */}
            <SuggestionFields action={action} cardId={cardId} />

            <div className="w-full">
                <Input
                    isRequired
                    name="url"
                    type="text"
                    isInvalid={!textIsValid}
                    radius="sm"
                    label={t("URL to Open")}
                    variant="flat"
                    className=""
                    onChange={handleTextInput}
                />

                <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
                    <p>
                        {t("Characters used")}: {textCharCount}/{maxChars}
                    </p>
                </div>
            </div>
        </div>
    );
}
