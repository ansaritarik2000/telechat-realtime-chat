import { useTranslation } from "react-i18next";
import Crumb from "../../components/Breadcrumb/Crumb";
import TabIndex from "./TabSwitcher/TabIndex";

export default function PhonebookIndex() {
    const { t } = useTranslation();
    return (
        <div className="px-2 py-3 h-[90vh]  rounded-lg">
            <Crumb secondSib={t("Phonebook")} />

            <TabIndex />
        </div>
    );
}
