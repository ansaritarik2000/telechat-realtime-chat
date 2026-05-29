import React from "react";
import Card from "./CardSection/Card";
import ActionButtonsIndex from "./ActionButtons/Index";
import FallbackTextInput from "./TempType/FallbackTextInput";

const CardAndActions = ({ index, cardId, showFallbackTextInput = true }) => {
    return (
        <div className="flex flex-col gap-4">
            <Card index={index} />
            {showFallbackTextInput && <FallbackTextInput />}
            <ActionButtonsIndex cardId={cardId} />
        </div>
    );
};

export default CardAndActions;
