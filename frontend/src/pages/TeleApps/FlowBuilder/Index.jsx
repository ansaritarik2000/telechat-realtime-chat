import React from "react";
import Flow from "./Flow";
import TemplatesPreview from "./TemplatePreview/Index";
import { usePreviewTemplateStore } from "../../../store/automationFlowStore/previewModal";

export default function FlowIndex() {
  const { visible, setVisible } = usePreviewTemplateStore();

  const closeModal = () => setVisible(false);
  return (
    <div className="border border-default mr-2">
      <Flow />

      <TemplatesPreview open={visible} closeModal={closeModal} />
    </div>
  );
}
