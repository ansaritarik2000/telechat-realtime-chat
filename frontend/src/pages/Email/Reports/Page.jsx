import React from "react";
import Crumb from "../../../components/Breadcrumb/Crumb.jsx";
import TabsSwitcher from "./Tabs/TabsSwitcher.jsx";
import { useTranslation } from "react-i18next";

export default function EmailReportsPage() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <Crumb secondSib={t("Email Reports")} />

            {/* Tabs Switcher */}
            <TabsSwitcher />
        </div>
    );
}
