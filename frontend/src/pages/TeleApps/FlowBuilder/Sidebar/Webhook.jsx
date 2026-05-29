import { Input } from "@heroui/react";
import React, { useState } from "react";
import { CopyCodeIcon } from "../../../../utils/ReusableIcons";

export default function WebhookConfig() {
  const [isCopied, setIsCopied] = useState(false);
  const webhookUrl =
    "https://webhook.telepie.ai/api/v1/workflow/67c52d803b428754707ca71e/67c52e23b8369c726086ca6c";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <>
      <Input
        isReadOnly
        size="md"
        label="Webhook URL"
        labelPlacement="outside"
        placeholder="Enter webhook url"
        className="w-full"
        radius="sm"
        variant="bordered"
        value={webhookUrl}
        endContent={
          <div
            className="cursor-pointer flex items-center"
            onClick={handleCopy}
          >
            <CopyCodeIcon
              customClass={isCopied ? "text-success" : "text-default-700"}
            />
            {isCopied && (
              <span className="ml-1 text-small text-success">Copied!</span>
            )}
          </div>
        }
      />
    </>
  );
}
