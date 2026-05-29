import { Handle, Position } from "@xyflow/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
// import { useFlow } from "../FlowContext";

export default function TargetAudience() {
    const { t } = useTranslation();
    // const { menu, setMenu } = useFlow();

    // const handleClick = () => {
    //   setMenu("ParentMenu");
    // };

    return (
        <>
            <div
                className="nodrag bg-primary-50 rounded-lg px-10 py-3 flex gap-2 items-center border-3 border-dotted border-primary"
                // onClick={handleClick}
            >
                <Icon icon="fluent-emoji-flat:bullseye" width="1.3em" />
                <p className=" text-sm font-medium text-foreground">
                    {t("Target Audience")}
                </p>
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
        </>
    );
}
