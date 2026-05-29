import React from "react";

const FileDropZone = ({ onFileDrop, accept, children }) => {
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    onFileDrop(file);
  };

  return (
    <div
      className="w-full h-32 border-dashed border-2 rounded-lg flex flex-col items-center justify-center relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        accept={accept}
        onChange={(e) => onFileDrop(e.target.files[0])}
      />
    </div>
  );
};

export default FileDropZone;
