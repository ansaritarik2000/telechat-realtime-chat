import React, { lazy, Suspense } from "react";
import Crumb from "../../../components/Breadcrumb/Crumb.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner.jsx";
import TemplatesPreview from "./TemplatePreview/Index.jsx";
import { usePreviewTemplateStore } from "../../../store/automationFlowStore/previewModal.js";
const Flow = lazy(() => import("./Flow.jsx"));

export default function FlowBuilder() {
  const { visible, setVisible } = usePreviewTemplateStore();

  const closeModal = () => setVisible(false);

  return (
    <div className=" h-screen">
      <Crumb
        secondSib="TeleApps"
        secondURL="/teleapps"
        thirdSib="Flow Builder"
      />

      <div className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Flow />
          <TemplatesPreview open={visible} closeModal={closeModal} />
        </Suspense>
      </div>
    </div>
  );
}
