import React, { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function SoupMeeting() {
  const [roomId, setRoomId] = useState("");
  const [transportId, setTransportId] = useState(null);
  const [producerId, setProducerId] = useState(null);
  const videoRef = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("createRoom", (data) => {
        setRoomId(data.roomId);
        createTransport();
      });
    });

    socket.on("consume", async ({ producerId, id, kind, rtpParameters }) => {
      console.log("Consuming media from producer:", producerId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createTransport = async () => {
    socket.emit("createTransport", (data) => {
      setTransportId(data.transportOptions.id);
    });
  };

  const startMeeting = async () => {
    if (!transportId) {
      console.error("Transport ID is not set.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      videoRef.current.srcObject = stream;

      socket.emit(
        "produce",
        {
          transportId,
          kind: "video",
          rtpParameters: {
            encodings: [{ codecPayloadType: 100 }],
          },
        },
        (data) => {
          setProducerId(data.producerId);
        }
      );
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const terminateMeeting = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (producerId) {
      socket.emit("closeProducer", { producerId });
    }

    if (transportId) {
      socket.emit("closeTransport", { transportId });
    }

    socket.emit("terminateRoom", { roomId });
  };

  return (
    <div>
      <Button onClick={startMeeting} className="w-fit">
        Start Meeting
      </Button>
      <Button onClick={terminateMeeting}>Terminate Meeting</Button>
      <video ref={videoRef} autoPlay muted></video>
    </div>
  );
}

export default SoupMeeting;
