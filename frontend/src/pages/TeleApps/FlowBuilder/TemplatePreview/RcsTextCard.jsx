import { useEffect, useState } from "react";
import { Button, Chip } from "@heroui/react";
import { usePreviewTemplateStore } from "../../../../store/automationFlowStore/previewModal";
import TextMessageCard from "../../../RCS/SendRCS/Mockups/TextMessageCard";
import { useThemeStore } from "../../../../store/themeStore";
import { useRcsFlowStore } from "../../../../store/automationFlowStore/rcsFlowStore";
import { Icon } from "@iconify-icon/react";
import { getTemplateWithDetails } from "../../../../services/Rcs/rcsTemplateService";
import { useTranslation } from "react-i18next";

const RcsTextCard = ({
  template,
  templateType,
  selected,
  modelClose = true,
}) => {
  const { setVisible } = usePreviewTemplateStore();
  const { selectedTemplate, setSelectedTemplate } = useRcsFlowStore();
  const [message, setMessage] = useState({});
  const { t } = useTranslation();

  //   Close modal
  const closeModal = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (template.id) {
      // fetch template details
      const fetchTemplateDetails = async () => {
        // this function is called for get sms template in details
        const data = await getTemplateWithDetails(template.id);

        if (data) {
          setMessage({
            content:
              data.template_contents &&
              data.template_contents.length &&
              data.template_contents[0].message,

            messageActions:
              data?.template_contents &&
              data?.template_contents[0]?.action_buttons,
          });
        }
      };
      fetchTemplateDetails();
    }
  }, [template]);

  // select template
  const selectTemplateHandller = (name, id, template_id) => {
    setSelectedTemplate({
      name: name,
      id: id,
      template_id: template_id,
    });
    modelClose && closeModal();
  };

  const { theme } = useThemeStore();
  // dark mode
  const isDarkMode = theme === "dark";

  return (
    <div className="  flex flex-col  ">
      {/* Message Preview */}
      <div className="border-2 border-default  p-4 h-full border-b-0 rounded-tr-lg rounded-tl-lg">
        <TextMessageCard isDarkMode={isDarkMode} message={message} />
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
            startContent={
              selected ? (
                <>
                  <Icon icon="lets-icons:check-fill" width="20" height="20" />
                </>
              ) : null
            }
            onClick={() =>
              selectTemplateHandller(
                template?.name,
                template?.id,
                template?.template_id
              )
            }
          >
            {selected ? t("Selected") : t("Select")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RcsTextCard;
