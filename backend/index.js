import http from "http";
import { CustomError } from "./utils/CustomErrorHandler/CustomError.js";
import { Server as SocketIoServer } from "socket.io";
import { createClient } from "@supabase/supabase-js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import bodyParser from "body-parser";
import rcsRoutes from "./routes/rcsRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";
import smsFileRoutes from "./routes/smsFileRoutes.js";
import flowRoutes from "./routes/flowRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import subAccountRoutes from "./routes/subAccountRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import phonebookRoutes from "./routes/phonebookRoutes.js";
import whatsAppRoutes from "./routes/whatsAppRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
// import telechatController from './controllers/telechat/telechatController.js';
import teleChatRoutes from "./routes/telechatRoutes.js";
import { deleteOldRecords } from "./services/emailServices/sendGridEmail.js";
import { generateInvoice } from "./services/invoiceServices/billingInvoiceService.js";
import messageRoutes from "./routes/telechat/messageRoutes.js";
import rcsChatRouter from "./routes/rcsChat/chatRoutes.js";
import rcsEnabledRoutes from "./routes/rcsEnabledRoutes.js";
import s3Routes from "./routes/s3Routes/s3Routes.js";
import walletRoutes from "./routes/wallets/walletRoutes.js";
import teleCreditsRoutes from "./routes/telecredits/teleCreditsRoutes.js";
import { globalerrorHandler } from "./controllers/ErrorController/errorController.js";
import webhookRouter from "./routes/webhook/webhook.root.js";
import rcsInboxRoute from "./controllers/rcs/rcsInbox/rcsInboxRoute.js";
import shortRoutes from "./routes/shortenRoutes.js";

dotenv.config();

// Uncaught Exception error handling
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("uncaught Exception Error Shutting down...");
    process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3005;

// Create HTTP server
const server = http.createServer(app);
app.disable("x-powered-by");

// Initialize Socket.IO
const io = new SocketIoServer(server, {
    cors: {
        origin: process.env.CORS_ACCESS,
    },
});

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
export const attachSupabase = (req, res, next) => {
    req.supabase = supabase;
    next();
};
// make supbase to apply global
app.use(attachSupabase);

