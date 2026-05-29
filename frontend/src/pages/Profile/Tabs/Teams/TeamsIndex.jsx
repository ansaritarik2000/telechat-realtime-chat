import {
    addToast,
    Badge,
    Tooltip,
    Divider,
    Card,
    CardHeader,
    CardBody,
    Chip,
} from "@heroui/react";
import Avatar from "avvvatars-react";
import TeamsTable from "./Table/Index";
import { Icon } from "@iconify-icon/react";
import RadialChart from "./RadialChart";
import { useTranslation } from "react-i18next";
import { lazy, Suspense, useEffect, useState } from "react";
import {
    getActiveMembersService,
    getGraphMemberService,
} from "../../../../services/members/memberService";
import { useQuery } from "@tanstack/react-query";
// const lazyChart = lazy(() =>
//     import("react-apexcharts").then((module) => ({ default: module.default }))
// );
const LazyChart = lazy(() => import("react-apexcharts"));

const ProfileBadge = ({ letter, name }) => {
    return (
        <Badge
            content=""
            color="success"
            shape="circle"
            placement="bottom-right"
        >
            <Tooltip content={name} placement="bottom">
                <div class="cursor-pointer flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full border-success text-default-500 text-2xl border font-medium">
                    {letter}
                </div>
            </Tooltip>
        </Badge>
    );
};

export default function TeamsIndex() {
    const { t } = useTranslation();
    const [activeMembers, setActiveMembers] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [loading, setLoading] = useState(true);

    const colorMap = {
        Admin: "rgba(34, 197, 94, 1)",
        Campaigner: "rgba(126, 34, 206, 1)",
        Viewer: "rgba(251, 191, 36, 1)",
        Agent: "rgba(37, 99, 235, 1)",
    };

    const totalUsers = roleData.reduce((sum, role) => sum + role.value, 0);

    useEffect(() => {
        const fetchActiveMembers = async () => {
            setLoading(true);
            const response = await getActiveMembersService();

            if (response.status === "SUCCESS") {
                setActiveMembers(response.data); // Set the active members data
            } else {
                addToast({
                    color: "danger",
                    title: "Failed to fetch active members",
                });

                console.error(
                    "Failed to fetch active members:",
                    response.message
                );
            }
            setLoading(false);
        };

        fetchActiveMembers();
    }, []);

    const {
        data: graphData,
        error: graphDataError,
        isLoading: graphDataisLoading,
    } = useQuery({
        queryKey: ["graphMemberData"],
        queryFn: async () => {
            const response = await getGraphMemberService();
            if (response.status === "SUCCESS") {
                return {
                    labels: Object.keys(response.data?.roleTotals),
                    dataSeries: Object.values(response.data?.roleTotals),
                    totalUsers: response.data?.totalUsers,
                };
            } else {
                throw new Error(response.message);
            }
        },
        staleTime: 60000, // Optional: Cache data for 60 seconds
        refetchOnWindowFocus: false, // Prevent refetching when window regains focus
    });

    useEffect(() => {
        if (graphData) {
            const updatedRoleData =
                graphData?.labels.map((label, index) => ({
                    label,
                    value: graphData?.dataSeries[index] || 0, // Ensure value is not undefined
                    color: colorMap[label] || "rgba(0, 0, 0, 1)", // Default color if label not found
                })) || [];

            setRoleData(updatedRoleData);
        }
    }, [graphData]);

    return (
        <div className="flex flex-col gap-6">
            {/* Top Sectoin: px-6 py-8 bg-content2 rounded-2xl */}
            <div className="flex justify-between gap-6 w-full">
                {/* Active Members */}
                <Card className="min-w-[20rem] w-2/5 border border-transparent dark:border-default">
                    <CardHeader className="bg-content-50">
                        <div className="flex gap-2 items-center p-1">
                            <Icon
                                icon="solar:users-group-two-rounded-line-duotone"
                                width={24}
                            />
                            <h2 className="font-semibold text-sm">
                                {t("Active Members")} ({activeMembers.length})
                            </h2>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="">
                        <div className="flex gap-3 p-4 ">
                            {loading ? (
                                <p>{t("Loading...")}</p>
                            ) : (
                                activeMembers.map((member) => (
                                    <div className="flex-col flex items-center  gap-2 ">
                                        <Tooltip
                                            content={member.full_name}
                                            placement="bottom"
                                            radius="full"
                                        >
                                            <div>
                                                <Badge
                                                    key={member.id}
                                                    content=""
                                                    color="success"
                                                    shape="circle"
                                                    placement="bottom-right"
                                                >
                                                    <Avatar
                                                        value={
                                                            member.avatar_value
                                                                ? member.avatar_value
                                                                : member.full_name
                                                        } // Pass computed initials as value
                                                        shadow={true}
                                                        size={55}
                                                        border={false}
                                                    />
                                                </Badge>
                                            </div>
                                        </Tooltip>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* Graphs */}
                <Card className="w-3/5 border border-transparent dark:border-default">
                    <CardBody className="px-2 py-4">
                        <div className="flex items-center gap-2 flex-wrap justify-around ">
                            {roleData
                                .filter((item) => item.value > 0)
                                .map((item, index) => {
                                    const percentage =
                                        (item.value / totalUsers) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="min-w-[10rem] px-4 flex-col"
                                        >
                                            <p className="text-sm text-center font-medium p-2">
                                                {item.label}
                                            </p>
                                            <div className="h-px bg-divider"></div>
                                            <div className="flex-center p-2">
                                                <Suspense
                                                    fallback={
                                                        <div>Loading...</div>
                                                    }
                                                >
                                                    <LazyChart
                                                        type="radialBar"
                                                        width="110px"
                                                        series={[percentage]}
                                                        options={{
                                                            chart: {
                                                                sparkline: {
                                                                    enabled: true,
                                                                },
                                                            },
                                                            stroke: {
                                                                lineCap:
                                                                    "round",
                                                            },
                                                            fill: {
                                                                type: "gradient",
                                                                gradient: {
                                                                    colorStops:
                                                                        [
                                                                            {
                                                                                offset: 0,
                                                                                color: item.color,
                                                                                opacity: 1,
                                                                            },
                                                                            {
                                                                                offset: 100,
                                                                                color: item.color,
                                                                                opacity: 0,
                                                                            },
                                                                        ],
                                                                },
                                                            },
                                                            plotOptions: {
                                                                radialBar: {
                                                                    hollow: {
                                                                        margin: 0,
                                                                        size: "40%",
                                                                        background:
                                                                            "transparent",
                                                                    },
                                                                    track: {
                                                                        background:
                                                                            "#e0e0e0",
                                                                        strokeWidth:
                                                                            "97%",
                                                                        margin: 5,
                                                                        dropShadow:
                                                                            {
                                                                                enabled: false,
                                                                            },
                                                                    },
                                                                    dataLabels:
                                                                        {
                                                                            name: {
                                                                                show: false,
                                                                            },
                                                                            value: {
                                                                                offsetY: 6,
                                                                                fontSize:
                                                                                    "20px",
                                                                                fontWeight: 400,
                                                                                color: item.color,
                                                                                formatter:
                                                                                    () =>
                                                                                        item.value,
                                                                            },
                                                                        },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Suspense>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Teams Table */}
            <TeamsTable />
        </div>
    );
}
