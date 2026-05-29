import React from "react";
import FileUpload from "../FileUpload/FileUpload";
import FooterButtons from "../Buttons/Index";
import CardAndActions from "../CardAndActions";
import toast from "react-hot-toast";
import { createRichCardTemplateService } from "../../../../../services/Rcs/rcsTemplateService.js";
import { useTemplateStore } from "../../../../../store/templateApprovalStore.js";
import { useNavigate } from "react-router-dom";
import FallbackTextInput from "../TempType/FallbackTextInput.jsx";

export default function SingleVideo() {
    const {
        templateName,
        selectedTemplateType,
        selectedBot,
        videoContent,
        fallbackText,
        fallbackTextVariables,
    } = useTemplateStore();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // this function is used for create rich
    const createRichCardTemplateHandller = async () => {
        // create text template
        const response = await createRichCardTemplateService(token, {
            bot_id: selectedBot?.bot_id,
            template_name: templateName,
            template_type: selectedTemplateType,
            title: videoContent.title,
            description: videoContent.description,
            mediaUrl: videoContent?.mediaUrl,
            thumbnailUrl: videoContent?.thumbnailUploadedUrl,
            suggestions: videoContent.buttons,
            titleVariables: videoContent.titleVariables,
            descriptionVariables: videoContent.descriptionVariables,
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
            {/* fall back text Section */}
            <FallbackTextInput />

            {/* File Upload */}
            <FileUpload />

            {/* card and action*/}
            <div className="w-full">
                <CardAndActions />
            </div>

            {/* Footer Buttonns */}

            <div className="py-10">
                <FooterButtons
                    onSubmitHandller={createRichCardTemplateHandller}
                />
            </div>
        </div>
    );
}
