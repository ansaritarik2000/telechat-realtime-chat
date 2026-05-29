import React, { useState, useEffect } from "react";
import { Chip, Image } from "@heroui/react";
import NewMeeting from "../Meeting/NewMeeting";
import { NewMeetingModal } from "../Meeting/NewMeetingModal";

export default function TimerCard() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    const formattedDate = currentTime.toLocaleDateString(undefined, options);
    return (
        <div className="flex gap-4">
            <div className="w-1/2 flex justify-between border border-default-300  rounded-md items-center">
                <div className="flex flex-col gap-10 px-10 py-12">
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-5xl text-default-600">
                            {formattedTime}
                        </span>
                        <span className="font-bold text-lg px-1 text-default-400">
                            {formattedDate}
                        </span>
                    </div>
                    <span className="text-md w-fit">
                        <Chip color="primary" variant="flat">
                            Upcoming Meeting at: 05:30 PM
                        </Chip>
                    </span>
                </div>
            </div>

            <div className="w-1/2 cursor-pointer">
                <NewMeetingModal />
            </div>
        </div>
    );
}
