import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const fileLimit = 3000000; // 5MB limit
  const { t } = useTranslation();
  const { singleImageContent, setSingleImageContent } = useWhatsappTemplateStore();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate the file
    if (selectedFile.size > fileLimit) {
      alert(`${selectedFile.name} is over 5MB!`);
      return;
    }
    if (!selectedFile.type.startsWith("image/")) {
      alert(`${selectedFile.name} is not a valid image file!`);
      return;
    }

    // Set the file and generate a preview
    setFile({
      name: selectedFile.name,
      size: (selectedFile.size / 1024 / 1024).toFixed(2), // Size in MB
      url: URL.createObjectURL(selectedFile),
    });

    // Update the store with the file details
    setSingleImageContent({
      imageUrl: URL.createObjectURL(selectedFile),
      name: selectedFile.name,
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (!droppedFile) return;

    // Validate the file
    if (droppedFile.size > fileLimit) {
      alert(`${droppedFile.name} is over 5MB!`);
      return;
    }
    if (!droppedFile.type.startsWith("image/")) {
      alert(`${droppedFile.name} is not a valid image file!`);
      return;
    }

    // Set the file and generate a preview
    setFile({
      name: droppedFile.name,
      size: (droppedFile.size / 1024 / 1024).toFixed(2), // Size in MB
      url: URL.createObjectURL(droppedFile),
    });

    // Update the store with the file details
    setSingleImageContent({
      imageUrl: URL.createObjectURL(droppedFile),
      name: droppedFile.name,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      console.log(file); // Perform your submit logic here
    } else {
      alert("Please upload an image!");
    }
  };

  return (
    <div className="w-1/2 flex border border-default rounded-lg p-8">
      <form
        className="w-full max-w-xl flex flex-col"
        onSubmit={handleSubmit}
        onReset={() => setFile(null)}
      >
        <div
          className="w-full h-32 border-dashed border-2 border-success-200 rounded-lg flex flex-col items-center justify-center relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-cloud-upload"
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
            accept="image/jpeg, image/png"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <p className="file-info text-gray-500 text-xs">
            {t("Drag & drop or click to upload an image (JPEG, PNG)")}
          </p>
        </div>
        <div className="mt-4">
          {file && (
            <div className="text-sm text-success-600">
              {file.name} - {file.size} MB
              <img
                src={file.url}
                alt={file.name}
                className="mt-2 w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="mt-4 text-gray-600 flex justify-between">
          <div>
            <span className="block text-xs text-default-400">
              Supported formats: JPEG, PNG | Max file size: 3MB
            </span>
          </div>
       
        </div>
      </form>
    </div>
  );
};

export default ImageUpload;
