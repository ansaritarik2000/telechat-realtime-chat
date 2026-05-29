import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { getYearlyReport } from "../../../services/Rcs/rcsgraphService";
import { useRcsStore } from "../../../store/rcsStore";

const RadarChart = () => {
  const chartRef = useRef(null);
  const chart = useRef(null); // Ref for the chart instance
  // selected date from datepicker
  const { dashboardDate } = useRcsStore();
  const yearOfDate = new Date(dashboardDate).getFullYear(); // Extract the year

  const [chartData, setChartData] = useState({
    series: [
      { name: "Failed", data: [] },
      { name: "Delivered", data: [] },
    ],
    categories: [],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const year = yearOfDate; // Replace with the desired year
        const data = await getYearlyReport(year);

        setChartData({
          series: data.series,
          categories: data.categories || [],
        });
      } catch (error) {
        console.error("Error fetching yearly report data:", error);
      }
    };

    fetchChartData();
  }, [yearOfDate]);

  console.log("chartData", chartData);

  useEffect(() => {
    const options = {
      series: [
        {
          name: chartData.series[1].name, // delivered data
          data: chartData.series[1].data, // showing only delivered data
        },
      ],
      chart: {
        height: 350,
        type: "radar",
      },
      colors: ["#00E396"],

      yaxis: {
        // min: 0, // Set the minimum value of y-axis
        // max: 5000, // Set the maximum value of y-axis
        // tickAmount: 5, // Number of ticks on y-axis
        labels: {
          formatter: function (value) {
            return value.toLocaleString(); // Format the labels with commas
          },
        },
      },
      xaxis: {
        categories: chartData.categories,
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

export default RadarChart;
