import React, { useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";

const btnStyles = "w-full h-[6vh] bg-default-200 ";

export default function Presets() {
  const { theme, preset, setPreset } = useThemeStore();

  // Apply the theme and preset to the document when they change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    if (preset) {
      document.documentElement.setAttribute("data-preset", preset);
    }
  }, [theme, preset]);

  // Handle preset change on button click
  const handlePresetChange = (preset) => {
    setPreset(preset);
  };

  return (
    <div className="grid grid-cols-2 gap-4  border-default rounded-xl w-full">
      {/* Default Preset */}
      <Button
        isIconOnly
        radius="sm"
        variant="flat"
        className={`${btnStyles} ${
          preset === "default" ? "bg-default-300" : ""
        }`}
        onClick={() => handlePresetChange("default")}
      >
        <Icon
          icon="ic:twotone-color-lens"
          width={28}
          className="text-default-500"
        />
      </Button>

      {/* Blue Preset */}
      <Button
        isIconOnly
        radius="sm"
        variant="flat"
        className={`${btnStyles} ${preset === "blue" ? "bg-blue-100" : ""}`}
        onClick={() => handlePresetChange("blue")}
      >
        <Icon
          icon="ic:twotone-color-lens"
          width={28}
          className="text-primary"
        />
      </Button>

      {/* Violet Preset */}
      <Button
        isIconOnly
        radius="sm"
        variant="flat"
        className={`${btnStyles} ${preset === "violet" ? "bg-violet-100" : ""}`}
        onClick={() => handlePresetChange("violet")}
      >
        <Icon
          icon="ic:twotone-color-lens"
          width={28}
          className="text-[purple]"
        />
      </Button>

      {/* Orange Preset */}
      <Button
        isIconOnly
        radius="sm"
        variant="flat"
        className={`${btnStyles} ${preset === "orange" ? "bg-orange-100" : ""}`}
        onClick={() => handlePresetChange("orange")}
      >
        <Icon
          icon="ic:twotone-color-lens"
          width={28}
          className="text-[orange]"
        />
      </Button>
    </div>
  );
}
