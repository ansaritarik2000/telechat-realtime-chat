import React from "react";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/react";

const AndroidFooter = () => {
  return (
    <div className="flex items-center p-2 py-1 bg-white space-x-2">
      {/* Plus Icon */}
      <Icon icon="akar-icons:circle-plus" width={23} />
      {/* Image upload */}
      <Icon icon="mage:image-upload" width={24} />

      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Rcs message"
          radius="full"
          size="sm"
          readOnly
          startContent={<Icon icon="bi:emoji-smile" width={20} />}
          className="-px-2"
        />
      </div>
    </div>
  );
};

export default AndroidFooter;
