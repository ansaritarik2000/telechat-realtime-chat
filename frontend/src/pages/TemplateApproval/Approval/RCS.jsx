import React, { useState, useMemo } from "react";
import { Input, Select, SelectItem, Textarea, Spacer } from "@heroui/react";
// import FooterButtons from "./Buttons/Index";
import UploadFile from "./UploadFile";
import { useTranslation } from "react-i18next";
import FooterButtons from "./RCSBody/Buttons/Index";

export const unicodes = [
    { key: "Yes", label: "Yes" },
    { key: "No", label: "No" },
];

export default function RCSTemplate() {
    const [templateValue, setTemplateValue] = useState("");
    const [headerValue, setHeaderValue] = useState("");
    const [unicode, setUnicode] = useState(new Set([]));
    const { t } = useTranslation();

    // Function to validate alphanumeric input
    const validateAlphanumeric = (value) => /^[a-zA-Z0-9]*$/.test(value);

    const onSubmitHandller = () => {
        // store the data in backend
        console.log("Working");
    };

    // Function to validate alphabetical input of length 6 and uppercase
    const validateHeader = (value) => /^[A-Z]{6}$/.test(value);

    // Memoized boolean indicating if Template Name input is invalid
    const isInvalidTemplate = useMemo(() => {
        if (templateValue === "") return false;
        return !validateAlphanumeric(templateValue);
    }, [templateValue]);

    // Memoized boolean indicating if Header input is invalid
    const isInvalidHeader = useMemo(() => {
        if (headerValue === "") return false;
        return !validateHeader(headerValue);
    }, [headerValue]);

    // Handle Template Name input change
    const handleTemplateChange = (newValue) => {
        setTemplateValue(newValue);
    };

    // Handle Header input change and enforce uppercase
    const handleHeaderChange = (newValue) => {
        setHeaderValue(newValue.toUpperCase());
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-6">
                {/* Template Name */}
                <div className="col-span-6 md:col-span-2">
                    <Input
                        isRequired
                        radius="sm"
                        value={templateValue}
                        type="text"
                        label="Template Name"
                        variant="flat"
                        isInvalid={isInvalidTemplate}
                        color={isInvalidTemplate ? "danger" : "default"}
                        errorMessage="Template Name can only contain letters and numbers."
                        className="max-w-xs"
                        //   description="(Alphanumeric Only e.g TEMPLATE01)"
                        onValueChange={handleTemplateChange}
                    />
                </div>
                {/* Header */}
                <div className="col-span-6 md:col-span-2">
                    <Input
                        radius="sm"
                        isRequired
                        value={headerValue}
                        type="text"
                        label="Header"
                        variant="flat"
                        isInvalid={isInvalidHeader}
                        color={isInvalidHeader ? "danger" : "default"}
                        errorMessage="Header must be 6 uppercase alphabetical characters."
                        className="max-w-xs"
                        onValueChange={handleHeaderChange}
                    />
                </div>
                {/* Unicode */}
                <div className="col-span-6 md:col-span-2">
                    <Select
                        isRequired
                        radius="sm"
                        label="Unicode"
                        variant="flat"
                        placeholder="Select the unicode"
                        selectedKeys={unicode}
                        className="max-w-xs"
                        onSelectionChange={setUnicode}>
                        {unicodes.map((unicode) => (
                            <SelectItem key={unicode.key}>
                                {unicode.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {/* <p className="text-xs ml-1 mb-2 text-default-500">
          Selected: {unicode}
        </p> */}
                </div>
            </div>

            {/* Message */}
            <Textarea
                isRequired
                radius="sm"
                label="Message"
                labelPlacement="outside"
                placeholder="Type your message here"
                className="max-w-screen-lg text-gray-500"
                minRows="8"
                maxRows="10"
            />

            <Spacer />

            {/* Template Type */}
            <Select
                isRequired
                radius="sm"
                label="Multimedia Type"
                variant="flat"
                placeholder="Select media type"
                className="max-w-xs">
                <SelectItem key="image-landscape">Image Landscape</SelectItem>
                <SelectItem key="image-portrait">Image Portrait</SelectItem>
                <SelectItem key="image-carousel">Image Carousel</SelectItem>
                <SelectItem key="video">Video</SelectItem>
            </Select>

            {/* Upload Button */}
            <UploadFile />

            {/* Buttons */}
            <div className="pt-10">
                <FooterButtons onSubmitHandller={onSubmitHandller} />
                {/* <FooterButtons /> */}
            </div>
        </div>
    );
}