// Middlewares
app.use(
    cors({
        origin: process.env.CORS_ACCESS,
    })
);
app.use(bodyParser.text({ type: "text/plain" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this routes use for webhook
app.use("/webhook", webhookRouter);

// this routes use for telecredits
app.use("/telecredits", teleCreditsRoutes(supabase));

// this routes use for wallets
app.use("/wallet", walletRoutes(supabase));

// Use the S3 routes
app.use("/s3", s3Routes);
//sms routes use
app.use("/sms", smsRoutes(supabase));

//this route use for shorten url
app.use("/", shortRoutes);

// delete the test table after 10days
cron.schedule("0 0 * * *", () => {
    deleteOldRecords(supabase); // Pass the function reference inside a callback
});
//this routes use for files upload of SMS
app.use("/smsFile", smsFileRoutes(supabase));

// this routes use for rcs related
app.use("/rcs/inbox", rcsInboxRoute);
app.use("/rcs", rcsRoutes(supabase));
app.use("/rcsinbox", rcsChatRouter(supabase));

// this routes use for whatsapp related
app.use("/whatsapp", whatsAppRoutes(supabase));

// this routes use for Telechat related
app.use("/telechat", teleChatRoutes(supabase));
app.use("/chating", messageRoutes(supabase));
// app.use("/message", messageRoutes(supabase));

// this routes use for file related sms/rcs
app.use("/file", fileRoutes(supabase));

// this routes use for rcs enabled
app.use("/rcsenabled", rcsEnabledRoutes(supabase));

// this routes use for flow
app.use("/flow", flowRoutes(supabase));

// this routes use for auth(login/signup)
app.use("/auth", authRoutes(supabase));

// this routes use for subaccount
app.use("/subaccount", subAccountRoutes(supabase));

// this routes use for profile
app.use("/profile", profileRoutes(supabase));

// this routes use for member
app.use("/member", memberRoutes(supabase));

// this routes use for group
app.use("/phonebook", phonebookRoutes(supabase));

// this route is for invoice generation
app.post("/generate-invoice", async (req, res) => {
    const invoiceData = req.body;
    //   console.log("Invoice data:", invoiceData);

    // Call the service to generate the invoice
    const result = await generateInvoice(invoiceData);

    if (result.success) {
        // If successful, send the generated PDF as response
        res.set("Content-Type", "application/pdf");
        res.set("Content-Disposition", 'attachment; filename="invoice.pdf"');
        res.send(result.data);
    } else {
        // If an error occurred, send the error message
        res.status(500).json({
            message: "Failed to generate invoice",
            error: result.message,
        });
    }
});

// WebSocket implementation
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle joining a group
  socket.on("joinGroup", async ({ groupId, userId }) => {
    console.log("📥 joinGroup received:", { groupId, userId });

    if (!groupId || !userId) {
      console.warn("❌ joinGroup missing groupId or userId");
      return;
    }

    // Leave previous group room if exists
    if (socket.currentGroupRoom) {
      console.log("🚪 Leaving previous group room:", socket.currentGroupRoom);
      socket.leave(socket.currentGroupRoom);
    }

    // Join new group
    socket.join(groupId);
    socket.currentGroupRoom = groupId;

    console.log(`📢 ${userId} joined group ${groupId}`);

    // Fetch messages
    const { data: messages, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("❌ Error fetching group messages:", error.message);
    } else {
      console.log(`📨 Sending ${messages.length} messages to client`);
      socket.emit("groupMessages", messages);
    }
  });

  // Handle sending a message to group
  socket.on("sendGroupMessage", async ({ groupId, senderId, content, mediaUrl }) => {
    console.log("📥 sendGroupMessage received:", {
      groupId,
      senderId,
      content,
      mediaUrl,
    });
  
    if (!groupId || !senderId || (!content && !mediaUrl)) {
      console.warn("❌ sendGroupMessage missing fields");
      return;
    }
  
    // ✅ CHECK: Ensure user is part of the group
    const { data: member, error: memberError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId)
      .eq("user_id", senderId)
      .maybeSingle();
  
    if (memberError) {
      console.error("❌ Error checking group membership:", memberError.message);
      return;
    }
  
    if (!member) {
      console.warn(`⛔ User ${senderId} is not a member of group ${groupId}`);
      return; // Reject message
    }
  
    // ✅ Proceed to insert message
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
  
    if (error) {
      console.error("❌ Error inserting message:", error.message);
    } else {
      console.log("📤 Broadcasting new message to group:", groupId);
      io.to(groupId).emit("newGroupMessage", newMessage);
    }
  });
  


  let currentRoom = null;

  // Join Room
  socket.on("joinRoom", async ({ sender, receiver }) => {
    if (!sender || !receiver) return;
    if (currentRoom) {
      socket.leave(currentRoom);
      // console.log(`Left room: ${currentRoom}`);
    }
    const { data: chatRoom } = await supabase
      .from("chat_room")
      .select("*")
      .or(
        `and(participant_1.eq.${sender},participant_2.eq.${receiver}),and(participant_1.eq.${receiver},participant_2.eq.${sender})`
      );
      // console.log("=============chatRoom===========",chatRoom);
      
    let room;

    if (chatRoom && chatRoom.length) {
      room = chatRoom[0];
    } else {
      const { data: newRoom } = await supabase
        .from("chat_room")
        .insert([{ participant_1: sender, participant_2: receiver }])
        .select();
      
      room = newRoom[0];

      await supabase.from("chat_messages").insert([
        { chat_room_id: room.id, messages: [] },
      ]);
    }
    currentRoom = room.id;
    socket.join(room.id);
    socket.emit("joinedRoom", room.id);
  });

    // Get Messages
    socket.on("getMessages", async ({ roomId }) => {
        const { data, error } = await supabase
            .from("chat_messages")
            .select("messages")
            .eq("chat_room_id", roomId)
            .single();

        if (data) {
            socket.emit("receiveMessages", data.messages);
        }
    });

  // Send Message
  socket.on("sendMessage", async ({ roomId, sender, receiver, message }) => {
    // console.log("🔹 Message received from client:", { roomId, sender, receiver, message });
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
  
    if (error) {
      console.error("❌ Error fetching chat:", error);
      return;
    }
  
    const updatedMessages = [...chat.messages, newMessage];
  
    const { error: updateError } = await supabase
      .from("chat_messages")
      .update({ messages: updatedMessages })
      .eq("chat_room_id", roomId);
  
    if (updateError) {
      console.error("❌ Error updating messages:", updateError);
      return;
    }
  
    io.in(roomId).emit("receiveMessage", newMessage);
    // console.log("✅ Message sent to room:", roomId);
  });
  // Mark Messages as Read
  socket.on("markAsRead", async ({ roomId, readerId }) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("messages")
      .eq("chat_room_id", roomId)
      .single();
  
    if (error || !data) {
      console.error("❌ Error fetching messages for markAsRead:", error);
      return;
    }
  
    let anyChanges = false;
  
    const updatedMessages = data.messages.map((msg) => {
      if (msg.receiver === readerId && msg.status !== "read") {
        anyChanges = true;
        return { ...msg, status: "read" };
      }
      return msg;
    });
  
    if (anyChanges) {
      const { error: updateError } = await supabase
        .from("chat_messages")
        .update({ messages: updatedMessages })
        .eq("chat_room_id", roomId);
  
      if (updateError) {
        console.error("❌ Error updating messages to read:", updateError);
        return;
      }
  
      io.to(roomId).emit("messagesRead", {
        readerId,
        roomId,
      });
    }
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// this routes use for emailCampaignReort Data And Testing
app.use("/email", emailRoutes(supabase));
// this routes use for base url
app.get("/", (req, res) => {
    res.send("Welcome to Telepie.com!");
});
// Error Handling part start here

// If route is not define in our server
app.all("*", (req, res, next) => {
    // const err = new Error(`Can't find the ${req.originalUrl} on the server!`)
    // err.status = 'failed'
    // err.statusCode = 404
    const err = new CustomError(
        `Can't find the ${req.originalUrl} on the server!`,
        404
    );
    next(err);
});

// Global Error Handle Middleware
app.use(globalerrorHandler);

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Unhandled Rejection error handling
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandled Rejection Error Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
