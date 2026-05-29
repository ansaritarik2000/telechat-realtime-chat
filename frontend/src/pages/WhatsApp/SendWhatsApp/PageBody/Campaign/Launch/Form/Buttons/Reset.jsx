import React from "react";
import { Icon } from "@iconify-icon/react";
import { Button } from "@heroui/react";

export default function Reset({ onClick }) {
    return (
        <div>
            <Button
                size="md"
                radius="sm"
                startContent={
                    <Icon
                        icon="ri:reset-right-line"
                        width="1.2em"
                        height="1.2em"
                    />
                }
                color="default"
                variant="bordered"
                onClick={onClick}>
                Reset
            </Button>
        </div>
    );
}
