import React from "react";
import { Image, Button } from "@heroui/react";

export default function RecentMedia() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-1">
        <Image
          src="https://picsum.photos/id/16/367/326"
          width={100}
          className="cursor-pointer rounded-md"
        />
        <Image
          src="https://picsum.photos/id/17/367/326"
          width={100}
          className="cursor-pointer rounded-md"
        />
        <Image
          src="https://picsum.photos/id/20/367/326"
          width={100}
          className="cursor-pointer rounded-md"
        />
        <Image
          src="https://picsum.photos/id/28/367/326"
          width={100}
          className="cursor-pointer rounded-md"
        />
        <Image
          src="https://picsum.photos/id/24/367/326"
          width={100}
          className="cursor-pointer rounded-md"
        />
        <Image
          src="https://picsum.photos/id/13/367/326"
          width={100}
          className="cursor-pointer rounded-md"
        />
      </div>

      <Button variant="flat" className="w-full" size="sm" color="default">
        Browser All
      </Button>
    </div>
  );
}
