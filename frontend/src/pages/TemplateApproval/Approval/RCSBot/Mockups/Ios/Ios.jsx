import React from "react";
import { IPhoneMockup } from "react-device-mockup";
import IosStatusBar from "./IosStatusBar";

export default function Ios({ contactName, messageData }) {
    return (
        <div className="">
            <div className="">
                <IPhoneMockup screenWidth={280} hideStatusBar>
                    <div className="bg-white h-full flex flex-col justify-between">
                        <div>
                            <IosStatusBar />
                        </div>
                    </div>
                </IPhoneMockup>
            </div>
        </div>
    );
}
