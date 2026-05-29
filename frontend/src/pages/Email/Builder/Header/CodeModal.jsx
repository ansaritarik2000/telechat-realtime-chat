import React, { useState } from "react";
import { Button, Divider, Tooltip } from "@heroui/react";
import { CopyIcon, HTMLIcon } from "../../../../utils/ReusableIcons";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function CodeModal({ htmlContent }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [copied, setCopied] = useState(false);

    // Function to copy HTML content
    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(htmlContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Function to export HTML as a file
    const handleExportHTML = () => {
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "email_template.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            {/* Button to trigger the modal */}
            <Button
                isIconOnly
                variant="flat"
                color="primary"
                className="px-6 group"
                onPress={onOpen}
            >
                <HTMLIcon size="1.7em" customClass="group-hover:text-primary" />
            </Button>

            {/* Modal component */}
            <Modal isOpen={isOpen} onOpenChange={onClose} size="xl">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-lg"></ModalHeader>
                    {/* HTML preview */}
                    <ModalBody>
                        <p className="text-md ">Export HTML Template</p>
                        <div className="relative">
                            <pre className="bg-neutral-900 text-white p-3 overflow-auto rounded-md max-h-[40vh] whitespace-pre-wrap break-words">
                                {htmlContent}
                            </pre>

                            <div className="absolute top-3 right-4 flex flex-col gap-2 cursor-pointer z-40">
                                {/* Copy button with tooltip feedback */}
                                <Tooltip content={"Copy to clipboard"}>
                                    <Button
                                        isIconOnly
                                        variant="solid"
                                        color="default"
                                        radius="sm"
                                        className=""
                                        onPress={handleCopyToClipboard}
                                    >
                                        <CopyIcon
                                            size="1.5em"
                                            customClass="text-default-900"
                                        />
                                    </Button>
                                </Tooltip>

                                {/* Download html file */}
                                <Tooltip content={"Download .html"}>
                                    <Button
                                        isIconOnly
                                        variant="solid"
                                        color="default"
                                        radius="sm"
                                        onPress={handleExportHTML}
                                    >
                                        <Icon
                                            icon="lucide:download"
                                            width="24"
                                            height="24"
                                        />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <p className="text-md ">Import HTML Template</p>
                            <InputFile />
                        </div>
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>
        </div>
    );
}

const InputFile = () => {
    return (
        <div className="h-20 rounded-lg border-2 bg-gray-50 flex justify-center items-center w-full relative">
            <div className="flex justify-center gap-2 items-center min-w-full absolute w-full h-full">
                <div className="flex justify-center items-center w-1/3 h-full bg-content3">
                    <HTMLIcon size="3.3em" customClass="text-primary" />
                </div>
                <div className="w-2/3">
                    <p className="block text-gray-500 font-semibold text-sm w-full">
                        Click here to import HTML template
                    </p>
                    <span className="block text-sm text-gray-400 font-normal mt-1">
                        or drag & drop
                    </span>
                </div>
            </div>
            <input
                name="file-upload"
                className="h-full w-full opacity-0 cursor-pointer"
                type="file"
            />
        </div>
    );
};
