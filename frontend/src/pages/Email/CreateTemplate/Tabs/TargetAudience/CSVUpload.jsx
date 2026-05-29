import React, { useRef, useState } from "react";
import { Button, addToast } from "@heroui/react";

import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";
import { uploadFileServiceEmails } from "../../../../../services/fileuploadservices/fileService";

const CsvUpload = () => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null); // Reference to the hidden input field
    const fileLimit = 5000000; // 5MB limit
    const { t } = useTranslation();

    // zustand store
    const setEmailCampaingnData = emailCampaingnStore(
        (state) => state.setEmailCampaingnData
    );
    const onSelect = emailCampaingnStore((state) => state.onSelect);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (
            selectedFile &&
            selectedFile.name === "send-email-sample.csv" &&
            selectedFile.size <= fileLimit
        ) {
            setFile(selectedFile);
            updateDropzoneFileList(selectedFile);
        } else {
            addToast({
                title: "Alert!",
                description:
                    "File is over 5MB! or file name should be send-email-sample.csv",
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
            setFile(droppedFile);
            updateDropzoneFileList(droppedFile);
            // Update the hidden input field with the dropped file
            fileInputRef.current.files = e.dataTransfer.files;
        } else {
            alert("File is over 5MB!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSelect(false);
        if (file && file.size <= fileLimit) {
            try {
                const response = await uploadFileServiceEmails(file);
                console.log(response.data);
                if (response.status === "SUCCESS") {
                    setEmailCampaingnData("csvFileContent", response.data);
                    setEmailCampaingnData(
                        "validEmails",
                        response.data.validEmails
                    );
                    // setCsvFileContent(response.data); // set all csv content
                    // setPhoneNumbers(response.data.validEmails); // set valid phone numbers
                    alert("File uploaded successfully!");
                }
            } catch (error) {
                console.error("Upload Error:", error.message);
                alert(error.message);
            }
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
                <p className="text-gray-600 mb-4">
                    {t("Click to upload or drag & drop the file")}
                </p>
                <div
                    className="w-full py-12 border-dashed border-2 border-success-200 rounded-lg flex flex-col items-center justify-center relative bg-gray-50 dark:bg-content1"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-cloud-upload animate-pulse"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                            <path d="M9 15l3 -3l3 3" />
                            <path d="M12 12l0 9" />
                        </svg>
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
                            href="/sample-email.csv"
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

                    <div className="flex gap-2 items-center">
                        <Button
                            type="reset"
                            color="default"
                            variant="bordered"
                            startContent={
                                <Icon
                                    icon="ri:reset-right-line"
                                    width="1.2em"
                                    height="1.2em"
                                />
                            }
                            size="sm"
                            radius="sm">
                            {t("Reset")}
                        </Button>
                        <Button
                            size="sm"
                            radius="sm"
                            type="submit"
                            color="success"
                            variant="flat"
                            // className="text-white"
                        >
                            {t("Save")}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CsvUpload;
