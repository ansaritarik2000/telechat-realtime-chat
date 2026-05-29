import React, { useState } from "react";
import { Icon } from "@iconify/react";
const ToggleSwitch = ({ onChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue); // Notify parent component of the change
  };

  return (
    <div className="flex items-center">
      <Icon
        icon="uim:android"
        width="35px"
        height="35px"
        style={{ color: "#0fb800" }}
      />
      {/* <span className="mr-2 text-gray-600">Android</span> */}

      <label
        htmlFor="toggle"
        className="relative cursor-pointer mx-2 select-none w-12 h-6 rounded-full bg-gray-400 flex items-center"
      >
        <input
          type="checkbox"
          id="toggle"
          className="opacity-0 absolute w-0 h-0"
          checked={isChecked}
          onChange={handleToggle}
        />
        <span
          className={`block w-6 h-6 rounded-full border bg-white shadow-md transform transition-transform duration-300 ${
            isChecked ? "translate-x-6" : ""
          }`}
        />
      </label>
      <Icon icon="ic:twotone-apple" width="40px" height="40px" />
      {/* <span className="ml-2 text-gray-600">iOS</span> */}
    </div>
  );
};

export default ToggleSwitch;
