import React from "react";
import { Icon } from "@iconify-icon/react";

export default function ElementLayoutCard({ layout }) {
    return (
        <div className="flex flex-col px-3 py-4  justify-center items-center gap-1 border rounded-xl cursor-pointer group hover:shadow-lg hover:border-success ">
            <Icon
                icon={layout.icon}
                width="1.8em"
                height="1.8em"
                className="text-default-500  group-hover:text-success group-hover:bg-success-100/30 p-1 w-10 h-9 rounded-xl"
            />
            <h2 className="text-xs group-hover:text-success">{layout.label}</h2>
        </div>
    );
}
