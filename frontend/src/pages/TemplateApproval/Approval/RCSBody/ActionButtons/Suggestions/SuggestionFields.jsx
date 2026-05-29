import React, { useState } from "react";
import { button, Input } from "@heroui/react";
import { useTemplateStore } from "../../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

const maxChars = 25;
const postMaxChars = 120;

export default function SuggestionFields({ action, cardId }) {
    const [textCharCount, setTextCharCount] = useState(0);
    const [postbackCharCount, setPostbackCharCount] = useState(0);
    const [textIsValid, setTextIsValid] = useState(true);
    const [postbackIsValid, setPostbackIsValid] = useState(true);
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

    const [suggestion, setSuggeston] = useState({
        text: action?.displayText,
        postBack: action?.postback,
    });

    const { t } = useTranslation();

    console.log("carouselItems", carouselItems);
    const { text, postBack } = suggestion;

    const handleTextInput = (e) => {
        const inputLen = e.target.value.length;
        const value = e.target.value;
        setSuggeston({ ...suggestion, text: e.target.value });
        setTextCharCount(inputLen);
        if (inputLen <= maxChars) {
            setTextIsValid(true);
        } else {
            setTextIsValid(false);
        }
        switch (selectedTemplateType) {
            case "text_message": {
                setTextMessageContent({
                    ...textMessageContent,
                    buttons: textMessageContent.buttons.map((item, index) => {
                        return item?.id === action.id
                            ? { ...item, displayText: value }
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
                            ? { ...item, displayText: value }
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
                            ? { ...item, displayText: value }
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
                                                displayText: value,
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
    };

    const handlePostbackInput = (e) => {
        const inputLen = e.target.value.length;
        const value = e.target.value;
        setPostbackCharCount(inputLen);
        setSuggeston({ ...suggestion, postBack: e.target.value });

        switch (selectedTemplateType) {
            case "text_message": {
                setTextMessageContent({
                    ...textMessageContent,
                    buttons: textMessageContent.buttons.map((item, index) => {
                        return item?.id === action.id
                            ? { ...item, postback: value }
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
                            ? { ...item, postback: value }
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
                            ? { ...item, postback: value }
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
                                                postback: value,
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

        if (inputLen <= postMaxChars) {
            setPostbackIsValid(true);
        } else {
            setPostbackIsValid(false);
        }
    };

    return (
        <div className="flex gap-3">
            <div className="w-full">
                <Input
                    isRequired
                    name="displayText"
                    type="text"
                    isInvalid={!textIsValid}
                    radius="sm"
                    label={t("Suggestion Text")}
                    variant="flat"
                    className=""
                    onChange={handleTextInput}
                    value={text}
                    isDisabled={action.id === 1}
                />

                <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
                    <p>
                        {t("Characters used")}: {textCharCount}/{maxChars}
                    </p>
                </div>
            </div>

            <div className="w-full">
                <Input
                    isRequired
                    type="text"
                    name="postback"
                    isInvalid={!postbackIsValid}
                    radius="sm"
                    label={t("Suggestion Postback")}
                    variant="flat"
                    className=""
                    value={postBack}
                    onChange={handlePostbackInput}
                    isDisabled={action.id === 1}
                />

                <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
                    <p>
                        {t("Characters used")}: {postbackCharCount}/
                        {postMaxChars}
                    </p>
                </div>
            </div>
        </div>
    );
}
