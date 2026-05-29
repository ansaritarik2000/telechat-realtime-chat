import React, { lazy, Suspense, useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import TempName from "../TempName/TempName";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";
import { getTemplateTypes } from "../../../../../services/Rcs/rcsTemplateService";
import toast from "react-hot-toast";

// Lazy loading template components
const SingleImg = lazy(() => import("../SingleImage/SingleImg"));
const ImgCarousel = lazy(() => import("../ImageCarousel/ImgCarousel"));
const Text = lazy(() => import("../TextTemp/Text"));
const SingleVideo = lazy(() => import("../SingleVideo/SingleVIdeo"));

export default function TempType() {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);

  const {
    selectedTemplateType,
    setSelectedTemplateType,
    setTextMessageContent,
    setSingleImageContent,
    setCarouselItems,
    setVideoContent,
    // fall back text
    setFallbackText,
    setFallbackTextVariables,
  } = useTemplateStore();

  // this function is used for get template types
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplateTypes();
        setTemplates(data);
      } catch (error) {
        toast.error("Error fetching template types:", error);
      }
    };
    fetchTemplates();
  }, []);

  // Render selected template component based on selectedTemplate state
  const renderTemp = () => {
    switch (selectedTemplateType) {
      case "singleimg":
        return <SingleImg />;
      case "video":
        return <SingleVideo />;
      case "imgcarousel":
        return <ImgCarousel />;
      case "text_message":
        return <Text />;
      default:
        return null;
    }
  };

  // reset template type
  const onTemplateTypeChangeHandller = (e) => {
    setSelectedTemplateType(e.target.value);
    setFallbackText("");
    setFallbackTextVariables([]);
    setTextMessageContent({
      textMessage: "",
      variables: [],
      buttons: [
        {
          id: 1,
          suggestionType: "reply",
          displayText: "Stop",
          postback: "Stop",
        },
      ],
    });
    setSingleImageContent({
      title: "",
      description: "",
      imageUrl: "",
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
    });

    setVideoContent({
      title: "",
      description: "",
      titleVariables: [],
      descriptionVariables: [],
      videoFile: "",
      thumbnailUrl: "",
      buttons: [
        {
          id: 1,
          suggestionType: "reply",
          displayText: "Stop",
          postback: "Stop",
        },
      ],
    });

    setCarouselItems([
      {
        id: 1,
        title: "",
        titleVariables: [],
        descriptionVariables: [],
        description: "",
        imageUrl: "",
        buttons: [
          {
            id: 1,
            suggestionType: "reply",
            displayText: "Stop",
            postback: "Stop",
          },
        ],
      },
    ]);
  };

  return (
    <div>
      <div className="flex gap-2">
        {/* Template Type */}
        <Select
          isRequired
          label={t("Select a template")}
          placeholder={t("Select a template")}
          // defaultSelectedKeys={[selectedTemplateType]}
          // value={selectedTemplateType}
          onChange={onTemplateTypeChangeHandller}
          className="w-1/2"
          radius="sm"
        >
          {templates?.map((template) => (
            <SelectItem key={template?.value} value={template?.value}>
              {t(template?.name)}
            </SelectItem>
          ))}
        </Select>

        <div className="w-1/2">
          <TempName />
        </div>
      </div>

      {/* Render Selected Template */}
      <div className="py-4">
        <Suspense fallback={<div>Loading template...</div>}>
          {renderTemp()}
        </Suspense>
      </div>
    </div>
  );
}
