import React from "react";
import { Input, Select, SelectItem } from "@heroui/react";

export default function SMSService() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-between w-2/3">
        <p className="text-md text-default-700 font-semibold">Text</p>
        <Input
          isRequired
          type="text"
          size="lg"
          variant="flat"
          className="w-2/3"
          radius="sm"
          placeholder="0.2"
          description="Current Available Credits: 34562"
        />
      </div>

      <div className="flex justify-between w-2/3">
        <p className="text-md text-default-700 font-semibold">Multimedia</p>
        <Input
          isRequired
          type="text"
          size="lg"
          variant="flat"
          className="w-2/3"
          radius="sm"
          placeholder="0.25"
          description="Current Available Credits: 65634"
        />
      </div>

      <div className="flex justify-between w-2/3">
        <p className="text-md text-default-700 font-semibold">Conversational</p>
        <Input
          isRequired
          type="text"
          size="lg"
          variant="flat"
          className="w-2/3"
          radius="sm"
          placeholder="0.1"
          description="Current Available Credits: 3567"
        />
      </div>

      <div className="flex justify-between w-2/3">
        <p className="text-md text-default-700 font-semibold">P2A</p>
        <Input
          isRequired
          type="text"
          size="lg"
          placeholder=""
          variant="flat"
          className="w-2/3"
          radius="sm"
          description="Current Available Credits: 0"
        />
      </div>

      <div className="flex justify-between w-2/3">
        <p className="text-md text-default-700 font-semibold">Action</p>
        <Select
          isRequired
          variant="flat"
          size="lg"
          className="w-2/3"
          defaultSelectedKeys={["add"]}
          radius="sm"
        >
          <SelectItem key="add" className="bg-success-100">
            Add Credits
          </SelectItem>
          <SelectItem key="remove" className="bg-danger-100">
            Remove Credits
          </SelectItem>
        </Select>
      </div>

      <div>
        <SaveButton label="Save Changes" />
      </div>
    </div>
  );
}
