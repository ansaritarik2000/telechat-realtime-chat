import React, { useState } from "react";
import {
    Checkbox,
    Button,
    ButtonGroup,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Select,
    SelectItem,
    Input,
    Chip,
    select,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import TransactionTable from "./Table/Index";
import { useTranslation } from "react-i18next";
import { useSubAccountStore } from "../../../../store/subAccount/subAccountStore";

export default function CreditsHistoryIndex() {
    const [selectedOption, setSelectedOption] = useState(new Set(["select"]));
    const { t } = useTranslation();
    const [showFields, setShowFields] = useState(false);
    const [btnColor, setBtnColor] = useState("default");
    const { auto_add_credits, setAutoAddCredits } = useSubAccountStore();

    const labelsMap = {
        add: "Add TeleCredits",
        remove: "Deduct TeleCredits",
        select: "Select Action",
    };

    console.log("auto_add_credits", auto_add_credits);

    // Handle action type
    const handleActionType = () => {
        selectedOptionValue === "select"
            ? setShowFields(false)
            : setShowFields(true);
    };

    // Handle Select Action
    const handleSelectAction = () => {
        // Set color & fields based on select option
        if (selectedOptionValue === "add") {
            // setBtnColor("success");
            setShowFields(true);
        } else if (selectedOptionValue === "remove") {
            // setBtnColor("primary");
            setShowFields(true);
        } else {
            setBtnColor("default");
            setShowFields(false);
        }
    };

    // Handle Checkbox Selection
    const handleCheckboxSelection = () => {
        selectedOptionValue = "select";
        selectedOption(selectedOptionValue);
        setShowFields(false);
    };

    let selectedOptionValue = Array.from(selectedOption)[0];
    return (
        <div className="px-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {/* Checkbox */}
                <Checkbox
                    defaultSelected={auto_add_credits}
                    size="md"
                    color="success"
                    // onValueChange={setIsCheckboxSelected}
                    onChange={(e) => setAutoAddCredits(e.target.checked)}>
                    {t("Users can auto add credits via TeleCredits page")}
                </Checkbox>

                {/* Description */}
                {auto_add_credits && (
                    <div className="text-xs text-default-400 mt-1">
                        <p>
                            {t(
                                "If disabled, account manager will have to add / remove TeleCredits manually"
                            )}
                            .
                            {t(
                                "The account manager will be notified via mail upon low TeleCredits"
                            )}{" "}
                            .{" "}
                            {t(
                                "The low TeleCredit notification limit can be set in Profile"
                            )}{" "}
                            <span>{">"}</span> {t("")} {t("Security & Alert")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
