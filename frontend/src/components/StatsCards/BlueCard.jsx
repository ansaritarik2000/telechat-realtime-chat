import React from "react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

export default function BlueCard(props) {
    const {
        heading = "Submitted Numbers",
        number = "234",
        percentage = "+20%",
        subheading = "Vs last campaign",
        icon = "streamline:money-graph-arrow-increase-ascend-growth-up-arrow-stats-graph-right-grow",
        w = "full",
        iconPercentageSubmitted = "",
    } = props;
    const { t } = useTranslation();

    return (
        <div
            className={`w-${w}  bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200   rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative`}>
            <div className="flex flex-col gap-4 ">
                <h1 className="font-semibold text-md text-primary-900">
                    {t(heading)}
                </h1>
                <p className="text-5xl font-bold text-primary-800">{number}</p>
                <p className="text-sm font-semibold text-primary-800">
                    <span
                        className={
                            // dynamic percentage color
                            iconPercentageSubmitted === "-"
                                ? "text-danger"
                                : "text-success"
                        }>
                        {iconPercentageSubmitted}
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
                    className="text-primary"
                />
            </div>
        </div>
    );
}
