import React, { useState, useRef } from "react";
import { addToast, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import { uploadFileService } from "../../../../../../../services/fileuploadservices/fileService";
import { useSendWhatsappStore } from "../../../../../../../store/whatsapp/whatsappStore";
import {
    CloseIcon,
    CloudUploadIcon,
    FilePreviewSVG,
    FileUploadIcon,
    LoaderIcon,
    TrashIcon,
} from "../../../../../../../utils/ReusableIcons";
import { formatFileSize } from "../../../../../../../utils/oprators";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
const FileUpload = () => {
    const { t } = useTranslation();
    const fileLimit = 5000000; // 5MB limit
    const {
        setPhoneNumbers,
        csvFileContent,
        setCsvFileContent,
        selectedTemplateTypeSend,
        singleTemplateData,
        csvFile,
        setCsvFile,
        fileProcessingInfo,
        setFileProcessingInfo,
        setContactUploadedFrom,
        contactUploadedFrom,
    } = useSendWhatsappStore();
    // Reference to the hidden input field
    const fileInputRef = useRef(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= fileLimit) {
            setCsvFile(selectedFile);
            updateDropzoneFileList(selectedFile);
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
        // Remove visual indication for drag over
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.size <= fileLimit) {
            setCsvFile(droppedFile);
            updateDropzoneFileList(droppedFile);
            setContactUploadedFrom("csv");
            // Update the hidden input field with the dropped file
            fileInputRef.current.files = e.dataTransfer.files;
        } else {
            addToast({
                title: "Alert!",
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
                //  console.log('csvFileContent',csvFileContent)
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
            addToast({
                title: e.name,
                description: e.message,
                color: "danger",
            });
        },
    });

    const updateDropzoneFileList = (csvFile) => {
        const dropzoneFileMessage = document.querySelector(".file-info");
        if (dropzoneFileMessage) {
            dropzoneFileMessage.innerHTML = `${csvFile.name}, ${csvFile.size} bytes`;
        }
    };

    const generateCsvData = (selectedTemplateTypeSend) => {
        let headers = ["phonenumber"];
        let data = [];

        switch (selectedTemplateTypeSend) {
            case "text":
                const bodyVar =
                    singleTemplateData[0]?.["textMessageContent"]?.variables;
                const headVar =
                    singleTemplateData[0]?.["headerContent"]?.variables;
                if (bodyVar) {
                    bodyVar.map((v, i) => headers.push(`var${i + 1}`));
                }
                if (bodyVar) {
                    headVar.map((v, i) => headers.push(`header${i + 1}`));
                }
                break;

            case "video":
                const videoVar =
                    singleTemplateData[0]?.["videoContent"]?.variables;
                if (videoVar) {
                    videoVar.map((v, i) => headers.push(`var${i + 1}`));
                }
                break;
            case "image":
                const imageVar =
                    singleTemplateData[0]?.["singleImageContent"]?.variables;
                if (imageVar) {
                    imageVar.map((v, i) => headers.push(`var${i + 1}`));
                }
                break;
            case "document":
                const docVar =
                    singleTemplateData[0]?.["documentContent"]?.variables;
                if (docVar) {
                    docVar.map((v, i) => headers.push(`var${i + 1}`));
                }
                break;

            case "location":
                const locVar = singleTemplateData[0]?.["location"]?.variables;
                if (locVar) {
                    locVar.map((v, i) => headers.push(`var${i + 1}`));
                }
                headers.push(
                    "latitude",
                    "longitude",
                    "locationname",
                    "locationaddress"
                );
                break;
            case "WithExpiration":
            case "WithoutExpiration":
                const LtoVar = singleTemplateData[0]?.["LtoContent"]?.variables;
                if (LtoVar) {
                    LtoVar.map((v, i) => headers.push(`var${i + 1}`));
                }
                headers.push("offer_code");
                break;
            case "carousel":
                const CarouselVar =
                    singleTemplateData[0]?.["carouselBodyContent"]?.variables;
                const cardVar = singleTemplateData[0]?.["carouselItems"]?.map(
                    (data) => data?.variables
                );
                if (CarouselVar) {
                    CarouselVar.map((v, i) => headers.push(`var${i + 1}`));
                }
                if (cardVar) {
                    cardVar.forEach((ar, i) => {
                        ar.forEach((br, j) => {
                            headers.push(`card${i + 1}var${j + 1}`);
                        });
                    });
                }
                break;
            default:
                headers.push("Var1", "Var2");
                data.push(["+917084415134", "Value1", "Value2"]);
                break;
        }

        return { headers, data };
    };

    const downloadCsv = (selectedTemplateTypeSend) => {
        if (!selectedTemplateTypeSend) {
            addToast({
                title: "Alert!",
                description:
                    "Please select one template type to download file!",
                color: "danger",
            });
            return;
        }
        const { headers, data } = generateCsvData(selectedTemplateTypeSend);
        const formattedData = data.map((row) =>
            row.map((cell) => (cell.startsWith("'") ? cell : `'${cell}`))
        );
        const csvData = [headers, ...formattedData];
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `whatsapp_${selectedTemplateTypeSend}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full flex">
            <form
                className="w-full max-w-4xl bg-white dark:bg-content1 rounded-lg flex flex-col"
                onSubmit={(e) => mutateAsync(e)}
                onReset={() => {
                    setCsvFile(null);
                    setFileProcessingInfo(null);
                    setPhoneNumbers([]);
                }}
            >
                <p className="text-gray-600 mb-4">
                    {t(
                        !csvFile
                            ? "Click to upload or drag & drop the file"
                            : ""
                    )}
                </p>
                {!csvFile && (
                    <div>
                        {/* File Drop Area */}
                        <div
                            className="w-full py-12 border-dashed border-2 border-success-200 rounded-lg flex flex-col items-center justify-center relative bg-gray-50 dark:bg-content1"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
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
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        downloadCsv(selectedTemplateTypeSend);
                                    }}
                                    className="flex items-center gap-1 cursor-pointer hover:underline hover:text-success text-sm text-default-500 w-3/4"
                                >
                                    Download sample file
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

                {csvFile && (
                    <div>
                        {/* Preview part */}
                        <div
                            className={`border border-default rounded-xl w-full h-fit flex items-center justify-between p-4 bg-success-50/40 shadow-transparent hover:shadow-sm duration-200 transition-all `}
                        >
                            {/* Preview Details part */}
                            <div className="w-full h-fit flex items-center justify-start gap-4">
                                {/* Icon */}
                                <div className="rounded-full bg-green-200 dark:bg-green-700 text-green-500 dark:text-white p-2">
                                    {/* File icon */}
                                    <FilePreviewSVG />
                                </div>

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
                                        isDisabled={isPending}
                                    >
                                        {!isPending ? (
                                            <>
                                                {/* Upload */}
                                                <FileUploadIcon
                                                    size="1.5em"
                                                    customClass="text-success-900 dark:text-success"
                                                />
                                                {t("Upload")}
                                            </>
                                        ) : (
                                            <>
                                                {/* Loader */}
                                                <LoaderIcon size="1.4em" />
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
                                    variant="ghost"
                                    size="sm"
                                    radius="sm"
                                >
                                    <CloseIcon size="1.9em" />
                                </Button>
                            </div>
                        </div>

                        {/* CSV file info after processing */}
                        {fileProcessingInfo && (
                            <div className="mt-3 h-fit w-full flex items-center justify-start gap-2">
                                <Chip color="primary" variant="flat" size="sm">
                                    Total Contact(s): {fileProcessingInfo.total}
                                </Chip>

                                <Chip color="danger" variant="flat" size="sm">
                                    Invalid Contact(s):{" "}
                                    {fileProcessingInfo.invalid}
                                </Chip>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default FileUpload;
