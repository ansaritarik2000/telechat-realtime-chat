// FileUploadPreview.jsx
import React from "react";
import { Badge, Button } from "@heroui/react";
import {
    CloseIcon,
    LoaderIcon,
    FileUploadIcon,
    FilePreviewSVG,
    FileIcon,
} from "../../utils/ReusableIcons";
import TextTruncator from "./TextTruncator";

const FileUploadPreview = ({
    file,
    isUploading = false,
    onUpload,
    onRemove,
    className = "",
    variant = "success",
    statusText = "Ready to upload",
    showSizeIndicator = true,
    index,
}) => {
    const variantStyles = {
        success: {
            bgColor: "bg-success-50/40",
            iconBg: "bg-green-200 dark:bg-green-700",
            iconText: "text-green-500 dark:text-white",
            statusText: "text-success-500",
            buttonColor: "success",
            iconColor: "text-success-700",
        },
        uploaded: {
            bgColor: "bg-success-50/40",
            iconBg: "bg-green-200 dark:bg-green-700",
            iconText: "text-green-500 dark:text-white",
            statusText: "text-success-500",
            buttonColor: "success",
            iconColor: "text-success-700",
        },
    };
    // Determine which variant to use
    const currentVariant = statusText === "Uploaded" ? "uploaded" : variant;
    const styles = variantStyles[currentVariant] || variantStyles.success;

    if (!file) return null;

    return (
        <>
            <div className="w-full my-2">
                <Badge
                    color="danger"
                    content={index}
                    size="sm"
                    placement="top-left"
                    className="-ml-4"
                    showOutline={false}
                >
                    <div
                        className={`border border-default rounded-xl w-full min-w-[31rem] h-fit flex items-center justify-between p-4 ${styles.bgColor} shadow-transparent hover:shadow-sm duration-200 transition-all ${className}`}
                    >
                        {/* Preview Details part */}
                        <div className="w-full h-fit flex items-center justify-start gap-4">
                            {/* Icon */}
                            <FileIcon />

                            {/* File Details Section */}
                            <div className="flex flex-col ">
                                <TextTruncator
                                    text={file.name}
                                    maxLength={25}
                                    className="text-sm"
                                />
                                <div className="flex items-center gap-2">
                                    {showSizeIndicator && (
                                        <>
                                            <span className="text-xs text-gray-500">
                                                {(file.size / 1024).toFixed(1)}{" "}
                                                KB
                                            </span>
                                            <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                                        </>
                                    )}
                                    <span
                                        className={`text-xs text-success-500 font-medium`}
                                    >
                                        {statusText}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 items-center">
                            {/* Upload File */}
                            {statusText !== "Uploaded" && (
                                <Button
                                    size="sm"
                                    radius="sm"
                                    color={styles.buttonColor}
                                    variant="flat"
                                    isDisabled={isUploading}
                                    onPress={onUpload}
                                >
                                    {isUploading ? (
                                        <LoaderIcon />
                                    ) : (
                                        <>
                                            <FileUploadIcon
                                                size="1.5em"
                                                customClass={styles.iconColor}
                                            />
                                            Upload
                                        </>
                                    )}
                                </Button>
                            )}

                            {/* Delete File */}
                            <Button
                                isDisabled={isUploading}
                                type="reset"
                                isIconOnly
                                color="default"
                                variant="ghost"
                                size="sm"
                                radius="sm"
                                onPress={onRemove}
                            >
                                <CloseIcon size="1.9em" />
                            </Button>
                        </div>
                    </div>
                </Badge>
            </div>
        </>
    );
};

export default FileUploadPreview;
