import React from "react";
import { Icon } from "@iconify-icon/react";
import {
    Avatar,
    AvatarGroup,
    Button,
    Chip,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    useDisclosure,
    ScrollShadow,
    Tooltip,
} from "@heroui/react";
import {
    NewMeetingModal,
    ScheduledMeetingsCard,
    CancelledMeetingsCard,
} from "../Meeting/NewMeetingModal";
import {
    CalendarIcon,
    ThreeDotsIcon,
    WarningIcon,
} from "../../../../utils/ReusableIcons";

const UpcomingCard = ({
    title,
    time,
    date,
    duration,
    medium,
    description = "Meeting details and agenda will be discussed during the call.",
    attendees = [],
}) => {
    // Modal states
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onOpenChange: onEditOpenChange,
    } = useDisclosure();

    const {
        isOpen: isCancelOpen,
        onOpen: onCancelOpen,
        onOpenChange: onCancelOpenChange,
    } = useDisclosure();

    // Function to get the appropriate medium icon
    const getMediumIcon = (medium) => {
        switch (medium?.toLowerCase()) {
            case "google meet":
                return "logos:google-meet";
            case "zoom":
                return "logos:zoom-icon";
            case "native":
                return "material-symbols:video-call";
            default:
                return "mdi:video-outline";
        }
    };

    // Function to get the display text for medium
    const getMediumText = (medium) => {
        return medium?.toLowerCase() === "native" ? "Telepie Meet" : medium;
    };

    return (
        <>
            <Card className="w-full border dark:border-content2" shadow={false}>
                <CardHeader className="flex justify-between items-start bg-primary-50 p-6 pb-4">
                    <div>
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <div className="flex flex-wrap gap-1  mt-1 text-xs text-default-500">
                            <div className="flex items-center gap-1">
                                <Icon icon="mdi:clock-time-four-outline" />
                                <span>Starting at: {time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CalendarIcon />
                                <span>{date}</span>
                            </div>
                        </div>
                    </div>

                    <Dropdown backdrop="blur">
                        <DropdownTrigger>
                            <Button isIconOnly size="md" variant="none">
                                <ThreeDotsIcon size="1.6em" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Meeting Actions"
                            variant="faded"
                        >
                            <DropdownItem
                                key="edit"
                                startContent={<Icon icon="mdi:pencil" />}
                                onPress={onEditOpen}
                            >
                                Edit Event
                            </DropdownItem>
                            <DropdownItem
                                key="cancel"
                                className="text-danger"
                                color="danger"
                                startContent={
                                    <Icon icon="mdi:calendar-remove" />
                                }
                                onPress={onCancelOpen}
                            >
                                Cancel Event
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>

                <CardBody>
                    <div className="flex justify-between items-start p-4">
                        <div className="space-y-3 w-full">
                            <div className="flex justify-between items-center">
                                <Chip
                                    startContent={
                                        <Icon
                                            icon={getMediumIcon(medium)}
                                            className="text-lg"
                                        />
                                    }
                                    variant="flat"
                                    color={
                                        medium?.toLowerCase() === "native"
                                            ? "success"
                                            : "primary"
                                    }
                                    size="sm"
                                >
                                    {getMediumText(medium)}
                                </Chip>

                                <div className="flex items-center gap-1 text-xs text-default-500">
                                    <Icon icon="wi:time-7" />
                                    <Tooltip content="Duration">
                                        <span>{duration}</span>
                                    </Tooltip>
                                </div>
                            </div>

                            <p className="text-default-600 text-sm">
                                {description}
                            </p>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="flex justify-between p-6 pt-2">
                    <div className="flex gap-2 ">
                        <Button
                            radius="sm"
                            variant="flat"
                            color="success"
                            startContent={
                                <Icon icon="mdi:video" size="1.4em" />
                            }
                        >
                            Join Meeting
                        </Button>
                        <Tooltip content="Copy Link">
                            <Button isIconOnly radius="sm" variant="flat">
                                <Icon icon="ic:outline-copy-all" />
                            </Button>
                        </Tooltip>
                    </div>

                    <AvatarGroup isBordered max={2} size="sm">
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                    </AvatarGroup>
                </CardFooter>
            </Card>

            {/* Edit Meeting Modal */}
            <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Edit Meeting
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Meeting Title"
                                    placeholder="Enter meeting title"
                                    variant="bordered"
                                    defaultValue={title}
                                />
                                <Input
                                    label="Date"
                                    placeholder="Select date"
                                    type="date"
                                    variant="bordered"
                                />
                                <div className="flex gap-2">
                                    <Input
                                        label="Start Time"
                                        placeholder="Start time"
                                        type="time"
                                        variant="bordered"
                                    />
                                    <Input
                                        label="End Time"
                                        placeholder="End time"
                                        type="time"
                                        variant="bordered"
                                    />
                                </div>
                                <Input
                                    label="Description"
                                    placeholder="Meeting description"
                                    variant="bordered"
                                    defaultValue={description}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Cancel Meeting Modal */}
            <Modal isOpen={isCancelOpen} onOpenChange={onCancelOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1 text-danger items-center">
                                <WarningIcon />
                                Cancel Meeting
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to cancel "{title}"?
                                </p>
                                <p className="text-small text-default-500">
                                    This action cannot be undone. All
                                    participants will be notified.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Keep Meeting
                                </Button>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Cancel Meeting
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default function UpcomingIndex() {
    return (
        <ScrollShadow
            hideScrollBar
            className="flex flex-col gap-6 bg-content1 rounded-xl h-full overflow-auto"
        >
            {/* Main content with increased padding */}
            <div className="px-6  space-y-8 mt-8">
                {/* Meeting cards section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-1 bg-primary-500 rounded-full"></div>
                        <h2 className="text-xl font-semibold text-default-700">
                            Quick Actions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <NewMeetingModal />
                        <ScheduledMeetingsCard count={12} />
                        <CancelledMeetingsCard count={3} />
                    </div>
                </section>

                {/* Upcoming meetings section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-1 bg-success-500 rounded-full"></div>
                            <h2 className="text-xl font-semibold text-default-700">
                                Upcoming Meetings
                            </h2>
                        </div>

                        <Button
                            size="sm"
                            variant="bordered"
                            color="default"
                            startContent={
                                <Icon icon="material-symbols:filter-list" />
                            }
                        >
                            Filter
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UpcomingCard
                            title="Product Demo"
                            time="02:00 PM"
                            date="Monday, 27 Aug 2024"
                            duration="1.5 hours"
                            medium="Native"
                            description="Showcase new product features to the client team and gather feedback."
                        />
                        <UpcomingCard
                            title="UI/UX Review"
                            time="10:00 AM"
                            date="Friday, 25 Aug 2024"
                            duration="45 minutes"
                            medium="Google Meet"
                            description="Review latest design changes and discuss implementation timeline."
                        />
                        <UpcomingCard
                            title="Developer Meeting"
                            time="09:30 AM"
                            date="Saturday, 26 Aug 2024"
                            duration="30 minutes"
                            medium="Zoom"
                            description="Daily team sync to discuss progress and blockers."
                        />
                    </div>
                </section>
            </div>
        </ScrollShadow>
    );
}
