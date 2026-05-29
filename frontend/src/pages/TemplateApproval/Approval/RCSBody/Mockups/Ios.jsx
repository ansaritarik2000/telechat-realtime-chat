import React from "react";
import { IPhoneMockup } from "react-device-mockup";
import { Image } from "@heroui/react";

export default function Ios({ text }) {
    return (
        <div className="">
            <div className="">
                <IPhoneMockup screenWidth={280} hideStatusBar>
                    {/* <Image alt="Bg Image" src="ios.svg" /> */}
                </IPhoneMockup>
            </div>
        </div>
    );
}
