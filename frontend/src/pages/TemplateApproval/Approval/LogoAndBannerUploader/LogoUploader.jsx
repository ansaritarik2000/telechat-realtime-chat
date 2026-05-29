import React, { useState } from "react";
import { Icon } from "@iconify/react"; // Import Icon from Iconify
import { useRcsBotStore } from "../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";
import { uploadFileToServer } from "../../../../services/s3FileServices/s3Services";
import toast from "react-hot-toast";

const LogoUploader = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const { setRcsBrandIcon, rcsBrandIcon } = useRcsBotStore();
    const { t } = useTranslation();

    // Handle image file selection
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
            setRcsBrandIcon({ ...rcsBrandIcon, file: file, preview: preview });
            // const brandIconResponse = await uploadFileToServer(file);
            // if (brandIconResponse.status === "SUCCESS") {
            //     const preview = brandIconResponse.data.Location;

            //     setRcsBrandIcon({ ...rcsBrandIcon, preview: preview });
            //     setImagePreview(preview);
            //     setRcsBrandIcon({ ...rcsBrandIcon, file: file });
            //     toast.success("Brand Icon uploaded successfully.");
            // } else {
            //     toast.error("Brand Icon upload failed.");
            // }
        }
    };

    // Handle removing the image preview
    const handleRemoveImage = () => {
        setImagePreview(null);
        setRcsBrandIcon({ preview: "", file: "" });
    };

    return (
        <div className="flex space-x-4">
            <div
                className={`${
                    imagePreview
                        ? "border-gray-200 border-1 dark:border-gray-600"
                        : "border-gray-300 border-2 dark:border-gray-600"
                }
                    rounded-full p-1 flex justify-center items-center relative`}
                style={{ width: "150px", height: "150px" }}>
                {imagePreview ? (
                    <div className="relative group w-full h-full ">
                        {/* Image with opacity effect */}
                        <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            className="w-full h-full object-cover rounded-full transition-opacity duration-300 group-hover:opacity-60"
                        />
                        {/* Black gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black to-black rounded-full opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>

                        {/* Delete icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Icon
                                icon="iconamoon:trash"
                                fontSize={25}
                                className="text-danger cursor-pointer"
                                onClick={handleRemoveImage}
                            />
                        </div>
                    </div>
                ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-cloud-upload animate-pulse"
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
                        <span className="text-sm">{t("Brand Icon")}</span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </label>
                )}
            </div>
        </div>
    );
};

export default LogoUploader;
