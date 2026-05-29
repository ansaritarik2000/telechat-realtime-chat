import React, { useContext } from "react";
import { IPhoneMockup } from "react-device-mockup";
import ChatBubble from "./Bubble";
import { Image } from "@heroui/react";
import { RtdContext } from "../Page";

export default function Ios({ text }) {
    const { displayText, setDisplayText } = useContext(RtdContext);
    return (
        <div className="relative w-[280px] h-[500px]">
            <IPhoneMockup screenWidth={280} hideStatusBar>
                <div className="absolute inset-0 z-0">
                    <Image
                        alt="Bg Image"
                        src="ios.svg"
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full"
                    />
                </div>
                <div className="realtive z-999 mt-[140px]">
                    <ChatBubble message={displayText} />
                </div>
            </IPhoneMockup>
        </div>
    );
}
