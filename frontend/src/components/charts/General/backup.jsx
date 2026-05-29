import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const CircleGradientBase = ({ percent, color, valueColor }) => {
  const [state] = useState({
    series: [percent], // Example data (percentage)
    options: {
      chart: {
        height: 200, // Height of the chart inside the card
        type: "radialBar",
        toolbar: {
          show: false, // Hide the toolbar
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: 0, // Start angle of the radial circle
          endAngle: 360, // End angle of the radial circle
          hollow: {
            margin: 0,
            size: "55%", // The size of the hollow center (adjust this as needed)
          },
          track: {
            strokeWidth: "60%", // Stroke width of the track
            background: "#fff",
          },
          dataLabels: {
            show: true, // Enable data labels
            name: {
              //   offsetY: -10,
              //   offsetX: 100,
              show: false,
              color: "#888",
              fontSize: "17px",
            },
            value: {
              formatter: (val) => `${parseInt(val)}%`, // Format value as percentage
              color: valueColor,
              fontSize: "22px",
              fontStyle: "bold",
              show: true,
              offsetY: 10,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light", // Shade of the gradient
          type: "horizontal", // Horizontal gradient
          shadeIntensity: 0.5, // Intensity of the shade
          gradientToColors: [valueColor], // Gradient color
          inverseColors: true, // Inverse the gradient colors
          opacityFrom: 20,
          opacityTo: 80,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round", // Round ends for the stroke
        // width: 8, // Stroke width of the radial bar (adjust as needed)
      },
      labels: ["label"], // Label for the chart
    },
  });

  return (
    <div className="flex justify-center items-center w-40">
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="radialBar"
          height={150} // You can control the chart height here
        />
      </div>
    </div>
  );
};

export const CircleGradientSuccess = ({ percent }) => (
  <CircleGradientBase percent={percent} color="success" valueColor="#17C964" />
);

export const CircleGradientWarning = ({ percent }) => (
  <CircleGradientBase percent={percent} color="warning" valueColor="#FFB547" />
);

export const CircleGradientError = ({ percent }) => (
  <CircleGradientBase percent={percent} color="error" valueColor="#FF6347" />
);
