import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Switch, cn } from "@heroui/react";
const ToggleSwitch = ({ onChange }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        onChange(newValue); // Notify parent component of the change
    };

    return (
        <>
            <div className="flex items-center">
                <Icon
                    icon="uim:android"
                    width="2rem"
                    height="2rem"
                    style={{ color: "#0fb800" }}
                />

                <Switch
                    size="md"
                    isSelected={isChecked}
                    onValueChange={handleToggle}
                    color="none"
                    // startContent={
                    //     <div className="px-8">
                    //         <Icon
                    //             icon="uim:android"
                    //             width={size}
                    //             height={size}
                    //             className="text-success"
                    //         />
                    //     </div>
                    // }
                    // endContent={
                    //     <Icon icon="ic:twotone-apple" width={size} height={size} />
                    // }
                />

                <Icon icon="ic:twotone-apple" width="2.2rem" height="2.2rem" />
            </div>
        </>
    );
};

export default ToggleSwitch;
