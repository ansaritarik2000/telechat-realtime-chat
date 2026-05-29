import React, { useState } from "react";
import ToggleSwitch from "./Toggle";
import Android from "./Android";
import Ios from "./Ios";

let message =
  "Your OTP is: 537824. Please use it to verify your account. Thank you!";

const MockupIndex = () => {
  const [selectedDevice, setSelectedDevice] = useState("android");

  const handleToggleChange = (isChecked) => {
    setSelectedDevice(isChecked ? "ios" : "android");
  };

  return (
    <div className="flex flex-col space-y-5 items-center mx-auto px-4 absolute right-20">
      <div className="">
        {selectedDevice === "android" && <Android text={message} />}
        {selectedDevice === "ios" && <Ios text={message} />}
      </div>

      <div>
        <ToggleSwitch onChange={handleToggleChange} />
      </div>
    </div>
  );
};

export default MockupIndex;
