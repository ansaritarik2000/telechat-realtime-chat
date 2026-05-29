import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import LogoUploader from "../LogoAndBannerUploader/LogoUploader";
import BannerUploader from "../LogoAndBannerUploader/BannerUploader";
import { useTranslation } from "react-i18next";

const upIcon = (
  <Icon icon="ant-design:cloud-upload-outlined" width="1.2em" height="1.2em" />
);

export default function FileUpload(props) {
  const { t } = useTranslation();
  const { label = "Click here", onChange } = props;

  const handleFileChange = (event) => {
    if (onChange) {
      onChange(event.target.files);
    }
  };

  return (
    <div className="flex justify-between w-full">
      <div className="flex flex-col gap-2 justify-center items-center w-full">
        {/* Logo Uploader */}
        <LogoUploader />

        <p
          class="text-center text-xs text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          <span className="block">
            {t("Supported formats")}: jpeg, jpg, png
          </span>
          <span className="block ">{t("Dimension")}: 224x224 px</span>
          <span className="block ">{t("Max size")}: 50Kb</span>
        </p>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center w-full">
        {/* Banner Uploader */}
        <BannerUploader bannerType="rcsbot" />
        <p
          class="text-center text-xs text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          <span className="block">
            {t("Supported formats")}: jpeg, jpg, png
          </span>
          <span className="block">
            {t("Dimension")}: 1440x448 {t("px")}
          </span>

          <span className="block">{t("Max size")}: 200Kb</span>
        </p>
      </div>
    </div>
  );
}
