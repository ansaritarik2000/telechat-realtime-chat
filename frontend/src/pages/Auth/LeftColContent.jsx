import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
    RCSIcon,
    SMSIcon,
    EmailIcon,
    WhatsAppIcon,
} from "../../utils/ReusableIcons";
import DeviceMockup from "./DeviceMockup";
import { motion, AnimatePresence } from "framer-motion";

export default function LeftColContent() {
    const [time, setTime] = useState("");
    const [amPm, setAmPm] = useState("");
    const [date, setDate] = useState("");
    const [swap, setSwap] = useState(false);

    useEffect(() => {
        const updateTimeAndDate = () => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            const [timePart, amPmPart] = formattedTime.split(" ");
            setTime(timePart);
            setAmPm(amPmPart);
            const formattedDate = now.toLocaleDateString("en-US", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
            setDate(formattedDate);
        };

        const intervalId = setInterval(updateTimeAndDate, 60000);
        updateTimeAndDate();
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSwap((prev) => !prev);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-0 relative ">
            <DeviceMockup
                insideContent={
                    <div className="space-y-8 w-full pt-12">
                        <div className="flex flex-col w-full h-fit items-center gap-0 justify-start text-white">
                            <h1 className="text-5xl font-semibold">
                                {time} <span className="text-xl">{amPm}</span>
                            </h1>
                            <p className="text-sm">{date}</p>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-2 w-full">
                            <AnimatedNotificationCard
                                label={swap ? "WhatsApp" : "RCS"}
                                no={swap ? "4" : "6"}
                                icon={
                                    swap ? (
                                        <WhatsAppIcon size="1.2em" />
                                    ) : (
                                        <RCSIcon size="1.2em" />
                                    )
                                }
                            />
                            <AnimatedNotificationCard
                                label={swap ? "Email" : "SMS"}
                                no={swap ? "8" : "10"}
                                icon={
                                    swap ? (
                                        <EmailIcon size="1.2em" />
                                    ) : (
                                        <SMSIcon size="1.2em" />
                                    )
                                }
                            />
                        </div>
                    </div>
                }
            />

            <div className="text-center gap-10 w-[48rem] flex flex-col justify-around">
                <Headings />
                <div className="flex gap-2 px-10 justify-between ">
                    <StatsCard
                        label="Performance"
                        precentage="42"
                        iconStyle="tabler:presentation"
                    />
                    <StatsCard
                        label="Brand Visibility"
                        precentage="36"
                        iconStyle="material-symbols:wifi-rounded"
                    />
                    <StatsCard
                        label="User Engagement"
                        precentage="60"
                        iconStyle="mynaui:click"
                    />
                    <StatsCard
                        label="Customer Retention"
                        precentage="51"
                        iconStyle="ion:happy-outline"
                    />
                </div>
            </div>
        </div>
    );
}

const AnimatedNotificationCard = ({ label, no, icon }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
            >
                <NotificationCard label={label} no={no} icon={icon} />
            </motion.div>
        </AnimatePresence>
    );
};

// Notificaton Card
const NotificationCard = ({ label, no, icon }) => {
    return (
        <button className="group relative">
            {/* Number */}
            <div className="absolute -right-2 -top-2 z-10">
                <div className="flex h-5 w-5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {no}
                    </span>
                </div>
            </div>
            {/* Icon */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-bl from-gray-900 via-gray-950 to-black p-[1px] shadow-2xl shadow-emerald-500/20">
                <div className="relative flex items-center gap-4 rounded-xl bg-gray-950 px-6 py-3 transition-all duration-300 group-hover:bg-gray-950/50">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-lg  transition-transform duration-300 group-hover:scale-110">
                        {icon}
                        <div className="absolute inset-0 bg-emerald-800/20 rounded-lg transition-all duration-300" />
                        {/* <div className="absolute inset-0 rounded-lg bg-emerald-500/50 blur-sm transition-all duration-300 group-hover:blur-md" /> */}
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-white">
                            {label}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-400/80">
                            Check your notifications
                        </span>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 transition-transform duration-300 group-hover:scale-150" />
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 transition-transform duration-300 group-hover:scale-150 group-hover:delay-100" />
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/30 transition-transform duration-300 group-hover:scale-150 group-hover:delay-200" />
                    </div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 opacity-20 transition-opacity duration-300 group-hover:opacity-40" />
            </div>
        </button>
    );
};

// Stats Card
const StatsCard = ({ label, precentage, iconStyle }) => {
    return (
        <button className="group relative">
            <div className="absolute -inset-1 rounded-xl  bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-50 group-hover:blur-2xl" />
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-1 pr-4">
                <div className="flex items-center gap-3 rounded-lg bg-slate-900/50 px-3 py-2">
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-lg bg-teal-500/20 blur-sm transition-all duration-300 group-hover:bg-teal-500/30 group-hover:blur-md" />

                        <Icon
                            icon={iconStyle}
                            width="26"
                            height="26"
                            className="text-teal-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-white">
                                {precentage}%
                            </span>
                            <svg
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-4 w-4 text-emerald-500 transform transition-transform duration-300 group-hover:translate-y-[-2px]"
                            >
                                <path
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    strokeWidth={2}
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">
                            {label}
                        </span>
                    </div>
                </div>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
        </button>
    );
};

// Headings
const Headings = () => {
    return (
        <div className="space-y-4">
            <h1 className="text-5xl custom-font font-bold text-white">
                Telepie Omnichannel
            </h1>
            <p className="text-lg font-semibold  text-success-500 flex justify-center items-center">
                <span>ANYONE. EVERYWHERE.</span>
                <span className="ml-2 flex items-center">
                    INSTANTLY
                    <Icon
                        icon="fluent-emoji:rocket"
                        width="24"
                        height="24"
                        className="inline-block ml-1"
                    />
                </span>
            </p>
        </div>
    );
};
