import React from "react";
import { Icon } from "@iconify/react";
import { timeFormat } from "../Android/utils/dateFormat";

const IosStatusBar = () => {
  return (
    <div className="flex justify-between items-center px-4 py-1 h-8 bg-gray-200 text-gray-600 text-sm">
      <span>{timeFormat(new Date())}</span>
      <div className="flex items-center space-x-1">
        <Icon icon="game-icons:network-bars" width={14} />
        <Icon icon="fa-solid:wifi" width={16} />
        <Icon icon="fa-solid:battery-three-quarters" width={20} />
      </div>
    </div>
  );
};

export default IosStatusBar;
