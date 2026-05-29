import React from "react";
import { Card, CardBody, Divider, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import ExecutionsTable from "./ExecutionTable";
import { useLocation } from "react-router-dom";

// Metric Card Component
const MetricCard = ({ icon, label, value, color, isLoading = false }) => {
    // Color configurations with light and dark mode variants
    const colorStyles = {
        blue: {
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            iconColor: "text-blue-500",
            darkBgColor: "dark:bg-blue-950/30",
            darkTextColor: "dark:text-blue-400",
            darkIconColor: "dark:text-blue-300",
            darkIconBgColor: "dark:bg-blue-900/40",
        },
        green: {
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            iconColor: "text-green-500",
            darkBgColor: "dark:bg-green-950/30",
            darkTextColor: "dark:text-green-400",
            darkIconColor: "dark:text-green-300",
            darkIconBgColor: "dark:bg-green-900/40",
        },
        red: {
            bgColor: "bg-red-50",
            textColor: "text-red-600",
            iconColor: "text-red-500",
            darkBgColor: "dark:bg-red-950/30",
            darkTextColor: "dark:text-red-400",
            darkIconColor: "dark:text-red-300",
            darkIconBgColor: "dark:bg-red-900/40",
        },
        purple: {
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            iconColor: "text-purple-500",
            darkBgColor: "dark:bg-purple-950/30",
            darkTextColor: "dark:text-purple-400",
            darkIconColor: "dark:text-purple-300",
            darkIconBgColor: "dark:bg-purple-900/40",
        },
        indigo: {
            bgColor: "bg-indigo-50",
            textColor: "text-indigo-600",
            iconColor: "text-indigo-500",
            darkBgColor: "dark:bg-indigo-950/30",
            darkTextColor: "dark:text-indigo-400",
            darkIconColor: "dark:text-indigo-300",
            darkIconBgColor: "dark:bg-indigo-900/40",
        },
    };

    const {
        bgColor,
        textColor,
        iconColor,
        darkBgColor,
        darkTextColor,
        darkIconColor,
        darkIconBgColor,
    } = colorStyles[color];

    return (
        <Card
            className={`w-full shadow-md  ${darkBgColor} ${bgColor} dark:shadow-lg dark:shadow-content2/4 dark:border-content3/20`}
        >
            <CardBody className="p-6">
                <div className="flex flex-col gap-2">
                    <div
                        className={`p-2 w-fit rounded-lg bg-white ${darkIconBgColor}`}
                    >
                        <div
                            className={`text-xl ${iconColor} ${darkIconColor}`}
                        >
                            {icon}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-default-500 dark:text-default-600 ">
                            {label}
                        </span>
                        <span
                            className={`text-2xl font-semibold ${textColor} ${darkTextColor} min-h-[2rem]`}
                        >
                            {isLoading ? (
                                <Spinner size="sm" color={color} />
                            ) : (
                                value?.toLocaleString() || "0"
                            )}
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default function FlowAnalytics() {
    // Static metric definitions
    const metricDefinitions = [
        {
            id: "total_runs",
            icon: <Icon icon="proicons:bar-chart" />,
            label: "Total Runs",
            color: "blue",
        },
        {
            id: "executing_runs",
            icon: <Icon icon="solar:play-circle-linear" />,
            label: "Executing Runs",
            color: "indigo",
        },
        {
            id: "completed_runs",
            icon: <Icon icon="solar:check-circle-linear" />,
            label: "Completed Runs",
            color: "green",
        },
        {
            id: "failed_runs",
            icon: <Icon icon="mynaui:x-circle" />,
            label: "Failed Runs",
            color: "red",
        },
        {
            id: "credits_consumed",
            icon: <Icon icon="f7:creditcard" />,
            label: "Credits Consumed",
            color: "purple",
        },
    ];

    // State for the dynamic values
    const [metricValues, setMetricValues] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);

    // URL Query parameter to get flow name
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const flowName = queryParams.get("flowName");

    // Fetch only the values from API
    React.useEffect(() => {
        const fetchMetricValues = async () => {
            try {
                setIsLoading(true);

                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Example of data structure you might receive from API
                const apiData = {
                    total_runs: 1248,
                    executing_runs: 42,
                    completed_runs: 1156,
                    failed_runs: 50,
                    credits_consumed: 3542,
                };

                setMetricValues(apiData);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
                // Set default values in case of error
                setMetricValues({});
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetricValues();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-medium mb-6 ">{flowName} Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {metricDefinitions.map((metric) => (
                    <MetricCard
                        key={metric.id}
                        icon={metric.icon}
                        label={metric.label}
                        value={metricValues[metric.id]}
                        color={metric.color}
                        isLoading={isLoading}
                    />
                ))}
            </div>

            <Divider className="mt-10" />

            {/* Executions Table */}
            <ExecutionsTable />
        </div>
    );
}
