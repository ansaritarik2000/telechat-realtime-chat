import React, { lazy, Suspense } from "react";
import { Icon } from "@iconify-icon/react";
import { useDisclosure, Input, Button } from "@heroui/react";

// Lazy load the Modal component
const Modal = lazy(() =>
    import("@heroui/react").then((module) => ({ default: module.Modal }))
);
const ModalContent = lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalContent,
    }))
);
const ModalHeader = lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalHeader,
    }))
);
const ModalBody = lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalBody,
    }))
);
const ModalFooter = lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalFooter,
    }))
);

export default function ScheduleCard() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <div className="w-1/3">
            <div
                onClick={onOpen}
                className="rounded-lg py-10 px-8 flex flex-col bg-secondary-50 gap-20 justify-start items-start hover:border-2 hover:shadow-sm  cursor-pointer active:border active:border-secondary transition-all"
            >
                <Icon icon="akar-icons:schedule" width="3em" height="3em" />
                <div>
                    <h1 className="text-2xl font-semibold text-defualt-500">
                        Schedule Meeting
                    </h1>
                    <h2 className="text-defualt-500">Plan your meeting</h2>
                </div>
            </div>

            {/* Use Suspense with a fallback to handle lazy-loaded components */}
            <Suspense fallback={null}>
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    placement="top-center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Schedule Meeting
                                </ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        label="Meeting Title"
                                        placeholder="Enter meeting title"
                                        variant="flat"
                                        radius="sm"
                                    />

                                    <Input
                                        label="Timing"
                                        placeholder="08:30 AM"
                                        variant="flat"
                                        radius="sm"
                                    />

                                    <Input
                                        disabled
                                        autoFocus
                                        label="Meeting Invite"
                                        //   labelPlacement="outside"
                                        placeholder="Enter meeting title"
                                        variant="bordered"
                                        radius="sm"
                                        value="https://meet.telepie.com/id?v=34hj5001"
                                        endContent={
                                            <Icon
                                                icon="ic:outline-copy-all"
                                                width="1.2em"
                                                height="1.2em"
                                                className="cursor-pointer"
                                            />
                                        }
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button
                                        color="default"
                                        variant="flat"
                                        onPress={onClose}
                                        radius="sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="success"
                                        onPress={onClose}
                                        radius="sm"
                                    >
                                        Schedule
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </Suspense>
        </div>
    );
}
