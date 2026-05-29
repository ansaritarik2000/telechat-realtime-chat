import React from "react";
import { AndroidMockup } from "react-device-mockup";
import ChatBubble from "./Bubble";
import { Image } from "@heroui/react";

export default function Android({ text }) {
  return (
    <div className="">
      <AndroidMockup screenWidth={280} navBar={"rhb"} hideStatusBar>
        {/* <ChatBubble message={text} /> */}
        <Image alt="Bg Image" src="android.svg" />
      </AndroidMockup>
    </div>
  );
}
