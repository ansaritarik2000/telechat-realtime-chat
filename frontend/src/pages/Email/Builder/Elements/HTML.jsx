import React from "react";

export default function HTMLComponent({ label, textarea, style }) {
    const sanitizedHTML = textarea || "";

    return (
        <div style={style}>
            <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></div>
        </div>
    );
}
