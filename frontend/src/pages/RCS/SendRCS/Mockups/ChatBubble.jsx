import React from "react";
import ImageCarousel from "./ImageCarousel";
import RichCard from "./RichCard";
import SuggestionButtons from "./SuggestionButtons";
import TextMessageCard from "./TextMessageCard";

const ChatBubble = ({ message, theme }) => {
    const isDarkMode = theme === "dark";
    return (
        <div className={message.type === "text_message" ? "p-1 pr-0" : "p-0"}>
            {message.type === "text_message" && (
                <TextMessageCard isDarkMode={isDarkMode} message={message} />
            )}
            {(message.type === "carousel" ||
                message.type === "imgcarousel") && (
                <ImageCarousel items={message.carouselItems} />
            )}
            {(message.type === "richCard" ||
                message.type === "singleimg" ||
                message.type === "video") && <RichCard {...message.content} />}
            {message.type === "suggestion" && (
                <SuggestionButtons suggestions={message.suggestions} />
            )}
        </div>
    );
};

export default ChatBubble;
