import React from "react";
import SingleCard from "./SingleCard";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify-icon/react";

export default function AppCards() {
    const { t } = useTranslation();
    const FlowTitle = (
        <div className="flex gap-1 items-center">
            <Icon icon="fluent-emoji:robot" />
            <p>{t("Flow Builder")}</p>
        </div>
    );

    return (
        <div className="flex gap-4">
            <SingleCard
                Title={`🛠️ ${t("Developer API")}`}
                Desc={t("Setup Documentation")}
                BtnText={t("Visit")}
                BtnURL="https://telepie.mintlify.app"
                imgURL="teleapps-dev-api.png"
                extURL="true"
                width="250"
                height="250"
            />

            <SingleCard
                Title={FlowTitle}
                Desc={t("Client Automation")}
                BtnText="Deploy"
                BtnURL="/flowcards"
                imgURL="teleapps-client-auto.png"
                width="250"
                height="250"
            />

            <SingleCard
                Title={`💬 ${t("Tele Chat & Meet")}`}
                Desc={t("Connect with team")}
                BtnText={t("Proceed")}
                BtnURL="/telechatnmeet"
                imgURL="teleapps-chat-n-meet.png"
                width="250"
                height="250"
            />

            <SingleCard
                Title={`🤖 ${t("TeleBot")}`}
                Desc={t("AI Integrated bot")}
                BtnText={t("Configure")}
                BtnURL="/flowbuilder"
                imgURL="teleapps-telebot.png"
                width="250"
                height="250"
            />
        </div>
    );
}
