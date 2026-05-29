import React from "react";
import EmailTabsSwitcher from "./TabsSwitcher";
import { useTranslation } from "react-i18next";

export default function EmailTemplateIndex() {
    const { t } = useTranslation();
    return (
        <div>
            <EmailTabsSwitcher />
        </div>
    );
}
