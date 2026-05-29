import React from "react";

export default function ColorPicker({ label, value, onhandleInputChange }) {
  return (
    <div className="flex justify-between  items-center  px-4  py-2 border-2 border-content3 rounded-lg w-full">
      <label className="text-sm">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onhandleInputChange(e.target.value)}
        className="cursor-pointer"
      />
    </div>
  );
}
