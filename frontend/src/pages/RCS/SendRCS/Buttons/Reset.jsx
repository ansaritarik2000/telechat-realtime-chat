import React from "react";
import { Icon } from "@iconify-icon/react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

export default function Reset({ onClick }) {
    const { t } = useTranslation();
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
                color="default"
                variant="bordered"
                onPress={onClick}>
                {t("Reset")}
            </Button>
        </div>
    );
}
