import React from "react";
import { Textarea } from "@heroui/react";
export default function NumberBox() {
  return (
    <div>
      <Textarea
        isRequired
        label="Numbers"
        labelPlacement="outside"
        placeholder="+91 9858734759"
        className="max-w-screen-lg text-gray-500"
        minRows="8"
        maxRows="10"
        description="Each line should contain exactly one number of 10 digits. You can paste up to 300K numbers. For more, use the CSV upload option."
      />
    </div>
  );
}
