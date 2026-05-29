import React, { useState } from "react";
import { Input, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ImagePreview({ label, value, onhandleInputChange }) {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                onhandleInputChange(e.target.result); // Convert image to base64 URL
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div>
                {/* Label */}
                <label className="text-sm text-default-500 font-semibold -pb-4">
                    {label}
                </label>
                {/* Image Preview */}
                <img
                    src={value}
                    alt={label}
                    className="w-full h-[150px] object-cover border rounded-md"
                />
            </div>

            {/* Image Upload */}
            <div className="border rounded-md relative">
                <input
                    id="file_input"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="file_input"
                    className="flex items-center justify-center w-full  hover:scale-105 rounded-lg bg-default-100 text-sm cursor-pointer">
                    <div className="flex items-center justify-between gap-1 w-full h-full">
                        <p className="pl-2">
                            {fileName ? fileName : "Upload Image"}
                        </p>
                        <div className="px-4 py-1  bg-gray-200 h-full">
                            <Icon
                                icon="ic:outline-file-upload"
                                width="24"
                                height="24"
                            />
                        </div>
                    </div>
                </label>
            </div>

            {/* Divider */}
            <div className="flex justify-center items-center gap-1">
                <div className="w-full">
                    <Divider />
                </div>
                <h2 className=" text-xs text-center">OR</h2>
                <div className="w-full">
                    <Divider />
                </div>
            </div>

            {/* CDN URL */}
            <Input
                size="sm"
                className="max-w-xs "
                variant="bordered"
                label="Image URL"
                value={value}
                onChange={(e) => onhandleInputChange(e.target.value)}
            />
        </div>
    );
}

{
    /* <p
          class="mt-1 text-xs text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          PNG, JPG, SVG (MAX. 800x400px).
        </p> */
}
