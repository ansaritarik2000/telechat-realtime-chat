import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";
import Crumb from "../../../components/Breadcrumb/Crumb.jsx";

// lazy loading component
const TabsSwitcher = lazy(() => import("./Tabs/TabsSwitcher.jsx"));

export default function RCSReportsPage() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <Crumb secondSib={t("RCS Reports & Overview")} />

            {/* Tabs Switcher */}
            <Suspense fallback={<LoadingSpinner />}>
                <TabsSwitcher />
            </Suspense>
        </div>
    );
}
