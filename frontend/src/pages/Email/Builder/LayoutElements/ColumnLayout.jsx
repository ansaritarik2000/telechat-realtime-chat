import React, { useState } from "react";
import { Button } from "@heroui/react";
import {
    useEmailTemplate,
    useDragDropLayout,
    useSelectedElement,
    useSelectedTab,
} from "../Index";
import ButtonComponent from "../Elements/Button";
import TextComponent from "../Elements/Text";
import ImageComponent from "../Elements/Image";
import DividerComponent from "../Elements/Divider";
import SocialIcons from "../Elements/SocialIcons";
import HTMLComponent from "../Elements/HTML";
import LogoComponent from "../Elements/Logo";
import { TrashIcon } from "../../../../utils/ReusableIcons";
import { Icon } from "@iconify/react";
// import TableComponent from "../Elements/Table";


export default function ColumnLayout({ layout }) {
    const [dragOver, setDragOver] = useState();
    const { emailTemplate, setEmailTemplate } = useEmailTemplate();
    const { dragElementLayout, setDragElementLayout } = useDragDropLayout();
    const { selectedElement, setSelectedElement } = useSelectedElement();
    const { selectedTab, setSelectedTab } = useSelectedTab();

    const onDragOverHandler = (e, index) => {
        e.preventDefault();
        setDragOver({
            index: index,
            columnId: layout?.id,
        });
    };

    const onDropHandler = () => {
        const index = dragOver.index;
        setEmailTemplate((prevItem) =>
            prevItem?.map((col) =>
                col.id === layout?.id
                    ? { ...col, [index]: dragElementLayout?.dragElement }
                    : col
            )
        );
        setDragOver(null);
    };

    const GetElementComponent = (element) => {
        if (element?.type === "Button") {
            return <ButtonComponent {...element} />;
        } else if (element?.type === "Text") {
            return <TextComponent {...element} />;
        } else if (element?.type === "Image") {
            return <ImageComponent {...element} />;
        } else if (element?.type === "Logo") {
            return <LogoComponent {...element} />;
        } else if (element?.type === "Divider") {
            return <DividerComponent {...element} />;
        } else if (element?.type === "SocialIcons") {
            return <SocialIcons {...element} />;
        } else if (element?.type === "Html") {
            return <HTMLComponent {...element} />;
        } else if (element?.type === "Table") {
            // return <TableComponent {...element} />;
            return <div> Table component not found at ../Elements/Table" </div>
        }
        return element?.type;
    };

    const onClickHandler = (index) => {
        setSelectedElement({ layout: layout, index: index });
        if (layout?.[index]?.type) {
            setSelectedTab("settings");
        } else {
            setSelectedTab("elements");
        }
    };

    // const deleteLayout = (layoutId) => {
    //   const updatedEmailTemplate = emailTemplate?.filter(
    //     (layout) => layout.id !== layoutId
    //   );
    //   setEmailTemplate(updatedEmailTemplate);
    //   if (selectedElement?.layout?.id === layoutId) {
    //     setSelectedElement(null);
    //   }
    // };

    const deleteLayout = (layoutId) => {
        const updatedEmailTemplate = emailTemplate?.filter(
            (layout) => layout.id !== layoutId
        );

        setEmailTemplate(updatedEmailTemplate);
        localStorage.setItem(
            "emailTemplate",
            JSON.stringify(updatedEmailTemplate)
        ); // Save immediately

        if (selectedElement?.layout?.id === layoutId) {
            setSelectedElement(null);
        }

        setSelectedTab("elements");
    };

    const moveUpLayout = (layoutId) => {
        setEmailTemplate((prevTemplate) => {
            const index = prevTemplate.findIndex(
                (layout) => layout.id === layoutId
            );
            if (index > 0) {
                const newTemplate = [...prevTemplate];
                [newTemplate[index - 1], newTemplate[index]] = [
                    newTemplate[index],
                    newTemplate[index - 1],
                ];
                return newTemplate;
            }
            return prevTemplate;
        });
    };

    const moveDownLayout = (layoutId) => {
        setEmailTemplate((prevTemplate) => {
            const index = prevTemplate.findIndex(
                (layout) => layout.id === layoutId
            );
            if (index < prevTemplate.length - 1) {
                const newTemplate = [...prevTemplate];
                [newTemplate[index], newTemplate[index + 1]] = [
                    newTemplate[index + 1],
                    newTemplate[index],
                ];
                return newTemplate;
            }
            return prevTemplate;
        });
    };

    const onDragLeaveHandler = () => {
        setDragOver(null);
    };

    return (
        <div className="relative">
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${layout.numOfCol}, 1fr)`,
                    gap: "2px",
                }}
                className={`${
                    selectedElement?.layout?.id === layout?.id &&
                    "border-2 border-dashed border-success"
                }`}
            >
                {Array.from({ length: layout.numOfCol }, (_, index) => (
                    <div
                        key={index}
                        className={`flex justify-center items-center p-2 cursor-pointer
            ${!layout?.[index]?.type && "border-2 bg-gray-100"}
            ${
                index == dragOver?.index &&
                dragOver?.columnId &&
                "bg-secondary-50"
            }
            ${
                selectedElement?.layout?.id === layout?.id &&
                selectedElement?.index === index &&
                "border-2 border-success"
            }
            `}
                        onDragOver={(e) => onDragOverHandler(e, index)}
                        onDrop={onDropHandler}
                        onClick={() => onClickHandler(index)}
                        onDragLeave={onDragLeaveHandler}
                    >
                        {GetElementComponent(layout?.[index]) ?? (
                            <div className="h-16 flex justify-center items-center">
                                <p className="text-md text-default-500">
                                    Drag Element Here
                                </p>
                            </div>
                        )}
                    </div>
                ))}

                {selectedElement?.layout?.id === layout?.id && (
                    <>
                        <div className="absolute top-0 -left-10 flex flex-col gap-2 group">
                            {/* Trash Button */}
                            <Button
                                isIconOnly
                                color="default"
                                variant="bordered"
                                size="sm"
                                onPress={() => deleteLayout(layout?.id)}
                            >
                                <TrashIcon
                                    size="1.5em"
                                    customClass="group-hover:text-danger-500 cursor-pointer text-default-500 hover:scale-105 transition-all"
                                />
                            </Button>
                        </div>

                        {/* Move up and Down Arrow */}
                        <div className="absolute top-0 -right-10 flex flex-col gap-2">
                            <Button
                                isIconOnly
                                color="default"
                                variant="bordered"
                                size="sm"
                                onPress={() => moveUpLayout(layout?.id)}
                            >
                                <Icon
                                    icon="flowbite:chevron-double-up-outline"
                                    width="30"
                                    height="30"
                                    className="text-default-500"
                                />
                            </Button>
                            <Button
                                isIconOnly
                                color="default"
                                variant="bordered"
                                size="sm"
                                onPress={() => moveDownLayout(layout?.id)}
                            >
                                <Icon
                                    icon="flowbite:chevron-double-down-outline"
                                    width="30"
                                    height="30"
                                    className="text-default-500"
                                />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
