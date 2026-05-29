import React, { useRef, useState } from "react";
import { Button, Chip } from "@heroui/react";
import { uploadFileService } from "../../../../services/fileuploadservices/fileService";
import { Icon } from "@iconify-icon/react";
import { useSendRcStore } from "../../../../store/sendRcsStore";
import { useTranslation } from "react-i18next";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { formatFileSize } from "../../../../utils/oprators";

import {
    CloseIcon,
    CloudUploadIcon,
    FileIcon,
    FileUploadIcon,
    TrashIcon,
} from "../../../../utils/ReusableIcons";

const CsvUpload = ({ setError }) => {
    // Reference to the hidden input field
    const fileInputRef = useRef(null);

    // 5MB limit of CSV
    const fileLimit = 5000000;

    // This is from "react-i18next". Working is to translate text
    const { t } = useTranslation();

    // zustand store

    const {
        setPhoneNumbers,
        setCsvFileContent,
        csvFile,
        setCsvFile,
        fileProcessingInfo,
        setFileProcessingInfo,
        setContactUploadedFrom,
    } = useSendRcStore();

    // This will handle file change from input
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= fileLimit) {
            setCsvFile(selectedFile);
            setContactUploadedFrom("csv");
        } else {
            addToast({
                title: "Alert!",
                description: "File is over 5MB!",
                color: "warning",
            });
        }
    };

    // This will disable browser default behaviour on file drop
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragLeave = (e) => {
        // Remove visual indication for drag over if needed
    };

    // This will handle file when dropped in drop area
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.size <= fileLimit) {
            setCsvFile(droppedFile);
            setContactUploadedFrom("csv");
            // Update the hidden input field with the dropped file
            fileInputRef.current.files = e.dataTransfer.files;
        } else {
            addToast({
                title: "Alert",
                description: "File is over 5MB!",
                color: "warning",
            });
        }
    };

    // Md Faizan: This is for uploading file on S3 on "Button" click
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault();
            // performing upload serice
            if (csvFile && csvFile.size <= fileLimit) {
                const response = await uploadFileService(csvFile);
                setCsvFileContent(response.data); // set all csv content
                setPhoneNumbers(response.data.validPhoneNumbers); // set valid phone numbers

                const numberInfo = {
                    valid: response.data.validPhoneNumbers.length,
                    total: response.data.allPhoneNumbers.length,
                    invalid: response.data.invalidPhoneNumbers.length,
                };

                // Add info processed file
                setFileProcessingInfo(numberInfo);

                return;
            }

            addToast({
                title: "Alert!",
                description: "File is over 5MB!",
                color: "warning",
            });
        },
        onSuccess: () => {
            addToast({
                title: "Success 🎉",
                description: "File uploaded successfully!",
                color: "success",
            });
        },
        onError: (e) => {
            setError(
                e.response.data.error ||
                    "The uploaded file has an invalid format or missing required columns. Please download the sample file and ensure your file follows the correct structure."
            );
        },
    });

    return (
        <div className="w-full flex flex-col">
            <form
                className="w-full max-w-4xl bg-white dark:bg-content1  rounded-lg  flex flex-col"
                onSubmit={(e) => mutateAsync(e)}
                onReset={() => {
                    setCsvFile(null);
                    setFileProcessingInfo(null);
                    setPhoneNumbers([]);
                }}>
                <p className="text-gray-600 mb-4">
                    {t(
                        !csvFile
                            ? "Click to upload or drag & drop the file"
                            : ""
                    )}
                </p>

                {/* File Drop area and instruction */}
                {!csvFile && (
                    <div>
                        {/* File Drop Area */}
                        <div
                            className="w-full py-12 border-dashed border-2 border-success-200 rounded-lg flex flex-col items-center justify-center relative bg-gray-50 dark:bg-content1"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}>
                            <div>
                                <CloudUploadIcon />
                            </div>

                            <input
                                type="file"
                                required
                                ref={fileInputRef} // Reference to the input field
                                id="upload-file"
                                name="uploaded-file"
                                accept=".csv,.xlsx,.xls"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <p className="text-gray-500 text-xs">
                                {t("No Files Selected")}
                            </p>
                        </div>

                        {/* File upload instruction */}
                        <div className="mt-4 text-gray-600 flex justify-between">
                            <div>
                                <span className="block text-sm text-default-500">
                                    {t("Supported formats")}: csv, xlsx, xls |{" "}
                                    {t("Max file size")}: 5MB
                                </span>

                                {/* Download Sample File Section */}
                                <a
                                    href="/sample-rcs.csv"
                                    download
                                    className="flex items-center gap-1 cursor-pointer hover:underline hover:text-success text-sm text-default-500 w-3/4">
                                    {t("Download sample file")}
                                    <Icon
                                        icon="iconamoon:cloud-download-light"
                                        width="1.3em"
                                        height="1.3em"
                                        className="hover:text-success"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Md Faizan: Uploaded file preview */}
                {csvFile && (
                    <div>
                        {/* Preview part */}
                        <div
                            className={`border border-default rounded-xl w-full h-fit flex items-center justify-between p-4 bg-success-50/40 shadow-transparent hover:shadow-sm duration-200 transition-all `}>
                            {/* Preview Details part */}
                            <div className="w-full h-fit flex items-center justify-start gap-4">
                                {/* Icon */}
                                <FileIcon />

                                {/* File Details Section */}
                                <div>
                                    <p className="text-sm">{`${csvFile.name}`}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(csvFile.size)}
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 items-center">
                                {/* Upload File */}
                                {(fileProcessingInfo?.total === 0 ||
                                    !fileProcessingInfo) && (
                                    <Button
                                        size="sm"
                                        radius="sm"
                                        type="submit"
                                        color="success"
                                        variant="flat"
                                        isDisabled={isPending}>
                                        {!isPending ? (
                                            <>
                                                {/* Upload */}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="size-3"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7l-5-5l-5 5m5-5v12"></path>
                                                </svg>
                                                {t("Upload")}
                                            </>
                                        ) : (
                                            <>
                                                {/* Loader */}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="animate-spin size-3"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                                                </svg>
                                                {t("Uploading...")}
                                            </>
                                        )}
                                    </Button>
                                )}

                                {/* Reset File */}
                                <Button
                                    isDisabled={isPending}
                                    type="reset"
                                    isIconOnly
                                    color="default"
                                    variant="flat"
                                    size="sm"
                                    radius="sm">
                                    <CloseIcon size="1.9em" />
                                </Button>
                            </div>
                        </div>

                        {/* CSV file info after processing */}
                        {fileProcessingInfo && (
                            <div className="mt-3 h-fit w-full flex items-center justify-start gap-2">
                                <Chip color="primary" variant="flat" size="sm">
                                    <p className="text-xs">
                                        Total Contact(s):
                                        {fileProcessingInfo.total}
                                    </p>
                                </Chip>

                                <Chip color="danger" variant="flat" size="sm">
                                    <p className="text-xs">
                                        Invalid Contact(s):
                                        {fileProcessingInfo.invalid}
                                    </p>
                                </Chip>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CsvUpload;
