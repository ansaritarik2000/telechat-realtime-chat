import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { useEmailDashStore } from "../../store/emailCampaign/dashboardDate";

const ColumnChart = ({data}) => {
    const chartRef = useRef(null);
    let chart = useRef(null); // Ref for the chart instance
    const  EmailDashboard = useEmailDashStore((state)=> state.EmailDashboard)
    // const [chartdata, setChartData]  = useState([])

    
    useEffect(() => {
        
        const options = {
            series: [
                { name: "Delivered", data: EmailDashboard?.dayWiseReport?.map(item => item.delivered || 0) },
                { name: "Awaited", data: EmailDashboard?.dayWiseReport?.map(item => item.bounces || 0) },
                { name: "Failed", data: EmailDashboard?.dayWiseReport?.map(item => item.failed || 0) },
            ],
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
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            },
            yaxis: {
                min: 0,
                max: 500, // Set maximum value for y-axis
                tickAmount: 5, // Number of ticks between min and max
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
    }, [EmailDashboard]); // Empty dependency array ensures useEffect runs only once

    return <div id="chart" ref={chartRef}></div>;
};

export default ColumnChart;
