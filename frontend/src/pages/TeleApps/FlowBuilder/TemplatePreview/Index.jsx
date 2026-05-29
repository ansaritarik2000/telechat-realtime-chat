import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Image,
    ScrollShadow,
} from "@heroui/react";
import RCSCard from "./RCSCard.jsx";
import SMSCard from "./SMSCard.jsx";
import SearchInput from "../../../../components/Buttons/Search";
import { Icon } from "@iconify-icon/react";
import { usePreviewTemplateStore } from "../../../../store/automationFlowStore/previewModal";
import { getTemplateBasedOnTypeIdService } from "../../../../services/Sms/smsTemplateService.js";
import { useSmsFlowStore } from "../../../../store/automationFlowStore/smsFlowStore.js";
import { useRcsFlowStore } from "../../../../store/automationFlowStore/rcsFlowStore.js";
import { getTemplates } from "../../../../services/Rcs/rcsTemplateService.js";
import Carousel from "./Carousel.jsx";
import WhatsApp from "../Sidebar/WhatsApp.jsx";
import WhatsappCard from "./WhatsAppCard.jsx";
import RcsTextCard from "./RcsTextCard.jsx";
import { useTranslation } from "react-i18next";

const TemplatesPreview = ({ open, closeModal }) => {
    const [smstemplates, setSmsTemplates] = useState([]);
    const [rcsTemplates, setRcsTemplates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { t } = useTranslation();
    const { type } = usePreviewTemplateStore();
    const { selectedTemplateType } = useSmsFlowStore();
    const { selectedBot, selectedTemplateType: selectedTemplateRcsType } =
        useRcsFlowStore();

    console.log("selectedBot", selectedBot);
    console.log("selectedTemplateType", selectedTemplateRcsType);

    // hard coded whatsapp templates
    const whatsappTemplates = [
        {
            id: 1,
            name: "Restaurant Reservation",
            card_heading: "Book a Table at {{var1}} Restaurant",
            card_subheading:
                "Reserve a table at your favorite restaurant today. Enjoy delicious meals with great ambiance {{var2}}.",
            imageUrl:
                "https://www.deonde.co/blog/wp-content/uploads/2022/04/Restaurant-Reservation-System-Features-1024x538.png",

            action_buttons: [
                {
                    id: 1,
                    created_at: "2024-09-27T07:14:08.905112+00:00",
                    type: "reply",
                    suggestion_text: "stop",
                    postback: "stop",
                },
            ],
            status: "approved",
        },
        {
            id: 2,
            name: "Product Promotion",
            card_heading: "Exclusive Deal on Smartwatches",
            card_subheading:
                "Get up to 30% off on the latest smartwatches. Limited-time offer!",
            imageUrl:
                "https://img.freepik.com/free-vector/website-promotion-concept-online-business-promotion-with-commercial-campaign-product-digital-advertising-social-media-marketing-isolated-flat-vector-illustration_613284-1993.jpg",
            type: "singleimg",
        },
    ];

    // this useffect is used for call get  template apis
    useEffect(() => {
        switch (type) {
            case "sms": {
                const selectedTemplateTypeId = selectedTemplateType?.id;
                if (selectedTemplateTypeId) {
                    const fetchTemplates = async () => {
                        try {
                            const data = await getTemplateBasedOnTypeIdService(
                                selectedTemplateTypeId
                            );
                            setSmsTemplates(data);
                        } catch (error) {
                            console.error(
                                `Error fetching templates for type ${selectedTemplateTypeId}:`,
                                error
                            );
                        }
                    };
                    fetchTemplates();
                }
                return;
            }
            case "rcs": {
                const selectedTemplateTypeId = selectedTemplateRcsType?.id;
                const botId = selectedBot?.id;
                if (botId && selectedTemplateTypeId) {
                    const fetchTemplates = async () => {
                        try {
                            const data = await getTemplates(
                                botId,
                                selectedTemplateTypeId
                            );
                            setRcsTemplates(data);
                        } catch (error) {
                            console.error(`Error fetching templates`, error);
                        }
                    };
                    fetchTemplates();
                }
                return;
            }
            default:
                return;
        }
    }, [selectedTemplateType, selectedBot, selectedTemplateRcsType, type]);

    const filteredSmsTemplates = smstemplates.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRcsTemplates = rcsTemplates.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal
            size="5xl"
            isOpen={open}
            onOpenChange={closeModal}
            placement="top-center"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex gap-2 items-center w-full">
                        <Icon icon="codicon:layout" width={"1.4em"} />
                        <h2 className="text-lg font-semibold">
                            {t("Select Templates")}
                        </h2>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="w-2/5">
                        <SearchInput
                            Placeholder={t("Search...")}
                            onSearch={(value) => setSearchTerm(value)}
                        />
                    </div>
                    <ScrollShadow hideScrollBar className="text-default-500">
                        {/* RCS */}
                        {type === "rcs" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4 w-full">
                                {/* Single Image and Video */}
                                {(selectedTemplateRcsType?.name ===
                                    "Single Image" ||
                                    selectedTemplateRcsType?.name ===
                                        "Video") &&
                                    filteredRcsTemplates.map(
                                        (template, index) => (
                                            <RCSCard
                                                key={index}
                                                template={template}
                                            />
                                        )
                                    )}
                                {filteredRcsTemplates.length === 0 && (
                                    <NoMatchFound />
                                )}

                                {/* Image Carousel */}
                                {selectedTemplateRcsType?.name ===
                                    "Image Carousel" &&
                                    filteredRcsTemplates.map(
                                        (template, index) => (
                                            <Carousel
                                                key={index}
                                                item={template}
                                            />
                                        )
                                    )}

                                {/* Text  */}
                                {selectedTemplateRcsType?.name === "Text" &&
                                    filteredRcsTemplates.map(
                                        (template, index) => (
                                            <RcsTextCard
                                                key={index}
                                                template={template}
                                                templateType={
                                                    selectedTemplateType?.name
                                                }
                                            />
                                        )
                                    )}
                            </div>
                        )}

                        {/* Whatsapp */}
                        {type === "whatsapp" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                                {whatsappTemplates.length > 0 ? (
                                    whatsappTemplates.map((template, index) => (
                                        <WhatsappCard
                                            key={index}
                                            template={template}
                                        />
                                    ))
                                ) : (
                                    <NoMatchFound />
                                )}
                            </div>
                        )}

                        {/* SMS */}
                        {type === "sms" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                                {filteredSmsTemplates.length > 0 ? (
                                    filteredSmsTemplates.map(
                                        (template, index) => (
                                            <SMSCard
                                                key={index}
                                                template={template}
                                                templateType={
                                                    selectedTemplateType?.name
                                                }
                                            />
                                        )
                                    )
                                ) : (
                                    <NoMatchFound />
                                )}
                            </div>
                        )}
                    </ScrollShadow>
                </ModalBody>

                <ModalFooter>
                    <div></div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TemplatesPreview;

const NoMatchFound = () => {
    return (
        <div className="flex flex-col justify-center py-20 items-center col-span-full">
            <Image
                src="/template-search-notfound.png"
                width={150}
                height={150}
                alt="Image Not Found"
            />
            <p className="text-sm  text-center text-default-500">
                No match found
            </p>
        </div>
    );
};
