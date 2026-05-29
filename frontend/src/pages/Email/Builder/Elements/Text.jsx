import React from "react";

export default function TextComponent({ label, style, textarea }) {
  return (
    <div className="w-full">
      <p style={style}>{textarea}</p>
    </div>
  );
}
