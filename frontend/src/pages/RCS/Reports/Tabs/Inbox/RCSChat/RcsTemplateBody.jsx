import React from "react";
import { useRcsFlowStore } from "../../../../../../store/automationFlowStore/rcsFlowStore";
import RcsTextCard from "../../../../../TeleApps/FlowBuilder/TemplatePreview/RcsTextCard";
import Carousel from "../../../../../TeleApps/FlowBuilder/TemplatePreview/Carousel";
import { Image } from "@heroui/react";
import RCSCard from "../../../../../TeleApps/FlowBuilder/TemplatePreview/RCSCard";

const RcsTemplateBody = ({ filteredRcsTemplates = [] }) => {
    const { selectedTemplateType, selectedTemplate } = useRcsFlowStore();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4 w-full">
            {/* Single Image and Video */}
            {(selectedTemplateType?.name === "Single Image" ||
                selectedTemplateType?.name === "Video") &&
                filteredRcsTemplates.map((template, index) => (
                    <RCSCard
                        key={index}
                        template={template}
                        selected={selectedTemplate?.id === template.id}
                        modelClose={false}
                    />
                ))}
            {filteredRcsTemplates.length === 0 && (
                <div className="flex flex-col gap-4 justify-center py-20 items-center col-span-full">
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
            )}

            {/* Image Carousel */}
            {selectedTemplateType?.name === "Image Carousel" &&
                filteredRcsTemplates.map((template, index) => (
                    <Carousel
                        selected={selectedTemplate?.id === template.id}
                        key={index}
                        item={template}
                        modelClose={false}
                    />
                ))}

            {/* Text  */}
            {selectedTemplateType?.name === "Text" &&
                filteredRcsTemplates.map((template, index) => (
                    <RcsTextCard
                        key={index}
                        template={template}
                        selected={selectedTemplate?.id === template.id}
                        templateType={selectedTemplateType?.name}
                        modelClose={false}
                    />
                ))}
        </div>
    );
};

export default RcsTemplateBody;
