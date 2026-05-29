import React from "react";
import { Textarea } from "@heroui/react";
import { cn } from "@heroui/react";

const PromptInput = React.forwardRef(({ classNames = {}, ...props }, ref) => {
    return (
        <Textarea
            ref={ref}
            aria-label="Prompt"
            style={{
                cursor: "default",
            }}
            className="min-h-[40px] cusror-none text-xs text-default-500 rounded-t-lg"
            classNames={{
                ...classNames,
                label: cn("hidden", classNames?.label),
                input: cn("py-0", classNames?.input),
            }}
            minRows={1}
            placeholder="Message Preview"
            radius="lg"
            variant="bordered"
            {...props}
        />
    );
});

export default PromptInput;

PromptInput.displayName = "PromptInput";
