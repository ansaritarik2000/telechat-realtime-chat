import React, { useState } from "react";
import { Button } from "@heroui/react";

const UploadFile = () => {
  const [file, setFile] = useState(null);
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
    // Add any visual indication for drag over if needed
  };

  const handleDragLeave = (e) => {
    // Remove visual indication for drag over
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
    <div className="flex">
      <form
        className="dropzone-box"
        onSubmit={handleSubmit}
        onReset={() => setFile(null)}
      >
        <h2>Upload Media</h2>
        <p className="text-gray-600">Click to upload or drag and drop</p>
        <div
          className="dropzone-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="file-upload-icon">
            {/* SVG upload */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-cloud-upload"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="#858585"
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
            onChange={handleFileChange}
          />
          <p className="file-info">No Files Selected</p>
        </div>
        <div className="dropzone-description">
          <span>Supported formats: PNG, JPG, mp4</span>
          <span>Max file size: 5MB</span>
        </div>
        <div className="flex justify-end mt-5">
          <div className="action-buttons">
            <Button type="reset" size="sm" radius="sm">
              Cancel
            </Button>
            <Button
              size="sm"
              radius="sm"
              type="submit"
              color="success"
              className="text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadFile;
