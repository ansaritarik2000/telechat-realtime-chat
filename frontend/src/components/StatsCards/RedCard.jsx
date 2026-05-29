import React from "react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

export default function RedCard(props) {
    const {
        heading = "Failed Numbers",
        number = "4",
        percentage = "-70%",
        subheading = "Vs last campaign",
        icon = "streamline:money-graph-arrow-decrease-down-stats-graph-descend-right-arrow",
        w = "full",
        iconPercentageFailed = "",
    } = props;

    const { t } = useTranslation();
    return (
        <div
            className={` w-${w} bg-gradient-to-r from-danger-50 to-danger-100 border-2 border-danger-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative`}>
            <div className="flex flex-col gap-4">
                <h1 className="font-semibold text-md text-danger-900">
                    {t(heading)}
                </h1>
                <p className="text-5xl font-bold text-danger-800">{number}</p>
                <p className="text-sm font-semibold text-danger-800">
                    <span
                        className={
                            // dynamic percentage color
                            iconPercentageFailed === "-"
                                ? "text-danger"
                                : "text-success"
                        }>
                        {iconPercentageFailed}
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
                    className="text-danger"
                />
            </div>
        </div>
    );
}
