import { useEffect, useState } from "react";
import { Select, SelectItem, Button, Checkbox, cn } from "@heroui/react";
import { usePreviewTemplateStore } from "../../../../store/automationFlowStore/previewModal";
import { getAllTemplateTypesSerivce } from "../../../../services/Sms/smsTemplateService";
import SelectTemplateButton from "./SelectTemplateButton";
import { useSmsFlowStore } from "../../../../store/automationFlowStore/smsFlowStore";
import CommonHeader from "./CommonHeader";
import { useTranslation } from "react-i18next";

export default function SMS({ routeBack, nodeId }) {
  const {
    selectedTemplateType,
    setSelectedTemplateType,
    sendAsFlashSMS,
    setSendAsFlashSMS,
  } = useSmsFlowStore();
  const [templateTypes, setTemplateTypes] = useState([]);
  const { t } = useTranslation();

  // Fetch template types on component mount
  useEffect(() => {
    const fetchTemplateTypes = async () => {
      try {
        const data = await getAllTemplateTypesSerivce();
        if (data && data.length > 0) {
          setTemplateTypes(data);
        }
      } catch (error) {
        console.error("Error fetching template types:", error);
      }
    };
    fetchTemplateTypes();
  }, []);

  const { setVisible, setType } = usePreviewTemplateStore();

  // open preview modal template
  const openTemplateModal = (type) => {
    setVisible(true);
    setType(type);
  };

  // Handle selection change to store both id and name
  const handleTemplateTypeChange = (selectedValue) => {
    const selectedTemplateId = [...selectedValue][0];
    const selectedTemplate = templateTypes.find(
      (type) => type.id === selectedTemplateId
    );

    if (selectedTemplate) {
      setSelectedTemplateType({
        id: selectedTemplate.id,
        name: selectedTemplate.name,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full ">
      <CommonHeader name={"SMS"} nodeId={nodeId} routeBack={routeBack} />

      {/* Sender ID Selector */}
      <Select
        aria-label="Sender ID"
        placeholder={"Sender ID"}
        label="Select Sender ID"
        className="w-full"
        variant="flat"
        radius="sm"
        size="sm"
      >
        <SelectItem key="1">+917330506200</SelectItem>
        <SelectItem key="2">+917330506201</SelectItem>
      </Select>

      {/* Select Template Type */}
      <Select
        aria-label="Select Template Type"
        isRequired
        label={t("Select Template Type")}
        labelPlacement="outside"
        placeholder=" "
        onSelectionChange={handleTemplateTypeChange}
        value={selectedTemplateType?.id || ""}
        className="w-full"
        variant="flat"
        color="default"
        radius="sm"
        size="md"
      >
        {templateTypes.map((type) => (
          <SelectItem key={type.id} value={type.id}>
            {t(type.name)}
          </SelectItem>
        ))}
      </Select>

      {/* Template Preview */}
      <SelectTemplateButton
        openTemplateModal={openTemplateModal}
        templateType={"sms"}
      />
    </div>
  );
}
