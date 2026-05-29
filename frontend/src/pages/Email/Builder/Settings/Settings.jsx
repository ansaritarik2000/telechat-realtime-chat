import React, { useState, useEffect } from "react";
import { Divider, Button, ScrollShadow } from "@heroui/react";
import { useSelectedElement } from "../Index";
import InputField from "./InputField";
import ColorPicker from "./ColorPicker";
import TextareaComponent from "./Textarea";
import InputStyleField from "./InputStyleField";
import SliderComponent from "./Slider";
import ButtonGroupField from "./ButtonGroupField";
import DropdownField from "./DropdownField";
import ImagePreview from "./ImagePreview";
import IconsGrid from "./IconsGrid";
import { TrashIcon } from "../../../../utils/ReusableIcons";
import { Icon } from "@iconify-icon/react";
import IconsList from "../Data/IconsList";

export default function SettingsIndex() {
    const { selectedElement, setSelectedElement } = useSelectedElement();
    const [element, setElement] = useState();
    const [iconStyle, setIconStyle] = useState("default");
    const [selectedIcons, setSelectedIcons] = useState([]);

    // Handle adding new social icons
    const updateSocialIcons = (icon) => {
        const currentIcons = element?.socialIcons || [];
        const updatedIcons = [
            ...currentIcons,
            { icon: icon[iconStyle], url: "" },
        ];
        updateCanvas(updatedIcons);
    };

    const updateIconUrl = (index, url) => {
        const updatedIcons = element?.socialIcons.map(
            (item, i) => (i === index ? { ...item, url: url || "#" } : item) // Ensure a default URL
        );
        updateCanvas(updatedIcons);
    };

    // Remove a specific icon
    const removeSocialIcon = (index) => {
        const updatedIcons = element?.socialIcons.filter((_, i) => i !== index);
        updateCanvas(updatedIcons);
    };

    // Update canvas state
    const updateCanvas = (updatedIcons) => {
        setSelectedElement((prev) => ({
            ...prev,
            layout: {
                ...prev.layout,
                [prev.index]: {
                    ...prev.layout[prev.index],
                    socialIcons: updatedIcons,
                },
            },
        }));
    };

    // Hnalde icon style change

    const handleIconStyleChange = (value) => {
        setIconStyle(value);

        if (!element?.socialIcons) return;

        const updatedIcons = element.socialIcons.map((icon) => ({
            ...icon,
            icon:
                IconsList.find((i) => Object.values(i).includes(icon.icon))?.[
                    value
                ] || icon.icon,
        }));

        updateCanvas(updatedIcons);
    };

    useEffect(() => {
        if (selectedElement) {
            setElement(selectedElement?.layout?.[selectedElement?.index]);

            // Check the current icon style from the first social icon
            if (
                selectedElement?.layout?.[selectedElement?.index]?.socialIcons
                    ?.length
            ) {
                const firstIcon =
                    selectedElement.layout[selectedElement.index].socialIcons[0]
                        .icon;

                // Find which style matches
                const detectedStyle = Object.keys(IconsList[0] || {}).find(
                    (style) =>
                        IconsList.some((icon) => icon[style] === firstIcon)
                );

                if (detectedStyle) {
                    setIconStyle(detectedStyle);
                }
            }
        }
    }, [selectedElement]);

    // Input Change Handler
    const onhandleInputChange = (fieldName, value) => {
        const updatedData = { ...selectedElement };
        // updatedData.layout[selectedElement.index][fieldName] = value || " ";
        updatedData.layout[selectedElement.index][fieldName] =
            value ||
            (fieldName === "imageUrl"
                ? "/email-builder-img-placeholder.png"
                : " ");
        setSelectedElement(updatedData);
    };

    // Style Change Handler
    const onhandleStyleChange = (fieldName, fieldValue) => {
        const updatedData = { ...selectedElement };

        // Handle `outerStyle` separately
        if (fieldName === "outerStyle") {
            updatedData.layout[selectedElement.index] = {
                ...updatedData.layout[selectedElement.index],
                outerStyle: {
                    ...updatedData.layout[selectedElement.index].outerStyle,
                    ...fieldValue, // Merge updates
                },
            };
        } else {
            // Handle `style`
            const updatedStyle = {
                ...updatedData.layout[selectedElement.index].style,
                [fieldName]: fieldValue,
            };
            updatedData.layout[selectedElement.index] = {
                ...updatedData.layout[selectedElement.index],
                style: updatedStyle,
            };
        }

        setSelectedElement(updatedData);
    };

    return (
        <ScrollShadow hideScrollBar>
            <div className="px-3 h-[82vh] flex flex-col gap-2">
                <HeadingWithDivider children="Settings" />
                {element ? (
                    <>
                        {/* Image */}
                        {element?.imageUrl && (
                            <ImagePreview
                                label="Preview"
                                value={element?.imageUrl}
                                onhandleInputChange={(value) =>
                                    onhandleInputChange("imageUrl", value)
                                }
                            />
                        )}

                        {/* Text Field */}
                        {element?.content && (
                            <InputField
                                label="Content"
                                value={element?.content}
                                onhandleInputChange={(value) =>
                                    onhandleInputChange("content", value)
                                }
                            />
                        )}
                        {/* URL */}
                        {element?.url && (
                            <InputField
                                label="URL"
                                value={element?.url}
                                onhandleInputChange={(value) =>
                                    onhandleInputChange("url", value)
                                }
                            />
                        )}

                        {/* Textarea */}
                        {element?.textarea && (
                            <TextareaComponent
                                label={element?.label}
                                value={element?.textarea}
                                onhandleInputChange={(value) =>
                                    onhandleInputChange("textarea", value)
                                }
                            />
                        )}
                        {/* Text Align */}
                        {element?.style?.textAlign && (
                            <ButtonGroupField
                                label="Text Align"
                                value={element.style.textAlign}
                                options={[
                                    {
                                        icon: "mdi:format-align-left",
                                        value: "left",
                                    },
                                    {
                                        icon: "mdi:format-align-center",
                                        value: "center",
                                    },
                                    {
                                        icon: "mdi:format-align-right",
                                        value: "right",
                                    },
                                ]}
                                onHandleStyleChange={(value) =>
                                    onhandleStyleChange("textAlign", value)
                                }
                            />
                        )}
                        {/* Background Color */}
                        {element?.style?.backgroundColor && (
                            <ColorPicker
                                label="Background Color"
                                value={element?.style?.backgroundColor}
                                onhandleInputChange={(value) =>
                                    onhandleStyleChange(
                                        "backgroundColor",
                                        value
                                    )
                                }
                            />
                        )}

                        {/* Text Color */}
                        {element?.style?.color && (
                            <ColorPicker
                                label="Text Color"
                                value={element?.style?.color}
                                onhandleInputChange={(value) =>
                                    onhandleStyleChange("color", value)
                                }
                            />
                        )}

                        {/* Border Color for Divider */}
                        {element?.style?.borderColor && (
                            <ColorPicker
                                label="Border Color"
                                value={element?.style?.borderColor}
                                onhandleInputChange={(value) =>
                                    onhandleStyleChange("borderColor", value)
                                }
                            />
                        )}

                        {/* Font Transform */}
                        {element?.style?.textTransform && (
                            <ButtonGroupField
                                label="Text Transform"
                                value={element.style.textTransform}
                                options={[
                                    {
                                        icon: "fluent:text-case-uppercase-20-regular",
                                        value: "uppercase",
                                    },
                                    // {
                                    //   icon: "fluent:text-case-lowercase-20-regular",
                                    //   value: "lowercase",
                                    // },
                                    {
                                        icon: "radix-icons:letter-case-capitalize",
                                        value: "capitalize",
                                    },
                                    {
                                        icon: "fluent:text-case-title-20-regular",
                                        value: "none",
                                    },
                                ]}
                                onHandleStyleChange={(value) =>
                                    onhandleStyleChange("textTransform", value)
                                }
                            />
                        )}

                        {/* Font Size */}
                        {element?.style?.fontSize && (
                            <InputStyleField
                                label="Font Size"
                                value={element?.style?.fontSize}
                                onHandleStyleChange={(value) =>
                                    onhandleStyleChange("fontSize", value)
                                }
                            />
                        )}

                        {/* Border Width for Divider */}
                        {element?.style?.borderWidth && (
                            <InputStyleField
                                label="Border Width"
                                value={element?.style?.borderWidth || "2px"}
                                onHandleStyleChange={(value) =>
                                    onhandleStyleChange("borderWidth", value)
                                }
                            />
                        )}

                        {/* Padding */}
                        {element?.style?.padding && (
                            <InputStyleField
                                label="Padding"
                                value={element?.style?.padding}
                                onHandleStyleChange={(value) =>
                                    onhandleStyleChange("padding", value)
                                }
                            />
                        )}

                        {/* Margin */}
                        {element?.style?.margin && (
                            <InputStyleField
                                label="Margin"
                                value={element?.style?.margin}
                                onHandleStyleChange={(value) =>
                                    onhandleStyleChange("margin", value)
                                }
                            />
                        )}

                        {/* Border Radius @ used only for divider */}
                        {element?.style?.borderRadius && (
                            <SliderComponent
                                label="Border Radius"
                                value={element?.style?.borderRadius}
                                onHandleStyleChange={(value) =>
                                    onhandleStyleChange("borderRadius", value)
                                }
                            />
                        )}

                        {/* Border Style  @ used only for divider */}
                        {element?.style?.borderStyle && (
                            <DropdownField
                                label="Border Style"
                                value={element?.style?.borderStyle}
                                options={[
                                    "solid",
                                    "dotted",
                                    "dashed",
                                    "double",
                                ]}
                                onhandleStyleChange={(value) =>
                                    onhandleStyleChange("borderStyle", value)
                                }
                            />
                        )}

                        {/* Width */}
                        {element?.style?.width &&
                            element?.type !== "SocialIcons" && (
                                <SliderComponent
                                    label="Width"
                                    value={element.style.width}
                                    type="%"
                                    onHandleStyleChange={(value) =>
                                        onhandleStyleChange("width", value)
                                    }
                                />
                            )}

                        {/* Font Weight */}
                        {element?.style?.fontWeight && (
                            <DropdownField
                                label="Font Weight"
                                value={element?.style?.fontWeight}
                                options={["lighter", "normal", "bold"]}
                                onhandleStyleChange={(value) =>
                                    onhandleStyleChange("fontWeight", value)
                                }
                            />
                        )}

                        {/* Specific to Social Icons */}
                        {element?.type === "SocialIcons" && (
                            <>
                                {/* Dropdown to change the style of all icons */}
                                <DropdownField
                                    label="Icon Style"
                                    value={iconStyle}
                                    options={[
                                        "Default",
                                        "Circle White",
                                        "Circle Black",
                                    ]}
                                    onhandleStyleChange={handleIconStyleChange}
                                />

                                {/* Display available icons grid */}
                                <IconsGrid
                                    updateSocialIcons={updateSocialIcons}
                                    selectedIcons={element?.socialIcons || []}
                                    iconStyle={iconStyle}
                                />
                            </>
                        )}

                        {/* Social Icon Size Control */}
                        {element?.type === "SocialIcons" && (
                            <InputStyleField
                                label="Icon Size"
                                value={element?.style?.width} // Assuming width & height are the same
                                onHandleStyleChange={(value) => {
                                    onhandleStyleChange("width", value);
                                    onhandleStyleChange("height", value);
                                }}
                            />
                        )}

                        {/* Social Icons Between Gap */}
                        {element?.type === "SocialIcons" && (
                            <SliderComponent
                                label="Icon Spacing"
                                value={element?.outerStyle?.gap ?? 15} // Default to 15px
                                onHandleStyleChange={(value) => {
                                    onhandleStyleChange("outerStyle", {
                                        ...element?.outerStyle,
                                        gap: value,
                                    });
                                }}
                            />
                        )}

                        {/* Display selected icons in the settings panel */}
                        {element?.socialIcons?.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center w-full gap-2  px-2 pt-5 pb-2 border  rounded-lg relative"
                            >
                                <img
                                    src={item.icon}
                                    alt="Icon"
                                    className="w-10 h-10 bg-default rounded-full"
                                />
                                <InputField
                                    label="URL"
                                    value={item.url}
                                    size="sm"
                                    onhandleInputChange={(value) =>
                                        updateIconUrl(index, value)
                                    }
                                />

                                <div className="absolute top-0 left-0 h-fit flex justify-center  items-center rounded-md ">
                                    <Icon
                                        icon="basil:cross-outline"
                                        width="24"
                                        height="24"
                                        onClick={() => removeSocialIcon(index)}
                                        className="text-default-500 hover:text-danger-500 cursor-pointer"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Table */}

                        {/* Write above this */}
                    </>
                ) : (
                    <p className="text-gray-500 text-sm">
                        Select an element from the canvas
                    </p>
                )}
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

{
    /* Available Social Icons */
}
// {element?.type === "SocialIcons" && (
//   <DropdownField
//     label={element?.label}
//     value={iconStyle} // State declare useState at top
//     options={["lighter", "normal", "bold"]}
//     onhandleStyleChange={(value) =>
//       onhandleStyleChange("fontWeight", value)
//     }
//   />
// )}

// {element?.type === "SocialIcons" && (
//   <>
//     <DropdownField
//       label="Icon Style"
//       value={iconStyle}
//       options={["default", "circlewhite", "circleblack"]}
//       onhandleStyleChange={(value) => setIconStyle(value)}
//     />
//     <IconsGrid
//       iconStyle={iconStyle}
//       updateSocialIcons={updateSocialIcons}
//     />
//   </>
// )}

{
    /* {element?.type === "SocialIcons" && (
            <DropdownField
              label="Icon Style"
              value={iconStyle}
              options={["default", "circlewhite", "circleblack"]}
              onhandleStyleChange={handleIconStyleChange}
            />
          )} */
}
{
    /* Close Button */
}
{
    /* <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => removeSocialIcon(index)}
                >
                  <TrashIcon size={20} />
                </Button> */
}
