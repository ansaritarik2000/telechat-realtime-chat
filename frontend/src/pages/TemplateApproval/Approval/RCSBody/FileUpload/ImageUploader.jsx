import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { useRcsStore } from "../../../../../store/rcsStore";
import toast from "react-hot-toast";
import { uploadFileToServer } from "../../../../../services/s3FileServices/s3Services";

function ImageUploader({ cardStyle }) {
    const [files, setFiles] = useState([]);
    const { setCurrentSlide } = useRcsStore();

    const {
        selectedTemplateType,
        singleImageContent,
        setSingleImageContent,
        setCarouselItems,
        carouselItems,
        setVideoContent,
        videoContent,
    } = useTemplateStore();

    // this is for show preview image
    const [currentPage, setCurrentPage] = useState(0); // Track current page
    const itemsPerPage = 4; // Set the number of items to display per page

    const dragAreaRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (selectedTemplateType === "imgcarousel") {
            const newCarouselItems = files?.map((file, index) => {
                return {
                    id: index + 1,
                    title: "",
                    description: "",
                    imageUrl: URL.createObjectURL(file),
                    imageFile: file,
                    titleVariables: [],
                    descriptionVariables: [],
                    buttons: [
                        {
                            id: 1,
                            suggestionType: "reply",
                            displayText: "Stop",
                            postback: "Stop",
                        },
                    ],
                };
            });
            setCarouselItems(newCarouselItems);
        }
        setCurrentSlide(0);
    }, [files]);

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

            // files filter according to type
            const newFiles = droppedFiles.filter((file) =>
                selectedTemplateType === "video"
                    ? file.type.split("/")[0] === "video"
                    : file.type.split("/")[0] === "image" &&
                      !files.some((e) => e.name === file.name)
            );

            // files condition check
            if (selectedTemplateType === "singleimg" && newFiles.length > 1) {
                window.alert("Only one image can be uploaded.");
                return;
            } else if (
                selectedTemplateType === "singleimg" &&
                files.length > 0
            ) {
                window.alert("Only one image is allowed.");
                return;
            } else if (
                selectedTemplateType === "video" &&
                newFiles.length > 1
            ) {
                window.alert("Only one video can be uploaded.");
                return;
            } else if (
                selectedTemplateType === "video" &&
                newFiles[0]?.size > 10 * 1024 * 1024
            ) {
                window.alert("Video size should not exceed 10MB.");
                return;
            }

            // maximum 10 files are allowed
            else if (newFiles?.length > 10) {
                window.alert("Maximum 10 files are allowed.");
                return;
            } else if (newFiles.length > 0) {
                // this is set image for single image
                if (selectedTemplateType === "singleimg") {
                    setSingleImageContent({
                        ...singleImageContent,
                        imageUrl: URL.createObjectURL(newFiles[0]),
                        imageFile: newFiles[0],
                    });
                }
                // this is set video file
                else if (selectedTemplateType === "video") {
                    setVideoContent({
                        ...videoContent,
                        videoFile: newFiles[0],
                    });
                }

                setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            }
        };

        // handle input file change
        const handleInputChange = () => {
            // files filter according to type
            const selectedFiles = Array.from(input.files);
            const newFiles = selectedFiles.filter((file) =>
                selectedTemplateType === "video"
                    ? file.type.split("/")[0] === "video"
                    : file.type.split("/")[0] === "image" &&
                      !files.some((e) => e.name === file.name)
            );

            // single image condition check
            if (selectedTemplateType === "singleimg" && newFiles.length > 1) {
                window.alert("Only one image can be uploaded.");
                return;
            }

            // video condition check
            else if (selectedTemplateType === "video" && newFiles.length > 1) {
                window.alert("Only one video can be uploaded.");
                return;
            } else if (
                selectedTemplateType === "video" &&
                newFiles[0]?.size > 10 * 1024 * 1024
            ) {
                window.alert("Video size should not exceed 10MB.");
                return;
            } else if (
                selectedTemplateType === "singleimg" &&
                files.length > 0
            ) {
                window.alert("Only one image is allowed.");
                return;
            }

            // maximum 10 files are allowed
            else if (newFiles?.length > 10) {
                window.alert("Maximum 10 files are allowed.");
                return;
            } else if (newFiles.length > 0) {
                // this is set image for single image
                if (selectedTemplateType === "singleimg") {
                    setSingleImageContent({
                        ...singleImageContent,
                        imageUrl: URL.createObjectURL(newFiles[0]),
                        imageFile: newFiles[0],
                    });
                }
                // this is set video file
                else if (selectedTemplateType === "video") {
                    setVideoContent({
                        ...videoContent,
                        videoFile: newFiles[0],
                    });
                }

                setFiles((prevFiles) => [...prevFiles, ...newFiles]);
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

    const handleDeleteImage = (index) => {
        // Ensure at least one file remains
        setFiles(files.filter((_, i) => i !== index));

        if (selectedTemplateType === "singleimg") {
            setSingleImageContent({
                ...singleImageContent,
                imageUrl: "",
                imageFile: "",
            });
        }
        if (selectedTemplateType === "video") {
            setVideoContent({
                ...videoContent,
                videoFile: "",
            });
        }
        // else if (selectedTemplateType === "imgcarousel") {
        //     setCarouselItems(carouselItems?.filter((_, i) => i !== index));
        // }
    };

    // preview images
    const renderImages = () => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        if (selectedTemplateType === "singleimg") {
            return singleImageContent.imageUrl ? (
                <div className="image">
                    <span onClick={() => handleDeleteImage(0)}>&times;</span>
                    <img src={singleImageContent.imageUrl} alt={`Preview 1`} />
                </div>
            ) : (
                <></>
            );
        } else if (selectedTemplateType === "video") {
            return videoContent?.videoFile ? (
                <div className="my-1">
                    <span>{videoContent.videoFile.name}</span>
                    <span
                        onClick={() => handleDeleteImage(0)}
                        className="text-red-500 text-2xl ml-1 p-1  cursor-pointer">
                        &times;
                    </span>
                </div>
            ) : (
                <></>
            );
        } else if (selectedTemplateType === "imgcarousel") {
            return carouselItems
                ?.slice(startIndex, endIndex)
                .map((item, index) => (
                    <div key={index + startIndex} className="image">
                        <span
                            onClick={() =>
                                handleDeleteImage(index + startIndex)
                            }>
                            &times;
                        </span>
                        <img src={item.imageUrl} alt={`Preview ${index}`} />
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

    // this function is used for upload files on server
    const handleFileUpload = async () => {
        if (selectedTemplateType === "singleimg") {
            const response = await uploadFileToServer(
                singleImageContent?.imageFile
            );
            toast.success("File uploaded successfully.");
            if (response.status === "SUCCESS") {
                setSingleImageContent({
                    ...singleImageContent,
                    mediaUrl: response.data.Location,
                });
            } else {
                toast.error("File upload failed.");
            }
        } else if (selectedTemplateType === "video") {
            const response = await uploadFileToServer(videoContent?.videoFile);
            toast.success("File uploaded successfully.");
            if (response.status === "SUCCESS") {
                setVideoContent({
                    ...videoContent,
                    mediaUrl: response.data.Location,
                });
            } else {
                toast.error("File upload failed.");
            }
        } else if (selectedTemplateType === "imgcarousel") {
            const imageCarouselUpload = carouselItems.map(async (item) => {
                const response = await uploadFileToServer(item?.imageFile);

                if (response.status === "SUCCESS") {
                    item.mediaUrl = response.data.Location;
                } else {
                    toast.error("File upload failed.");
                }
            });
            Promise.all(imageCarouselUpload).then(() => {
                setCarouselItems(carouselItems);
            });
            toast.success("File uploaded successfully.");
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
                            Choose{" "}
                            {selectedTemplateType === "video"
                                ? "video"
                                : "image"}
                        </span>
                        <span className="text-default-400 text-sm">
                            {" "}
                            or drag it here{" "}
                        </span>
                    </span>
                </div>
                <span className="on-drop">
                    Drop {selectedTemplateType === "video" ? "video" : "image"}{" "}
                    here
                </span>
                <input
                    name="file"
                    type="file"
                    className="file"
                    multiple={selectedTemplateType === "imgcarousel"}
                    ref={inputRef}
                    style={{ display: "none" }}
                    accept={
                        selectedTemplateType === "video" ? "video/*" : "image/*"
                    }
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
                        {selectedTemplateType === "video"
                            ? ".mp4, .m4v"
                            : ".jpeg, .png"}{" "}
                        | Max size:{" "}
                        {selectedTemplateType === "video" ? "10MB" : "2MB"}
                    </span>
                    <span className="block text-xs text-default-400">
                        Horizontal orientation: 3:4 and{" "}
                        {selectedTemplateType === "video"
                            ? "768x1024"
                            : "768x1024"}
                    </span>
                </div>
                {/* Button */}
                <Button
                    size="sm"
                    radius="sm"
                    type="submit"
                    variant="flat"
                    color="success"
                    onPress={handleFileUpload}
                    //   className="text-white"
                >
                    Upload
                </Button>
            </div>
        </div>
    );
}

export default ImageUploader;
