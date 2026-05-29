import React, { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router-dom";
import {
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@heroui/react";
import CalendarBookingIndex from "./BookingCalendar/BookingIndex";
import {
    CalendarIcon,
    CreateMeetingIcon,
} from "../../../../utils/ReusableIcons";

export function NewMeetingModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const handleCreateMeeting = () => {
        navigate(`/golive`);
    };

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    const formattedDate = currentTime.toLocaleDateString(undefined, options);

    return (
        <>
            <Card className="h-full border-none" shadow="sm">
                <CardHeader className="bg-primary-50 p-4 flex-col items-start">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex-center gap-3">
                            <Button
                                isIconOnly
                                size="md"
                                variant="flat"
                                color="primary"
                            >
                                <Icon
                                    icon="material-symbols:video-call"
                                    width="1.8em"
                                    height="1.8em"
                                    className="text-primary-600"
                                />
                            </Button>
                            <h3 className="text-lg font-semibold text-primary-700">
                                New Meeting
                            </h3>
                        </div>

                        <div className="flex flex-col items-end">
                            <p className="text-lg font-bold text-primary-600">
                                {formattedTime}
                            </p>
                            <p className="text-xs">{formattedDate}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-default-600">
                                Start instantly or schedule a meet with your
                                team
                            </p>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="p-4">
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <Button
                            color="primary"
                            variant="solid"
                            className="justify-center"
                            startContent={
                                <CreateMeetingIcon
                                    size="1.4em"
                                    customClass="text-white"
                                />
                            }
                            radius="sm"
                            onPress={handleCreateMeeting}
                            size="md"
                        >
                            Start Now
                        </Button>
                        <Button
                            variant="flat"
                            color="primary"
                            className="justify-center"
                            onPress={onOpen}
                            startContent={
                                <CalendarIcon
                                    size="1.4em"
                                    customClass="text-primary"
                                />
                            }
                            radius="sm"
                            size="md"
                        >
                            Schedule
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Schedule Meet */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size="5xl"
                classNames={{
                    backdrop: "bg-black/50 backdrop-blur-sm",
                }}
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-primary-600">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon customClass="text-primary" />
                                    <span>Schedule New Meeting</span>
                                </div>
                            </ModalHeader>
                            <ModalBody className="flex-center">
                                <CalendarBookingIndex />
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

// Scheduled Meetings Card Component
export function ScheduledMeetingsCard({ count = 0 }) {
    return (
        <Card className="h-full border-none" shadow="sm">
            <CardHeader className="bg-success-50 p-4 flex-col items-start">
                <div className="flex w-full justify-between items-center">
                    <div className="flex-center gap-3">
                        <Button
                            isIconOnly
                            size="md"
                            variant="flat"
                            color="success"
                        >
                            <Icon
                                icon="material-symbols:calendar-month"
                                width="1.8em"
                                height="1.8em"
                                className="text-success-600"
                            />
                        </Button>
                        <h3 className="text-lg font-semibold text-success-700">
                            Scheduled Meetings
                        </h3>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="text-2xl font-bold text-success-600">
                            {count}
                        </p>
                        <p className="text-xs">This Month</p>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-default-600">
                            Total scheduled events
                        </p>
                        <p className="text-xs text-default-400">
                            View all your upcoming meetings
                        </p>
                    </div>
                </div>
            </CardBody>

            <CardFooter className="p-4">
                <Button
                    variant="flat"
                    color="success"
                    className="w-full justify-center"
                    startContent={
                        <Icon
                            icon="material-symbols:calendar-view-week"
                            width="1.4em"
                            height="1.4em"
                        />
                    }
                    radius="sm"
                    size="md"
                >
                    View Schedule
                </Button>
            </CardFooter>
        </Card>
    );
}

// Cancelled Meetings Card Component
export function CancelledMeetingsCard({ count = 0 }) {
    return (
        <Card className="h-full border-none" shadow="sm">
            <CardHeader className="bg-danger-50 p-4 flex-col items-start">
                <div className="flex w-full justify-between items-center">
                    <div className="flex-center gap-3">
                        <Button
                            isIconOnly
                            size="md"
                            variant="flat"
                            color="danger"
                        >
                            <Icon
                                icon="mage:video-cross"
                                width="1.8em"
                                height="1.8em"
                                className="text-danger-600"
                            />
                        </Button>
                        <h3 className="text-lg font-semibold text-danger-700">
                            Cancelled Meetings
                        </h3>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="text-2xl font-bold text-danger-600">
                            {count}
                        </p>
                        <p className="text-xs">This Month</p>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-default-600">
                            Total cancelled events
                        </p>
                        <p className="text-xs text-default-400">
                            Review cancelled meetings
                        </p>
                    </div>
                </div>
            </CardBody>

            <CardFooter className="p-4">
                <Button
                    variant="flat"
                    color="danger"
                    className="w-full justify-center"
                    startContent={
                        <Icon
                            icon="material-symbols:history"
                            width="1.4em"
                            height="1.4em"
                        />
                    }
                    radius="sm"
                    size="md"
                >
                    View History
                </Button>
            </CardFooter>
        </Card>
    );
}
