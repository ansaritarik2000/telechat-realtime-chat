import React from "react";
import { Chip, Tooltip } from "@heroui/react";
import { channelIcons } from "../../../../constants/channelIcons";

// Component that accepts a `channels` prop
const ChannelIconsRenderer = ({ channels }) => {
  // Filter the channelIcons array based on the `channels` prop
  const filteredIcons = channelIcons.filter((c) =>
    channels.includes(c.name.toLowerCase())
  );

  return (
    <div className="flex-center gap-1">
      {filteredIcons.map((c) => (
        <Tooltip key={c.id} content={c.name} placement="top">
          {c.icon}
        </Tooltip>
      ))}
    </div>
  );
};

export default ChannelIconsRenderer;
