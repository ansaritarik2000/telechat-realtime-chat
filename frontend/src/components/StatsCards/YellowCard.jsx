import React from "react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

export default function YellowCard(props) {
    const {
        heading = "Awaited Numbers",
        number = "10",
        percentage = "-10",
        subheading = "Vs last campaign",
        icon = "streamline:interface-signal-graph-heart-line-beat-square-graph-stats",
        w = "full",
        iconPercentageAwaiting = "",
    } = props;

    const { t } = useTranslation();

    return (
        <div
            className={`w-${w} bg-gradient-to-r from-warning-50 to-warning-100 border-2 border-warning-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative`}>
            <div className="flex flex-col gap-4">
                <h1 className="font-semibold text-md text-warning-900">
                    {t(heading)}
                </h1>
                <p className="text-5xl font-bold text-warning-800">{number}</p>
                <p className="text-sm font-semibold text-warning-800">
                    <span
                        className={
                            // dynamic percentage color
                            iconPercentageAwaiting === "-"
                                ? "text-danger"
                                : "text-success"
                        }>
                        {iconPercentageAwaiting}
                        {percentage}%
                    </span>{" "}
                    {t(subheading)}
                </p>
            </div>
            <div className="absolute right-8">
                <Icon
                    icon={icon}
                    width="3em"
                    height="3em"
                    className="text-warning"
                />
            </div>
        </div>
    );
}
