import React from "react";
import IconsList from "../Data/IconsList";

export default function IconsGrid({
  updateSocialIcons,
  selectedIcons = [],
  iconStyle,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-1 py-2 border-1 rounded-lg border-default-300">
      {IconsList.filter(
        (icon) =>
          !selectedIcons.some((selected) => selected.icon === icon[iconStyle])
      ).map((icon) => (
        <img
          key={icon.name}
          src={icon[iconStyle] || icon.default} // Use selected icon style
          alt={icon.name}
          className="w-10 h-10 cursor-pointer hover:opacity-75 bg-default rounded-full"
          onClick={() => updateSocialIcons(icon)}
        />
      ))}
    </div>
  );
}
