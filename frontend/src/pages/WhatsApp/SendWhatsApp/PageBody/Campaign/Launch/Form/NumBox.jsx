import React, { useState } from "react";
import { Textarea, Chip, ScrollShadow, addToast } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useSendWhatsappStore } from "../../../../../../../store/whatsapp/whatsappStore";

export default function NumberBox() {
    const {
        phoneNumbers,
        setPhoneNumbers,
        setContactUploadedFrom,
        singleTemplateData,
        numDisable
    } = useSendWhatsappStore();

    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");


    // Handle input change
    const handleInputChange = (e) => {
        const rawInput = e.target.value;
        setContactUploadedFrom("number");
        setInputValue(rawInput);
    };

    // Handle paste event
    const handlePaste = (e) => {
        e.preventDefault(); // Prevent default paste behavior
        const pastedText = e.clipboardData.getData("text"); // Get pasted text
        setContactUploadedFrom("number");
        // setInputValue(pastedText); // Update the input value
        processInput(pastedText); // Process the pasted text
    };

    // Handle keydown events (Enter or comma)
    const handleInputKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            processInput(inputValue.trim()); // Process the current input
            setInputValue(""); // Clear the input after processing
        }
    };

    // Process input and update Zustand store
    const processInput = (input) => {
        if (!input) return;

        // Split input by new lines or commas
        const numbers = input
            .split(/\n|,/)
            .map((num) => num.trim()) // Trim spaces
            .filter((num) => num.length > 0); // Remove empty entries

        // Validate each number
        const validNumbers = numbers.filter((num) => {
            // Check if it's a valid phone number format
            if (/^\+?\d+$/.test(num)) {
                // For numbers starting with + (international)
                if (num.startsWith("+")) {
                    // Allow up to 13 digits (including + and country code)
                    // Example: +911234567890 (13 digits)
                    return num.length <= 13;
                }
                // For local numbers (no +)
                else {
                    // Must be exactly 10 digits
                    return num.length === 10;
                }
            }
            return false;
        });

        // Add valid numbers to the Zustand store
        if (validNumbers.length > 0) {
            // const nonEmptyPhoneNumbers = phoneNumbers.filter(num => num.trim() !== "");
            console.log(phoneNumbers, "Checking");
            const updatedNumbers = [
                ...new Set([...phoneNumbers, ...validNumbers]),
            ]; // Remove duplicates
            setPhoneNumbers(updatedNumbers);
        }
    };


    // Remove a number from the Zustand store
    const removeNumber = (numberToRemove) => {
        const updatedNumbers = phoneNumbers.filter(
            (num) => num !== numberToRemove
        );
        setPhoneNumbers(updatedNumbers);
    };
    

    return (
        <div>
            <Textarea
                isRequired
                label={t("Numbers")}
                labelPlacement="outside"
                placeholder={`Use commas or press Enter to add numbers:\n9876543210\n+919876543210\n\n`}
                className="max-w-screen-lg text-gray-500"
                minRows="2"
                maxRows="6"
                value={inputValue}
                onChange={handleInputChange}
                onPaste={handlePaste} // Handle paste event
                onKeyDown={handleInputKeyDown}
                isDisabled={numDisable}
                description={`${t(
                    "Each line should contain exactly one number of 10 digits"
                )}. ${t("You can paste up to 300K numbers")}. ${t(
                    "For more, use the CSV upload option"
                )}.`}
            />

            {phoneNumbers.length > 0 && (
                <ScrollShadow hideScrollBar className="w-full mt-3 max-h-48">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {phoneNumbers.map((number, index) => (
                            <Chip
                                key={index}
                                onClose={() => removeNumber(number)}
                                variant="flat"
                                color="primary"
                            >
                                {number}
                            </Chip>
                        ))}
                    </div>
                </ScrollShadow>
            )}
        </div>
    );
}
