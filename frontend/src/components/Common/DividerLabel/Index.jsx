import React from "react";
import { Divider } from "@heroui/react";

export default function DividerLabel({ label, size = "lg" }) {
    return (
        <div className="flex justify-center items-center gap-2">
            <h2 className={`font-semibold ${size} w-fit`}>{label}</h2>
            <div className="flex-1">
                <Divider />
            </div>
        </div>
    );
}
