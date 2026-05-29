import { useTranslation } from "react-i18next";
import Crumb from "../../components/Breadcrumb/Crumb";
import AppCards from "./Cards/Cards";

export default function TeleApps() {
    const { t } = useTranslation();
    return (
        <div className="px-2">
            <Crumb secondSib={t("TeleApps")} />

            <div className="py-4">
                <AppCards />
            </div>
        </div>
    );
}
// https://rentry.co/tktwvzux
