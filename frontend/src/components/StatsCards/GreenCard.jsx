import React from "react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

export default function BlueCard(props) {
    const {
        heading = "Delivered Numbers",
        number = "220",
        percentage = "+10",
        subheading = "Vs last campaign",
        icon = "material-symbols:bar-chart",
        w = "full",
        iconPercentageDelivered = "",
    } = props;

    const { t } = useTranslation();
    return (
        <div
            className={`w-${w} bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative`}>
            <div className="flex flex-col gap-4">
                <h1 className="font-semibold text-md text-success-900">
                    {" "}
                    {t(heading)}
                </h1>
                <p className="text-5xl font-bold text-success-800">{number}</p>
                <p className="text-sm font-semibold text-success-800">
                    <span
                        className={
                            // dynamic percentage color
                            iconPercentageDelivered === "-"
                                ? "text-danger"
                                : "text-success"
                        }>
                        {iconPercentageDelivered}
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
                    className="text-success"
                />
            </div>
        </div>
    );
}
