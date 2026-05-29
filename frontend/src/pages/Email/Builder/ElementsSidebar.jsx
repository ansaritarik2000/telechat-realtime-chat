import React from "react";
import { Divider, ScrollShadow } from "@heroui/react";
import Layout from "./Data/Layout";
import ElementLayoutCard from "./ElementLayoutCard";
import ElementList from "./Data/ElementList";
import { useDragDropLayout } from "./Index";

export default function ElementsSidebar() {
    const { dragElementLayout, setDragElementLayout } = useDragDropLayout();

    const onDragLayoutStart = (layout) => {
        setDragElementLayout({
            dragLayout: {
                ...layout,
                id: Date.now(),
            },
        });
    };

    const onDragElementStart = (element) => {
        setDragElementLayout({
            dragElement: {
                ...element,
                id: Date.now(),
            },
        });
    };

    return (
        <ScrollShadow
            hideScrollBar
            offset={100}
            className="px-3 w-full  h-[82vh]"
        >
            <HeadingWithDivider children="Layout" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3 ">
                {Layout.map((layout, index) => (
                    <div
                        key={index}
                        draggable
                        onDragStart={() => onDragLayoutStart(layout)}
                    >
                        <ElementLayoutCard layout={layout} />
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <HeadingWithDivider children="Elements" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3 ">
                {ElementList.map((element, index) => (
                    <div
                        key={index}
                        draggable
                        onDragStart={() => onDragElementStart(element)}
                    >
                        <ElementLayoutCard layout={element} />
                    </div>
                ))}
            </div>
        </ScrollShadow>
    );
}

const HeadingWithDivider = ({ children }) => {
    return (
        <div className="flex justify-center items-center gap-2">
            <h2 className="font-semibold text-sm">{children}</h2>
            <div className="w-full">
                <Divider />
            </div>
        </div>
    );
};
