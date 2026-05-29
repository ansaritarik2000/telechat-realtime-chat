import React, { useState, useContext } from "react";
import { Input, Textarea } from "@heroui/react";
import { RtdContext } from "../../Index";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import AddVar from "../../Buttons/AddVar";
import { extractVariables } from "../utils/extratVariable";

const maxCharsHeading = 200;
const maxCharSubHeading = 2000;

export default function Card({ index }) {
    const {
        selectedTemplateType,
        singleImageContent,
        setSingleImageContent,
        videoContent,
        setVideoContent,
        carouselItems,
        setCarouselItems,
    } = useTemplateStore();
     
    const [cardContent, setCardContent] = useState({
        heading: "",
        subHeading: "",
    });
    const [isValid, setIsValid] = useState({
        isHeadingValid: true,
        isSubHeadingValid: true,
    });

    const [charCount, setCharCount] = useState({
        headingCharacterCount: 0,
        subHeadingCharacterCount: 0,
    });

    //  destructuring of content
    const { heading, subHeading } = cardContent;
    const { isHeadingValid, isSubHeadingValid } = isValid;
    const { headingCharacterCount, subHeadingCharacterCount } = charCount;

    const handleCardInput = (e) => {
        const { name, value } = e.target;
        const textLength = value?.length;

        // extract variable from inputField
        const variablesInMessage = extractVariables(value);

        setCardContent({ ...cardContent, [name]: value });

        // card heading input
        if (name === "heading") {
            // set for single image content
            if (selectedTemplateType === "singleimg") {
                setSingleImageContent({
                    ...singleImageContent,
                    title: value,
                    titleVariables: variablesInMessage,
                });
            }

            // set for card title for video content
            else if (selectedTemplateType === "video") {
                setVideoContent({
                    ...videoContent,
                    title: value,
                    titleVariables: variablesInMessage,
                });
            }

            // set heading for image carousel
            else if (selectedTemplateType === "imgcarousel") {
                const updatedCarouselItems = [...carouselItems];
                updatedCarouselItems[index] = {
                    ...updatedCarouselItems[index],
                    title: value,
                    titleVariables: variablesInMessage,
                };
                setCarouselItems(updatedCarouselItems);
            }

            // heading character count
            setCharCount({
                ...charCount,
                headingCharacterCount: textLength,
            });

            // check valid or invalid  heading
            if (textLength <= maxCharsHeading) {
                setIsValid({ ...isValid, isHeadingValid: true });
            } else {
                setIsValid({ ...isValid, isHeadingValid: false });
            }
        } else if (name === "subHeading") {
            // set subheading for single  content
            if (selectedTemplateType === "singleimg") {
                setSingleImageContent({
                    ...singleImageContent,
                    description: value,
                    descriptionVariables: variablesInMessage,
                });
            }

            // set for card description for video content
            else if (selectedTemplateType === "video") {
                setVideoContent({
                    ...videoContent,
                    description: value,
                    descriptionVariables: variablesInMessage,
                });
            }

            // set subheading for image carousel content
            else if (selectedTemplateType === "imgcarousel") {
                const updatedCarouselItems = [...carouselItems];
                updatedCarouselItems[index] = {
                    ...updatedCarouselItems[index],
                    description: value,
                    descriptionVariables: variablesInMessage,
                };
                setCarouselItems(updatedCarouselItems);
            }

            // set character count subheading
            setCharCount({
                ...charCount,
                subHeadingCharacterCount: textLength,
            });

            // set valid for subheading
            if (textLength <= maxCharSubHeading) {
                setIsValid({ ...isValid, isSubHeadingValid: true });
            } else {
                setIsValid({ ...isValid, isSubHeadingValid: false });
            }
        }
    };

    // card variable add handller

    // this is add variable for card headng
    const addCardHeadingVariable = () => {
        switch (selectedTemplateType) {
            // add variable for single image card heading
            case "singleimg": {
                const newVariable = `{{var${
                    singleImageContent.titleVariables.length + 1
                }}}`;

                const varWithTitle =
                    singleImageContent.title + " " + newVariable;

                // Add the new variable to the singleImageContent title variables array

                // state set for global state
                setSingleImageContent({
                    ...singleImageContent,
                    title: varWithTitle,
                    titleVariables: [
                        ...singleImageContent.titleVariables,
                        newVariable,
                    ],
                });

                // state set for local state
                setCardContent({ ...cardContent, heading: varWithTitle });

                // heading character count
                setCharCount({
                    ...charCount,
                    headingCharacterCount: varWithTitle.length,
                });
                break;
            }

            // add variable for single video card heading
            case "video": {
                const newVariable = `{{var${
                    videoContent.titleVariables.length + 1
                }}}`;

                const varWithTitle = videoContent.title + " " + newVariable;
                // Add the new variable to the singleImageContent title variables array

                // state set for global state
                setVideoContent({
                    ...videoContent,
                    title: varWithTitle,
                    titleVariables: [
                        ...videoContent.titleVariables,
                        newVariable,
                    ],
                });

                // state set for local state
                setCardContent({ ...cardContent, heading: varWithTitle });

                // heading character count
                setCharCount({
                    ...charCount,
                    headingCharacterCount: varWithTitle.length,
                });
                break;
            }

            // add variable for carousel heading
            case "imgcarousel": {
                const updatedCarouselItems = [...carouselItems];
                const newVariable = `{{var${
                    updatedCarouselItems[index].titleVariables.length + 1
                }}}`;

                const varWithTitle =
                    updatedCarouselItems[index].title + " " + newVariable;

                // Add the new variable to the carousel title variables array
                updatedCarouselItems[index] = {
                    ...updatedCarouselItems[index],
                    title: varWithTitle,
                    titleVariables: [
                        ...updatedCarouselItems[index].titleVariables,
                        newVariable,
                    ],
                };
                setCarouselItems(updatedCarouselItems);

                // state set for local state
                setCardContent({ ...cardContent, heading: varWithTitle });

                // heading character count
                setCharCount({
                    ...charCount,
                    headingCharacterCount: varWithTitle.length,
                });
                break;
            }

            default:
                break;
        }
    };

    // this is add variable for card subHeadng
    const addCardSubHeadingVariable = () => {
        switch (selectedTemplateType) {
            // card subheading variable set for single image
            case "singleimg": {
                const newVariable = `{{var${
                    singleImageContent.descriptionVariables.length + 1
                }}}`;

                // card subheading with variables
                const varWithDescription =
                    singleImageContent.description + " " + newVariable;

                // Add the new variable to the singleImageContent title variables array

                // state set for global state
                setSingleImageContent({
                    ...singleImageContent,
                    description: varWithDescription,
                    descriptionVariables: [
                        ...singleImageContent.descriptionVariables,
                        newVariable,
                    ],
                });

                // state set for local state
                setCardContent({
                    ...cardContent,
                    subHeading: varWithDescription,
                });

                // heading character count
                setCharCount({
                    ...charCount,
                    subHeadingCharacterCount: varWithDescription.length,
                });
                break;
            }

            // card subheading variable set for single video card
            case "video": {
                const newVariable = `{{var${
                    videoContent.descriptionVariables.length + 1
                }}}`;

                // card subheading with variables
                const varWithDescription =
                    videoContent.description + " " + newVariable;

                // Add the new variable to the singleImageContent title variables array

                // state set for  video content
                setVideoContent({
                    ...videoContent,
                    description: varWithDescription,
                    descriptionVariables: [
                        ...singleImageContent.descriptionVariables,
                        newVariable,
                    ],
                });

                // state set for card heading
                setCardContent({
                    ...cardContent,
                    subHeading: varWithDescription,
                });

                // sub heading character count
                setCharCount({
                    ...charCount,
                    subHeadingCharacterCount: varWithDescription.length,
                });
                break;
            }

            // add variable for carousel subheading
            case "imgcarousel": {
                const updatedCarouselItems = [...carouselItems];

                const newVariable = `{{var${
                    updatedCarouselItems[index].descriptionVariables.length + 1
                }}}`;

                const varWithDescription =
                    updatedCarouselItems[index].description + " " + newVariable;

                // Add the new variable to the carousel description variables and title array
                updatedCarouselItems[index] = {
                    ...updatedCarouselItems[index],
                    description: varWithDescription,
                    descriptionVariables: [
                        ...updatedCarouselItems[index].descriptionVariables,
                        newVariable,
                    ],
                };
                setCarouselItems(updatedCarouselItems);

                // state set for subheading
                setCardContent({
                    ...cardContent,
                    subHeading: varWithDescription,
                });

                // sub heading character count
                setCharCount({
                    ...charCount,
                    subHeadingCharacterCount: varWithDescription.length,
                });
                break;
            }

            default:
                break;
        }
    };

    return (
        <div className="flex flex-col space-y-4 w-full">
            <div>
                <Input
                    isRequired
                    type="text"
                    isInvalid={!isHeadingValid}
                    radius="sm"
                    label="Card Heading"
                    variant="flat"
                    value={heading}
                    name="heading"
                    className=""
                    // errorMessage="The heading cannot be more than 200 characters."
                    onChange={handleCardInput}
                />

                <div className="flex w-full mt-1 pl-1 justify-end text-xs text-gray-400">
                    <AddVar handleAddVar={addCardHeadingVariable} />
                    <p className="ml-2">
                        Characters used: {headingCharacterCount}/
                        {maxCharsHeading}
                    </p>
                </div>
            </div>

            <div>
                <Textarea
                    isRequired
                    isInvalid={!isSubHeadingValid}
                    radius="sm"
                    name="subHeading"
                    label="Card SubHeading"
                    placeholder="Type your message here"
                    className="text-gray-500"
                    minRows="8"
                    maxRows="10"
                    value={subHeading}
                    onChange={handleCardInput}
                />
                <div className="flex w-full mt-1 pl-1 justify-end text-xs text-gray-400">
                    <AddVar handleAddVar={addCardSubHeadingVariable} />
                    <p className="ml-2">
                        Characters used: {subHeadingCharacterCount}/
                        {maxCharSubHeading}
                    </p>
                </div>
            </div>
        </div>
    );
}
