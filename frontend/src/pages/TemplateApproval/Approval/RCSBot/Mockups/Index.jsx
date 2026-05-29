import React, { useState } from "react";
import Android from "./Android/Android";
import Ios from "./Ios/Ios";
import ToggleSwitch from "../../../../RCS/SendRCS/Mockups/Toggle";

const RCSBOTMockupIndex = ({
    messageData = [],
    contactName = "Telepie Technology",
}) => {
    const [selectedDevice, setSelectedDevice] = useState("android");

    const handleToggleChange = (isChecked) => {
        setSelectedDevice(isChecked ? "ios" : "android");
    };

    return (
        <div className="flex flex-col space-y-5 items-center mx-auto px-4 sticky top-10">
            <div className="">
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
            <div>
                <ToggleSwitch onChange={handleToggleChange} />
            </div>
        </div>
    );
};

export default RCSBOTMockupIndex;
