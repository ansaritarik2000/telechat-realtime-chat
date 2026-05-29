import { Button, Divider } from "@heroui/react";

const ActionButton = ({ suggestion_text = "", icon }) => {
  return (
    <div className="flex flex-col justify-between items-center">
      <div className="w-full">
        <Divider />
      </div>
      <Button
        size="md"
        variant="none"
        radius="none"
        color="primary"
        startContent={icon}
        className="w-full"
        disableAnimation={true}
      >
        <span className="text-primary text-xs">
          {suggestion_text || "Button Label"}
        </span>
      </Button>
    </div>
  );
};

export default ActionButton;
