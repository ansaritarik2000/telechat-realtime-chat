// import React from "react";

// export default function ButtonComponent({ style, content, url, outerStyle }) {
//   return (
//     <a href={url} style={outerStyle}>
//       <button style={style}>{content}</button>
//     </a>
//   );
// }

import React from "react";

export default function ButtonComponent({ style, content, url, outerStyle }) {
  return (
    <a href={url} style={outerStyle}>
      <button style={style}>{content}</button>
    </a>
  );
}
