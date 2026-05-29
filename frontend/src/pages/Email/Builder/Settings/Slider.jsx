// import React from "react";
// import { Slider } from "@heroui/react";

// export default function SliderComponent({
//   label,
//   value, // This is the style.width value (e.g., "100%", "auto")
//   onHandleStyleChange,
//   type = "%", // Default to "%" for width
// }) {
//   // Parse the numeric value from the string (e.g., "100%" → 100)
//   const parseValue = (value) => {
//     if (typeof value === "string") {
//       if (value === "auto") {
//         return 0; // Default to 0% if width is "auto"
//       }
//       return parseFloat(value); // Extract the numeric part
//     }
//     return value; // If it's already a number, return it
//   };

//   // Format the value back into a string (e.g., 100 → "100%")
//   const formatValue = (value) => {
//     return `${value}${type}`; // Append the type (e.g., "%" or "px")
//   };

//   // Get the initial numeric value for the slider
//   const initialValue = parseValue(value);

//   return (
//     <Slider
//       size="sm"
//       className="max-w-sm"
//       value={initialValue} // Pass the parsed numeric value to the slider
//       label={label}
//       maxValue={100} // Maximum width percentage
//       minValue={0} // Minimum width percentage
//       step={1}
//       onChange={(v) => {
//         onHandleStyleChange(formatValue(v));
//       }}
//     />
//   );
// }

import React from "react";
import { Slider } from "@heroui/react";

export default function SliderComponent({
  label,
  value,
  onHandleStyleChange,
  type = "px", // Default unit
}) {
  // Parse numeric value from string (handles %, px, and "auto")
  const parseValue = (value) => {
    if (typeof value === "string") {
      if (value === "auto") {
        return 0; // Treat "auto" as 0 (or you can handle it differently)
      }
      return parseFloat(value); // Extract numeric part
    }
    return value;
  };

  // Format back into a string with correct unit
  const formatValue = (num) => {
    return `${num}${type}`;
  };

  // Ensure a valid initial value
  const initialValue = isNaN(parseValue(value)) ? 0 : parseValue(value);

  return (
    <Slider
      size="sm"
      className="max-w-sm"
      value={initialValue}
      label={label}
      maxValue={type === "%" ? 100 : 50} // 100% max for width, 50px max for border-radius
      minValue={0}
      step={1}
      onChange={(v) => {
        onHandleStyleChange(formatValue(v));
      }}
    />
  );
}
