import React from "react";
import { Icon } from "@iconify-icon/react";
const ShowSelectedFile = ({ selectedFile, removePreview }) => {
    return (
        <div className="relative mb-2 flex items-center  w-[210px] h-[70px] border rounded-lg dark:bg-gray-800 dark:border-gray-700">
            {selectedFile.type === "image" ? (
                <img
                    src={selectedFile.url}
                    alt="Preview"
                    className="w-[90px] h-full"
                />
            ) : selectedFile.type === "video" ? (
                <video
                    src={selectedFile.url}
                    controls
                    className="w-[90px] h-full object-contain"
                />
            ) : selectedFile.type === "pdf" ? (
                <div className="flex w-full h-full flex-col items-center justify-center">
                    <Icon
                        icon="vscode-icons:file-type-pdf2"
                        width="50"
                        height="50"
                    />
                    {/* <p className="mt-2 w-full">{selectedFile.name}</p> */}
                </div>
            ) : null}
            <span className="w-[400px] ml-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {" "}
                1 File Attached.
            </span>
            <Icon
                icon="si:close-duotone"
                width="28"
                height="28"
                onClick={removePreview}
                className="absolute cursor-pointer -top-1 -right-1"
                style={{ color: "#b82323" }}
            />
        </div>
    );
};

export default ShowSelectedFile;
