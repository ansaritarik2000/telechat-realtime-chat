import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../../../../components/Logo";
import {
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Tooltip,
} from "@heroui/react";
import {
    CodeIcon,
    DesktopIcon,
    TabletIcon,
    MobileIcon,
    ImportIcon,
    ExportIcon,
    HTMLIcon,
} from "../../../../utils/ReusableIcons";
import { useScreenSize } from "../Index";
import { Icon } from "@iconify/react";
import UndoRedo from "./UndoRedo";
import CodeModal from "./CodeModal";

export default function BuilderHeader({ htmlContent }) {
    const { screenSize, setScreenSize } = useScreenSize();

    const fileInputRef = useRef(null);

    // Trigger file input click
    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "text/html") {
                console.log("File selected:", file.name);
            } else {
                alert("Please select an HTML file.");
            }
        }
    };

    return (
        <div className="py-4 px-2 shadow-sm grid grid-cols-5 justify-between w-full">
            {/*  Logo, Device Togglers, Undo/Redo */}
            <div className="col-span-4 flex justify-between items-center pr-6">
                {/* Logo Section */}
                <LogoSection />

                {/* Device Change Togglers in the middle */}
                <div className="flex justify-center items-center">
                    <div className="space-x-1">
                        {/* Desktop Button */}
                        <Tooltip content="Desktop">
                            <Button
                                isIconOnly
                                color="success"
                                radius="sm"
                                size="md"
                                variant={
                                    screenSize === "desktop" ? "flat" : "light"
                                }
                                className={
                                    screenSize === "desktop"
                                        ? "text-success-600"
                                        : "text-default-500"
                                }
                                onPress={() => setScreenSize("desktop")}
                            >
                                <DesktopIcon
                                    customClass={
                                        screenSize === "desktop"
                                            ? "text-success-700"
                                            : "text-default-500"
                                    }
                                    size="1.5em"
                                />
                            </Button>
                        </Tooltip>
                        {/* Tablet */}
                        <Tooltip content="Tablet">
                            <Button
                                isIconOnly
                                color="success"
                                radius="sm"
                                size="md"
                                variant={
                                    screenSize === "tablet" ? "flat" : "light"
                                }
                                className={
                                    screenSize === "tablet"
                                        ? "text-success-700"
                                        : "text-default-500"
                                }
                                onPress={() => setScreenSize("tablet")}
                            >
                                <TabletIcon
                                    customClass={
                                        screenSize === "tablet"
                                            ? "text-success-600"
                                            : "text-default-500"
                                    }
                                    size="1.5em"
                                />
                            </Button>
                        </Tooltip>

                        {/* Mobile */}
                        <Tooltip content="Mobile">
                            <Button
                                isIconOnly
                                color="success"
                                radius="sm"
                                size="md"
                                variant={
                                    screenSize === "mobile" ? "flat" : "light"
                                }
                                className={
                                    screenSize === "mobile"
                                        ? "text-success-700"
                                        : "text-default-500"
                                }
                                onPress={() => setScreenSize("mobile")}
                            >
                                <MobileIcon
                                    customClass={
                                        screenSize === "mobile"
                                            ? "text-success-600"
                                            : "text-default-500"
                                    }
                                    size="1.5em"
                                />
                            </Button>
                        </Tooltip>
                    </div>
                </div>

                {/* Undo/Redo Buttons at the end */}
                <UndoRedo />
            </div>

            {/* Dropdown Section (Import / Export HTML) */}
            <div className="flex gap-3 justify-end items-center ">
                <div className="flex justify-center items-center gap-3">
                    {/* HTML Preview & Upload Modal */}
                    <CodeModal htmlContent={htmlContent} />

                    <Button isLoading color="success" variant="flat">
                        Save Template
                    </Button>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </div>
    );
}

const LogoSection = () => {
    return (
        <div className="flex items-center">
            <Tooltip content="Back to Dashboard">
                <Link
                    to="/"
                    className="py-2 hover:bg-default-100 border  rounded-md "
                >
                    <Icon
                        icon="uiw:left"
                        width="27"
                        height="27"
                        className="text-default-500"
                    />
                </Link>
            </Tooltip>
            <Logo />
        </div>
    );
};
