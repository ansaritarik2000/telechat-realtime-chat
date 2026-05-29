import React from "react";
import WelcomeCard from "./WelcomeCard";
import TabIndex from "./Tabs/Index";
// import {Divider} fr

export default function HomeIndex() {
    return (
        <div className="flex flex-col gap-4 p-4 ">
            {/* Welcome Card */}
            <WelcomeCard />

            {/* Tab Switcher */}
            <TabIndex />
        </div>
    );
}
