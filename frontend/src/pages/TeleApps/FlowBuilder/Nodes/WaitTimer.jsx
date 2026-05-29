import { useTranslation } from "react-i18next";
import { FlowTimerIcon } from "../../../../utils/ReusableIcons";
import { Card, CardHeader, Divider, CardBody, Chip } from "@heroui/react";

export default function WaitTimer() {
    const { t } = useTranslation();
    return (
        <Card className="w-[12rem]">
            <CardHeader className="flex gap-1  bg-gradient-to-r from-default-100 to-content">
                <FlowTimerIcon size="1.4em" />
                <p className="font-medium text-md text-foreground">
                    {t("Wait Timer")}
                </p>
            </CardHeader>
            <Divider />
            <CardBody className="flex-center">
                <Chip size="sm" variant="bordered">
                    11/12/2025
                </Chip>
            </CardBody>
        </Card>
    );
}
