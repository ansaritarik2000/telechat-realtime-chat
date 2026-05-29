import React from "react";
import ApexCharts from "react-apexcharts";
import { useTranslation } from "react-i18next";

const PolarChart = (props) => {
    const { t } = useTranslation();
    const { values = [4, 6, 3, 5], names = ["Transactional", "Promotional"] } =
        props;

    const options = {
        series: [...values],
        chart: {
            type: "polarArea",
            width: "40%", // Set to full width or a specific pixel value
        },
        stroke: {
            colors: ["#fff"],
        },
        fill: {
            opacity: 1,
        },
        legend: {
            show: false, // Hide the legend
        },
        tooltip: {
            y: {
                formatter: (value, { seriesIndex }) => {
                    // Customize the label text here
                    const labels = [...names];
                    return `${t(labels[seriesIndex])}: ${value}`;
                },
            },
            // Disable the default tooltip title
            x: {
                show: false,
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300, // Adjust as needed
                    },
                    legend: {
                        position: "bottom",
                        show: false, // Hide the legend for small screens as well
                    },
                },
            },
        ],
    };

    return (
        <div>
            <ApexCharts
                options={options}
                series={options.series}
                type="polarArea"
                height={550} // Adjust the height as needed
                width="100%" // Make the chart take up full width of its container
            />
        </div>
    );
};

export default PolarChart;
