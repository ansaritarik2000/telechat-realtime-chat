import React, { useEffect, useState } from "react";
import ImageCarousel from "../../../RCS/SendRCS/Mockups/ImageCarousel";
import { Button } from "@heroui/react";
import { getTemplateWithDetails } from "../../../../services/Rcs/rcsTemplateService";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify-icon/react";
import { usePreviewTemplateStore } from "../../../../store/automationFlowStore/previewModal";
import { useRcsFlowStore } from "../../../../store/automationFlowStore/rcsFlowStore";

export default function Carousel({ item, selected, modelClose = true }) {
  const [carouselTemplate, setCarouselTemplate] = useState();
  const { t } = useTranslation();
  const { setVisible } = usePreviewTemplateStore();
  const { setSelectedTemplate } = useRcsFlowStore();

  //   Close modal
  const closeModal = () => {
    setVisible(false);
  };
  // This useeffect  is call rcs templates in details based on
  useEffect(() => {
    if (item.id) {
      const fetchTemplates = async (id) => {
        const data = await getTemplateWithDetails(id);
        if (data) {
          setCarouselTemplate(data);
        }
      };

      fetchTemplates(item.id);
    }
  }, [item.id]);

  // select template
  const selectTemplateHandller = (name, id, template_id) => {
    setSelectedTemplate({
      name: name,
      id: id,
      template_id: template_id,
    });
    modelClose && closeModal();
  };

  return (
    <div className="border border-primary-300 gap-2 shadow-inner rounded-lg p-6 flex flex-col justify-between h-full">
      <ImageCarousel items={carouselTemplate?.template_contents} />

      {/* Template Name & Button */}
      <div className="flex flex-col items-center  gap-2  w-full mx-auto">
        {/* Template Name */}

        <h1 className="text-sm text-default-500">{carouselTemplate?.name}</h1>

        {/* Select Button */}
        <Button
          onPress={() =>
            selectTemplateHandller(
              carouselTemplate?.name,
              carouselTemplate?.id,
              carouselTemplate?.template_id || carouselTemplate?.name
            )
          }
          startContent={
            selected ? (
              <>
                <Icon icon="lets-icons:check-fill" width="20" height="20" />
              </>
            ) : null
          }
          size="sm"
          color="primary"
          variant="flat"
          radius="sm"
          className="w-full"
        >
          {selected ? t("Selected") : t("Select")}
        </Button>
      </div>
    </div>
  );
}
