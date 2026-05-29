import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button, Input } from "@heroui/react";
import { useTagsAndComponentsStore } from "../../../../store/phonebook/tagsAndComponent";
import { set } from "lodash";
import GreyLine from "./GrayLine";

const ColorPickerModal = ({
    handleCreatedHandller,
    handleCancelHandller,
    isCustomizationWhatsapp,
}) => {
    const {
        tagsName,
        tagsColor,
        setTagsName,
        setTagsColor,
        tagsBgColor,
        setTagsBgColor,
    } = useTagsAndComponentsStore();

    const badgeColors = [
        {
            bg: "bg-gray-100",
            text: "text-gray-600",
            circleBgColor: "bg-gray-500",
        },
        {
            bg: "bg-red-100",
            text: "text-red-700",
            circleBgColor: "bg-red-500",
        },
        {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            circleBgColor: "bg-yellow-500",
        },
        {
            bg: "bg-green-100",
            text: "text-green-700",
            circleBgColor: "bg-green-500",
        },
        {
            bg: "bg-blue-100",
            text: "text-blue-700",
            circleBgColor: "bg-blue-500",
        },
        {
            bg: "bg-indigo-100",
            text: "text-indigo-700",
            circleBgColor: "bg-indigo-500",
        },
        {
            bg: "bg-purple-100",
            text: "text-purple-700",
            circleBgColor: "bg-purple-500",
        },
        {
            bg: "bg-pink-100",
            text: "text-pink-700",
            circleBgColor: "bg-pink-500",
        },
        {
            bg: "bg-orange-100",
            text: "text-orange-700",
            circleBgColor: "bg-orange-500",
        },
        {
            bg: "bg-teal-100",
            text: "text-teal-700",
            circleBgColor: "bg-teal-500",
        },
        {
            bg: "bg-cyan-100",
            text: "text-cyan-700",
            circleBgColor: "bg-cyan-500",
        },
        {
            bg: "bg-lime-100",
            text: "text-lime-700",
            circleBgColor: "bg-lime-500",
        },
        {
            bg: "bg-amber-100",
            text: "text-amber-700",
            circleBgColor: "bg-amber-500",
        },
        {
            bg: "bg-rose-100",
            text: "text-rose-700",
            circleBgColor: "bg-rose-500",
        },
        {
            bg: "bg-sky-100",
            text: "text-sky-700",
            circleBgColor: "bg-sky-500",
        },
        {
            bg: "bg-fuchsia-100",
            text: "text-fuchsia-700",
            circleBgColor: "bg-fuchsia-500",
        },
    ];

    const handleColorSelect = (color) => {
        setTagsColor(color.text);
        setTagsBgColor(color.bg);
    };

    return (
        <div className=" flex items-center justify-center">
            <div className="rounded-lg  w-full">
                {/* Input for Name */}
                <div className={isCustomizationWhatsapp ? "mb-2" : "mb-4"}>
                    <Input
                        isRequired
                        type="text"
                        radius="sm"
                        label="Add Custom Tag"
                        size={isCustomizationWhatsapp ? "sm" : ""}
                        // placeholder="Custom Tag Name"
                        value={tagsName}
                        onChange={(e) => setTagsName(e.target.value)}
                    />
                </div>

                {/* Colors Section */}
                <div className="mb-2">
                    <div className="text-sm text-default-500 flex gap-2 items-center px-1">
                        <span className="text-xs">Choose Tag Color</span>
                        <div className="flex-1">
                            <GreyLine />
                        </div>
                    </div>
                    <div
                        className={`grid grid-cols-8 gap-1 ${
                            isCustomizationWhatsapp ? "my-1" : "my-2"
                        } h-20 overflow-y-auto `}>
                        {badgeColors.map((color, index) => (
                            <div
                                key={index}
                                onClick={() => handleColorSelect(color)}
                                className={`${
                                    isCustomizationWhatsapp
                                        ? "w-5 h-5 "
                                        : "w-10 h-10"
                                } ${
                                    isCustomizationWhatsapp ? "m-1" : "m-2"
                                } rounded-full cursor-pointer flex items-center justify-center
                  ${color.circleBgColor} ${
                                    tagsBgColor === color.bg
                                        ? "ring-2 ring-red-500"
                                        : ""
                                }`}>
                                {tagsBgColor === color.bg && (
                                    <Icon
                                        icon="mdi:check"
                                        className="text-white text-lg"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center px-2">
                    {/* Back  */}
                    <Button
                        isIconOnly
                        color="default"
                        radius="sm"
                        size="sm"
                        variant="bordered"
                        onClick={handleCancelHandller}>
                        <Icon
                            icon="eva:arrow-back-outline"
                            className="text-default-500"
                            width={"1.3em"}
                        />
                    </Button>

                    <Button
                        color="primary"
                        variant="flat"
                        radius="sm"
                        size="sm"
                        onClick={handleCreatedHandller}>
                        Add Tag
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ColorPickerModal;
