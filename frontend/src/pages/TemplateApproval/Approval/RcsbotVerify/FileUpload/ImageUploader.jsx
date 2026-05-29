import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import { Icon } from "@iconify/react";
import { useRcsBotVerifyStore } from "../../../../../store/rcsBotVerifyStore";

function ImageUploader({
    cardStyle,
    allowedFiles = "image/*",
    isMultiplesFile = true,
    fileType = "image",
    documentsName,
}) {
    const [files, setFiles] = useState([]);
    const {
        screenImages,
        setScreenImages,
        panCard,
        setPanCard,
        aadharCard,
        setAadharCard,
    } = useRcsBotVerifyStore();
    // this is for show preview image
    const [currentPage, setCurrentPage] = useState(0); // Track current page
    const itemsPerPage = 4; // Set the number of items to display per page

    const dragAreaRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const dragArea = dragAreaRef.current;
        const input = inputRef.current;

        const handleDragOver = (e) => {
            e.preventDefault();
            dragArea.classList.add("dragover");
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            dragArea.classList.remove("dragover");
        };

        // handle drag and drop files
        const handleDrop = (e) => {
            e.preventDefault();
            dragArea.classList.remove("dragover");

            const droppedFiles = Array.from(e.dataTransfer.files);

            setFiles(droppedFiles);
            if (documentsName === "screenImages") {
                setScreenImages(droppedFiles);
            } else if (documentsName === "panCard") {
                setPanCard(droppedFiles);
            } else if (documentsName === "aadharCard") {
                setAadharCard(droppedFiles);
            }
        };

        // handle input file change
        const handleInputChange = () => {
            // files filter according to type
            const selectedFiles = Array.from(input.files);

            setFiles(selectedFiles);
            if (documentsName === "screenImages") {
                setScreenImages(selectedFiles);
            } else if (documentsName === "panCard") {
                setPanCard(selectedFiles);
            } else if (documentsName === "aadharCard") {
                setAadharCard(selectedFiles);
            }
        };

        const handleSelectClick = () => {
            input.click();
        };

        dragArea.addEventListener("dragover", handleDragOver);
        dragArea.addEventListener("dragleave", handleDragLeave);
        dragArea.addEventListener("drop", handleDrop);
        input.addEventListener("change", handleInputChange);

        // Cleanup event listeners on component unmount
        return () => {
            dragArea.removeEventListener("dragover", handleDragOver);
            dragArea.removeEventListener("dragleave", handleDragLeave);
            dragArea.removeEventListener("drop", handleDrop);
            input.removeEventListener("change", handleInputChange);
        };
    }, [files]);

    const handleDeleteFile = (index) => {
        // Ensure at least one file remains
        const filteredFiles = files.filter((_, i) => i !== index);
        setFiles(files.filter((_, i) => i !== index));
        if (documentsName === "screenImages") {
            setScreenImages(filteredFiles);
        } else if (documentsName === "panCard") {
            setPanCard(filteredFiles);
        } else if (documentsName === "aadharCard") {
            setAadharCard(filteredFiles);
        }
    };

    // preview images
    const renderImages = () => {
        const startIndex = currentPage * itemsPerPage;

        if (fileType === "pdf") {
            return files.map((item, index) => (
                <div
                    key={index}
                    className="pdf-preview flex items-center gap-2">
                    <Icon icon="mdi:file-pdf-box" width="40" height="40" />

                    <span className="text-xs">{item?.name}</span>
                    <button
                        onClick={() => handleDeleteFile(index)}
                        className="text-red-500">
                        ×
                    </button>
                </div>
            ));
        } else if (fileType === "image") {
            return files.map((file, index) => (
                <div key={index + startIndex} className="image">
                    <span onClick={() => handleDeleteFile(index + startIndex)}>
                        &times;
                    </span>
                    <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                    />
                </div>
            ));
        }
    };

    // preview next and prev
    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < files.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div
            className="card border-2 border-default-300 rounded-lg p-8"
            style={cardStyle}>
            <div className="drag-area !border-success-200 " ref={dragAreaRef}>
                <div className="flex flex-col items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler text-gray-700 icon-tabler-cloud-upload animate-pulse"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                        <path d="M9 15l3 -3l3 3" />
                        <path d="M12 12l0 9" />
                    </svg>
                    <span className="visible">
                        <span
                            className="select !text-primary underline text-sm"
                            role="button"
                            onClick={() => inputRef.current.click()}>
                            Choose {fileType}
                        </span>
                        <span className="text-default-400 text-sm">
                            {" "}
                            or drag it here{" "}
                        </span>
                    </span>
                </div>
                <span className="on-drop">
                    Drop {fileType}
                    here
                </span>
                <input
                    name="file"
                    type="file"
                    className="file"
                    multiple={isMultiplesFile}
                    ref={inputRef}
                    style={{ display: "none" }}
                    accept={allowedFiles}
                />
            </div>

            <div className="relative">
                {/* IMAGE PREVIEW CONTAINER */}
                <div className="previewContainer">{renderImages()}</div>
                {/*next and previous page image preview*/}
                <div className="flex justify-between w-full my-2 items-center">
                    {currentPage > 0 && (
                        <button
                            onClick={handlePrevPage}
                            className="absolute prev-btn left-0 mt-2  top-1/2 !rounded-lg -translate-y-1/2  !bg-opacity-50 !hover:bg-gray-600 !hover:bg-opacity-90 !text-success-500 flex items-center justify-center"
                            style={{
                                height: "78px",
                                width: "30px",
                                padding: "0px 0px",
                            }}>
                            <Icon
                                icon="solar:alt-arrow-left-linear"
                                style={{ fontSize: "30px" }} // Reduced icon size
                            />
                        </button>
                    )}
                    {(currentPage + 1) * itemsPerPage < files.length && (
                        <button
                            onClick={handleNextPage}
                            className="absolute next-btn right-0  top-1/2 mt-2 !rounded-lg -translate-y-1/2 !bg-gray-400 !bg-opacity-50 !hover:bg-gray-600 !hover:bg-opacity-90 !text-success-500 flex items-center justify-center"
                            style={{
                                height: "78px",
                                width: "30px",
                                padding: "0px 0px",
                            }}>
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                style={{ fontSize: "30px" }} // Reduced icon size
                            />
                        </button>
                    )}
                </div>
            </div>

            <div className=" flex items-center justify-between ">
                {/* Supported formats and max file size */}
                <div>
                    <span className="block text-xs text-default-400">
                        Supported formats:{" "}
                        {fileType === "image" ? ".jpeg, .png" : "pdf"} | Max
                        size: 5MB
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ImageUploader;
