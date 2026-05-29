import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { getGraphMemberService } from "../../../../services/members/memberService";

const RadialChart = () => {
    const [dataSeries, setDataSeries] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [labels, setLabels] = useState([
        "Admin",
        "Agent",
        "Viewer",
        "Campaigner",
    ]);

    useEffect(() => {
        const fetchGraphData = async () => {
            const response = await getGraphMemberService();

            if (response.status === "SUCCESS") {
                const datSeries = Object.values(response.data?.roleTotals); // Admin, Agent, Compaigner, Viewer
                const labelsData = Object.keys(response.data?.roleTotals);
                setLabels(labelsData);
                setDataSeries(datSeries);
                setTotalUsers(response.data?.totalUsers);
            } else {
                console.error("Failed to fetch graph data:", response.message);
            }
        };

        fetchGraphData();
    }, []);

    const { t } = useTranslation();

    const options = {
        chart: {
            height: 350,
            type: "radialBar",
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: "22px",
                    },
                    value: {
                        fontSize: "16px",
                        formatter: (val) => val,
                    },
                    total: {
                        show: true,
                        label: t("Total"),
                        formatter: () => {
                            return totalUsers; // Calculate total
                        },
                    },
                },
                track: {
                    background: "#F6F7F8",
                    strokeWidth: "100%", // Set the width of the track's background circle
                },
                hollow: {
                    margin: 2, // Margin between the hollow center and radial bar
                    size: "42%", // Size of the hollow center
                },
            },
        },
        stroke: {
            lineCap: "round",
            width: 10, // Increase stroke width here (in pixels)
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                shadeIntensity: 0.5,
                type: "horizontal",
                gradientToColors: ["#ABE5A1", "#4FC3F7", "#FBB13C", "#C084FC"],
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
            },
        },
        colors: [
            "rgba(34, 197, 94, 1)", // Green (success)
            "rgba(37, 99, 235, 1)", // Blue (primary)
            "rgba(251, 191, 36, 1)", // Yellow (warning)
            "rgba(126, 34, 206, 1)", // Purple (secondary)
        ],
        labels: labels, // Updated labels
    };

    return (
        <div>
            <div id="chart">
                <ReactApexChart
                    options={options}
                    series={dataSeries}
                    type="radialBar"
                    height={270}
                />
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default RadialChart;
