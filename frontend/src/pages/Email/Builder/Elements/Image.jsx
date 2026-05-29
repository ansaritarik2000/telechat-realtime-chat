import React from "react";

// The style, content, outerStyle cab be modified in ElementList.jsx

export default function ImageComponent({ style, imageUrl, outerStyle }) {
  return (
    <div style={outerStyle}>
      <img src={imageUrl} style={style} alt="Image" />
    </div>
  );
}
