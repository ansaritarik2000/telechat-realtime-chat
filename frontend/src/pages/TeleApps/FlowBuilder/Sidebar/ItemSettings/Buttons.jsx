import React from "react";
import { Button } from "@heroui/react";
import { useFlow } from "../../FlowContext";

export default function Buttons({ saveBtn }) {
  const { menu, setMenu } = useFlow();

  const handleOnClick = () => {
    setMenu("ChildMenu");
  };

  return (
    <div className="flex-between">
      {/* Reset Button */}
      <Button variant="bordered" size="sm" radius="sm" isDisabled={false}>
        Reset
      </Button>
      {/* Save Button */}
      <Button
        variant="solid"
        color="primary"
        size="sm"
        radius="sm"
        isDisabled={saveBtn}
        onPress={handleOnClick}
      >
        Save
      </Button>
    </div>
  );
}
