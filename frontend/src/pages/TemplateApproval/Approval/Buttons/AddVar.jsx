import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

// Add variable button
const AddVar = ({ handleAddVar }) => {
    const { t } = useTranslation();
    return (
        <div>
            <span
                className="text-sm flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={handleAddVar}>
                <Icon fontSize={14} icon="iconamoon:sign-plus-duotone" />
                <span className="text-xs">{t("Add Variable")}</span>
            </span>
        </div>
    );
};

export default AddVar;
