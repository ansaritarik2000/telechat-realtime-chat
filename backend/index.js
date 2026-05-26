import http from "http";
import { Server as SocketIoServer } from "socket.io";
import { createClient } from "@supabase/supabase-js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import teleChatRoutes from "./routes/telechatRoutes.js";
import messageRoutes from "./routes/telechat/messageRoutes.js";
import ws from "ws";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3005;
const server = http.createServer(app);

const io = new SocketIoServer(server, {
  cors: { origin: process.env.CORS_ACCESS },
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY,
  {
    realtime: {
      transport: ws,
    },
  },
);

export const attachSupabase = (req, res, next) => {
  req.supabase = supabase;
  next();
};

app.use(attachSupabase);
app.use(cors({ origin: process.env.CORS_ACCESS }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes(supabase));
app.use("/telechat", teleChatRoutes(supabase));
app.use("/chating", messageRoutes(supabase));

app.get("/", (req, res) => {
  res.send("TeleChat Server Running!");
});

// Socket.io — full code same rakho
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGroup", async ({ groupId, userId }) => {
    if (!groupId || !userId) return;
    if (socket.currentGroupRoom) socket.leave(socket.currentGroupRoom);
    socket.join(groupId);
    socket.currentGroupRoom = groupId;

    const { data: messages, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (!error) socket.emit("groupMessages", messages);
  });

  socket.on(
    "sendGroupMessage",
    async ({ groupId, senderId, content, mediaUrl }) => {
      if (!groupId || !senderId || (!content && !mediaUrl)) return;

      const { data: member } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", groupId)
        .eq("user_id", senderId)
        .maybeSingle();

      if (!member) return;

      const { data: newMessage, error } = await supabase
        .from("group_messages")
        .insert([
          {
            group_id: groupId,
            sender_id: senderId,
            content,
            media_url: mediaUrl,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (!error) io.to(groupId).emit("newGroupMessage", newMessage);
    },
  );

  let currentRoom = null;

  socket.on("joinRoom", async ({ sender, receiver }) => {
    if (!sender || !receiver) return;
    if (currentRoom) socket.leave(currentRoom);

    const { data: chatRoom } = await supabase
      .from("chat_room")
      .select("*")
      .or(
        `and(participant_1.eq.${sender},participant_2.eq.${receiver}),and(participant_1.eq.${receiver},participant_2.eq.${sender})`,
      );

    let room;
    if (chatRoom && chatRoom.length) {
      room = chatRoom[0];
    } else {
      const { data: newRoom } = await supabase
        .from("chat_room")
        .insert([{ participant_1: sender, participant_2: receiver }])
        .select();
      room = newRoom[0];
      await supabase
        .from("chat_messages")
        .insert([{ chat_room_id: room.id, messages: [] }]);
    }

    currentRoom = room.id;
    socket.join(room.id);
    socket.emit("joinedRoom", room.id);
  });

  socket.on("getMessages", async ({ roomId }) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("messages")
      .eq("chat_room_id", roomId)
      .single();
    if (data) socket.emit("receiveMessages", data.messages);
  });

  socket.on("sendMessage", async ({ roomId, sender, receiver, message }) => {
    const newMessage = {
      sender,
      receiver,
      message,
      created_at: new Date().toISOString(),
      status: "sent",
    };

    const { data: chat, error } = await supabase
      .from("chat_messages")
      .select("messages")
      .eq("chat_room_id", roomId)
      .single();

    if (error) return;

    const updatedMessages = [...chat.messages, newMessage];
    await supabase
      .from("chat_messages")
      .update({ messages: updatedMessages })
      .eq("chat_room_id", roomId);
    io.in(roomId).emit("receiveMessage", newMessage);
  });

  socket.on("markAsRead", async ({ roomId, readerId }) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("messages")
      .eq("chat_room_id", roomId)
      .single();

    if (error || !data) return;

    let anyChanges = false;
    const updatedMessages = data.messages.map((msg) => {
      if (msg.receiver === readerId && msg.status !== "read") {
        anyChanges = true;
        return { ...msg, status: "read" };
      }
      return msg;
    });

    if (anyChanges) {
      await supabase
        .from("chat_messages")
        .update({ messages: updatedMessages })
        .eq("chat_room_id", roomId);
      io.to(roomId).emit("messagesRead", { readerId, roomId });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`TeleChat Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
