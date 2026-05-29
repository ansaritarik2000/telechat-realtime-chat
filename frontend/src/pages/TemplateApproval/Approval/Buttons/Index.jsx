import React from "react";
import Submit from "./Submit";
import Discard from "./Discard";
import Reset from "./Reset";
import { useTemplateStore } from "../../../../store/templateApprovalStore";
import { useNavigate } from "react-router-dom";
// import SendBtn from "./SendBtn";

export default function FooterButtons({ onSubmit }) {
  const { resetStore } = useTemplateStore();
  const navigate = useNavigate();

  // reset handller
  const resetHandller = () => {
    resetStore();
  };

  // discard handller
  const discardHandller = () => {
    resetStore();
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center space-x-4">
      <div className="flex space-x-4">
        <Discard discardHandller={discardHandller} />
        <Reset resetHandller={resetHandller} />
      </div>
      <Submit onSubmit={onSubmit} />
    </div>
  );
}
