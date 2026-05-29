import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const ClickChart = ({ percentage, current, total }) => {
  const chartRef = useRef(null);

  const applyRoundedEdges = () => {
    const tracks = document.querySelectorAll(
      ".apexcharts-radialbar .apexcharts-tracks path"
    );
    const series = document.querySelectorAll(
      ".apexcharts-radialbar .apexcharts-series path"
    );

    // Add rounded corners to both tracks and series
    [...tracks, ...series].forEach((path) => {
      path.setAttribute("stroke-linecap", "round");
    });
  };

  useEffect(() => {
    const options = {
      series: [parseFloat(percentage)],
      chart: {
        height: 350,
        width: 320,

        type: "radialBar",
        events: {
          mounted: applyRoundedEdges, // Apply rounded edges on mount
          updated: applyRoundedEdges, // Apply rounded edges on update
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            size: "60%",
          },
          track: {
            background: "#e7e7e7",
            strokeWidth: "35%",
          },
          dataLabels: {
            name: {
              show: true,
            },
            value: {
              show: true,
              color: "#007BFF",
              fontSize: "2.25rem",
              fontWeight: "600",
              fontFamily: "&quot;Public Sans Variable&quot",
              offsetY: -45, // Adjust vertical position
              offsetX: -10, // Adjust horizontal position
              formatter: (val) => `${val.toFixed(2)}%`,
            },
            total: {
              show: true,
              label: `${current}/${total} Click Rate`,
              color: "#007BFF",
              fontSize: "0.70rem",
              fontWeight: "500",
              fontFamily: "&quot;Public Sans Variable&quot",
              offsetY: 45,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "linear",
          shadeIntensity: 1,
          gradientToColors: ["#00E396"],
          colorFrom: "#00E396",
          stops: [0, 100],
        },
      },
      stroke: {
        width: 2,
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    // Cleanup
    return () => chart.destroy();
  }, [percentage, current, total]);

  return <div ref={chartRef} />;
};

export default ClickChart;
