import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify-icon/react";
import WhatsAppTemplateCard from "./WhatsAppTemplateCard";
import { useSendWhatsappStore } from "../../../../store/whatsapp/whatsappStore";

const WhatsappCard = ({ template, selected }) => {
  const { setSelectedSendTemplate } = useSendWhatsappStore();
  const { t } = useTranslation();

  // select template
  const selectTemplateHandller = (name, template_id) => {
    setSelectedSendTemplate({
      name: name,
      template_id: template_id,
    });
  };

  return (
    <>
      {/* Main Div */}
      <div className="border border-success-300  gap-2 shadow-inner rounded-lg p-6 bg-success-50 flex flex-col justify-between h-full">
        <WhatsAppTemplateCard
          title={template?.card_heading}
          description={template?.card_subheading}
          action_buttons={template?.action_buttons}
          imageUrl={template?.imageUrl}
        />

        {/* Template Name & Button */}
        <div className="flex flex-col items-center  gap-2  w-full mx-auto">
          {/* Template Name */}

          <h1 className="text-sm text-black-500">{template?.name}</h1>
          <div className="flex gap-1 items-center text-xs text-default-500">
            <div>Marketing</div>{" "}
            <Icon icon="tabler:point-filled" width="12" height="12" />
            <div>en</div>
          </div>

          {/* Select Button */}
          <Button
            size="sm"
            color="success"
            variant="flat"
            startContent={
              selected ? (
                <>
                  <Icon icon="lets-icons:check-fill" width="20" height="20" />
                  {/* <Icon
                                        icon="gg:check-o"
                                        height={18}
                                        width={18}
                                    /> */}
                </>
              ) : null
            }
            radius="sm"
            className="w-full"
            onPress={() => selectTemplateHandller(template?.name, template?.id)}
          >
            {selected ? t("Selected") : t("Select")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default WhatsappCard;
