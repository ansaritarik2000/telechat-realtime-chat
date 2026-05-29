import React from "react";
import { Input, Button, Image, Link, Snippet } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import HealthIndex from "./HealthIndex";

const InputField = ({
    label = "Label",
    placeholder = "",
    variant = "flat",
}) => (
    <Input
        label={label}
        placeholder=""
        className=""
        radius="sm"
        variant={variant}
        isRequired
    />
);

export default function MetaIndex() {
    return (
        <div className="flex flex-col gap-6 mt-3">
            <div className="flex gap-4 items-center border border-content3 rounded-lg border-shadow bg-default-50 p-10">
                <Image src="wa-meta-webhook.svg" width={250} className="p-1" />

                <div className="flex flex-col gap-3 w-1/3">
                    <h1 className="text-2xl font-semibold text-default-600">
                        Meta Onboarding
                    </h1>

                    <Snippet symbol="$" size="md">
                        https://wa.telepie.com/embedded-signup
                    </Snippet>

                    <Button
                        // showAnchorIcon
                        as={Link}
                        href="https://wa.telepie.com/embedded-signup"
                        variant="flat"
                        radius="sm"
                        color="primary"
                        endContent={
                            <Icon
                                icon="mingcute:external-link-line"
                                width="1.2em"
                                height="1.2em"
                            />
                        }
                    >
                        Meta API
                    </Button>
                </div>
            </div>

            {/* Input Fields */}
            {/* <div className="w-1/2 flex flex-col gap-3 border rounded-lg px-4 py-8 border-shadow shadow-md">
        <InputField
          label="WhatsApp Business Account ID"
          placeholder="215653001634796"
        />
        <InputField label="Business Account ID" placeholder="215653001634796" />
        <InputField
          label="Meta Access Token"
          placeholder="EAAQI9Tit5nABOwhfXmrkfgf2E3ZBTKsyAWEbo6PWc78gLykblbV9DFvx"
        />
        <InputField label="WhatsApp Phone ID" placeholder="230745540118212" />
        <InputField label="App ID" placeholder="1135749217773168" />

        <div className="flex justify-end mt-10 gap-3 ">
          <Button
            variant="flat"
            radius="sm"
            color="primary"
            className="max-w-full"
            startContent={
              <Icon
                icon="ant-design:api-twotone"
                width="1.2em"
                height="1.2em"
              />
            }
          >
            Fetch Request
          </Button>
          <Button
            variant="flat"
            radius="sm"
            color="success"
            className="max-w-full"
            startContent={
              <Icon
                icon="lets-icons:save-duotone"
                width="1.2em"
                height="1.2em"
              />
            }
          >
            Save
          </Button>
        </div>
      </div> */}
            <HealthIndex />
        </div>
    );
}
