import React, { useEffect, useState } from "react";
import { Textarea } from "@heroui/react";
import TestBtn from "./Buttons/Test";
import { useSendWhatsappStore } from "../../../../../../../store/whatsapp/whatsappStore";
import InsertMediaURL from "./Buttons/InsertMediaURL";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import VarDropdown from "./VarDropdown";

const maxChars = 360;

export default function Textbox({ message, data }) {
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
        <div className="flex flex-col  w-full">
            {selectedTemplateTypeSend !== "carousel" && (
                <div className="flex flex-col gap-2">
                    <Textarea
                        isRequired
                        isDisabled={!selectedTemplateName}
                        radius="sm"
                        isInvalid={!isValid}
                        label="Message Preview"
                        className="w-full text-default-500 rounded-t-lg"
                        minRows="5"
                        maxRows="10"
                        onChange={handleCharCount}
                        value={message}
                        readOnly
                        errorMessage="The message length cannot be more than 360 characters."
                    />
                    {mapvar.length > 0 && csvHeaders.length > 0 && (
                        <VarDropdown
                            options={csvHeaders}
                            sections={mapvar}
                            onMappingChange={setHeaderMappings}
                        />
                    )}
                </div>
            )}

            {selectedTemplateTypeSend === "carousel" && (
                <div className="relative">
                    <Carousel
                        showThumbs={false}
                        showIndicators={true}
                        showArrows={false}
                        infiniteLoop={true}
                        autoPlay={false}
                        showStatus={false}
                        selectedItem={currentSlide}
                        onChange={setCurrentSlide}
                        renderIndicator={(
                            onClickHandler,
                            isSelected,
                            index,
                            label
                        ) => (
                            <li
                                key={index}
                                onClick={onClickHandler}
                                onKeyDown={onClickHandler}
                                role="button"
                                tabIndex={0}
                                aria-label={`Slide ${index + 1}`}
                                className={`
                                    w-2.5 h-2.5
                                    rounded-full
                                    inline-block
                                    mx-1.5
                                    cursor-pointer
                                    ${
                                        isSelected
                                            ? "bg-green-500"
                                            : "bg-gray-400"
                                    }
                                `}
                            />
                        )}
                        statusFormatter={(current, total) => (
                            <div className="absolute -top-8 right-0 text-xs text-default-400">
                                Slide {current} of {total}
                            </div>
                        )}
                    >
                        {data[0]?.carouselItems?.map((items, index) => {
                            // Create unique mapping state for each carousel card
                            const cardKey = `card_${index}`;
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col gap-0 pb-8"
                                >
                                    <Textarea
                                        isRequired
                                        isDisabled={!selectedTemplateName}
                                        radius="sm"
                                        isInvalid={!isValid}
                                        label={`Message Preview Card ${
                                            index + 1
                                        }`}
                                        className="w-full text-default-500 rounded-t-lg"
                                        minRows="5"
                                        maxRows="10"
                                        onChange={handleCharCount}
                                        value={items?.textMessage}
                                        readOnly
                                    />

                                    <div className="flex justify-end">
                                        <span className="text-xs text-default-400">
                                            Character count:{" "}
                                            {items?.textMessage?.length}/
                                            {maxChars}
                                        </span>
                                    </div>

                                    {items?.variables?.length > 0 &&
                                        csvHeaders.length > 0 && (
                                            <VarDropdown
                                                options={csvHeaders}
                                                sections={items?.variables}
                                                onMappingChange={(mappings) => {
                                                    setHeaderMappings(
                                                        (prev) => ({
                                                            ...prev,
                                                            [cardKey]: mappings,
                                                        })
                                                    );
                                                }}
                                            />
                                        )}
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
            )}

            <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2 items-center">
                    <TestBtn />
                    {["image", "video", "document", "carousel"].includes(
                        selectedTemplateTypeSend
                    ) && <InsertMediaURL />}
                </div>
                {["image", "video", "document", "text", "location"].includes(
                    selectedTemplateTypeSend
                ) && (
                    <span className="text-xs text-default-400">
                        Character count: {charCount}/{maxChars}
                    </span>
                )}
            </div>
        </div>
    );
}
