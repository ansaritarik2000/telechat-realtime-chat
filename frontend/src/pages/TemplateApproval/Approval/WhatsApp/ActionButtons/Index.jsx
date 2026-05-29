import React, { useEffect, useState } from "react";
import InputSection from "./InputSection";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";

export default function ActionButtonsIndex({ cardId, index }) {
  const { t } = useTranslation();
  const {
    textMessageContent,
    singleImageContent,
    videoContent,
    location,
    selectedTemplateType,
    addButton,
    removeButton,
    documentContent,
    setTextMessageContent,
    setSingleImageContent,
    setVideoContent,
    setDocumentContent,
    setCarouselItems,
    setLocation,
    carouselItems,
    setLTO,
    LtoContent,
    resetActionCounts
  } = useWhatsappTemplateStore();

// Check the data comes or not
//   console.log(index,cardId,"ActionButtonsIndex Coponents")
  const data = carouselItems.find((item)=> item.id===cardId);
  useEffect(() => {
    resetActionCounts();
  }, [selectedTemplateType, resetActionCounts]);
   // drag and drop action buttons
 const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log("drag and drop:", event);
    if (!over || active.id === over.id) {
      return; // Exit if no valid drop target or if the item was dropped in the same position
    }

    // Check the template type
    switch (selectedTemplateType) {
      // text content
      case "text": {
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

      //   single image
      case "image": {
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
      // Location case
      case "location": {
        const oldIndex = location.buttons.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = location.buttons.findIndex(
          (item) => item.id === over.id
        );

        // Reorder the buttons using arrayMove
        const newOrder = arrayMove(location.buttons, oldIndex, newIndex);

        // Update Zustand store with the new order of buttons
        setLocation({
          ...location,
          buttons: newOrder,
        });
        break;
      }

      case "document": {
        const oldIndex = documentContent.buttons.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = documentContent.buttons.findIndex(
          (item) => item.id === over.id
        );

        // Reorder the buttons using arrayMove
        const newOrder = arrayMove(documentContent.buttons, oldIndex, newIndex);

        // Update Zustand store with the new order of buttons
        setDocumentContent({
          ...documentContent,
          buttons: newOrder,
        });
        break;
      }

      //   carousel case
      case "carousel": {
        const carouselItemsData = carouselItems.find(
          (item) => item.id === cardId
        );
        const oldIndex = carouselItemsData?.buttons?.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = carouselItemsData?.buttons?.findIndex(
          (item) => item.id === over.id
        );

        // Reorder the buttons using arrayMove
        const newOrder = arrayMove(
          carouselItemsData?.buttons,
          oldIndex,
          newIndex
        );

        // Update Zustand store with the new order of buttons
        setCarouselItems({
          ...carouselItemsData,
          buttons: newOrder,
        });
        break;
      }
      case "WithExpiration":
      case "WithoutExpiration": {
        const oldIndex = LtoContent.buttons.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = LtoContent.buttons.findIndex(
          (item) => item.id === over.id
        );

        // Reorder the buttons using arrayMove
        const newOrder = arrayMove(LtoContent.buttons, oldIndex, newIndex);

        // Update Zustand store with the new order of buttons
        setLTO({
          ...LtoContent,
          buttons: newOrder,
        });
        break;
      }

      default:
        // Handle other template types if necessary
        break;
    }
  };

  const addSectionHandler = () => {
    if (selectedTemplateType === "carousel") return;
    const newButton = {
      id: 0, // ID will be auto-generated in the store
      suggestionType: "quick_reply",
      displayText: "",
      displayTextValue: "",
    };
    //  console.log("section.id", section.id)
    switch (selectedTemplateType) {
      case "text":
        addButton("textMessageContent", newButton, null);
        break;
      case "image":
        addButton("singleImageContent", newButton, null);
        break;
      case "video":
        addButton("videoContent", newButton, null);
        break;
      case "location":
        addButton("location", newButton, null);
        break;
      case "document":
        addButton("documentContent", newButton, null);
        break;
      case "carousel":
        addButton("carouselItems", newButton, cardId);
        break;
      case "WithExpiration":
      case "WithoutExpiration":
        addButton("LtoContent", newButton, null);
        break;
      default:
        break;
    }
  };

  const deleteSectionHandler = (id) => {
    if (selectedTemplateType === "carousel") return;
    if (id === 1) return; // Prevent deletion of the first action
    if(id===2 && ["WithExpiration", "WithoutExpiration"].includes(selectedTemplateType) ) return;
    switch (selectedTemplateType) {
      case "text":
        removeButton("textMessageContent", id);
        break;
      case "image":
        removeButton("singleImageContent", id);
        break;
      case "video":
        removeButton("videoContent", id);
        break;
      case "location":
        removeButton("location", id);
        break;
      case "document":
        removeButton("documentContent", id);
        break;
      case "carousel":
        removeButton("carouselItems", id, cardId);
        break;
      case "WithExpiration":
      case "WithoutExpiration":
        removeButton("LtoContent", id);
        break;
      default:
        break;
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
          items={
            selectedTemplateType === "text"
              ? textMessageContent.buttons.map((btn) => btn.id)
              : selectedTemplateType === "image"
              ? singleImageContent?.buttons?.map((btn) => btn.id)
              : selectedTemplateType === "video"
              ? videoContent?.buttons?.map((btn) => btn.id)
              : selectedTemplateType === "location"
              ? location?.buttons?.map((btn) => btn.id)
              : selectedTemplateType === "document"
              ? documentContent?.buttons?.map((btn) => btn.id)
              : ["WithExpiration", "WithoutExpiration"].includes(
                  selectedTemplateType
                )
              ? LtoContent?.buttons?.map((btn) => btn.id)
              : selectedTemplateType === "carousel"
              ? carouselItems
                  ?.find((item) => item.id === cardId)
                  ?.buttons?.map((btn) => btn.id)
              : []
          }
          strategy={verticalListSortingStrategy}
        >
          {selectedTemplateType === "text"
            ? textMessageContent?.buttons?.map((section) => (
                <InputSection
                  key={section.id} // Ensure unique and stable key
                  id={section.id}
                  section={section}
                  addSectionHandler={addSectionHandler}
                  deleteSectionHandler={deleteSectionHandler}
                />
              ))
            : selectedTemplateType === "image"
            ? singleImageContent?.buttons?.map((section) => (
                <InputSection
                  key={section.id}
                  id={section.id}
                  section={section}
                  addSectionHandler={addSectionHandler}
                  deleteSectionHandler={deleteSectionHandler}
                />
              ))
            : selectedTemplateType === "video"
            ? videoContent?.buttons?.map((section) => (
                <InputSection
                  key={section.id}
                  id={section.id}
                  section={section}
                  addSectionHandler={addSectionHandler}
                  deleteSectionHandler={deleteSectionHandler}
                />
              ))
            : selectedTemplateType === "location"
            ? location?.buttons?.map((section) => (
                <InputSection
                  key={section.id}
                  id={section.id}
                  section={section}
                  addSectionHandler={addSectionHandler}
                  deleteSectionHandler={deleteSectionHandler}
                />
              ))
            : selectedTemplateType === "document"
            ? documentContent?.buttons?.map((section) => (
                <InputSection
                  key={section.id}
                  id={section.id}
                  section={section}
                  addSectionHandler={addSectionHandler}
                  deleteSectionHandler={deleteSectionHandler}
                />
              ))
            : selectedTemplateType === "carousel"
            ? carouselItems
                ?.find((item) => item.id === cardId)
                ?.buttons?.map((section) => (
                  <InputSection
                    key={section.id}
                    id={section.id}
                    section={section}
                    addSectionHandler={addSectionHandler}
                    deleteSectionHandler={deleteSectionHandler}
                    cardId={cardId}
                  />
                ))
            : ["WithExpiration", "WithoutExpiration"].includes(
                selectedTemplateType
              )
            ? LtoContent?.buttons?.map((section) => (
                <InputSection
                  key={section.id}
                  id={section.id}
                  section={section}
                  addSectionHandler={addSectionHandler}
                  deleteSectionHandler={deleteSectionHandler}
                />
              ))
            : null}
        </SortableContext>
      </DndContext>
    </div>
  );
}
