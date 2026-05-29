import React, { useState } from "react";
import { Input, Switch, Button, Textarea } from "@heroui/react";
import { Icon } from "@iconify-icon/react";

const InputField = ({ label = "Label", placeholder = "Stop" }) => (
    <Input
        label=""
        placeholder={placeholder}
        radius="sm"
        variant="flat"
        isRequired
        className="w-1/2"
    />
);

export default function OptIndex() {
    const [enabled, setEnabled] = useState(false);
    const [textareaValue, setTextareaValue] = useState(
        "Hi, It's sad to see you go. Anyways, we won't be sending you any further notifications"
    );

    const handleEnable = (e) => {
        setEnabled(e.target.checked);
    };

    const handleTextareaChange = (e) => {
        if (enabled) {
            setTextareaValue(e.target.value);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* First Top Card */}
            <div className="flex  p-10  border border-content3 rounded-md justify-between">
                {/* Left Side */}
                <div className="flex flex-col gap-4 ">
                    <h1 className="text-2xl font-semibold text-default-600">
                        Opt-out Keywords
                    </h1>
                    <p className="text-sm w-3/4">
                        The user will have to type exactly one of these messages
                        upon which they be will opted out
                    </p>

                    <div className="flex flex-col gap-3 mt-4">
                        <InputField placeholder="Stop" />
                        <InputField placeholder="Unsubscribe" />
                        <InputField placeholder="Cancel" />
                        <InputField placeholder="OptOut" />

                        <Button
                            variant="flat"
                            radius="sm"
                            className="w-1/2"
                            color="success"
                        >
                            Add Item
                        </Button>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-semibold text-default-600">
                        Opt-out Response
                    </h1>

                    <p className="text-sm">
                        Setup a response message for opt-out user keywords
                    </p>

                    <div className="flex justify-between">
                        <Switch
                            size="sm"
                            checked={enabled}
                            onChange={handleEnable}
                        >
                            Enable
                        </Switch>

                        <Button
                            size="sm"
                            radius="sm"
                            variant="bordered"
                            color=""
                            startContent={
                                <Icon
                                    icon="iconamoon:edit-duotone"
                                    width="1.2em"
                                    height="1.2em"
                                />
                            }
                        >
                            Edit
                        </Button>
                    </div>

                    <Textarea
                        variant="flat"
                        minRows={3}
                        placeholder="Enter your description"
                        value={textareaValue}
                        onChange={handleTextareaChange}
                        disabled={!enabled}
                        description="Reply START to subscribe again"
                        classNames={{
                            base: "w-full",
                            input: "resize-y min-h-[60px]",
                        }}
                        startContent={
                            <Icon
                                icon="logos:whatsapp-icon"
                                width="1.2em"
                                height="1.2em"
                            />
                        }
                    />
                </div>
            </div>
        </div>
    );
}
