import React, { useContext } from "react";
import { AndroidMockup } from "react-device-mockup";
import ChatBubble from "./Bubble";
import { RtdContext } from "../Page";

export default function Android({ text }) {
    const { displayText, setDisplayText } = useContext(RtdContext);

    return (
        <div className="relative w-[280px] h-[500px]">
            <AndroidMockup screenWidth={280} navBar={"rhb"} hideStatusBar>
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {/* <Image
                        alt="Bg Image"
                        src="android.svg"
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full"
                    /> */}
                </div>
                {/* Chat Bubble */}
                <div className="relative z-10 mt-[110px]">
                    <ChatBubble message={displayText} />
                </div>
            </AndroidMockup>
        </div>
    );
}
