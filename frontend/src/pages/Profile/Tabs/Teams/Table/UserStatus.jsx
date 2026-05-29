import { useCheckbox, Chip, VisuallyHidden, tv } from "@heroui/react";
import { useTranslation } from "react-i18next";

const checkbox = tv({
    slots: {
        base: "border-default hover:bg-default-200",
        content: "text-default-500 text-xs px-1 ",
    },
    variants: {
        isSelected: {
            true: {
                base: "",
                content: "text-success-foreground",
            },
        },
        isDisabled: {
            true: {
                base: "",
                content: "text-default-500",
            },
        },
        isFocusVisible: {
            true: {
                base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
            },
        },
    },
});

export default function UserStatus({ selected, onChange }) {
    const {
        children,
        isSelected,
        isFocusVisible,
        getBaseProps,
        getLabelProps,
        getInputProps,
    } = useCheckbox({
        defaultSelected: selected,
    });

    const styles = checkbox({
        isSelected,
        isDisabled: !isSelected, // Assuming disabled means not selected
        isFocusVisible,
    });

    const { t } = useTranslation();

    const handleStatusChange = () => {
        if (isSelected) {
            onChange("inactive"); // Set status to active if chip is enabled
        } else {
            onChange("active"); // Set status to inactive if chip is disabled
        }
    };

    return (
        <div onClick={() => handleStatusChange()}>
            <label {...getBaseProps()}>
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>
                <Chip
                    onClick={() => handleStatusChange()}
                    classNames={{
                        base: styles.base(),
                        content: styles.content(),
                    }}
                    size="sm"
                    variant="dot"
                    color={isSelected ? "success" : "danger"} // Change color based on state
                    {...getLabelProps()}>
                    {children
                        ? children
                        : isSelected
                        ? t("Active")
                        : t("Inactive")}
                </Chip>
            </label>
        </div>
    );
}
