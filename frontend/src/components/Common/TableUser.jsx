import React from "react";
import AvatarIndex from "../AvatarGen/Index";

export default function TableUser({
  avatarType = "character",
  avatarValue,
  size = "45",
  name,
  email,
}) {
  return (
    <div className="flex gap-2 items-center">
      <AvatarIndex
        isEditable={false}
        avatarType={avatarType}
        value={avatarValue || name}
        size={size}
      />
      <div className="flex flex-col gap-0">
        <p className="text-sm">{name}</p>
        <p className="text-xs text-default-500">{email}</p>
      </div>
    </div>
  );
}
