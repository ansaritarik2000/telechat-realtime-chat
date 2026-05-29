import React, { useState } from "react";
import { Textarea, addToast } from "@heroui/react";
import { useTranslation } from "react-i18next";
import emailCampaignStore from "../../../../../store/emailCampaign/emailCampaignStore";
import emailValidator from "email-validator";

export default function EmailBox() {
    const { t } = useTranslation();
    // Zustand store
    const { emailCampaingnData, setEmailCampaingnData, select, onSelect } =
        emailCampaignStore();

    // Local state to manage textarea input temporarily
    const [inputValue, setInputValue] = useState("");

    // Handles changes in the textarea input
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    // Handles the Enter key to validate email before adding to the state
    const handleKeyDown = (e) => {
        onSelect(false);
        if (e.key === "Enter") {
            e.preventDefault();

            const lines = inputValue.split("\n");

            const lastLine = lines[lines.length - 1].trim();

            if (emailValidator.validate(lastLine)) {
                // If valid, update Zustand store
                const updatedEmails = new Set([
                    ...emailCampaingnData.targetEmails,
                    lastLine,
                ]);
                setEmailCampaingnData("targetEmails", updatedEmails);
                setInputValue((prev) => prev + "\n");
            } else {
                addToast({
                    title: "Alert!",
                    description:
                        "Invalid email format. Please correct it before proceeding.",
                    color: "warning",
                });
            }
        }
    };

    return (
        <div>
            <Textarea
                isRequired
                name="targetEmails"
                label={t("Emails")}
                labelPlacement="outside"
                placeholder="Enter emails here one in each line"
                className="max-w-screen-lg text-gray-500"
                minRows="8"
                maxRows="10"
                value={inputValue}
                description={`${t("You can paste up to 50K emails")}. ${t(
                    "For more, use the CSV upload option"
                )}.`}
                onChange={handleChange} // Update local state on change
                onKeyDown={handleKeyDown} // Intercept Enter key for validation
            />
        </div>
    );
}
