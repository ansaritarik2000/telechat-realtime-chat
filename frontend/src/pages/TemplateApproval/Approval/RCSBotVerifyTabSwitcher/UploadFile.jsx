import React from "react";
import { Icon } from "@iconify/react";
const UploadFile = ({
  handleFileChange,
  placeholder = "Upload Image",
  fileName,
  multiple = false,
  accept = "image/*",
  totalFiles,
}) => {
  return (
    <div className="border border-default rounded-md relative">
      <input
        id="file_input"
        type="file"
        accept={accept}
        multiple={multiple}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file_input"
        className="flex items-center justify-center w-full  hover:scale-105 rounded-lg bg-default-100 text-sm cursor-pointer"
      >
        <div className="flex items-center justify-between gap-1 w-full h-full">
          <p className="px-2 flex items-center gap-1">
            {fileName ? (
              <>
                <Icon
                  icon="ic:baseline-check-circle"
                  width="18"
                  height="18"
                  className="text-green-500"
                />
                {totalFiles}
                {totalFiles > 1 ? " files" : " file"} uploaded
              </>
            ) : (
              placeholder
            )}
          </p>
          <div className="px-4 py-1  bg-gray-200 dark:bg-slate-500 h-full">
            <Icon icon="ic:outline-file-upload" width="24" height="24" />
          </div>
        </div>
      </label>
    </div>
  );
};

export default UploadFile;
