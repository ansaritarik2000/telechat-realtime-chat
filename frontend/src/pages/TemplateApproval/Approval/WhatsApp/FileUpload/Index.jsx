import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";
import MessageBox from "../MessageBox";


const FileUploadIndex = () => {
  const [file, setFile] = useState(null);
  const fileLimit = 3000000; // 3MB limit
  const { t } = useTranslation();
  const {documentContent,setDocumentContent} = useWhatsappTemplateStore();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= fileLimit) {
      setFile(selectedFile);
      updateDropzoneFileList(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setDocumentContent({imageUrl:previewUrl,name:selectedFile.name});
      // console.log("previewUrl",previewUrl);
    } else {
      alert("File is over 3MB!");
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
      alert("File is over 3MB!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && file.size <= fileLimit) {
      console.log(file); // Perform your submit logic here
    } else {
      alert("File is over 3MB!");
    }
  };

  const updateDropzoneFileList = (file) => {
    const dropzoneFileMessage = document.querySelector(".file-info");
    if (dropzoneFileMessage) {
      dropzoneFileMessage.innerHTML = `${file.name}, ${file.size} bytes`;
    }
  };

  return (
    <div className="w-1/2 flex border border-default  rounded-lg p-8 ">
      <form
        className="w-full max-w-xl  flex flex-col"
        onSubmit={handleSubmit}
        onReset={() => setFile(null)}
      >
        
        <div
          className="w-full h-32 border-dashed border-2 border-success-200 rounded-lg flex flex-col items-center justify-center relative  "
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-cloud-upload "
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
            accept=".pdf, .txt"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <p className="file-info text-gray-500 text-xs">
            {t("No Files Selected")}
          </p>
        </div>
        <div className="mt-4 text-gray-600 flex justify-between">
          {/* Supported formats and max file size */}
          <div>
            <span className="block text-xs text-default-400">
              Supported formats: PDF | Max file size: 3MB
            </span>
            {/* <span className="block text-sm text-default-500"></span> */}
          </div>

          {/* Buttons */}
          {/* <div className="flex gap-2 items-center">
            <Button type="reset" variant="none" size="sm" radius="sm">
              Cancel
            </Button>
            <Button
              size="sm"
              radius="sm"
              variant="flat"
              type="submit"
              color="success"
            >
              Upload
            </Button>
          </div> */}
        </div>
      </form>
      
    </div>
  );
};

export default FileUploadIndex;
