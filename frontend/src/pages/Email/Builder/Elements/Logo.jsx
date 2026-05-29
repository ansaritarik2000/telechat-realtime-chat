import React from "react";

export default function LogoComponent({ style, imageUrl, outerStyle }) {
    return (
        <div style={outerStyle}>
            <img src={imageUrl} style={style} alt="Image" />
        </div>
    );
}
