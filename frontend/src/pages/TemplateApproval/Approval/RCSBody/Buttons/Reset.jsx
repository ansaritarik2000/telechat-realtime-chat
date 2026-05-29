import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";

export default function Reset() {
    const { t } = useTranslation();
    const { resetStore } = useTemplateStore();

    // Reset the store
    const resetHandeller = () => {
        resetStore();
    };
    return (
        <div>
            <Button
                size="md"
                radius="sm"
                startContent={
                    <Icon
                        icon="ri:reset-right-line"
                        width="1.2em"
                        height="1.2em"
                    />
                }
                onClick={resetHandeller}
                color="default"
                variant="bordered">
                {t("Reset")}
            </Button>
        </div>
    );
}
