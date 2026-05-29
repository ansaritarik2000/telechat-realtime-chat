import React, { useState } from "react";
import { Textarea } from "@heroui/react";
import { useTranslation } from "react-i18next";
export default function TextField(props) {
    const { t } = useTranslation();
    const {
        label = "Label",
        color = "",
        isRequired = false,
        charsAllowed = 100,
        value,
        onChange,
    } = props;

    const [error, setError] = useState(false);

    // Function to calculate & limit entered chars
    const handleCalculatedChars = (newValue) => {
        if (newValue.length > charsAllowed) {
            setError(true);
            onChange(newValue.slice(0, charsAllowed));
        } else {
            setError(false);
            onChange(newValue);
        }
    };

    return (
        <div>
            <Textarea
                isRequired={isRequired}
                label={label}
                description={`${value.length}/${charsAllowed} ${t(
                    "chars used"
                )}`}
                radius="sm"
                value={value}
                onValueChange={handleCalculatedChars}
                color={error ? "danger" : "default"}
                isInvalid={error}
                errorMessage={error ? `Only ${charsAllowed} chars allowed` : ""}
            />
        </div>
    );
}
