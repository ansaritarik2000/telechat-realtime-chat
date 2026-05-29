import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { getWeeklyReport } from "../../../services/Sms/smsgraphService";
import { useRcsStore } from "../../../store/rcsStore";
const ColumnChart = () => {
    const chartRef = useRef(null);

    // selected date from datepicker
    const { dashboardDate } = useRcsStore();

    let chart = useRef(null); // Ref for the chart instance
    const [chartData, setChartData] = useState({
        series: [
            { name: "Delivered", data: [] },
            { name: "Awaited", data: [] },
            { name: "Failed", data: [] },
        ],
        categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    });

    useEffect(() => {
        const fetchChartData = async () => {
            // Function to get the start and end dates of the current week
            const getCurrentWeekDates = () => {
                const now = new Date(dashboardDate);
                const dayOfWeek = now.getDay();
                const diffToMonday = (dayOfWeek + 6) % 7; // Adjust to get the start of the week (Monday)
                const startOfWeek = new Date(
                    now.setDate(now.getDate() - diffToMonday)
                );
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Sunday)

                // Format dates as YYYY-MM-DD
                const formatDate = (date) => date.toISOString().split("T")[0];

                return {
                    startDate: formatDate(startOfWeek),
                    endDate: formatDate(endOfWeek),
                };
            };

            try {
                const { startDate, endDate } = getCurrentWeekDates();
                const data = await getWeeklyReport(startDate, endDate); // Example dates, replace with actual
                setChartData({
                    series: data.series,

                    categories: data.categories || [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                    ], // Default categories if not provided
                });
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchChartData();
    }, [dashboardDate]); // Empty dependency array ensures useEffect runs only once

    useEffect(() => {
        const options = {
            series: chartData.series,
            colors: ["#00E396", "#FEB019", "#008FFB"], // Green for Delivered, Yellow for Awaited, Blue for Failed
            chart: {
                type: "bar",
                height: 350,
            },
            plotOptions: {
                bar: {
                    borderRadius: 6,
                    horizontal: false,
                    columnWidth: "55%",
                    endingShape: "rounded",
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            xaxis: {
                categories: chartData.categories,
            },
            yaxis: {
                // min: 0,
                // max: 50, // Set maximum value for y-axis
                // tickAmount: 5, // Number of ticks between min and max
                title: {
                    text: "Hundreds",
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
        };

        // Initialize chart on component mount
        if (chartRef.current) {
            chart.current = new ApexCharts(chartRef.current, options);
            chart.current.render();
        }

        // Cleanup function
        return () => {
            // Destroy chart instance when component unmounts
            if (chart.current) {
                chart.current.destroy();
            }
        };
    }, [chartData]); // Empty dependency array ensures useEffect runs only once

    return <div id="chart" ref={chartRef}></div>;
};

export default ColumnChart;
