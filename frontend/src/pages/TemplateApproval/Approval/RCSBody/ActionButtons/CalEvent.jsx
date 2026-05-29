import React, { useState } from "react";
import { DateRangePicker, Input } from "@heroui/react";
import SuggestionFields from "./Suggestions/SuggestionFields";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";
import {
    parseAbsoluteToLocal,
    parseZonedDateTime,
} from "@internationalized/date";

const maxChars = 2048;

export default function CalEvent({ action, cardId }) {
    const [textCharCount, setTextCharCount] = useState(0);
    const [calValue, setCalValue] = useState({
        eventDateAndTime: {
            start: parseAbsoluteToLocal("2024-04-01T18:45:22Z"),
            end: parseAbsoluteToLocal("2025-04-08T19:15:22Z"),
        },
        title: "",
        description: "",
    });
    const { t } = useTranslation();

    // destructuring of calValue
    const { eventDateAndTime, title, description } = calValue;

    const [textIsValid, setTextIsValid] = useState(true);

    // zustand state
    const {
        textMessageContent,
        setTextMessageContent,
        selectedTemplateType,
        singleImageContent,
        setSingleImageContent,
        carouselItems,
        setCarouselItems,
        videoContent,
        setVideoContent,
    } = useTemplateStore();

    // handle date change
    const handleDateTimeChange = (eventDateAndTime) => {
        const formatDateTime = (dateObj) => {
            const { year, month, day, hour, minute, second } = dateObj;
            const date = new Date(year, month - 1, day, hour, minute, second);
            return date.toISOString(); // returns ISO 8601 string format
        };

        const formattedStartTime = formatDateTime(eventDateAndTime.start);
        const formattedEndTime = formatDateTime(eventDateAndTime.end);

        setCalValue({
            ...calValue,
            eventDateAndTime: {
                ...eventDateAndTime,
                start: eventDateAndTime.start,
                end: eventDateAndTime.end,
            },
        });

        switch (selectedTemplateType) {
            case "text_message": {
                setTextMessageContent({
                    ...textMessageContent,
                    buttons: textMessageContent.buttons.map((item, index) => {
                        return item?.id === action.id
                            ? {
                                  ...item,
                                  startTime: formattedStartTime,
                                  endTime: formattedEndTime,
                                  timeZone: eventDateAndTime.start.timeZone,
                              }
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
                            ? {
                                  ...item,
                                  startTime: formattedStartTime,
                                  endTime: formattedEndTime,
                                  timeZone: eventDateAndTime.start.timeZone,
                              }
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
                            ? {
                                  ...item,
                                  startTime: formattedStartTime,
                                  endTime: formattedEndTime,
                                  timeZone: eventDateAndTime.start.timeZone,
                              }
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
                                  buttons: carouselItem.buttons.map((item) =>
                                      item?.id === item.id
                                          ? {
                                                ...item,
                                                startTime: formattedStartTime,
                                                endTime: formattedEndTime,
                                                timeZone:
                                                    eventDateAndTime.start
                                                        .timeZone,
                                            }
                                          : item
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

    // handle onchange input
    const handleTextInput = (e) => {
        const inputLen = e.target.value.length;
        const { value, name } = e.target;
        setCalValue({ ...calValue, [name]: value });
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
                                  buttons: carouselItem.buttons.map((item) =>
                                      item?.id === item.id
                                          ? { ...item, [name]: value }
                                          : item
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

            <div className="flex flex-col gap-3">
                <div className="w-full">
                    {/* <Input
                        isRequired
                        type="text"
                        radius="sm"
                        label={t("Event Date & Time")}
                        variant="flat"
                        name="eventDateAndTime"
                        value={eventDateAndTime}
                        onChange={handleTextInput}
                        className=""
                    /> */}

                    <DateRangePicker
                        isRequired
                        name="eventDateAndTime"
                        label="Event Date & Time"
                        visibleMonths={2}
                        hideTimeZone
                        onChange={handleDateTimeChange}
                        value={eventDateAndTime}
                        granularity="second"
                    />

                    <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
                        <p>
                            {/* Characters used: {textCharCount}/{maxChars} */}
                            {/* No limit */}
                        </p>
                    </div>
                </div>

                <div className="w-full">
                    <Input
                        isRequired
                        type="text"
                        radius="sm"
                        label={t("Event Title")}
                        name="title"
                        value={title}
                        onChange={handleTextInput}
                        variant="flat"
                        className=""
                    />

                    <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
                        <p>
                            {/* Characters used: {textCharCount}/{maxChars} */}
                            {t("Max")} 2048 {t("characters")}
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
                    label={t("Description")}
                    variant="flat"
                    className=""
                    onChange={handleTextInput}
                    value={description}
                    name="description"
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
