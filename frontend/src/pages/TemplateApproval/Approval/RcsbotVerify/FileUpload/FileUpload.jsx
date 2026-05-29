import React from "react";
import ImageUploader from "./ImageUploader";

export default function FileUpload({
    fileType,
    allowedFiles,
    isMultiplesFile,
    documentsName,
}) {
    return (
        <div className={`flex justify-between gap-4 w-full`}>
            {/*  ImageUploader */}
            <div className={"w-full"}>
                <ImageUploader
                    fileType={fileType}
                    allowedFiles={allowedFiles}
                    documentsName={documentsName}
                    isMultiplesFile={isMultiplesFile}
                />
            </div>
        </div>
    );
}
