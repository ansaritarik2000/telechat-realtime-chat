import { useEffect, useState } from "react";
import { Button, Chip, Divider } from "@heroui/react";
import RichCard from "../../../RCS/SendRCS/Mockups/RichCard";
import { getTemplateWithDetails } from "../../../../services/Rcs/rcsTemplateService";
import { usePreviewTemplateStore } from "../../../../store/automationFlowStore/previewModal";
import { useRcsFlowStore } from "../../../../store/automationFlowStore/rcsFlowStore";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify-icon/react";

const RCSCard = ({ template, selected, modelClose = true }) => {
    const [templateCardContent, setTemplateCardCotent] = useState();
    const { t } = useTranslation();
    const { setVisible } = usePreviewTemplateStore();
    const { setSelectedTemplate } = useRcsFlowStore();

    //   Close modal
    const closeModal = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (template.id) {
            const fetchTemplateDetails = async () => {
                // this function is called for get sms template in details
                const responseData = await getTemplateWithDetails(template.id);

                setTemplateCardCotent(
                    responseData?.template_contents &&
                        responseData?.template_contents.length > 0 &&
                        responseData?.template_contents[0]
                );
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

        if (modelClose) {
            closeModal();
        }
    };

    return (
        <>
            {/* Main Div */}
            <div className="border border-primary-300 gap-2 shadow-inner rounded-lg p-6  flex flex-col justify-between h-full">
                <RichCard
                    title={templateCardContent?.card_heading}
                    description={templateCardContent?.card_subheading}
                    action_buttons={templateCardContent?.action_buttons}
                    imageUrl={templateCardContent?.imageUrl}
                />

                {/* Template Name & Button */}
                <div className="flex flex-col items-center  gap-2  w-full mx-auto">
                    {/* Template Name */}

                    <h1 className="text-sm text-default-500">
                        {template.name}
                    </h1>

                    {/* Select Button */}
                    <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        radius="sm"
                        startContent={
                            selected ? (
                                <>
                                    <Icon
                                        icon="lets-icons:check-fill"
                                        width="20"
                                        height="20"
                                    />
                                </>
                            ) : null
                        }
                        className="w-full"
                        onClick={() =>
                            selectTemplateHandller(
                                template?.name,
                                template?.id,
                                template?.template_id
                            )
                        }>
                        {selected ? t("Selected") : t("Select")}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default RCSCard;
