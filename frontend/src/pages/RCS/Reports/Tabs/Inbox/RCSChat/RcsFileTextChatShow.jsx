import React from "react";
import { Icon } from "@iconify-icon/react";
import { Image } from "@heroui/react";

const RcsFileTextChatShow = ({ chat }) => {
    const getFileType = (url) => {
        if (!url) return "unknown";
        const extension = url.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
            return "image";
        if (["mp4", "webm", "ogg"].includes(extension)) return "video";
        if (["pdf"].includes(extension)) return "pdf";
        return "unknown";
    };

    const fileType = getFileType(chat?.file_url);
    const cleanFileName = (url) => {
        if (!url) return "Unknown File";
        const decodedName = decodeURIComponent(url.split("/").pop());
        return decodedName.replace(/\?.*/, "");
    };
    const fileName = cleanFileName(chat?.file_url);
    return (
        <div className="px-4 py-[3px] flex justify-end flex-col items-end">
            <div className="flex items-end flex-col">
                <span className="bg-primary-100 items-end px-3 py-2 text-sm rounded-xl w-fit break-words max-w-xs">
                    {fileType === "image" && (
                        <Image
                            src={chat?.file_url}
                            alt="File"
                            className="w-full"
                        />
                    )}
                    {fileType === "video" && (
                        <video controls className="w-full">
                            <source
                                src={chat?.file_url}
                                type={`video/${chat?.file_url
                                    .split(".")
                                    .pop()}`}
                            />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {fileType === "pdf" && (
                        <div className="flex items-center gap-3 p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                            {/* PDF Icon */}
                            <Icon
                                icon="vscode-icons:file-type-pdf2"
                                width="40"
                                height="40"
                                className="text-red-500"
                            />

                            {/* View PDF Text */}
                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                                {fileName || "View PDF"}
                            </p>

                            {/* Download Icon (Perfect Circle) */}
                            <a
                                href={chat?.file_url}
                                download={fileName || "document.pdf"}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 transition-all">
                                <Icon
                                    icon="mdi:download"
                                    width="24"
                                    height="24"
                                    className="text-white"
                                />
                            </a>
                        </div>
                    )}
                    {fileType === "unknown" && (
                        <span>Unsupported file format</span>
                    )}
                    <span className="py-2 mt-3  text-sm text-default-400 dark:text-foreground">
                        {chat.message}
                    </span>
                </span>
                <div className="text-[10px] py-[1px] text-end text-default-400 dark:text-foreground gap-1 flex justify-end items-center">
                    <span>{chat?.time}</span>
                    <Icon
                        icon="quill:checkmark-double"
                        width="15"
                        height="15"
                        className="text-primary"
                    />
                </div>
            </div>
        </div>
    );
};

export default RcsFileTextChatShow;
