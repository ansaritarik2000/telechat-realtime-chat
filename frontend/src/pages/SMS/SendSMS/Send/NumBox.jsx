import React, { useState } from "react";
import { Textarea, Chip, ScrollShadow } from "@heroui/react";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { useTranslation } from "react-i18next";

export default function NumberBox() {
    // zustand store
    const { phoneNumbers, setPhoneNumbers, setContactUploadedFrom } =
        useSendSmsStore();
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

        // Validate each number (allow only digits with optional + at the beginning)
        const validNumbers = numbers.filter((num) => /^\+?\d+$/.test(num));

        // Add valid numbers to the Zustand store
        if (validNumbers.length > 0) {
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
                placeholder={`Press enter or use comma to add numbers:\n9876543210\n+919876543210`}
                className="max-w-screen-lg text-gray-500"
                minRows="2"
                maxRows="6"
                value={inputValue}
                onChange={handleInputChange}
                onPaste={handlePaste} // Handle paste event
                onKeyDown={handleInputKeyDown}
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
                                size="sm"
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
