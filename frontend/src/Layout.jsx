import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/SidebarPage";
import Navigation from "./components/Navigation/Nav";

export default function Layout() {
    return (
        <div className="flex h-screen">
            <div className="h-full z-50">
                <Sidebar />
            </div>
            <div className="flex-1 h-full overflow-y-auto ">
                {/* Navigation */}
                <Navigation />

                {/* Outlet for rendering route components */}
                <div className="py-4 px-2 mr-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
