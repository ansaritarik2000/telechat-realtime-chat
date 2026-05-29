import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import emailCampaingnStore from "../../store/emailCampaign/emailCampaignStore";

const BounceChart = () => {
  const chartRef = useRef(null);
  const EmailDashboard = emailCampaingnStore((state) => state.EmailDashboard);
  // Function to apply rounded edges
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
    let totalSubmittedCredits = 0;
    let totalBouncCredits = 0;
    EmailDashboard.forEach((campaign) => {
      totalSubmittedCredits += campaign.submittedCredits || 0;
      totalBouncCredits += campaign.openCredits || 0;
    });
    const openCreditsPercentage =
      totalSubmittedCredits > 0
        ? (totalBouncCredits / totalSubmittedCredits) * 100
        : 0;
    const options = {
      series: [openCreditsPercentage],
      chart: {
        height: 350,
        width: 370,
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
            strokeWidth: "50%",
          },
          dataLabels: {
            name: {
              show: true,
            },
            value: {
              show: true,
              color: "#007BFF",
              fontSize: "2.00rem",
              fontWeight: "700",
              fontFamily: "&quot;Public Sans Variable&quot",
              offsetY: -45, // Adjust vertical position
              offsetX: -10, // Adjust horizontal position
              formatter: (val) => `${val}%`,
            },
            total: {
              show: true,
              label: `${totalBouncCredits}/${totalSubmittedCredits} Bounce Rate`,
              color: "#007BFF",
              fontSize: "0.75rem",
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
  }, [EmailDashboard]);

  return <div ref={chartRef} />;
};

export default BounceChart;
