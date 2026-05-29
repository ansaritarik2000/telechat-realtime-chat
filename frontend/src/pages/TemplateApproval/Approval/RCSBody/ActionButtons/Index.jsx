import React, { useEffect, useState } from "react";
import InputSection from "./InputSection";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

export default function ActionButtonsIndex({ cardId }) {
  const { t } = useTranslation();

  const {
    setTextMessageContent,
    textMessageContent,
    singleImageContent,
    setSingleImageContent,
    videoContent,
    setVideoContent,
    selectedTemplateType,
    carouselItems,
    setCarouselItems,
  } = useTemplateStore();

  // drag and drop action buttons
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return; // Exit if no valid drop target or if the item was dropped in the same position
    }

    // Check the template type
    switch (selectedTemplateType) {
      // text content
      case "text_message": {
        const oldIndex = textMessageContent.buttons.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = textMessageContent.buttons.findIndex(
          (item) => item.id === over.id
        );

        // Reorder the buttons using arrayMove
        const newOrder = arrayMove(
          textMessageContent.buttons,
          oldIndex,
          newIndex
        );

        // Update Zustand store with the new order of buttons
        setTextMessageContent({
          ...textMessageContent,
          buttons: newOrder,
        });
        break;
      }

      // single image
      case "singleimg": {
        const oldIndex = singleImageContent.buttons.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = singleImageContent.buttons.findIndex(
          (item) => item.id === over.id
        );

        // Reorder the buttons using arrayMove
        const newOrder = arrayMove(
          singleImageContent.buttons,
          oldIndex,
          newIndex
        );

        // Update Zustand store with the new order of buttons
        setSingleImageContent({
          ...singleImageContent,
          buttons: newOrder,
        });
        break;
      }

      // video content
      case "video": {
        const oldIndex = videoContent.buttons.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = videoContent.buttons.findIndex(
          (item) => item.id === over.id
        );

        // Reorder the buttons using arrayMove
        const newOrder = arrayMove(videoContent.buttons, oldIndex, newIndex);

        // Update Zustand store with the new order of buttons
        setVideoContent({
          ...videoContent,
          buttons: newOrder,
        });
        break;
      }

      // carousel case
      case "imgcarousel": {
        // Find the specific carousel item based on cardId
        const targetCarouselItem = carouselItems.find(
          (item) => item.id === cardId
        );

        if (!targetCarouselItem) {
          return; // Exit if no matching carousel item
        }

        const oldIndex = targetCarouselItem.buttons.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = targetCarouselItem.buttons.findIndex(
          (item) => item.id === over.id
        );

        // Reorder the buttons using arrayMove
        const newOrder = arrayMove(
          targetCarouselItem.buttons,
          oldIndex,
          newIndex
        );

        // Create a new carouselItems array with the updated buttons for the matched item
        const updatedCarouselItems = carouselItems.map((item) =>
          item.id === cardId ? { ...item, buttons: newOrder } : item
        );

        // Update Zustand store with the new order of buttons in the matched carousel item
        setCarouselItems(updatedCarouselItems);
        break;
      }

      default:
        // Handle other template types if necessary
        break;
    }
  };

  // add action buttons

  const addSectionHandler = () => {
    switch (selectedTemplateType) {
      case "text_message":
        return setTextMessageContent({
          ...textMessageContent,
          buttons: [
            ...textMessageContent.buttons,
            {
              id: textMessageContent.buttons.length + 1,
              suggestionType: "reply",
              displayText: "",
              postback: "",
            },
          ],
        });

      case "singleimg":
        return setSingleImageContent({
          ...singleImageContent,
          buttons: [
            ...singleImageContent.buttons,
            {
              id: singleImageContent.buttons.length + 1,
              suggestionType: "reply",
              displayText: "",
              postback: "",
            },
          ],
        });

      case "video":
        return setVideoContent({
          ...videoContent,
          buttons: [
            ...videoContent.buttons,
            {
              id: videoContent.buttons.length + 1,
              suggestionType: "reply",
              displayText: "",
              postback: "",
            },
          ],
        });

      case "imgcarousel": {
        // Find the specific carousel item based on cardId
        const targetCarouselItem = carouselItems.find(
          (item) => item.id === cardId
        );

        if (!targetCarouselItem) {
          return; // Exit if no matching carousel item
        }

        // Create a new button for the carousel item
        const newButton = {
          id: targetCarouselItem.buttons.length + 1,
          suggestionType: "reply",
          displayText: "",
          postback: "",
        };

        // Update the carouselItems array with the new button in the matched item
        const updatedCarouselItems = carouselItems.map((item) =>
          item.id === cardId
            ? { ...item, buttons: [...item.buttons, newButton] }
            : item
        );

        // Update Zustand store with the new carousel items
        return setCarouselItems(updatedCarouselItems);
      }

      default:
        return null;
    }
  };

  // delete action buttons
  const deleteSectionHandler = (id) => {
    if (id === 1) {
      return; // Prevent deletion of the first action
    }

    switch (selectedTemplateType) {
      case "text_message":
        return setTextMessageContent({
          ...textMessageContent,
          buttons: textMessageContent.buttons?.filter((item) => item.id !== id),
        });

      case "singleimg":
        return setSingleImageContent({
          ...singleImageContent,
          buttons: singleImageContent.buttons?.filter((item) => item.id !== id),
        });

      case "video":
        return setVideoContent({
          ...videoContent,
          buttons: videoContent.buttons?.filter((item) => item.id !== id),
        });

      case "imgcarousel": {
        // Find the specific carousel item based on cardId
        const targetCarouselItem = carouselItems.find(
          (item) => item.id === cardId
        );

        if (!targetCarouselItem) {
          return; // Exit if no matching carousel item
        }

        // Filter out the button with the matching id in the specific carousel item
        const updatedButtons = targetCarouselItem.buttons?.filter(
          (item) => item.id !== id
        );

        // Update the carouselItems array with the filtered buttons for the matched item
        const updatedCarouselItems = carouselItems.map((item) =>
          item.id === cardId ? { ...item, buttons: updatedButtons } : item
        );

        // Update Zustand store with the new carousel items
        return setCarouselItems(updatedCarouselItems);
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-4 h-min-screen pb-8">
      {/* Action Buttons header */}
      <div className="flex justify-between">
        <div>
          <p className="font-medium text-default-600 text-lg ">
            {t("Actions Buttons")}
          </p>
        </div>
      </div>

      {/* Input Fields Section */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          // Pass an array of section ids
          items={
            selectedTemplateType === "text_message"
              ? textMessageContent.buttons.map((section) => section.id)
              : selectedTemplateType === "singleimg"
              ? singleImageContent?.buttons?.map((section) => section.id)
              : selectedTemplateType === "video"
              ? videoContent?.buttons?.map((section) => section.id)
              : selectedTemplateType === "imgcarousel"
              ? carouselItems
                  .find((carousel) => carousel.id === cardId)
                  ?.buttons?.map((section) => section.id) || []
              : []
          }
          strategy={verticalListSortingStrategy}
        >
          {selectedTemplateType === "text_message"
            ? textMessageContent.buttons.map((section) => (
                <InputSection
                  key={section.id}
                  id={section.id}
                  action={section}
                  addSectionHandller={addSectionHandler}
                  deleteSectionHandller={deleteSectionHandler}
                />
              ))
            : selectedTemplateType === "singleimg"
            ? singleImageContent?.buttons?.map((section) => (
                <InputSection
                  key={section.id}
                  id={section.id}
                  action={section}
                  addSectionHandller={addSectionHandler}
                  deleteSectionHandller={deleteSectionHandler}
                />
              ))
            : selectedTemplateType === "video"
            ? videoContent?.buttons?.map((section) => (
                <InputSection
                  key={section.id}
                  id={section.id}
                  action={section}
                  addSectionHandller={addSectionHandler}
                  deleteSectionHandller={deleteSectionHandler}
                />
              ))
            : selectedTemplateType === "imgcarousel"
            ? carouselItems
                .find((carousel) => carousel.id === cardId)
                ?.buttons?.map((section) => (
                  <InputSection
                    key={section.id}
                    id={section.id}
                    action={section}
                    addSectionHandller={addSectionHandler}
                    deleteSectionHandller={deleteSectionHandler}
                    cardId={cardId}
                  />
                ))
            : []}
        </SortableContext>
      </DndContext>
    </div>
  );
}
