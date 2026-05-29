import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useSmsTemplateStore } from "../../../../../../store/smsTemplateStore";
import { CloudUploadIcon } from "../../../../../../utils/ReusableIcons";
import { t } from "i18next";
import { formatFileSize } from "../../../../../../utils/oprators";
import { Button } from "@heroui/react";

const CsvUpload = () => {
    // zustand store
    const { file, setFile } = useSmsTemplateStore();
    const fileLimit = 5000000; // 5MB limit

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= fileLimit) {
            setFile(selectedFile);
            updateDropzoneFileList(selectedFile);
        } else {
            alert("File is over 5MB!");
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
            setFile(droppedFile);
            updateDropzoneFileList(droppedFile);
        } else {
            alert("File is over 5MB!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file && file.size <= fileLimit) {
            console.log(file); // Perform your submit logic here
        } else {
            alert("File is over 5MB!");
        }
    };

    const updateDropzoneFileList = (file) => {
        const dropzoneFileMessage = document.querySelector(".file-info");
        if (dropzoneFileMessage) {
            dropzoneFileMessage.innerHTML = `${file.name}, ${file.size} bytes`;
        }
    };

    return (
        <div className="w-full flex">
            <form
                className="w-full max-w-4xl bg-white dark:bg-content1  rounded-lg  flex flex-col"
                onSubmit={handleSubmit}
                onReset={() => setFile(null)}>
                {!file && (
                    <div>
                        <div
                            className="w-full h-32 border-dashed border-2 dark:bg-content1 border-success-200 rounded-lg flex flex-col items-center justify-center relative bg-gray-50"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}>
                            <div>
                                <CloudUploadIcon />
                            </div>

                            <input
                                type="file"
                                required
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
                                {/* Download sample file */}
                                <a
                                    href="bulk-template-sample.csv"
                                    download
                                    className="flex items-center gap-1 cursor-pointer hover:underline hover:text-success text-sm text-default-500">
                                    Download sample file
                                    <Icon
                                        icon="iconamoon:cloud-download-light"
                                        width="1.3em"
                                        height="1.3em"
                                        className="hover:text-success"
                                    />
                                </a>
                            </div>

                            <div className="flex gap-2 items-center">
                                {/* <Button type="reset" size="sm" radius="sm">
              Cancel
            </Button>
            <Button size="sm" radius="sm" type="submit" color="success">
              Save
            </Button> */}
                            </div>
                        </div>
                    </div>
                )}
                {file && (
                    <div>
                        {/* Preview part */}
                        <div className="border border-gray-500/30 rounded-xl w-full h-fit flex items-center justify-between px-4 py-2">
                            {/* Preview Details part */}
                            <div className="w-full h-fit flex items-center justify-start gap-4">
                                {/* Icon */}
                                <div className="rounded-full bg-green-200 text-green-500 p-2">
                                    {/* File icon */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={17}
                                        height={17}
                                        viewBox="0 0 24 24">
                                        <g
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}>
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8m8 4H8m8 4H8"></path>
                                        </g>
                                    </svg>
                                </div>

                                {/* File Details Section */}
                                <div>
                                    <p className="text-sm">{`${file?.name}`}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file?.size)}
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 items-center">
                                {/* Reset File */}
                                <Button
                                    type="reset"
                                    color="danger"
                                    variant="flat"
                                    isIconOnly
                                    size="sm"
                                    radius="sm">
                                    <Icon
                                        icon={"fluent:delete-20-regular"}
                                        width={20}
                                        height={20}
                                        className="text-danger"
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CsvUpload;
