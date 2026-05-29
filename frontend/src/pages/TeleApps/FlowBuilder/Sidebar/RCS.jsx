import { useEffect, useState } from "react";
import { Select, SelectItem, RadioGroup, Radio } from "@heroui/react";
import { usePreviewTemplateStore } from "../../../../store/automationFlowStore/previewModal";
import CommanHeader from "./CommonHeader";
import { getRCSBots } from "../../../../services/Rcs/rcsBotService";
import { getTemplateTypes } from "../../../../services/Rcs/rcsTemplateService";
import SelectTemplateButton from "./SelectTemplateButton";
import { useRcsFlowStore } from "../../../../store/automationFlowStore/rcsFlowStore";
import { useNodeId, useReactFlow } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import WaitForResponseSwitch from "./Common/WaitForResponse";
import DirectMessageComponent from "./Common/DirectMessage";

export default function RCS({ routeBack, nodeId }) {
    const {
        selectedBot,
        setSelectedBot,
        selectedTemplateType,
        setSelectedTemplateType,
    } = useRcsFlowStore();

    const [bots, setBots] = useState([]);
    const [templateTypes, setTemplateTypes] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState("");
    const [messageMode, setMessageMode] = useState("approved_templates");
    const [messageType, setMessageType] = useState("");
    const { t } = useTranslation();

    // Handle selection change to store both id and name
    const handleTemplateTypeChange = (selectedValue) => {
        const selectedTemplateId = [...selectedValue][0];
        const selectedTemplate = templateTypes.find(
            (type) => type.id === parseInt(selectedTemplateId)
        );

        if (selectedTemplate) {
            setSelectedTemplateType({
                id: selectedTemplate.id,
                name: selectedTemplate.name,
            });
        }
    };

    // Handle selection change to store both id and name
    const handleBotChange = (selectedValue) => {
        const selectedBotId = [...selectedValue][0];
        const selectedBot = bots.find(
            (bot) => bot.id === parseInt(selectedBotId)
        );

        if (selectedBot) {
            setSelectedBot({
                id: selectedBot.id,
                name: selectedBot.name,
            });
        }
    };

    // Fetch all bots and template types on component mount
    useEffect(() => {
        const fetchBots = async () => {
            try {
                const data = await getRCSBots();
                setBots(data);
            } catch (error) {
                console.error("Error fetching bots:", error);
            }
        };
        const fetchTemplateTypes = async () => {
            try {
                const data = await getTemplateTypes();
                setTemplateTypes(data);
            } catch (error) {
                console.error("Error fetching template types:", error);
            }
        };

        fetchBots();
        fetchTemplateTypes();
    }, []);

    const { setVisible, setType } = usePreviewTemplateStore();

    // open preview modal template
    const openTemplateModal = (type) => {
        setVisible(true);
        setType(type);
    };

    return (
        <div className="flex flex-col gap-6 w-full ">
            <CommanHeader name={"RCS"} nodeId={nodeId} routeBack={routeBack} />
            {/* Select Route */}
            <Select
                aria-label="Select Bot"
                isRequired
                label={t("Select RCS Bot")}
                labelPlacement="outside"
                placeholder=" "
                onSelectionChange={handleBotChange}
                value={selectedBot?.id || ""}
                className="w-full"
                variant="flat"
                color="default"
                radius="sm"
                size="md"
            >
                {bots.map((bot) => (
                    <SelectItem key={bot.id}>{bot.name}</SelectItem>
                ))}
            </Select>

            {/* Message Mode Radio Selector */}
            <RadioGroup
                size="sm"
                // label={t("Message Mode")}
                orientation="horizontal"
                value={messageMode}
                onValueChange={setMessageMode}
            >
                <Radio value="approved_templates">
                    {t("Approved Templates")}
                </Radio>
                <Radio value="direct_message">{t("Direct Message")}</Radio>
            </RadioGroup>

            {/* Conditional rendering based on message mode */}
            {messageMode === "approved_templates" ? (
                <>
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
                        {templateTypes.map((templateType) => (
                            <SelectItem key={templateType.id}>
                                {t(templateType.name)}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* Template Preview */}
                    <SelectTemplateButton
                        openTemplateModal={openTemplateModal}
                        templateType={"rcs"}
                    />
                </>
            ) : (
                <DirectMessageComponent nodeId={nodeId} />
            )}

            {/* Wait for User Response Switch */}

            <WaitForResponseSwitch />
        </div>
    );
}
