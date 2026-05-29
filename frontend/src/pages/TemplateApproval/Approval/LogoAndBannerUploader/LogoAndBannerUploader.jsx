import React from "react";
import LogoUploader from "./LogoUploader";
import BannerUploader from "./BannerUploader";

const LogoAndBannerUploader = () => {
    return (
        <div className="flex justify-between items-center">
            <LogoUploader />
            <BannerUploader />
        </div>
    );
};

export default LogoAndBannerUploader;
