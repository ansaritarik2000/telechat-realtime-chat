import { Icon } from "@iconify/react";
import { useSendRcStore } from "../../../../store/sendRcsStore";
import React, { useState, useEffect, Suspense } from "react";
import { useSendWhatsappStore } from "../../../../store/whatsapp/whatsappStore";

// Lazy load the robot image and modal components
const Modal = React.lazy(() =>
    import("@heroui/react").then((module) => ({ default: module.Modal }))
);
const ModalContent = React.lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalContent,
    }))
);
const ModalHeader = React.lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalHeader,
    }))
);
const ModalBody = React.lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalBody,
    }))
);
const ModalFooter = React.lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalFooter,
    }))
);

const AnimatedCheckModal = ({ onOpenChange, delay = 2000 }) => {
    const { sendRcsAnimationModelOpen } = useSendRcStore();
    const { sendWhatsappAnimationModelOpen } = useSendWhatsappStore();
    const [completedSteps, setCompletedSteps] = useState([false, false, false]);

    useEffect(() => {
        if (sendRcsAnimationModelOpen || sendWhatsappAnimationModelOpen) {
            // Reset steps when modal opens
            setCompletedSteps([false, false, false]);

            // Simulate step completion with a delay
            const timers = completedSteps.map(
                (step, index) =>
                    setTimeout(() => {
                        setCompletedSteps((prevSteps) => {
                            const updatedSteps = [...prevSteps];
                            updatedSteps[index] = true; // Mark step as complete
                            return updatedSteps;
                        });
                    }, (index + 1) * delay) // Delay each step completion
            );

            return () => timers.forEach((timer) => clearTimeout(timer)); // Cleanup timers
        }
    }, [sendRcsAnimationModelOpen, sendWhatsappAnimationModelOpen]); // Trigger when the modal opens

    // checked list items.
    const items = [
        "Preparing Selected Template.",
        "Filtering Spam, Invaild/Duplicate Numbers.",
        "Deploying to Targeted Audiences.",
    ];

    return (
        <Suspense fallback={null}>
            <Modal
                isOpen={
                    sendRcsAnimationModelOpen || sendWhatsappAnimationModelOpen
                }
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader />
                            <ModalBody className="space-y-0">
                                <div
                                    className="flex flex-col items-center gap-1 mb-2
                                "
                                >
                                    <img
                                        src="/Gifs/roboticon.gif"
                                        alt="Campaign Image"
                                        className="w-3/4 h-auto rounded-md -mt-12 -mb-12"
                                    />
                                </div>
                                <ul className="space-y-2">
                                    {items.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="relative w-5 h-5">
                                                <div
                                                    className={`border-2 rounded-full w-full h-full ${
                                                        completedSteps[index]
                                                            ? "animate-none border-green-500"
                                                            : "animate-spin-border"
                                                    }`}
                                                ></div>
                                                <Icon
                                                    icon="mdi:check-circle"
                                                    className={`absolute inset-0 w-5 h-5 text-green-500 transition-opacity duration-300 ${
                                                        completedSteps[index]
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    }`}
                                                />
                                            </div>
                                            {/* Update text color dynamically */}
                                            <span
                                                className={`transition-colors duration-300 ${
                                                    completedSteps[index]
                                                        ? "text-gray-800"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </ModalBody>
                            <ModalFooter className="flex justify-end gap-4"></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Suspense>
    );
};

export default AnimatedCheckModal;
