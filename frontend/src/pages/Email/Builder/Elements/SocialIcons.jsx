import React from "react";

export default function SocialIcons({ socialIcons, style, outerStyle }) {
    return (
        <div style={outerStyle}>
            {socialIcons.map((icon, index) => {
                const url = icon.url && icon.url.trim() !== "" ? icon.url : "#"; // Ensure URL is valid

                /* console.log("Icon Object:", icon);  */
                /* console.log("Final URL:", url); */

                return (
                    <a
                        href={url}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={icon.icon}
                            alt="icon"
                            style={style}
                            className="bg-default rounded-full"
                        />
                    </a>
                );
            })}
        </div>
    );
}
