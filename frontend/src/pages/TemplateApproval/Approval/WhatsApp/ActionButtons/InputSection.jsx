import React, { useEffect, useState } from "react";
import { Button, select, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import SuggestionFields from "./Suggestions/SuggestionFields";
import UrlActions from "./UrlActions";
import Dialer from "./Dialer";
import LocationQuery from "./LocationQuery";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";
import { DragHandleIcon, TrashIcon } from "../../../../../utils/ReusableIcons";

const actions = [
  { key: "quick_reply", label: "Custom", maxCount: 10 },
  { key: "url", label: "Visit Website", maxCount: 3 },
  { key: "phone_number", label: "Phone Number", maxCount: 1 },
  { key: "copy_code", label: "Copy Offer Code", maxCount: 1 },
];

  const InputSection = React.memo(({
  deleteSectionHandler,
  addSectionHandler,
  section,
  id,
  cardId
  }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { t } = useTranslation();

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: "grab",
    };

    const {
      updateButtonField,
      selectedTemplateType,
      actionCounts,
      incrementActionCount,
      decrementActionCount,
    } = useWhatsappTemplateStore();

    const [selectedAction, setSelectedAction] = useState(
      section.suggestionType
    );

    // Update actions with disabled state based on current counts
    const updatedActions = actions.map((action) => ({
      ...action,
      disabled: actionCounts[action.key] >= action.maxCount,
    }));

    // Handle initial count when component mounts
    useEffect(() => {
      if (section.suggestionType) {
        incrementActionCount(section.suggestionType);
      }

      // Cleanup on unmount
      return () => {
        if (section.suggestionType) {
          decrementActionCount(section.suggestionType);
        }
      };
    }, [section.suggestionType, incrementActionCount, decrementActionCount]);

  const onActinSelectionHandller = (e) => {
  const newAction = e.target.value;
  const oldAction = selectedAction;

      // Update global counts
      if (oldAction) decrementActionCount(oldAction);
      incrementActionCount(newAction);

      // Update selected action
      setSelectedAction(newAction);

      // Determine content type
      let contentType;
      switch (selectedTemplateType) {
        case "text":
          contentType = "textMessageContent";
          break;
        case "image":
          contentType = "singleImageContent";
          break;
        case "video":
          contentType = "videoContent";
          break;
        case "location":
          contentType = "location";
          break;
        case "document":
          contentType = "documentContent";
          break;
        case "WithExpiration":
          contentType = "LtoContent";
          break;
        case "WithoutExpiration":
          contentType = "LtoContent";
          break;
        case "carousel":
          contentType = "carouselItems";
          break;
        default:
          return;
      }

      // Update button field in the store
      updateButtonField(
        contentType,
        cardId,
        section.id,
        "suggestionType",
        newAction
      );
    };

    const handleDelete = () => {
      if (selectedAction) decrementActionCount(selectedAction);
      deleteSectionHandler(id);
    };

  const renderFields = () => {
    if (!section) return null; // Ensure section is defined

    switch (selectedAction) {
      case "quick_reply": return <SuggestionFields section={section} id={id} cardId={cardId} />;
      case "url": return <UrlActions section={section} id={id} cardId={cardId} />;
      case "phone_number": return <Dialer section={section} id={id} cardId={cardId} />;
      case "copy_code": return <LocationQuery section={section} id={id} cardId={cardId} />;
      default: return null;
    }
  };

    return (
      <div className="flex gap-1" ref={setNodeRef} style={style}>
        <div className="flex flex-1 gap-3 px-2 py-5 border-default border-1 rounded-md">
          {/* Type of Action */}
          <Select
            isRequired
            label={t("Type of Action")}
            placeholder={t("Select action type")}
            className="w-60"
            radius="sm"
            isDisabled={id === 1 || selectedTemplateType === "carousel"}
            defaultSelectedKeys={[section.suggestionType]}
            value={selectedAction || ""}
            onChange={onActinSelectionHandller}
          >
            {updatedActions.map((action) => (
              <SelectItem
                key={action.key}
                value={action.key}
                isDisabled={action.disabled}
              >
                {t(action.label)}
              </SelectItem>
            ))}
          </Select>

          {/* Render Input Fields */}
          <div className="flex-1">{renderFields()}</div>
        </div>

        <div className="flex flex-col w-fit gap-1 h-full">
          {/* Add button */}
          <Button
            isIconOnly
            color="default"
            variant="bordered"
            size="sm"
            onPress={addSectionHandler}
          >
            <Icon
              icon="iconamoon:sign-plus-duotone"
              width="1.6em"
              height="1.6em"
            />
          </Button>

          {/* Delete button */}
          <Button
            isIconOnly
            color="default"
            variant="bordered"
            size="sm"
            onPress={handleDelete}
            className={`
              ${id === 1 ? "cursor-not-allowed" : "cursor-pointer"}
          `}
            isDisabled={
              ["carousel", "WithExpiration", "WithoutExpiration"].includes(
                selectedTemplateType
              ) && id === 2
                ? "true"
                : "false" && id === 1
            }
          >
            <TrashIcon size="1.4em" customClass="text-danger-400" />
          </Button>

          {/* Drag Handle Icon */}
          <div
            {...attributes}
            {...listeners}
            className="flex justify-center items-center pb-4"
          >
            <DragHandleIcon
              customClass="cursor-grab text-default-500"
              size="1em"
            />
          </div>
        </div>
      </div>
    );
  }
);

export default InputSection;
