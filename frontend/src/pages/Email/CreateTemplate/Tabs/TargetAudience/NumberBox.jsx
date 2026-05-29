import React, { useState } from "react";
import { Textarea } from "@heroui/react";
import { useTranslation } from "react-i18next";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";

export default function NumberBox() {
    const { t } = useTranslation();
    // zustand store
    const { setPhoneNumbers } = useState("");
    const onSelect = emailCampaingnStore((state)=> state.onSelect)
    // Handles changes in the textarea input
    const handleChange = (e) => {
        const numbers = e.target.value.split("\n"); // Assuming each line has a phone number
        setPhoneNumbers(numbers);
    };

    return (
        <div>
            <Textarea
                isRequired
                label={t("Numbers")}
                labelPlacement="outside"
                placeholder="+91 9858734759"
                className="max-w-screen-lg text-gray-500"
                minRows="8"
                maxRows="10"
                description={`${t(
                    "Each line should contain exactly one number of 10 digits"
                )}. ${t("You can paste up to 300K numbers")}. ${t(
                    "For more, use the CSV upload option"
                )}.`}
                onChange={handleChange} // Update state on change
            />
        </div>
    );
}
