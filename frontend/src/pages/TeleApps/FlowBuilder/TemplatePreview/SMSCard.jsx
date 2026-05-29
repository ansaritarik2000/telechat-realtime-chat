import { Button, Chip } from "@heroui/react";
import { usePreviewTemplateStore } from "../../../../store/automationFlowStore/previewModal";
import { useSmsFlowStore } from "../../../../store/automationFlowStore/smsFlowStore";
import { useTranslation } from "react-i18next";

const SMSCard = ({ template, templateType }) => {
  const { setVisible } = usePreviewTemplateStore();
  const { t } = useTranslation();
  const { selectedTemplate, setSelectedTemplate } = useSmsFlowStore();
  //   Close modal
  const closeModal = () => {
    setVisible(false);
  };

  console.log("selectedTemplate", selectedTemplate);
  // select template
  const selectTemplateHandller = (name, template_id) => {
    setSelectedTemplate({
      name: name,
      template_id: template_id,
    });
    closeModal();
  };

  return (
    <div className="  flex flex-col  ">
      {/* Message Preview */}
      <div className="border-2 border-default p-4 h-full border-b-0 rounded-tr-lg rounded-tl-lg">
        <div className="bg-primary-50 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl p-4 ">
          <p className="text-xs">{template?.message}</p>
        </div>
      </div>

      {/* Template Name & Button */}
      <div className="mt-auto flex flex-col gap-2 bg-content2 px-4 py-3 rounded-br-lg rounded-bl-lg">
        {/* Template Name */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-0">
            <p className="text-sm text-default-500 font-semibold">
              {template?.name}
            </p>
            <span className="text-xs text-default-400">{templateType}</span>
          </div>

          {/* Select Button */}
          <Button
            size="sm"
            radius="sm"
            variant="flat"
            color="primary"
            className=" mt-2"
            onPress={() =>
              selectTemplateHandller(template.name, template.template_id)
            }
          >
            {t("Select")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SMSCard;
