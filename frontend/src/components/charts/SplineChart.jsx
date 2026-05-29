import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useEmailDashStore } from "../../store/emailCampaign/dashboardDate";

const SplineChart = ({data}) => {
    const chartRef = useRef(null);
    const  EmailDashboard = useEmailDashStore((state)=> state.EmailDashboard)
    useEffect(() => {
        console.log("Spline Data",EmailDashboard )
        const options = {
            series: [
                { name: "Delivered", data: EmailDashboard?.dayWiseReport?.map(item => item.delivered || 0) },
                { name: "Failed", data: EmailDashboard?.dayWiseReport?.map(item => item.bounces|| 0) },
            ],
            chart: { height: 350, type: "area",width:"100%" },
            dataLabels: { enabled: false },
            stroke: { curve: "smooth" },
            xaxis: {
                type: "datetime",
                categories: [
                    "2018-09-19T00:00:00.000Z",
                    "2018-09-19T01:30:00.000Z",
                    "2018-09-19T02:30:00.000Z",
                    "2018-09-19T03:30:00.000Z",
                    "2018-09-19T04:30:00.000Z",
                    "2018-09-19T05:30:00.000Z",
                    "2018-09-19T06:30:00.000Z",
                ],
            },
            yaxis: {
                min: 0,
                max: 500,
                tickAmount: 10, // Number of ticks between min and max
            },
            tooltip: { x: { format: "dd/MM/yy HH:mm" } },
        };

        const chart = new ApexCharts(chartRef.current, options);
        chart.render();

        // Cleanup
        return () => chart.destroy();
    }, [EmailDashboard]);

    return <div ref={chartRef} />;
};

export default SplineChart;
