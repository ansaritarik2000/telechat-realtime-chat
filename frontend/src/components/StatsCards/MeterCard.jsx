import React from "react";
import { Icon } from "@iconify-icon/react";
import { Suspense } from "react";
import CircleGradient from "../charts/General/CircleGradient";

export default function MeterCard({ icon, label, color, value, percent }) {
  return (
    <div
      className={`col-span-1  relative  rounded-lg border-2 border-${color}-200  dark:border-${color}-500 bg-${color}-50 h-36 `}
    >
      {/* Chart */}
      <div className="w-full h-full  flex gap-2   items-center ">
        <Suspense fallback={<div>Loading chart...</div>}>
          <CircleGradient percent={percent} color={color} />
        </Suspense>

        <div className="flex w-fit gap-12 items-center   ">
          {/* Labels */}
          <div className="flex flex-col gap-1">
            <p className={`text-3xl font-bold  text-${color}-800`}>{value}</p>
            <p className={`font-medium text-${color} `}>{label}</p>
          </div>

          {/* Icon */}
          <Icon
            icon={icon}
            width="3em"
            height="3em"
            className={`text-${color}-500`}
          />
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex justify-between items-center relative">

  <div
    className={`absolute flex justify-center items-center rounded-full h-14 w-14 bg-${color}-100`}
  >

    <div
      className={`absolute flex justify-center items-center rounded-full h-10 w-10 bg-${color}-50`}
    >

      <Icon
        icon={icon}
        width="2em"
        height="2em"
        className={`text-${color}-500`}
      />
    </div>
  </div>
</div> */
}
