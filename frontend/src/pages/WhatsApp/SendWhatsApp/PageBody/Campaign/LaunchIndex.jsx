import React from "react";
import CampaignForm from "./Launch/Form/FormIndex";
import Preview from "./Launch/Preview/Index";

export default function LaunchCampaignIndex() {
    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 ">
                <CampaignForm />
            </div>

            <div className="col-span-1">
                <Preview />
            </div>
        </div>
    );
}
