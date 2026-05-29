import { useState } from "react";
import { useWhatsappTemplateStore } from "../../../../../../store/templateApprovalStore";
import { Radio, RadioGroup, Input } from "@heroui/react";

export const MediaType = () => {
  const { setMediaType, mediaType } = useWhatsappTemplateStore();
  const handleChange = (value) => {
    setMediaType(value);
  };

  return (
    <div className="flex gap-3">
      <p className="text-default-600 font-medium text-medium">Media Type:</p>
      <RadioGroup
        orientation="horizontal"
        value={mediaType}
        onValueChange={handleChange}
      >
        {[
          { key: "image", label: "Image" },
          { key: "video", label: "Video" },
        ].map((option) => (
          <Radio key={option.key} value={option.key}>
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
};

export const TimeOfferInput = () => {
  const { LtoContent, setLTO } = useWhatsappTemplateStore();
  const [charCount, setCharCount] = useState(0);
  const maxChars = 16;

  const handleFooterTextChange = (e) => {
    const value = e.target.value;
    setCharCount(value.length);
    setLTO({
      ...LtoContent,
      timeOffertext: value,
    });
  };
  return (
    <>
      <Input
        value={LtoContent?.timeOffertext}
        type="text"
        radius="sm"
        label={"Limited Time Offer Text"}
        variant="flat"
        isInvalid={LtoContent?.timeOffertext.length > maxChars}
        color={
          LtoContent?.timeOffertext.length > maxChars ? "danger" : "default"
        }
        errorMessage={`Footer Text can only contain ${maxChars} characters.`}
        className=""
        onChange={handleFooterTextChange}
      />
      <div className="flex justify-end">
        <div className="flex gap-2 items-center justify-center">
          <p className="text-xs text-gray-500">
            Characters used: {charCount}/{maxChars}
          </p>
        </div>
      </div>
    </>
  );
};
