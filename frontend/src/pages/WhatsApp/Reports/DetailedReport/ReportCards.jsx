import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getWhatsappStats } from "./DetailedTable/utils";

export default function ReportCards() {
    const [searchParams] = useSearchParams();
    const campaign_id = searchParams.get("campaignId");
    const [stats, setStats] = useState({
        currentStats: {
            submittedCredits: 0,
            deliveredCredits: 0,
            failedCredits: 0,
            readCredits: 0,
            pendingCredits: 0
        },
        percentages: {
            submitted: 0,
            delivered: 0,
            failed: 0,
            read: 0,
            pending: 0
        }
    });

    useEffect(() => {
        if (!campaign_id) return;

        const fetchData = async () => {
            try {
                const response = await getWhatsappStats(campaign_id);
                
                if (response?.data) {
                    setStats({
                        currentStats: {
                            submittedCredits: response.data.currentStats.submittedCredits || 0,
                            deliveredCredits: response.data.currentStats.deliveredCredits || 0,
                            failedCredits: response.data.currentStats.failedCredits || 0,
                            readCredits: response.data.currentStats.readCredits || 0,
                            pendingCredits: response.data.currentStats.pendingCredits || 0
                        },
                        percentages: {
                            submitted: response.data.percentages.submitted || 0,
                            delivered: response.data.percentages.delivered || 0,
                            failed: response.data.percentages.failed || 0,
                            read: response.data.percentages.read || 0,
                            pending: response.data.percentages.pending || 0
                        }
                    });
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Error in fetching WhatsApp stats");
            }
        };

        fetchData();
    }, [campaign_id]);

    const getTrendIcon = (percentage) => {
        if (percentage > 0) return "+";
        if (percentage < 0) return "-";
        return "";
    };

    return (
        <div className="w-full flex gap-4">
            {/* Submitted Card */}
            <StatCard 
                title="Submitted Numbers"
                value={stats.currentStats.submittedCredits}
                percentage={stats.percentages.submitted}
                icon="ri:check-fill"
                iconColor="warning"
                gradientFrom="warning-50"
                gradientTo="warning-100"
                borderColor="warning-200"
                textColor="primary-800"
            />

            {/* Delivered Card */}
            <StatCard 
                title="Delivered Numbers"
                value={stats.currentStats.deliveredCredits}
                percentage={stats.percentages.delivered}
                icon="ri:check-double-fill"
                iconColor="success"
                gradientFrom="success-50"
                gradientTo="success-100"
                borderColor="success-200"
                textColor="success-800"
            />

            {/* Failed Card */}
            <StatCard 
                title="Failed Numbers"
                value={stats.currentStats.failedCredits}
                percentage={stats.percentages.failed}
                icon="streamline:money-graph-arrow-decrease-down-stats-graph-descend-right-arrow"
                iconColor="danger"
                gradientFrom="danger-50"
                gradientTo="danger-100"
                borderColor="danger-200"
                textColor="danger-800"
            />

            {/* Read Messages Card */}
            <StatCard 
                title="Read Messages"
                value={stats.currentStats.readCredits}
                percentage={stats.percentages.read}
                icon="ri:check-double-fill"
                iconColor="primary"
                gradientFrom="primary-50"
                gradientTo="primary-100"
                borderColor="primary-200"
                textColor="warning-800"
            />
        </div>
    );
}

const StatCard = ({ 
    title, 
    value, 
    percentage, 
    icon, 
    iconColor,
    gradientFrom,
    gradientTo,
    borderColor,
    textColor
}) => {
    const trendIcon = getTrendIcon(percentage);
    const trendColor = percentage > 0 ? "text-success" : percentage < 0 ? "text-danger" : "text-gray-500";

    return (
        <div className={`w-1/4 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} border-2 border-${borderColor} rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative`}>
            <div className="flex flex-col gap-4">
                <h1 className={`font-semibold text-md text-${textColor}`}>
                    {title}
                </h1>
                <p className={`text-5xl font-bold text-${textColor}`}>
                    {value}
                </p>
                <p className={`text-sm font-semibold text-${textColor}`}>
                    <span className={trendColor}>
                        {trendIcon}
                        {Math.abs(percentage)}%
                    </span> Vs last campaign
                </p>
            </div>
            <div className="absolute right-8">
                <Icon
                    icon={icon}
                    width="3em"
                    height="3em"
                    className={`text-${iconColor}`}
                />
            </div>
        </div>
    );
};

// Helper function to determine trend icon
const getTrendIcon = (percentage) => {
    if (percentage > 0) return "+";
    if (percentage < 0) return "-";
    return "";
};