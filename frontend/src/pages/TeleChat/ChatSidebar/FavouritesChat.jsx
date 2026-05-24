import React, { useEffect, useState } from "react";
import { getFavouriteChatService } from "../../../../../services/Telechat/chats/getFavoriteChatServices.js";
import ChatCard from "./ChatCard";

export default function FavouritesChat({ chats, toggleFavourite }) {
  const [favouriteChats, setFavouriteChats] = useState([]); // Store favourite chat user IDs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const token = localStorage.getItem("token"); // Token for authorization

  useEffect(() => {
    const fetchFavouriteChats = async () => {
      try {
        const response = await getFavouriteChatService(token);
        if (response.status === "SUCCESS") {
          // console.log("Fetched Favourite Chats:", response.data);
          setFavouriteChats(response.data.map((chat) => chat.user_id)); // Extract user IDs
        } else {
          setError(response.message || "Failed to fetch favourite chats.");
        }
      } catch (err) {
        // console.error("Error fetching favourite chats:", err);
        setError("An error occurred while fetching favourite chats.");
      } finally {
        setLoading(false); // Stop loading after the request
      }
    };

    if (token) fetchFavouriteChats();
  }, [token]);

  // Filter chats based on favourite chats' user IDs
  const favoriteChatsData = chats.filter((chat) =>
    favouriteChats.includes(chat.user_id)
  );

  return (
    <div className="flex flex-col gap-2">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div> // Display error in red
      ) : favoriteChatsData.length > 0 ? (
        favoriteChatsData.map((chat) => (
          <ChatCard
            key={chat.user_id}
            title={chat.name || "No Name"} // Display chat name
            chipStatus={chat.status || "Unknown"}
            recent={chat.lastMessage || "No recent message"}
            time={chat.lastActive || "Unknown"}
            number={chat.phoneNumber || "No Number"}
            // avatarURL={`https://ui-avatars.com/api/?name=${chat.avatar_value}`}
            avtarValue={chat.avatar_value}
            avatarType={chat.avatar_type}
            badgeCol="success"
            onFavouriteToggle={() => toggleFavourite(chat.user_id)}
          />
        ))
      ) : (
        <div className="bg-gray-400">To-D</div>
      )}
    </div>
  );
}
