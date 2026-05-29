import React from "react";
import { Icon } from "@iconify/react";

export default function SocialMediaFooter() {
  return (
    <div className="flex items-center justify-center gap-2">
      <SocialMediaIcon
        icon="flowbite:linkedin-solid"
        href="https://www.linkedin.com/company/telepietechnology"
      />
      <SocialMediaIcon
        icon="basil:facebook-solid"
        href="https://www.facebook.com/profile.php?id=61558607226448"
      />
      <SocialMediaIcon
        icon="proicons:x-twitter"
        href="https://x.com/TelepieT"
      />
      <SocialMediaIcon
        icon="ic:twotone-whatsapp"
        href="https://wa.me/+918368615329"
      />
      <SocialMediaIcon icon="fluent:call-16-regular" href="tel:+919718821876" />
    </div>
  );
}

export function SocialMediaIcon({ icon, href }) {
  return (
    <a
      href={href}
      className="flex items-center justify-center w-8 h-8 rounded-lg  text-white cursor-pointer shadow-sm hover:scale-125 hover:bg-gray hover:border hover:border-success duration-150 transition-all"
    >
      <Icon icon={icon} width={20} />
    </a>
  );
}
