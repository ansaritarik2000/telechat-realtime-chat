import { useTranslation } from "react-i18next";
import PolarChart from "./Chart";
import { Icon } from "@iconify-icon/react";

const chartValues = [4, 6, 3, 5];

export default function Expenses({
    textLabels = [],
    chartLabels,
    chartValues,
}) {
    const { t } = useTranslation();
    return (
        <div className="w-1/2 border-2 dark:border-content2 rounded-lg px-6 py-6 flex flex-col justify-between">
            {/* Heading */}
            <h1 className="font-semibold text-xl text-default-700">
                {t("Expenses categories")}
            </h1>
            <div className="flex justify-around items-center">
                {/* Chart */}
                <PolarChart values={chartValues} names={chartLabels} />

                <div className="flex flex-col">
                    {textLabels.map((label, index) => (
                        <p
                            key={index}
                            className="text-md font-semibold flex items-center gap-1">
                            <Icon
                                icon={label.icon}
                                width="1.2em"
                                height="1.2em"
                                className={`text-${label.color}`}
                            />
                            {t(label.label)}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
