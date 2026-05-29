import React from "react";
import FileUpload from "../FileUpload/FileUpload";
import Card from "../CardSection/Card";
import Slider from "../Slider";
import CardAndActions from "../CardAndActions";
import FooterButtons from "../Buttons/Index";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { createCarouselTemplateService } from "../../../../../services/Rcs/rcsTemplateService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FallbackTextInput from "../TempType/FallbackTextInput";

export default function ImgCarousel() {
    const {
        templateName,
        selectedBot,
        carouselItems,
        fallbackText,
        fallbackTextVariables,
    } = useTemplateStore();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // this function is used for create rich
    const createCarouselTemplateHandller = async () => {
        // create text template
        const response = await createCarouselTemplateService(token, {
            bot_id: selectedBot?.bot_id,
            template_name: templateName,
            template_type: "imgcarousel",
            carouselItems: carouselItems,
            fallbackText,
            fallbackTextVariables,
        });
        if (response.status === "SUCCESS") {
            toast.success("Template created successfully.");
            // navigate("/template-approval");
        } else {
            toast.error("Failed to create template.");
        }
    };

    return (
        <div className="flex flex-col space-y-8">
            {/* File Upload */}
            <FileUpload />

            {/* Slider Sections */}
            <div className="w-full">
                <Slider
                    sections={carouselItems.map((item, index) => {
                        return (
                            <CardAndActions
                                showFallbackTextInput={false}
                                key={item.id}
                                index={index}
                                cardId={item.id}
                            />
                        );
                    })}
                />
            </div>

            {/* fall back text Section */}
            <FallbackTextInput />

            {/* Footer Buttonns */}
            <div className="py-10">
                <FooterButtons
                    onSubmitHandller={createCarouselTemplateHandller}
                />
            </div>
        </div>
    );
}
