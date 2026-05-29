// import React, { useState } from "react";
// import { Icon } from "@iconify-icon/react";
// import { Tooltip } from "@heroui/react";

// const channelIcons = [
//   {
//     name: "SMS",
//     icon: (
//       <Icon
//         icon="fluent:chat-12-filled"
//         className="!text-[#fdc842]"
//         width={"1.4em"}
//       />
//     ),
//   },
//   {
//     name: "RCS",
//     icon: (
//       <Icon
//         icon="pajamas:image-comment-dark"
//         className="text-[#699df8]"
//         width={"1.4em"}
//       />
//     ),
//   },
//   {
//     name: "WhatsApp",
//     icon: <Icon icon="logos:whatsapp-icon" width={"1.4em"} />,
//   },
//   {
//     name: "Email",
//     icon: <Icon icon="skill-icons:gmail-light" width={"1.4em"} />,
//   },
// ];

// export default function ChannelsSelector() {
//   const [selectedChannels, setSelectedChannels] = useState([]);

//   const toggleChannel = (channelName) => {
//     setSelectedChannels((prevSelectedChannels) => {
//       if (prevSelectedChannels.includes(channelName)) {
//         // If the channel is already selected, remove it
//         return prevSelectedChannels.filter((name) => name !== channelName);
//       } else {
//         // Otherwise, add it to the selected channels list
//         return [...prevSelectedChannels, channelName];
//       }
//     });
//   };

//   return (
//     <div className="relative flex flex-col gap-0 py-6 px-6 rounded-md bg-content2">
//       <div className="flex gap-1">
//         <span className="text-md text-default-500">Channels:</span>
//         {channelIcons.map((channel) => (
//           <div key={channel.name} className="flex cursor-pointer relative">
//             <Tooltip content={channel.name}>
//               <div onClick={() => toggleChannel(channel.name)}>
//                 {channel.icon}
//                 {/* Show tick icon above the selected icon */}
//                 {selectedChannels?.includes(channel.name) && (
//                   <Icon
//                     icon="mdi:check-circle"
//                     className="absolute -top-3 right-0 text-green-500"
//                     width={"0.9em"}
//                   />
//                 )}
//               </div>
//             </Tooltip>
//           </div>
//         ))}
//       </div>

//       {/* Show assigned / selected channels names */}
//       <p className="text-xs text-default-400">
//         {"Selected Channels"}: {selectedChannels.join(", ") || "None"}
//       </p>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { Chip, Tooltip } from "@heroui/react";

const channelIcons = [
  {
    name: "SMS",
    icon: (
      <Icon
        icon="fluent:chat-12-filled"
        className="!text-[#fdc842]"
        width={"1.4em"}
      />
    ),
  },
  {
    name: "RCS",
    icon: (
      <Icon
        icon="pajamas:image-comment-dark"
        className="text-[#699df8]"
        width={"1.4em"}
      />
    ),
  },
  {
    name: "WhatsApp",
    icon: <Icon icon="logos:whatsapp-icon" width={"1.4em"} />,
  },
  {
    name: "Email",
    icon: <Icon icon="skill-icons:gmail-light" width={"1.4em"} />,
  },
];

export default function Channels() {
  const [selectedChannels, setSelectedChannels] = useState([]);

  const handleToggleChannel = (channelName) => {
    setSelectedChannels((prevSelectedChannels) => {
      if (prevSelectedChannels.includes(channelName)) {
        return prevSelectedChannels.filter((name) => name !== channelName);
      } else {
        return [...prevSelectedChannels, channelName];
      }
    });
  };

  const handleRemoveChannel = (channelName) => {
    setSelectedChannels((prevSelectedChannels) =>
      prevSelectedChannels.filter((name) => name !== channelName)
    );
  };

  return (
    <div className="relative flex flex-col gap-4 py-6 px-6 rounded-md bg-content2">
      {/* Select Channels */}
      <div className="flex gap-2 mb-4 ">
        <span className="text-md text-default-500">Select Channels:</span>
        {channelIcons.map((channel) => (
          <div
            key={channel.name}
            className="flex cursor-pointer relative "
            onClick={() => handleToggleChannel(channel.name)}
          >
            <Tooltip content={channel.name}>{channel.icon}</Tooltip>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* Display selected channels as chips */}
        {selectedChannels.map((channel) => (
          <Chip
            key={channel}
            variant="bordered"
            onClose={() => handleRemoveChannel(channel)}
            className="flex items-center gap-1"
            startContent={channelIcons.find((c) => c.name === channel)?.icon}
          >
            {channel}
          </Chip>
        ))}
      </div>

      {/* Show assigned / selected channels names */}
      <p className="text-xs text-default-400">
        {"Selected Channels"}:{" "}
        {selectedChannels.length > 0 ? selectedChannels.join(", ") : "None"}
      </p>
    </div>
  );
}
