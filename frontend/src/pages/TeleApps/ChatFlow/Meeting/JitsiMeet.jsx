import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useLocation, useNavigate } from "react-router-dom";

const JitsiMeetComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const roomName = queryParams.get("roomName") || "DefaultRoom";

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        // userInfo={
        //   {
        //       displayName: "Your Username",
        //   }
        // }
        onApiReady={(externalApi) => {
          console.log("Jitsi API is ready");

          //   externalApi.addEventListener("videoConferenceLeft", () => {
          //     navigate("/telechatnmeet");
          //   });
        }}
        getIFrameRef={(iframeRef) => {
          if (iframeRef) {
            iframeRef.style.width = "100%";
            iframeRef.style.height = "100%";
            // iframeRef.style.border = "none";
          }
        }}
      />
    </div>
  );
};

export default JitsiMeetComponent;
