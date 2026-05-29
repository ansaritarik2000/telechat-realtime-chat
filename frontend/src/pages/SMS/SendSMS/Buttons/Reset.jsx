import React from "react";
import { Icon } from "@iconify-icon/react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ResetIcon } from "../../../../utils/ReusableIcons";

export default function Reset({ onClick }) {
    const { t } = useTranslation();

    return (
        <div>
            <Button
                size="md"
                radius="sm"
                startContent={<ResetIcon />}
                color="default"
                variant="bordered"
                onPress={onClick}
            >
                {t("Reset")}
            </Button>
        </div>
    );
}
