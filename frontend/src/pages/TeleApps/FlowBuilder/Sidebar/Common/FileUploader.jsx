import React, { useState } from "react";
import { Icon } from "@iconify/react";

// File Uploader Component
export const FileUploader = ({ type }) => {
  const [fileName, setFileName] = useState("");

  // File type configuration with size limits and allowed types
  const fileTypeConfig = {
    image: {
      maxSize: "5MB",
      types: ".jpg, .jpeg, .png, .gif, .webp",
      description: "Supported formats: JPG, PNG, GIF up to 5MB",
    },
    video: {
      maxSize: "50MB",
      types: ".mp4, .mov, .avi, .webm",
      description: "Supported formats: MP4, MOV, WEBM up to 50MB",
    },
    audio: {
      maxSize: "10MB",
      types: ".mp3, .wav, .ogg",
      description: "Supported formats: MP3, WAV, OGG up to 10MB",
    },
    document: {
      maxSize: "10MB",
      types: ".pdf, .doc, .docx, .xls, .xlsx",
      description: "Supported formats: PDF, DOC, DOCX, XLS up to 10MB",
    },
  };

  const config = fileTypeConfig[type.toLowerCase()] || {
    maxSize: "10MB",
    types: "*",
    description: "All file types supported up to 10MB",
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center border border-gray-300 rounded-md h-12 overflow-hidden">
        <div className="flex-grow px-3 truncate">
          {fileName ? (
            <span className="text-sm">{fileName}</span>
          ) : (
            <span className="text-sm text-gray-500">Upload {type}</span>
          )}
        </div>
        <label htmlFor={`file-upload-${type}`} className="h-full">
          <div className="bg-gray-100 h-full px-3 flex items-center cursor-pointer hover:bg-gray-200">
            <Icon
              icon="heroicons:cloud-arrow-up"
              className="text-xl text-gray-600"
            />
          </div>
          <input
            type="file"
            className="hidden"
            id={`file-upload-${type}`}
            accept={config.types}
            onChange={handleFileChange}
          />
        </label>
      </div>
      <p className="text-xs text-gray-500 mt-1">{config.description}</p>
    </div>
  );
};
