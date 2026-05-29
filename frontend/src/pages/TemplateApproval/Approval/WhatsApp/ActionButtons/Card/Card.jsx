import React, { useState } from "react";
import ActionButtonsIndex from "../Index";
import FooteraInput from "../InputFilelds/HeaderInput";
import MessageBox from "../../MessageBox";

export default function Card({ index, cardId }) {
  return (
    <>
      <MessageBox cardId={cardId} index={index} />
      <ActionButtonsIndex cardId={cardId} index={index} />
    </>
  );
}
