import React, { useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useFlow } from "../FlowContext";
import {
    ColoredRCSIcon,
    ColoredSMSIcon,
} from "../../../../utils/ReusableIcons";

const CommonHeader = ({ routeBack, name, nodeId, icon, backToParent }) => {
    const { t } = useTranslation();
    const { menu, setMenu } = useFlow();

    const handleClick = () => {
        // If backToParent is true, we're in a child menu item and should go back to ChildMenu
        // Otherwise, go back to ParentMenu
        // if (backToParent) {
        //   setMenu("ChildMenu");
        //   console.log("Back to ChildMenu");
        // } else {
        //   setMenu("ParentMenu");
        //   console.log("Back to ParentMenu");
        // }

        // Call the routeBack function if provided
        if (routeBack) {
            routeBack();
        }
    };

    // Debug effect to verify menu state changes
    useEffect(() => {
        console.log("Current menu in CommonHeader:", menu);
    }, [menu]);

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center border-b border-default pb-4">
                {/* Icon to Label Text */}
                <div className="flex gap-2 items-center ">
                    {/* RCS */}
                    {(name === "RCS" || icon === "rcs") && (
                        <ColoredRCSIcon size="1.7em" />
                    )}
                    {/* RCS  */}
                    {name === "SMS" && <ColoredSMSIcon size="1.7em" />}
                    {/* WA */}
                    {(name === "WhatsApp" || icon === "WhatsApp") && (
                        <Icon icon="logos:whatsapp-icon" width={"1.7em"} />
                    )}
                    {/* Email */}
                    {(name === "Email" || icon === "Email") && (
                        <Icon icon="skill-icons:gmail-light" width={"1.7em"} />
                    )}

                    <div className="flex flex-col justify-around">
                        <p className="font-medium text-xs text-foreground">
                            {t(name)}
                        </p>
                        <p className="text-xs text-default-400">
                            {t("ID")}: {nodeId}
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    radius="sm"
                    variant="flat"
                    onPress={handleClick}
                >
                    {t("Back")}
                </Button>
            </div>
        </>
    );
};

export default CommonHeader;
