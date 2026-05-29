import React, { useState, Suspense, useEffect } from "react";
import { Select, SelectItem, Input } from "@heroui/react";
import { useTemplateStore } from "../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";
import { getRCSBots } from "../../../../services/Rcs/rcsBotService";

const bots = [
    { key: "telepie", label: "Telepie Technologies" },
    { key: "wired", label: "Wired Technologies" },
];

// Lazily load TempType component
const TempType = React.lazy(() => import("./TempType/TempType"));

export default function RCSBody() {
    const { selectedBot, setSelectedBot } = useTemplateStore();
    const [bots, setBots] = useState([]);
    const { t } = useTranslation();

    // handle bot change
    const handleBotChange = (key) => {
        const selected = bots.find((bot) => bot.bot_id === key);
        setSelectedBot(selected); // Store both key and label
    };

    // Fetch all bots and template types on component mount
    useEffect(() => {
        const fetchBots = async () => {
            try {
                const data = await getRCSBots();
                setBots(data);
            } catch (error) {
                console.error("Error fetching bots:", error);
            }
        };
        fetchBots();
    }, []);

    return (
        <div className="flex flex-col gap-6 ">
            {/* Bot Selector */}
            <Select
                isRequired
                label={t("Select a bot")}
                placeholder={t("Select a bot")}
                value={selectedBot?.bot_id}
                // defaultSelectedKeys={[selectedBot?.key]}
                onChange={(e) => handleBotChange(e.target.value)}
                className="w-1/2"
                radius="sm"
                size="md">
                {bots?.map((bot) => (
                    <SelectItem key={bot?.bot_id} value={bot.name}>
                        {bot.name}
                    </SelectItem>
                ))}
            </Select>

            {/* Template name */}
            <div className="">
                {/* Lazily loaded TempType component */}
                <Suspense fallback={<div>Loading template type...</div>}>
                    <TempType />
                </Suspense>
            </div>
        </div>
    );
}
