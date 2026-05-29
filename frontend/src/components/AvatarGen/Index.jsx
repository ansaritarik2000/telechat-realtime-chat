import React, { useEffect, useState } from "react";
import Avatar from "avvvatars-react";
import { Icon } from "@iconify-icon/react";
import { Button } from "@heroui/react";

export default function AvatarIndex({
    value = "Wired",
    shadow = true,
    size = 110,
    borderSize = 3,
    border = false,
    borderColor = "#fff",
    shapTypeHandller,
    avatarType = "character",
    isEditable = true,
    radius = "",
}) {
    const [style, setStyle] = useState(avatarType);
    const [randomValue, setRandomValue] = useState(value);

    console.log("value-->", value);

    useEffect(() => {
        setStyle(avatarType);
        setRandomValue(value);
    }, [avatarType, value]);

    // this function is used for character button handller
    const characterHandller = () => {
        setStyle("character");
        shapTypeHandller("character", value);
    };

    //this function is used for shap button handller
    const shapHandller = () => {
        // Function to generate a random 5-character string
        const generateRandomString = () => {
            const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let randomString = "";
            for (let i = 0; i < 5; i++) {
                const randomIndex = Math.floor(
                    Math.random() * characters.length
                );
                randomString += characters[randomIndex];
            }
            return randomString;
        };
        setRandomValue(generateRandomString());
        setStyle("shape");
        shapTypeHandller("shape", generateRandomString());
    };

    // Function to derive initials
    const getInitials = (text) => {
        if (!text || typeof text !== "string") {
            return ""; // Return an empty string for invalid input
        }

        const words = text.split(" ");
        if (words.length > 1) {
            // If there are two or more words, take the first letter of each
            return (words[0][0] + words[1][0]).toUpperCase();
        } else {
            // Otherwise, take the first two letters
            return text.slice(0, 2).toUpperCase();
        }
    };

    // Example usage
    console.log("randomValue", randomValue);
    console.log("Initials:", getInitials(randomValue));

    return (
        <div className="flex justify-center items-center gap-2">
            {/* Avatar component with dynamic style */}
            <Avatar
                value={style === "character" ? getInitials(value) : randomValue} // Pass computed initials as value
                style={style}
                shadow={shadow}
                size={size}
                radius={radius}
                border={border}
                borderSize={borderSize}
                borderColor={borderColor}
            />

            {/* Buttons to change avatar style */}
            {isEditable && (
                <div className="flex flex-col gap-2">
                    {/* Change to text mode */}
                    <Button
                        isIconOnly
                        size="sm"
                        radius="full"
                        variant="flat"
                        color="default"
                        startContent={<Icon icon="ci:font" width={15} />}
                        onClick={characterHandller}
                    />

                    {/* Change to shape mode */}
                    <Button
                        isIconOnly
                        size="sm"
                        radius="full"
                        variant="flat"
                        startContent={
                            <Icon icon="ic:round-repeat" width={15} />
                        }
                        onClick={shapHandller}
                    />
                </div>
            )}
        </div>
    );
}
