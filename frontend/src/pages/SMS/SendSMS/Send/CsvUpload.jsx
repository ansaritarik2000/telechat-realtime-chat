import React, { useRef, useState } from "react";
import { addToast, Button, Chip } from "@heroui/react";
import { uploadFileService } from "../../../../services/fileuploadservices/fileService";
import { Icon } from "@iconify-icon/react";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import {
    CloseIcon,
    CloudUploadIcon,
    FileIcon,
    FileUploadIcon,
    FilterIcon,
    LoaderIcon,
    TrashIcon,
} from "../../../../utils/ReusableIcons";
import { formatFileSize } from "../../../../utils/oprators";

const CsvUpload = ({ setError }) => {
    const fileInputRef = useRef(null); // Reference to the hidden input field
    const fileLimit = 5000000; // 5MB limit
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
    } = useSendSmsStore();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= fileLimit) {
            setCsvFile(selectedFile);
            // updateDropzoneFileList(selectedFile);
            setContactUploadedFrom("csv");
        } else {
            addToast({
                title: "Alert!",
                description: "File is over 5MB!",
                color: "warning",
            });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragLeave = (e) => {
        // Remove visual indication for drag over if needed
    };

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
        <div className="w-full flex">
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
                {!csvFile && (
                    <div>
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
                            <p className="file-info text-gray-500 text-xs">
                                {t("No Files Selected")}
                            </p>
                        </div>
                        <div className="mt-4 text-gray-600 flex justify-between">
                            <div>
                                <span className="block text-sm text-default-500">
                                    {t("Supported formats")}: csv, xlsx, xls |{" "}
                                    {t("Max file size")}: 5MB
                                </span>

                                {/* Download Sample File Section */}
                                <a
                                    href="/sample-sms.csv"
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

                {/* Upload file preview */}
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
                                                <FileUploadIcon
                                                    customClass="text-success-700 dark:text-success"
                                                    size="1.6em"
                                                />
                                                {t("Upload")}
                                            </>
                                        ) : (
                                            <>
                                                {/* Loader */}
                                                <LoaderIcon />
                                                {t("Uploading...")}
                                            </>
                                        )}
                                    </Button>
                                )}

                                {/* Reset File */}
                                <Button
                                    isDisabled={isPending}
                                    type="reset"
                                    color="default"
                                    variant="flat"
                                    isIconOnly
                                    size="sm"
                                    radius="sm">
                                    {/* <TrashIcon customClass="text-danger" /> */}
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
