import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import BannerUploader from "../../LogoAndBannerUploader/BannerUploader";

export default function FileUpload() {
    const [selectedFile, setSelectedFile] = useState("image");
    const { selectedTemplateType } = useTemplateStore();

    // Function to handle change in Select component
    const handleSelectedFile = (newValue) => {
        setSelectedFile(newValue);
    };

    return (
        <div
            className={`flex justify-between gap-4 ${
                selectedTemplateType === "video" ? "videoAndBannerUploader" : ""
            } w-full`}>
            {/*  ImageUploader */}
            <div
                className={`${
                    selectedTemplateType === "video" ? "w-1/2" : "w-full"
                }`}>
                <ImageUploader
                    cardStyle={
                        selectedTemplateType === "video"
                            ? { marginTop: 0, boxShadow: "none" }
                            : {}
                    }
                />
            </div>

            {/* BannerUploader for video */}
            {selectedTemplateType === "video" && (
                <div className="w-1/2">
                    <BannerUploader
                        labelName="Drag & drop thumbnail here"
                        className="videoThumbnail"
                    />
                </div>
            )}
        </div>
    );
}
