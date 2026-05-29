import React, { useState } from "react";
import { Button } from "@heroui/react";
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import SaveFlowModal from "./Modals/SaveFlowModal";
import { useFlowStore } from "../../../store/automationFlowStore/flowStore";
import { useRouteChangeModal } from "../../../store/automationFlowStore/routeChangeModal";
import RouteChangeModal from "./Modals/RunTestModal";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { PNGIcon } from "../../../utils/ReusableIcons";

export default function Buttons({ saveDraft, saveFlow }) {
  const { saveFlowModalVisible, setSaveFlowModalVisible } = useFlowStore();
  const { routeChangeModalOpen, setRouteChangeModalOpen } =
    useRouteChangeModal();
  const { t } = useTranslation();

  const routeChangeModalHandler = () => {
    setRouteChangeModalOpen(true);
  };

  const closeRouteChangeModal = () => {
    setRouteChangeModalOpen(false);
  };

  const saveFlowModalOpen = () => {
    setSaveFlowModalVisible(true);
  };

  const closeModal = () => setSaveFlowModalVisible(false);

  //   Route change modal handler

  return (
    <div className="flex gap-3">
      {/* <Button
        size="md"
        variant="bordered"
        color="default"
        radius="sm"
        onClick={saveDraft}
        className=" dark:text-white"
      >
        {t("Save Draft")}
      </Button> */}

      <Button
        size="md"
        variant="flat"
        color="default"
        radius="sm"
        onPress={setRouteChangeModalOpen}
        startContent={
          <Icon
            icon="material-symbols-light:play-circle-outline"
            width="24"
            height="24"
          />
        }
      >
        Test
      </Button>

      <Button
        onPress={saveFlowModalOpen}
        size="md"
        variant="flat"
        color="primary"
        radius="sm"
        startContent={
          <Icon
            icon="material-symbols-light:save-outline"
            width="24"
            height="24"
          />
        }
      >
        {t("Save Flow")}
      </Button>

      {/* Save Flow Modal */}
      <SaveFlowModal
        open={saveFlowModalVisible}
        closeModal={closeModal}
        saveFlow={saveFlow}
      />

      <RouteChangeModal
        openModal={routeChangeModalOpen}
        closeModal={closeRouteChangeModal}
      />
    </div>
  );
}

// Download Button

function downloadImage(dataUrl) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export const DownloadFlowButton = () => {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );

    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "#1a365d",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="bottom-left" className="pl-10">
      <Button
        onPress={onClick}
        size="sm"
        radius="sm"
        variant="bordered"
        className="download-btn"
        startContent={<PNGIcon customClass="text-default-800" size="1.5em" />}
      >
        Download PNG
      </Button>
    </Panel>
  );
};
