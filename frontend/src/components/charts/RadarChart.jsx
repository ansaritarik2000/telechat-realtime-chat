import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const RadarChart = ({data}) => {
  const chartRef = useRef(null);
  const chart = useRef(null); // Ref for the chart instance

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Series 1",
          data: [3000, 4000, 4500, 3200, 3000, 3800],
        },
      ],
      chart: {
        height: 350,
        type: "radar",
      },

      yaxis: {
        min: 0, // Set the minimum value of y-axis
        max: 5000, // Set the maximum value of y-axis
        tickAmount: 5, // Number of ticks on y-axis
        labels: {
          formatter: function (value) {
            return value.toLocaleString(); // Format the labels with commas
          },
        },
      },
      xaxis: {
        categories: ["January", "February", "March", "April", "May", "June"],
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
  }, []); // Empty dependency array ensures useEffect runs only once

  return <div id="chart" ref={chartRef}></div>;
};

export default RadarChart;
