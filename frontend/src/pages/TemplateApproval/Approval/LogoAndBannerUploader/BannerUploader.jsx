import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
    useRcsBotStore,
    useTemplateStore,
} from "../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/react";
import { uploadFileToServer } from "../../../../services/s3FileServices/s3Services";
import toast from "react-hot-toast";

const BannerUploader = ({
    bannerType = "",
    labelName = "Brand Banner",
    height = "h-[150px]",
    width = "w-[400px]",
    className = "",
}) => {
    const [imagePreview, setImagePreview] = useState(null);
    const { setRcsBrandBanner, rcsBrandBanner } = useRcsBotStore();
    const { selectedTemplateType, videoContent, setVideoContent } =
        useTemplateStore();
    const { t } = useTranslation();

    // Handle image file selection
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (selectedTemplateType === "video") {
                if (file?.size > 2 * 1024 * 1024) {
                    window.alert("thumbnail size should not exceed 2MB.");
                    return;
                }
            }

            // for brand banner upload file
            if (labelName === "Brand Banner") {
                // const brandBannerResponse = await uploadFileToServer(file);
                // if (brandBannerResponse.status === "SUCCESS") {
                //     setRcsBrandBanner({
                //         ...rcsBrandBanner,
                //         preview: brandBannerResponse.data.Location,
                //     });
                //     toast.success("Brand Banner uploaded successfully.");
                // }
                const preview = URL.createObjectURL(file);
                setRcsBrandBanner({
                    ...rcsBrandBanner,
                    file: file,
                    preview: preview,
                });
            }

            // this is used for preview image
            const reader = new FileReader();
            reader.onload = () => {
                const preview = reader.result;
                setImagePreview(reader.result);
                // this is set video thumbnail
                if (selectedTemplateType === "video") {
                    setVideoContent({
                        ...videoContent,
                        thumbnailFile: file,
                        thumbnailUrl: preview,
                    });
                }
            };
            reader.readAsDataURL(file);

            // this is used for set image file
            // setRcsBrandBanner({ ...rcsBrandBanner, file: file });
        }
    };
    console.log("rcsBrandBanner", rcsBrandBanner);

    // Handle removing the image preview
    const handleRemoveImage = () => {
        setImagePreview(null);
        setRcsBrandBanner({ preview: "", file: "" });
        // remove video thumbnail if template type video
        if (selectedTemplateType === "video") {
            setVideoContent({ ...videoContent, thumbnailUrl: "" });
        }
    };

    // Combined class names (Tailwind CSS should handle this)
    const containerClasses = `rounded-lg  flex justify-center items-center relative w-full h-full ${className} `;

    const bannerTypeClasses = bannerType == "rcsbot" ? "pt-10" : "pt-0";

    const handleFileUpload = async () => {
        if (selectedTemplateType === "video") {
            const response = await uploadFileToServer(
                videoContent?.thumbnailFile
            );
            toast.success("File uploaded successfully.");
            if (response.status === "SUCCESS") {
                setVideoContent({
                    ...videoContent,
                    thumbnailUploadedUrl: response.data.Location,
                });
            } else {
                toast.error("File upload failed.");
            }
        }
    };

    return (
        <div
            className={
                "p-8 pt-10 border-2 border-default-300 h-full  flex flex-col gap-4 w-full rounded-lg "
            }>
            <div className={containerClasses + "h-[10em]"}>
                {imagePreview ? (
                    <div className="relative group w-full ">
                        {/* Image with opacity effect */}
                        <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            className="w-full h-full object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-60"
                        />
                        {/* Black gradient overlay */}
                        <div className="absolute inset-0 bg-black/10 rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>

                        {/* Delete icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Icon
                                icon="iconamoon:trash"
                                fontSize={30}
                                className="text-danger cursor-pointer"
                                onClick={handleRemoveImage}
                            />
                        </div>
                    </div>
                ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-cloud-upload animate-pulse "
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
                        {bannerType != "rcsbot" ? (
                            <span className="text-sm ">
                                <span className="select !text-primary underline text-sm">
                                    Choose thumbnail
                                </span>{" "}
                                or drag it here{" "}
                            </span>
                        ) : (
                            <span className="text-sm "> {labelName} </span>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </label>
                )}
            </div>

            {/* Footer */}
            {labelName != "Brand Banner" && (
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-default-400">
                            Supported formats: .jpeg, .png | Max size: 2MB
                        </span>
                        <span className="text-xs text-default-400">
                            Resolution: 3:4 & 250x330 px
                        </span>
                    </div>

                    {/* Button */}
                    <Button
                        size="sm"
                        radius="sm"
                        variant="flat"
                        color="success"
                        onPress={handleFileUpload}>
                        Upload{" "}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BannerUploader;
