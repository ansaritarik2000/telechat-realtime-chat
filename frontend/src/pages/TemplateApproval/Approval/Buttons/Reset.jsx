import { Button } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

export default function Reset({ resetHandller }) {
    const { t } = useTranslation();
    return (
        <div>
            <Button
                onClick={resetHandller}
                variant="flat"
                color="default"
                size="md"
                radius="sm"
                startContent={
                    <Icon
                        icon="ri:reset-right-line"
                        width="1.2em"
                        height="1.2em"
                    />
                }>
                <span>{t("Reset")}</span>
            </Button>
        </div>
    );
}
