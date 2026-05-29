import React, { useState } from "react";
import { Input } from "@heroui/react";
import { useTranslation } from "react-i18next";
export default function UserId({ userId }) {
    const { t } = useTranslation();
    return (
        <div>
            <Input
                isReadOnly
                disableAnimation={true}
                variant="flat"
                type="text"
                color="success"
                label={t("Campaign ID")}
                defaultValue={userId}
                radius="sm"
                className="max-w-[150px]"
            />
        </div>
    );
}
