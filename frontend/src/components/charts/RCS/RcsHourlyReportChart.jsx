import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { getHourlyReport } from "../../../services/Rcs/rcsgraphService";
import { useRcsStore } from "../../../store/rcsStore";

const SplineChart = () => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        series: [
            { name: "Failed", data: [] },
            { name: "Delivered", data: [] },
        ],
        categories: [],
    });

    // selected date from datepicker
    const { dashboardDate } = useRcsStore();

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const date = new Date(dashboardDate); // Replace with the desired date
                const data = await getHourlyReport(date);
                setChartData({
                    series: data.series,
                    categories: data.categories || [],
                });
            } catch (error) {
                console.error("Error fetching hourly report data:", error);
            }
        };

        fetchChartData();
    }, [dashboardDate]);

    useEffect(() => {
        const options = {
            series: chartData.series,
            chart: { height: 350, type: "area" },
            dataLabels: { enabled: false },
            stroke: { curve: "smooth" },
            xaxis: {
                type: "datetime",
                categories: chartData.categories,
            },
            yaxis: {
                // min: 0,
                // max: 500,
                // tickAmount: 10,
                min: 0,
                max: 50,
                tickAmount: 5,
            },
            tooltip: { x: { format: "dd/MM/yy HH:mm" } },
        };

        const chart = new ApexCharts(chartRef.current, options);
        chart.render();

        // Cleanup
        return () => chart.destroy();
    }, [chartData]);

    return <div ref={chartRef} />;
};

export default SplineChart;
