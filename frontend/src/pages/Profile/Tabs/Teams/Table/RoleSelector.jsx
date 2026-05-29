import React, { useState } from "react";
import { useCheckbox, Chip, VisuallyHidden, tv } from "@heroui/react";

const checkbox = tv({
  slots: {
    base: "border-default ",
    content: "text-default-500 text-sm px-3 py-1",
  },
  variants: {
    isSelected: {
      true: {
        base: "border-primary hover:border-primary-500",
        content: "text-primary-foreground",
      },
      false: {
        base: "border-default bg-default hover:bg-default-200",
        content: "text-default-500",
      },
    },
    isFocusVisible: {
      true: {
        base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
      },
    },
  },
});

const RoleSelector = ({ handleRoleSelect, selectRole }) => {
  const [selectedRole, setSelectedRole] = useState(selectRole);

  const roles = ["Admin", "Agent", "Viewer", "Campaigner"];

  const handleSelect = (role) => {
    handleRoleSelect(role);
    setSelectedRole(role);
  };

  const RoleCheckbox = ({ label, isSelected, onSelect }) => {
    const {
      children,
      isFocusVisible,
      getBaseProps,
      getLabelProps,
      getInputProps,
    } = useCheckbox({
      defaultSelected: false,
      isSelected, // Use the selected state from the parent
      onChange: onSelect, // Call onSelect when the checkbox state changes
    });

    const styles = checkbox({ isSelected, isFocusVisible });

    const handleChipColor = () => {
      const colorMap = {
        Admin: "success",
        Agent: "primary",
        Viewer: "warning",
        Campaigner: "secondary",
      };
      return isSelected ? colorMap[label] || "default" : "default";
    };

    return (
      <div>
        <label {...getBaseProps()}>
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
          <Chip
            classNames={{
              base: styles.base(),
              content: styles.content(),
            }}
            size="sm"
            color={handleChipColor()}
            variant="solid"
            {...getLabelProps()}
          >
            {children ? children : label}
          </Chip>
        </label>
      </div>
    );
  };

  return (
    <div className="flex gap-2">
      {roles.map((role) => (
        <RoleCheckbox
          key={role}
          label={role}
          isSelected={selectedRole === role}
          onSelect={() => handleSelect(role)}
        />
      ))}
    </div>
  );
};

export default RoleSelector;
