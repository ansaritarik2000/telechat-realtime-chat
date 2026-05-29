import React from "react";
import FileUpload from "../FileUpload/FileUpload";
import FooterButtons from "../Buttons/Index";
import CardAndActions from "../CardAndActions";
import { useTemplateStore } from "../../../../../store/templateApprovalStore.js";
import { createRichCardTemplateService } from "../../../../../services/Rcs/rcsTemplateService.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SingleImg() {
    const {
        templateName,
        selectedTemplateType,
        selectedBot,
        singleImageContent,
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
            title: singleImageContent.title,
            description: singleImageContent.description,
            fallbackText,
            fallbackTextVariables,

            mediaUrl: singleImageContent?.mediaUrl,
            suggestions: singleImageContent.buttons,
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
