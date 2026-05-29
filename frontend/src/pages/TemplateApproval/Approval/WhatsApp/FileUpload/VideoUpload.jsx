import React, { useState } from "react";
import { validateFile } from "./utils";
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");
  const videoLimit = 5000000; // 5MB limit
  const thumbnailLimit = 3000000; // 3MB limit
  const {setVideoContent}  = useWhatsappTemplateStore()
  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    let validation;

    if (type === "video") {
      validation = validateFile(selectedFile, "video", videoLimit);
      if (validation.isValid) {
        setVideo(selectedFile);
        setError("");
      }
    } else if (type === "thumbnail") {
      validation = validateFile(selectedFile, "image", thumbnailLimit);
      if (validation.isValid) {
        setThumbnail(selectedFile);
        const preview = URL.createObjectURL(selectedFile);
        setVideoContent({
            name:selectedFile.name,
            thumbnailUrl:preview
        })
        // console.log(preview)
        setError("");
      }
    }

    if (!validation.isValid) {
      setError(validation.message);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    let validation;

    if (type === "video") {
      validation = validateFile(droppedFile, "video", videoLimit);
      if (validation.isValid) {
        setVideo(droppedFile);
        setError("");
      }
    } else if (type === "thumbnail") {
      validation = validateFile(droppedFile, "image", thumbnailLimit);
      if (validation.isValid) {
        setThumbnail(droppedFile);
        setError("");
      }
    }

    if (!validation.isValid) {
      setError(validation.message);
    }
  };

  const handleRemoveFile = (type) => {
    if (type === "video") setVideo(null);
    if (type === "thumbnail") setThumbnail(null);
  };

  return (
    <div className="flex gap-2">
      {/* Video Upload */}
      <div className="w-1/2 flex border border-default rounded-lg p-8">
        <div className="w-full max-w-xl flex flex-col">
          <div
            className="w-full h-32 border-dashed border-2 border-success-200 rounded-lg flex flex-col items-center justify-center relative"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "video")}
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
              accept="video/mp4"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e, "video")}
            />
            <p className="text-gray-500 text-xs">Drag & drop or click to upload a video (MP4)</p>
          </div>

          <div className="mt-4 text-gray-600 flex justify-between">
            <span className="block text-xs text-default-400">
              Supported format: MP4 | Max file size: 50MB
            </span>
          </div>
          {video && (
            <div className="mt-2 text-sm text-success-600 flex justify-between items-center">
              <span>
                Uploaded: {video.name}, {Math.round(video.size / 1024 / 1024)} MB
              </span>
              <button
                className="text-red-500 text-xs"
                onClick={() => handleRemoveFile("video")}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div className="w-1/2 flex border border-default rounded-lg p-8">
        <div className="w-full max-w-xl flex flex-col">
          <div
            className="w-full h-32 border-dashed border-2 border-success-200 rounded-lg flex flex-col items-center justify-center relative"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "thumbnail")}
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
              onChange={(e) => handleFileChange(e, "thumbnail")}
            />
            <p className="text-gray-500 text-xs">Drag & drop or click to upload a Thumbnail (JPEG, PNG)</p>
          </div>

          <div className="mt-4 text-gray-600 flex justify-between">
            <span className="block text-xs text-default-400">
              Supported formats: JPEG, PNG | Max file size: 5MB
            </span>
          </div>

          {thumbnail && (
            <div className="mt-2 text-sm text-success-600 flex justify-between items-center">
              <span>
                Uploaded: {thumbnail.name}, {(thumbnail.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <button
                className="text-red-500 text-xs"
                onClick={() => handleRemoveFile("thumbnail")}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
