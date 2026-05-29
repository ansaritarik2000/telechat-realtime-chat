import React, { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";

export const StartMeet = () => {
  const [connection, setConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const setupWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:3001");

      wsRef.current.onopen = () => {
        console.log("WebSocket connection opened");
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const { type, sdp, candidate } = data;

        console.log("Received message", data);

        if (type === "offer") {
          await handleOffer(sdp);
        } else if (type === "answer") {
          await handleAnswer(sdp);
        } else if (type === "candidate") {
          await handleCandidate(candidate);
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        // Try to reconnect if necessary
        setTimeout(setupWebSocket, 1000); // Reconnect after 1 second
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error", error);
      };
    };

    setupWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  const sendMessage = (message) => {
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  };

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);

      const peerConnection = new RTCPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendMessage({
            type: "candidate",
            candidate: event.candidate,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      setConnection(peerConnection);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      sendMessage({
        type: "offer",
        sdp: offer,
      });
    } catch (error) {
      console.error("Error starting stream", error);
    }
  };

  const stopStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (connection) {
      connection.close();
      setConnection(null);
    }

    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const handleOffer = async (offer) => {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({
          type: "candidate",
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    sendMessage({
      type: "answer",
      sdp: answer,
    });

    setConnection(peerConnection);
  };

  const handleAnswer = async (answer) => {
    if (connection) {
      await connection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleCandidate = async (candidate) => {
    if (connection) {
      try {
        await connection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding received ICE candidate", e);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Button onClick={startStream} className="w-fit">
          Start Stream
        </Button>
        <Button onClick={stopStream} className="w-fit">
          Stop Stream
        </Button>
      </div>
      <video ref={localVideoRef} autoPlay muted className="w-20 rounded-lg" />
      <video ref={remoteVideoRef} autoPlay className="w-20 rounded-lg" />
    </div>
  );
};
