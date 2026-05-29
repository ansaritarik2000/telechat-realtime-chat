import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSendWhatsappStore } from "../../../../../../../../store/whatsapp/whatsappStore";
import { uploadFileToServer } from "../../../../../../../../services/s3FileServices/s3Services";
import {
    Modal,
    Button,
    Input,
    Divider,
    addToast,
    Image,
    ScrollShadow,
} from "@heroui/react";
import {
    FILE_TYPE_CONFIG,
    uploadMediaSevices,
} from '../Utils/utils.js';
import {
    CloudUploadIcon,
} from "../../../../../../../../utils/ReusableIcons";
import FileUploadPreview from "../../../../../../../../components/Common/FileUploadPreview";
import { mediaId } from "../../../../../../../TemplateApproval/Approval/WhatsApp/utils/sendTemplatesForApproval";

const MediaUpload = () => {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rawMediaUrlInput, setRawMediaUrlInput] = useState("");
    const fileLimit = 5000000; // 5MB limit
    const [uploadingStates, setUploadingStates] = useState([]);
    const {
        setMediaUrl,
        mediaUrl,
        setMediaId,
        MediaId,
        setMediaFileName,
        mediaFileName,
        selectedTemplateTypeSend,
        singleTemplateData,
    } = useSendWhatsappStore();
// Handle the file change with validate files types 
    const handleFileChange = (e) => {
        // Select the file
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;
        const carouelType = singleTemplateData[0]?.carouelType || "";
        // Validate the file
        const fileValidator = (file) => {
            const fileExtension = file.name.split(".").pop().toLowerCase();
            const config = FILE_TYPE_CONFIG[selectedTemplateTypeSend];
            // 1. Check if carousel type matches file type
            if (selectedTemplateTypeSend === "carousel" && carouelType) {
                if (
                    carouelType === "image" &&
                    !["jpg", "jpeg", "png"].includes(fileExtension)
                ) {
                    addToast({
                        title: "Alert!",
                        description:
                            "Only image files (JPG, PNG) are allowed this template.",
                        color: "danger",
                        timeout: 3000,
                    });
                    return false;
                }
                if (
                    carouelType === "video" &&
                    !["mp4"].includes(fileExtension)
                ) {
                    addToast({
                        title: "Alert!",
                        description:
                            "Only video files (MP4) are allowed for this template.",
                        color: "danger",
                        timeout: 3000,
                    });

                    return false;
                }
            }
            if (!config.extensions?.includes(fileExtension)) {
                addToast({
                    title: "Alert!",
                    description: config.errorMessage,
                    color: "danger",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                });

                return false;
            }
// Check the file size
            if (file.size > fileLimit) {
                addToast({
                    title: "Error",
                    description: `File ${file.name} is over 5MB!`,
                    color: "danger",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                });
                return false;
            }
            return true;
        };
// Hnadle the carousel case 
        if (selectedTemplateTypeSend === "carousel") {
            // Get maximum allowed files from carousel items length
            const maxFilesAllowed =
                singleTemplateData[0]?.carouselItems?.length || 0;
            const currentFileCount = files.length;
            // Check if adding these files would exceed the limit
            if (currentFileCount + selectedFiles.length > maxFilesAllowed) {
                addToast({
                    title: "Limit Exceeded",
                    description: `You can only add ${maxFilesAllowed} files for this template.`,
                    color: "warning",
                    timeout: 3000,
                });

                return;
            }
            
            const validFiles = selectedFiles.filter(fileValidator);
            setFiles((prev) => [...prev, ...validFiles]);
        } else {
            const validFile = selectedFiles.find(fileValidator);
            if (validFile) setFiles([validFile]);
        }
    };
// Handle the files uploads in S3 bucket 
    const handleUpload = async (fileToUpload, index) => {
        if (!fileToUpload) {
            toast.error("Please select a file to upload.");
            return;
        }

        try {
            setUploadingStates((prev) => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
            });
            setIsModalOpen(true);

            const [uploadedUrl, uploadId] = await Promise.all([
                uploadFileToServer(fileToUpload),
                uploadMediaSevices(fileToUpload),
            ]);
// For the single file store data
            const updateStore = {
                url: uploadedUrl?.data?.Location,
                id: uploadId?.data?.MediaId,
                name: fileToUpload.name,
            };
// Handle the carousel case to save the data
            if (selectedTemplateTypeSend === "carousel") {
                // Create new arrays with updated or added item
                const updateArray = (current, newValue) => {
                    const arr = [...(current || [])];
                    if (index !== undefined && index < arr.length) {
                        arr[index] = newValue;
                    } else {
                        arr.push(newValue);
                    }
                    return arr;
                };

                setMediaUrl(updateArray(mediaUrl, updateStore.url));
                setMediaId(updateArray(MediaId, updateStore.id));
                setMediaFileName(updateArray(mediaFileName, updateStore.name));
            } else {
                // Single file case
                setMediaUrl(updateStore.url);
                setMediaId(updateStore.id);
                setMediaFileName(updateStore.name);
            }

            addToast({
                title: "Success 🎉",
                description: "File uploaded successfully!",
                color: "success",
                duration: 3000,
            });
        } catch (error) {
            console.error("Upload error:", error);
            addToast({
                title: "Error",
                description: error.message || "Failed to upload file.",
                color: "danger",
            });
        } finally {
            setUploadingStates((prev) => {
                const newStates = [...prev];
                newStates[index] = false;
                return newStates;
            });
            setIsModalOpen(false);
        }
    };
