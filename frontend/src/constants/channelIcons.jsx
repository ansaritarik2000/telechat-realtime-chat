import { Icon } from "@iconify/react";

export const channelIcons = [
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
