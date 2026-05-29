import React, { useState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import SuggestionFields from "./Suggestions/SuggestionFields";
import UrlActions from "./UrlActions";
import Dialer from "./Dialer";
import GeoLocation from "./Geolocation";
import LocationQuery from "./LocationQuery";
import ShareLocation from "./ShareLocation";
import CalEvent from "./CalEvent";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

const actions = [
  { key: "reply", label: "Reply" },
  { key: "url_action", label: "URL Action" },
  { key: "dialer_action", label: "Dialer Action" },
  { key: "view_location_latlong", label: "View GeoLocation" },
  { key: "view_location_query", label: "View Location (Query)" },
  { key: "share_location", label: "Share Location" },
  { key: "calendar_event", label: "Calendar Event" },
];

export default function InputSection({
  cardId,
  id,
  action,
  addSectionHandller,
  deleteSectionHandller,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const { t } = useTranslation();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  const {
    videoContent,
    setVideoContent,
    textMessageContent,
    setTextMessageContent,
    selectedTemplateType,
    singleImageContent,
    setSingleImageContent,
    carouselItems,
    setCarouselItems,
  } = useTemplateStore();

  const [selectedAction, setSelectedAction] = useState("reply");

  const renderFields = () => {
    switch (selectedAction) {
      case "reply":
        return <SuggestionFields action={action} cardId={cardId} />;
      case "url_action":
        return <UrlActions action={action} cardId={cardId} />;
      case "dialer_action":
        return <Dialer action={action} cardId={cardId} />;
      case "view_location_latlong":
        return <GeoLocation action={action} cardId={cardId} />;
      case "view_location_query":
        return <LocationQuery action={action} cardId={cardId} />;
      case "share_location":
        return <ShareLocation action={action} cardId={cardId} />;
      case "calendar_event":
        return <CalEvent action={action} cardId={cardId} />;
      default:
        return null;
    }
  };

  const onSelectActionTypeHandller = (e) => {
    const value = e.target.value;
    setSelectedAction(value);
    switch (selectedTemplateType) {
      case "text_message":
        return setTextMessageContent({
          ...textMessageContent,
          buttons: textMessageContent.buttons.map((item) => {
            return item?.id === action.id
              ? { ...item, suggestionType: value }
              : item;
          }),
        });
      case "singleimg":
        return setSingleImageContent({
          ...singleImageContent,
          buttons: singleImageContent.buttons.map((item) => {
            return item?.id === action.id
              ? { ...item, suggestionType: value }
              : item;
          }),
        });

      case "video":
        return {
          ...videoContent,
          buttons: videoContent.buttons.map((item) => {
            return item?.id === action.id
              ? { ...item, suggestionType: value }
              : item;
          }),
        };

      case "imgcarousel":
        return setCarouselItems(
          carouselItems.map((carouselItem) =>
            carouselItem.id === cardId
              ? {
                  ...carouselItem,
                  buttons: carouselItem.buttons.map((button) =>
                    button?.id === action.id
                      ? { ...button, suggestionType: value }
                      : button
                  ),
                }
              : carouselItem
          )
        );
      default:
        return "reply";
    }
  };

  return (
    <div
      className="flex gap-1"
      key={id}
      ref={setNodeRef} // Attach ref to make this section sortable
      style={style} // Apply the transform and transition styles
    >
      <div className="flex flex-1 gap-3 px-2 py-5 border-default border-medium rounded-md bg-white dark:bg-content3">
        {/* Type of Action */}
        <Select
          isDisabled={id === 1}
          isRequired
          label={t("Type of Action")}
          placeholder={t("Select action type")}
          defaultSelectedKeys={[action.suggestionType]}
          value={selectedAction}
          onChange={onSelectActionTypeHandller}
          className="w-60"
          radius="sm"
        >
          {actions.map((action) => (
            <SelectItem key={action.key} value={action.key}>
              {t(action.label)}
            </SelectItem>
          ))}
        </Select>

        {/* Render Input Fields */}
        <div className="flex-1">{renderFields()}</div>
      </div>

      <div className="flex flex-col items-center  w-fit gap-1">
        {/* Add button */}
        <Button
          isIconOnly
          color="default"
          variant="bordered"
          size="sm"
          onPress={addSectionHandller}
        >
          <Icon
            icon="iconamoon:sign-plus-duotone"
            width="1.6em"
            height="1.6em"
          />
        </Button>

        {/* Delete button */}
        <Button
          className={id === 1 ? "cursor-not-allowed" : ""}
          color="default"
          variant="bordered"
          isIconOnly
          size="sm"
          onPress={() => deleteSectionHandller(id)}
        >
          <Icon
            icon="iconamoon:trash"
            width="1.6em"
            height="1.6em"
            className={` text-danger ${id === 1 ? "cursor-not-allowed " : ""}`}
          />
        </Button>

        {/* Drag Handle Icon */}
        <div className="flex flex-col bg-content2 rounded-md text-default-500 px-[0.2em] py-[0.1em] ">
          <Icon
            {...attributes}
            {...listeners}
            icon="gravity-ui:dots-9"
            width="1.3em"
            height="1.4em"
            className=" cursor-grab"
          />
          <Icon
            {...attributes}
            {...listeners}
            icon="gravity-ui:dots-9"
            width="1.3em"
            height="1.4em"
            className=" cursor-grab -mt-[3px]"
          />
        </div>
      </div>
    </div>
  );
}