// Delete remove the files before and after upload
    const removeFile = (index) => {
        if (selectedTemplateTypeSend === "carousel") {
            // Remove from all arrays in a consistent way
            const removeFromArray = (arr) => {
                if (!arr || arr.length <= index) return arr;
                const newArr = [...arr];
                newArr.splice(index, 1);
                return newArr;
            };

            setFiles(removeFromArray(files));
            setMediaUrl(removeFromArray(mediaUrl));
            setMediaId(removeFromArray(MediaId));
            setMediaFileName(removeFromArray(mediaFileName));
        } else {
            // Reset all for non-carousel
            setFiles([]);
            setMediaUrl([]);
            setMediaId([]);
            setMediaFileName([]);
        }
    };
    // Handle the url input change 
    const handleMediaUrlChange = (e) => {
        const value = e.target.value;
        if (selectedTemplateTypeSend === "carousel") {
            // Split by comma and trim whitespace for carousel
            const urls = value
                .split(",")
                .map((url) => url.trim())
                .filter((url) => url);
                 setMediaUrl(urls);
        } else {
            // Single URL for non-carousel
            setMediaUrl(value);
        }
    };

    // Helper function to display URLs
    const displayUrls = () => {
        if (selectedTemplateTypeSend === "carousel") {
            // Join array with comma and space for display
            return mediaUrl?.join(", ") || "";
        }
        // Single URL for non-carousel
        return mediaUrl || "";
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {/* URL Input */}
            <Input
                isRequired
                id="media-url"
                name="media-url"
                type="text"
                radius="sm"
                size="md"
                label="Paste Media URL"
                placeholder=""
                variant="flat"
                onChange={handleMediaUrlChange}
                value={displayUrls()}
            />

            {/* OR Divider */}
            <div className="flex justify-center items-center gap-1">
                <div className="w-full">
                    <Divider />
                </div>
                <h2 className="text-sm text-center">OR</h2>
                <div className="w-full">
                    <Divider />
                </div>
            </div>

            {/* File Upload Component */}
            {files.length === 0 ? (
                <div className="h-24 rounded-lg border-2 border-dashed border-success-200 flex justify-center items-center w-full relative bg-gray-50 dark:bg-content1 hover:border-success-300 transition-colors duration-300">
                    <input
                        type="file"
                        id="upload-file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        accept=".png, .jpg, .jpeg, .PNG, .JPG, .JPEG, .mp4, .MP4, .pdf, .PDF"
                        multiple={selectedTemplateTypeSend === "carousel"}
                    />
                    <label
                        htmlFor="upload-file"
                        className="flex items-center justify-center w-full h-full rounded-lg cursor-pointer"
                    >
                        <div className="flex justify-center items-center w-full h-full">
                            {/* Left Column */}
                            <div className="flex justify-center items-center w-1/3 bg-success-50 h-full rounded-l-lg border-r border-success-100">
                                <CloudUploadIcon className="text-success-500" />
                            </div>

                            {/* Right Column */}
                            <div className="w-2/3 px-4 h-full flex flex-col justify-center">
                                <p className="block font-medium text-sm truncate max-w-full">
                                    No Files Selected
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs dark:text-default-400">
                                        Drag & drop or click to browse | Max 5MB
                                    </span>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            ) : (
                <div className="flex flex-col gap-3 ">
                    {/* Add another file button for carousel */}
                    {selectedTemplateTypeSend === "carousel" && (
                        <div className="h-24 rounded-lg border-2 border-dashed border-success-200 flex justify-center items-center w-full relative bg-gray-50 dark:bg-content1 hover:border-success-300 transition-colors duration-300">
                            <input
                                type="file"
                                id="upload-another-file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                multiple
                                accept=".png, .jpg, .jpeg, .PNG, .JPG, .JPEG, .mp4, .MP4, .pdf, .PDF"
                            />
                            <label
                                htmlFor="upload-another-file"
                                className="flex items-center justify-center w-full h-full rounded-lg cursor-pointer"
                            >
                                <div className="flex flex-col justify-center items-center">
                                    <CloudUploadIcon className="text-success-500 mb-2" />
                                    <p className="text-sm">Add another file</p>
                                </div>
                            </label>
                        </div>
                    )}

                    <ScrollShadow hideScrollBar className="w-full h-44">
                        {files.map((file, index) => (
                            <FileUploadPreview
                                key={index}
                                file={file}
                                isUploading={uploadingStates[index] || false}
                                onUpload={() => handleUpload(file, index)}
                                onRemove={() => removeFile(index)}
                                statusText={
                                    mediaUrl[index]
                                        ? "Uploaded"
                                        : "Ready to upload"
                                }
                                index={index + 1}
                            />
                        ))}
                    </ScrollShadow>
                </div>
            )}

            {/* Upload Progress Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Uploading File
                    </h2>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: isUploading ? "50%" : "100%" }}
                        ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        {isUploading ? "Uploading..." : "Upload Complete!"}
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default MediaUpload;
