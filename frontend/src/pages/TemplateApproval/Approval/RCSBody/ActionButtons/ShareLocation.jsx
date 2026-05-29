import React, { useState } from "react";
import { Input } from "@heroui/react";
import SuggestionFields from "./Suggestions/SuggestionFields";

const maxChars = 13;

export default function ShareLocation({ action, cardId }) {
    const [textCharCount, setTextCharCount] = useState(0);

    const [textIsValid, setTextIsValid] = useState(true);

    const handleTextInput = (e) => {
        const inputLen = e.target.value.length;
        setTextCharCount(inputLen);

        if (inputLen <= maxChars) {
            setTextIsValid(true);
        } else {
            setTextIsValid(false);
        }
    };
    return (
        <div className="flex gap-3 flex-col">
            {/* Suggestion Fields */}
            <SuggestionFields action={action} cardId={cardId} />

            {/* <div className="w-full">
        <Input
          isRequired
          type="text"
          isInvalid={!textIsValid}
          radius="sm"
          label="Phone Number"
          variant="flat"
          className=""
          onChange={handleTextInput}
        />

        <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
          <p>
            Characters used: {textCharCount}/{maxChars}
          </p>
        </div>
      </div> */}
        </div>
    );
}
