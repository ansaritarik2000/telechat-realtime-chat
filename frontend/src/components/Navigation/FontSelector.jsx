import React, { useEffect, useState } from "react";
import { useFontStore } from "../../store/fontStore";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const FontContainer = ({ fontName }) => (
  <div className="flex-col flex items-center gap-0">
    <Icon icon="nimbus:font" width={24} className="text-default-500" />
    <span className="text-xs ">{fontName}</span>
  </div>
);

export default function FontSelector() {
  const { selectedFont, setFont } = useFontStore();

  // Retrieve the font from localStorage when the component mounts
  useEffect(() => {
    const storedFont = localStorage.getItem("selectedFont");
    if (storedFont) {
      setFont(storedFont);
    }
  }, [setFont]);

  // Apply the selected font to all elements on the page (root-level selector)
  useEffect(() => {
    document.querySelectorAll("*").forEach((el) => {
      el.style.fontFamily = `${selectedFont}, sans-serif`;
    });

    // Store the selected font in localStorage whenever it changes
    if (selectedFont) {
      localStorage.setItem("selectedFont", selectedFont);
    }
  }, [selectedFont]);

  // Handle font selection change on button click
  const handleFontChange = (font) => {
    setFont(font);
  };

  return (
    <div className="grid grid-cols-2 gap-4  border-default rounded-xl w-full">
      {/* Inter Font */}
      <Button
        isIconOnly
        radius="sm"
        variant={`${selectedFont === "Inter" ? "bordered" : "flat"}`}
        color={`${selectedFont === "Inter" ? "primary" : "default"}`}
        className={`w-full h-20 `}
        onClick={() => handleFontChange("Inter")}
      >
        <FontContainer fontName="Inter" />
      </Button>

      {/* Public Sans Font */}
      <Button
        isIconOnly
        radius="sm"
        variant={`${selectedFont === "Public Sans" ? "bordered" : "flat"}`}
        color={`${selectedFont === "Public Sans" ? "primary" : "default"}`}
        className={`w-full h-20 `}
        onClick={() => handleFontChange("Public Sans")}
      >
        <FontContainer fontName="Public Sans" />
      </Button>

      {/* DM Sans Font */}
      <Button
        isIconOnly
        radius="sm"
        variant={`${selectedFont === "Tahoma" ? "bordered" : "flat"}`}
        color={`${selectedFont === "Tahoma" ? "primary" : "default"}`}
        className={`w-full h-20 `}
        onClick={() => handleFontChange("Tahoma")}
      >
        <FontContainer fontName="Tahoma" />
      </Button>

      {/* Space Grotesk Font */}
      <Button
        isIconOnly
        radius="sm"
        variant={`${selectedFont === "Space Grotesk" ? "bordered" : "flat"}`}
        color={`${selectedFont === "Space Grotesk" ? "primary" : "default"}`}
        className={`w-full h-20 `}
        onClick={() => handleFontChange("Space Grotesk")}
      >
        <FontContainer fontName="Space Grotesk" />
      </Button>
    </div>
  );
}
