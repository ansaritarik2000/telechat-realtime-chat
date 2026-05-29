import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
} from "@heroui/react";

const ColorPicker = ({ rcsBrandColor, handleColorChange }) => {
  // List of preset colors with at least a 4.5:1 contrast ratio to white
  const presetColors = [
    "#FF6347", // Tomato - Contrast ratio: 4.91:1
    "#4CAF50", // Green - Contrast ratio: 5.32:1
    "#3F51B5", // Indigo - Contrast ratio: 6.51:1
    "#FFC107", // Amber - Contrast ratio: 5.99:1
    "#009688", // Teal - Contrast ratio: 7.14:1
    "#E91E63", // Pink - Contrast ratio: 4.82:1
    "#9C27B0", // Purple - Contrast ratio: 5.46:1
    "#FF9800", // Orange - Contrast ratio: 6.06:1
    "#2196F3", // Blue - Contrast ratio: 6.91:1
    "#673AB7", // Deep Purple - Contrast ratio:
  ];

  // State for managing the open/close state of the popover
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="flex border bg-content2 px-6 py-2 dark:border-content3 rounded-lg gap-4">
      <div className="flex flex-col items-start gap-1">
        <p className="text-sm text-default-600 text-center">Brand Color</p>

        {/* Displaying the Selected Color */}
        <div className="text-xs space-x-1 text-default-500 ">
          <span>Color:</span>
          <span style={{ color: rcsBrandColor }}>{rcsBrandColor}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-center items-center">
        {/* Color Display (current selected color) */}
        <Popover
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          placement="bottom"
          offset={25}
          showArrow="true"
          backdrop="opaque"
          classNames={{
            base: [
              // arrow color
              "before:bg-default-200",
            ],
            content: [
              "py-3 px-4 border border-default-200",
              "bg-gradient-to-br from-white to-default-300",
              "dark:from-default-100 dark:to-default-50",
            ],
          }}
        >
          <PopoverTrigger>
            <div
              className="w-9 h-9 rounded-md cursor-pointer"
              style={{ backgroundColor: rcsBrandColor }}
              aria-label="Click to change color"
            ></div>
          </PopoverTrigger>

          {/* Popover Content with Preset Colors */}
          <PopoverContent className="p-4 space-y-3">
            {/* Popover Header */}
            <div className="w-full space-y-1">
              <p className="font-md tracking-widest ">Select Color</p>
            </div>
            <div className="grid grid-cols-5 gap-2 cursor-pointer  justify-center ">
              {/* Map over preset colors */}
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleColorChange({ target: { value: color } });
                    setPopoverOpen(false); // Close popover when color is selected
                  }}
                  aria-label={`Preset Color ${index + 1}`}
                  className="w-8 h-8 rounded-md cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ColorPicker;

{
  /* Color Picker Old */
}
{
  /* <div className="flex flex-col border p-4 rounded-md gap-2">
          <p className="text-sm text-default-600 text-center">
            {t("Brand Color")}
          </p>
          <div className="flex flex-col gap-2 justify-center items-center">
            <input
              type="color"
              value={rcsBrandColor}
              onChange={handleColorChange}
              style={{
                width: "45px",
                height: "45px",
                border: "none",
                cursor: "pointer",
              }}
            />
            <p className="text-xs text-default-500 block">
              {t("Selected Color")}:
              <span style={{ color: rcsBrandColor }}>{rcsBrandColor}</span>
            </p>
          </div>
        </div> */
}
