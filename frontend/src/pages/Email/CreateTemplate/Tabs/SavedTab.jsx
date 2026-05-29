import React from "react";
import CreateBtn from "../../../../components/Buttons/CreateBtn";
import SearchInput from "../../../../components/Buttons/Search";
import { useTranslation } from "react-i18next";

export default function SavedTab() {
    const { t } = useTranslation();

    return (
        <div className="">
            <div className="flex justify-between">
                <SearchInput />
                <CreateBtn
                    Text={t("Create Template")}
                    Path="/createemailtemplate"
                />
            </div>

            <div className="flex justify-center items-center h-[800px] flex-col">
                <p className="text-lg font-light text-default-500">
                    {t("You don't have created any template yet.")}
                </p>
            </div>
        </div>
    );
}
