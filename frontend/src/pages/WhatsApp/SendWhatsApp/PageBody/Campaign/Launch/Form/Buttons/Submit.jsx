import React, { Suspense, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    addToast,
} from "@heroui/react";
import { useSendWhatsappStore } from "../../../../../../../../store/whatsapp/whatsappStore";
import { CheckIcon } from "../../../../../../../../utils/ReusableIcons";

const AnimatedCheckModal = React.lazy(() =>
    import("../../../../../../../RCS/SendRCS/Buttons/AnimatedCheckModal")
);

export default function Submit({ onSubmit }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // Destructure the state from your store
    const { sendWhatsappAnimationModelOpen, phoneNumbers,selectedTemplateTypeSend,selectedTemplate,selectedTemplateName,mediaUrl,campaignName } = useSendWhatsappStore();

    // Use useEffect to listen for changes in sendWhatsappAnimationModelOpen
    useEffect(() => {
        // If sendWhatsappAnimationModelOpen is true, close the confirmation modal
        if (sendWhatsappAnimationModelOpen) {
            onOpenChange(false); // Close the confirmation modal
        }
    }, [sendWhatsappAnimationModelOpen]);
    const onSendHandle =()=>{
    const isValidationFailed = !selectedTemplateTypeSend  ||  !selectedTemplate||  !selectedTemplateName 
    if(phoneNumbers.length ===0 || isValidationFailed){
        addToast({
            title:"Alert!",
            description:"Please select at least one phone number and required to proceed with the campaign.",
            color:'warning'
        })
        return;
    }
    if (['image', 'video', 'document'].includes(selectedTemplateTypeSend) && mediaUrl.length===0) {
        addToast({
          title: "Media Required",
          description: `Please upload or provide a URL for the ${selectedTemplateTypeSend} campaign.`,
          color: 'warning'
        });
        return  // Explicit return false to stop execution
      }
    onOpen()
    }
    return (
        <div>
            <Button
                size="md"
                radius="sm"
                endContent={
                    <Icon
                        icon="mingcute:send-plane-line"
                        width="1.2em"
                        height="1.2em"
                    />
                }
                color="success"
                variant="shadow"
                onPress={()=>{
                    onSendHandle()
                }}
                className="text-white">
                Send
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-1">
                                <CheckIcon customClass="text-success" />
                                Confirmation
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to launch the{" "}
                                    <span className="font-semibold">
                                        {campaignName}
                                    </span>{" "}
                                    campaign?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="success"
                                    variant="flat"
                                    onPress={onSubmit}
                                >
                                    Yes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Modal after launching the campaign */}
            <Suspense fallback={<div>Loading...</div>}>
                <AnimatedCheckModal onOpenChange={onOpenChange} />
            </Suspense>
        </div>
    );
}
