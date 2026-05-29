import React from "react";
import Index from "./Approval/Index";
import { Toaster } from "react-hot-toast";

export default function TemplatePage() {
    return (
        <div className="h-full">
            <Toaster position="top-center" gutter={20} />
            <Index />
        </div>
    );
}
