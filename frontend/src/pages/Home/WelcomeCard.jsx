import React, { useState, useEffect } from "react";
import { LinearGradient } from "react-text-gradients";
import { Card, CardHeader, Image } from "@heroui/react";
import "./style.css";
import { quotes } from "./quotes";
import Cube from "./Cube";
import { useThemeStore } from "../../store/themeStore";
import { useTranslation } from "react-i18next";

const dayTime = [
    { key: "morning", label: "morning", emoji: "🌞" },
    { key: "afternoon", label: "afternoon", emoji: "☀️" },
    { key: "evening", label: "evening, glad to see you back!", emoji: "🌕" },
];

function WelcomeCard() {
    const [randomQuote, setRandomQuote] = useState("");
    const { t } = useTranslation();
    const { theme } = useThemeStore();

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setRandomQuote(quotes[randomIndex].quote);
    }, []);

    const getTimeOfDay = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            return "morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "afternoon";
        } else {
            return "evening";
        }
    };

    const { label, emoji } = dayTime.find(
        (item) => item.key === getTimeOfDay()
    );

    const greeting = `${t("Good")} ${t(label)} ${emoji}`;

    return (
        <div className="max-w-full gap-2 grid grid-cols-12 ">
            <Card className="col-span-8 sm:col-span-12 h-[390px] dark:border dark:border-content2">
                <CardHeader className="absolute z-10 top-1 flex-col items-center my-4">
                    <div className=" h-full flex w-full justify-between">
                        <div className="h-full mx-10 my-5 flex justify-between flex-col space-y-8">
                            <p className="font-bold text-xl text-default-600 ">
                                {t("Welcome back")}
                                <span className="animate-wave inline-block">
                                    👋🏼
                                </span>
                            </p>
                            <h1>
                                <LinearGradient
                                    gradient={["to left", "#17acff ,#ff68f0"]}
                                    fallbackColor="default"
                                    className="mb-2 text-4xl font-bold "
                                >
                                    Nawazuddin Siddique
                                </LinearGradient>
                            </h1>
                            <p className="text-md w-2/3  ">{t(randomQuote)}</p>
                            <p className="font-semibold text-2xl text-default-600 ">
                                {greeting}
                            </p>
                        </div>
                        {/* Cube */}
                        <Cube />
                    </div>
                </CardHeader>

                {/* On light mode show square-light.svg, on dark mode hide the image */}
                {theme === "light" && (
                    <Image
                        removeWrapper
                        className="z-0 w-full h-full object-cover"
                        src="home-square-bg.svg"
                    />
                )}
            </Card>
        </div>
    );
}

export default WelcomeCard;
