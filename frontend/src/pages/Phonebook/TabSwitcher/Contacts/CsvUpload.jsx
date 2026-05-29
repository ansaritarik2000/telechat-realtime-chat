import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { usePhoneBookStore } from "../../../../store/phonebook/phonebookStore";

const CsvUpload = () => {
  const { file, setFile } = usePhoneBookStore();
  const fileLimit = 5000000; // 5MB limit
  const { t } = useTranslation();

  useEffect(() => {
    setFile(null);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && file.size <= fileLimit) {
      console.log(file); // Perform your submit logic here
    } else {
      console.log("File is over 5MB!");
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
        className="w-full max-w-4xl bg-white dark:bg-content2 border dark:border-content3 rounded-lg p-6 shadow-sm flex flex-col"
        onSubmit={handleSubmit}
        onReset={() => setFile(null)}
      >
        {/* <h2 className="text-2xl font-semibold mb-4">Upload File</h2> */}
        {/* <p className="text-gray-600 mb-4">
          Click to upload or drag & drop the file
        </p> */}
        <div
          className="w-full h-32 border-dashed border-2 border-success-200 rounded-lg flex flex-col items-center justify-center relative dark:bg-content2 bg-gray-50"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
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
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
              <path d="M9 15l3 -3l3 3" />
              <path d="M12 12l0 9" />
            </svg>
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
        <div className="mt-4  flex justify-start">
          <div>
            <span className="block text-sm text-default-500">
              Supported formats: CSV, XLSX, XLS
            </span>
            <span className="block text-sm text-default-500">
              Max file size: 5MB
            </span>
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
      </form>
    </div>
  );
};

export default CsvUpload;
