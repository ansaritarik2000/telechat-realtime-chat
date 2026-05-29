import React, { useState, lazy, Suspense } from "react";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router-dom";
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

export default function NewMeeting() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [meetingTitle, setMeetingTitle] = useState("");
    const navigate = useNavigate();

    const handleCreateMeeting = () => {
        // Navigate to /golive with the meeting title as a query parameter
        navigate(`/golive?roomName=${encodeURIComponent(meetingTitle)}`);
    };

    return (
        <div>
            <div
                onClick={onOpen}
                className="rounded-lg py-10 px-8 flex flex-col bg-success-50 gap-20 justify-start items-start cursor-pointer hover:bg-success-100/70  active:border active:border-success transition-all"
            >
                <Icon icon="mage:plus-square" width="3em" height="3em" />
                <div>
                    <h1 className="text-2xl font-semibold text-defualt-500">
                        New Meeting
                    </h1>
                    <h2 className="text-defualt-500">
                        Start an instant meeting
                    </h2>
                </div>
            </div>

            {/* Use Suspense with fallback loading message */}
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
                                    New Meeting
                                </ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        label="Meeting Title"
                                        placeholder="Enter meeting title"
                                        variant="flat"
                                        radius="sm"
                                        value={meetingTitle}
                                        onChange={(e) =>
                                            setMeetingTitle(e.target.value)
                                        }
                                    />
                                    <Input
                                        disabled
                                        label="Meeting Invite"
                                        placeholder="Meeting invite link"
                                        variant="bordered"
                                        radius="sm"
                                        value={`https://meet.telepie.com/id?v=${meetingTitle}`}
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
                                        onPress={() => {
                                            handleCreateMeeting();
                                            onClose();
                                        }}
                                        radius="sm"
                                    >
                                        Create
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
