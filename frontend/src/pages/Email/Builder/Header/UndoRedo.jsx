import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function UndoRedo() {
  return (
    <div className="space-x-4 ">
      <Tooltip content="Undo">
        <Button isIconOnly size="sm" radius="sm" variant="bordered">
          <Icon
            icon="famicons:arrow-undo-outline"
            width="20"
            height="20"
            className="text-defualt-400"
          />
        </Button>
      </Tooltip>

      <Tooltip content="Redo">
        <Button isIconOnly size="sm" radius="sm" variant="bordered">
          <Icon
            icon="famicons:arrow-redo-outline"
            width="20"
            height="20"
            className="text-defualt-400"
          />
        </Button>
      </Tooltip>
    </div>
  );
}
