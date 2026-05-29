import React, { useState } from "react";
import ToggleSwitch from "./Toggle";
import Android from "./Android/Android";
import Ios from "./Ios/Ios";

const MockupIndex = ({
    messageData = [],
    contactName = "Telepie Technology",
}) => {
    const [selectedDevice, setSelectedDevice] = useState("android");

    const handleToggleChange = (isChecked) => {
        setSelectedDevice(isChecked ? "ios" : "android");
    };

    return (
        <div className="flex flex-col gap-2 items-center mx-auto sticky ">
            <ToggleSwitch onChange={handleToggleChange} />

            <div>
                {selectedDevice === "android" && (
                    <Android
                        contactName={contactName}
                        messageData={messageData}
                    />
                )}
                {selectedDevice === "ios" && (
                    <Ios contactName={contactName} messageData={messageData} />
                )}
            </div>
        </div>
    );
};

export default MockupIndex;
