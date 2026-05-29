import { useState } from "react";
import { useScreenSize } from "./Index";
import { useDragDropLayout, useEmailTemplate, useSelectedTab } from "./Index";
import ColumnLayout from "./LayoutElements/ColumnLayout";

export default function Canvas() {
    const { screenSize } = useScreenSize();
    const { dragElementLayout, setDragElementLayout } = useDragDropLayout();
    const { emailTemplate, setEmailTemplate } = useEmailTemplate();
    const { selectedTab, setSelectedTab } = useSelectedTab();
    const [dragOver, setDragOver] = useState(false);

    const onDragOverHandler = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const onDropHandler = () => {
        setDragOver(false);
        if (dragElementLayout?.dragLayout) {
            setEmailTemplate((prev) => [
                ...prev,
                dragElementLayout?.dragLayout,
            ]);
        }
        console.log("Email Template", emailTemplate);
    };

    const getLayoutComponent = (layout) => {
        if (layout?.type === "column") {
            return <ColumnLayout layout={layout} />;
        }
    };

    // On dragLeaveHandler setting bg bg-white
    const onDragLeaveHandler = () => {
        setDragOver(false);
    };

    return (
        <div className="mt-4 mx-6 flex justify-center items-center">
            <div
                className={`w-full rounded-xl py-12 px-12 ${
                    screenSize === "desktop"
                        ? "max-w-7xl"
                        : screenSize === "tablet"
                        ? "max-w-3xl"
                        : "max-w-md"
                }
        ${dragOver ? "bg-success-50" : "bg-white"}
         `}
                onDragOver={onDragOverHandler}
                onDrop={onDropHandler}
                onDragLeave={onDragLeaveHandler}
            >
                {emailTemplate?.length > 0 ? (
                    emailTemplate?.map((layout, index) => {
                        return (
                            <div key={index}>{getLayoutComponent(layout)}</div>
                        );
                    })
                ) : (
                    <div
                        onClick={() => setSelectedTab("elements")}
                        className="cursor-pointer"
                    >
                        <p className="text-center p-4 bg-gray-50  border-2 border-success border-dashed">
                            Drag Layout Here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
