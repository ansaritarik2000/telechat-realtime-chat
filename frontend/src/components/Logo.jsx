import React from "react";
import { Image } from "@heroui/react";
import { useThemeStore } from "../store/themeStore";
import { Link } from "react-router-dom";

export default function Logo() {
    const { theme } = useThemeStore();
    return (
        <div>
            <Link to="/">
                <Image
                    src={
                        theme === "dark"
                            ? "telepie-logo-dark-full.svg"
                            : "telepie-logo-light-full.svg"
                    }
                    width={150}
                    height={50}
                    radius="none"
                    alt="Logo"
                />
            </Link>
        </div>
    );
}
