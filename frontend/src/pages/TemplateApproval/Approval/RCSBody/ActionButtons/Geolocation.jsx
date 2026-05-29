import React, { useState } from "react";
import { Input } from "@heroui/react";
import SuggestionFields from "./Suggestions/SuggestionFields";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

const maxChars = 25;

export default function GeoLocation({ action, cardId }) {
    const [textCharCount, setTextCharCount] = useState(0);
    const [geoLocationValue, setGeoLocationValue] = useState({
        latitude: "",
        longitude: "",
        label: "",
    });
    const { t } = useTranslation();

    // zustand state
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

    // destructuring of geolocation value
    const { latitude, longitude, label_geo_location } = geoLocationValue;

    const [textIsValid, setTextIsValid] = useState(true);

    // handle onchange input
    const handleTextInput = (e) => {
        const inputLen = e.target.value.length;
        setTextCharCount(inputLen);
        const { value, name } = e.target;
        setGeoLocationValue({ ...geoLocationValue, [name]: value });
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

            <div className="flex gap-3">
                <div className="w-full">
                    <Input
                        isRequired
                        type="text"
                        radius="sm"
                        name="latitude"
                        label={t("Latitude")}
                        variant="flat"
                        className=""
                        value={latitude}
                        onChange={handleTextInput}
                    />

                    <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
                        <p>
                            {/* Characters used: {textCharCount}/{maxChars} */}
                            {t("No limit")}
                        </p>
                    </div>
                </div>

                <div className="w-full">
                    <Input
                        isRequired
                        type="text"
                        radius="sm"
                        name="longitude"
                        label={t("Longitude")}
                        value={longitude}
                        onChange={handleTextInput}
                        variant="flat"
                        className=""
                    />

                    <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
                        <p>
                            {/* Characters used: {textCharCount}/{maxChars} */}
                            {t("No limit")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <Input
                    isRequired
                    type="text"
                    isInvalid={!textIsValid}
                    radius="sm"
                    label={t("Label")}
                    name="label"
                    value={label_geo_location}
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
