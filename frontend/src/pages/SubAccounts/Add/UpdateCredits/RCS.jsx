import React from "react";
import { Input, Select, SelectItem } from "@heroui/react";

export default function RCSService() {
    return (
        <div className="flex flex-col space-y-8">
            <div className="flex justify-between w-2/3">
                <p className="text-md text-default-700 font-semibold">
                    Credits
                </p>
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
                <p className="text-md text-default-700 font-semibold">Action</p>
                <Select
                    isRequired
                    variant="flat"
                    size="lg"
                    className="w-2/3"
                    defaultSelectedKeys={["add"]}
                    radius="sm">
                    <SelectItem key="add">Add Credits</SelectItem>
                    <SelectItem key="remove">Remove Credits</SelectItem>
                </Select>
            </div>
        </div>
    );
}
