# 💬 TeleChat — Real-Time Chat Application

A fullstack real-time chat module built solo as part of a SaaS telecom platform (Telepie). Includes private messaging, group chat, favourites, and read receipts — connected end-to-end from database to UI.

> **Role:** Sole developer for this module — designed DB schema, built REST APIs, implemented Socket.io real-time layer, and built the React frontend with service architecture.

**Live Demo:** *(coming soon — setting up independent deployment)*  
**Part of:** Telepie Dashboard — a telecom SaaS product

---

## ✨ Features

- 🔴 **Real-time private chat** — Socket.io rooms, instant message delivery
- 👥 **Group chat** — create groups, manage members, broadcast messages
- ✅ **Read receipts** — messages marked as read in real-time
- ⭐ **Favourites** — mark/unmark chats, persisted in DB
- 🔐 **Auth** — JWT login/signup with bcrypt password hashing
- 📧 **Forgot password** — email reset via AWS SES
- 🧱 **MVC architecture** — routes → controllers → Supabase DB
- 🎯 **React Context** — global chat state without prop drilling
- 🗃️ **Service layer** — all API calls abstracted into reusable services

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, HeroUI |
| State | Zustand (favourites), React Context (chat view) |
| Real-time | Socket.io client + server |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | JWT, bcrypt, AWS SES |

---

## 🏗️ Architecture

```
Frontend                          Backend (Node.js)
─────────────────                 ──────────────────────────
ChatBody.jsx                      index.js
  └── TeleChatContext              └── Socket.io server
  └── SidebarIndex                     ├── joinRoom
  └── ChatSection                      ├── sendMessage
  └── GroupChatSection                 ├── getMessages
  └── RightBar / RightBarGroup         ├── markAsRead
                                        ├── joinGroup
services/Telechat/                      └── sendGroupMessage
  ├── getMessageService.js
  ├── postMessageService.js         controllers/
  ├── getFavoriteChatServices.js        ├── chat/
  └── updatedFavouriteChatServices.js   ├── groups/
                                        └── auth/
socket.js (socket.io-client)
```

---

## 💡 Key Technical Decisions I Made

**1. Socket.io Room Architecture**
Each 1-on-1 chat gets a unique `chat_room` entry in DB. On `joinRoom`, server checks if room exists — creates one if not — then joins the socket to that room ID. This prevents message leakage between users.

**2. Group Membership Validation**
Before saving any group message, backend verifies the sender exists in `group_members` table. Unauthorized users get rejected at the socket level, not just the API level.

**3. React Context for Chat State**
Used `TeleChatContext` to pass `setChatView` and `setRightBar` functions deep into the component tree — clicking a chat card in the sidebar updates the main chat area without prop drilling across 4 levels.

**4. Service Layer Pattern**
All API calls are in `/services/Telechat/` — components never call axios directly. This made it easy to change API endpoints without touching UI components.

**5. Read Receipts**
`markAsRead` socket event updates message `status` field in DB and broadcasts `messagesRead` to the room — both sides update in real-time.

---

## 🗄️ Database Schema (Supabase/PostgreSQL)

```sql
-- Private Chat
chat_room        (id, participant_1, participant_2)
chat_messages    (id, chat_room_id, messages[])   -- messages stored as JSON array

-- Group Chat  
groups           (group_id, group_name, created_by, is_private, created_at)
group_members    (group_id, user_id, role, status)
group_messages   (id, group_id, sender_id, content, media_url, created_at)

-- Direct messages (older flow)
telechat         (id, sender_id, receiver_id, message, created_at)
```

---

## 🚀 Setup

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
PORT=3005
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
EMAIL_USER=your_verified_email
CORS_ACCESS=http://localhost:5173
```

```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Update `socket.js` with your backend URL.

---

## 📁 Folder Structure

```
backend/
├── controllers/
│   ├── chat/
│   │   ├── chatRoomController.js       # Create/fetch chat rooms
│   │   ├── messageController.js        # Send message to DB
│   │   ├── getMessageController.js     # Fetch message history
│   │   ├── favouriteChatController.js  # Get favourite chats
│   │   └── updateFavouriteChat.js      # Toggle favourite
│   ├── groups/
│   │   ├── groupController.js          # Create group + add members
│   │   ├── getGroupsController.js      # List all groups
│   │   ├── getGroupByIdController.js   # Group detail + auth check
│   │   ├── getGroupMembersController.js # Members with avatars
│   │   └── getUserGroupsController.js  # Groups for logged-in user
│   └── auth/
│       ├── loginController.js          # JWT login + avatar fetch
│       ├── signupController.js         # bcrypt signup
│       └── forgotPasswordController.js # JWT reset + AWS SES email
├── routes/
└── index.js                            # Express + Socket.io server

frontend/src/
├── pages/TeleApps/ChatFlow/TeleChat/
│   ├── ChatBody.jsx                    # Context provider, layout
│   ├── ChatSidebar/
│   │   ├── SidebarIndex.jsx            # Tabs, search, group modal
│   │   ├── ChatCard.jsx                # Chat list item, click handler
│   │   ├── ChatSection.jsx             # Private chat window
│   │   ├── GroupChatSection.jsx        # Group chat window
│   │   ├── ActiveChat.jsx              # Horizontal scrollable active users
│   │   ├── FavouritesChat.jsx          # Filtered favourites list
│   │   ├── RightBar.jsx                # User detail sidebar
│   │   └── RightBarGroup.jsx          # Group detail + members sidebar
├── services/Telechat/
│   ├── chats/
│   │   ├── getMessageService.js
│   │   ├── postMessage.js
│   │   ├── getFavoriteChatServices.js
│   │   └── updatedFavouriteChatServices.js
│   └── groupChatService/
├── store/Telechat/telechatStore.js     # Zustand store for favourites
└── socket.js                           # Socket.io client instance
```

---

## 👨‍💻 Developer

**Tarik** — Fullstack Developer  
Built this module end-to-end: DB schema design → backend APIs → Socket.io real-time → React frontend

[![GitHub](https://img.shields.io/badge/GitHub-ansaritarik2000-black)](https://github.com/ansaritarik2000)
