import React, { useEffect, useState } from "react";
import { Chip, Input } from "@heroui/react"; // Importing Input from NextUI
import { Icon } from "@iconify/react"; // For icons
import cx from "classnames"; // For conditional classes
import ColorPickerModal from "./ColorPickerModal";
import { useTagsAndComponentsStore } from "../../../../store/phonebook/tagsAndComponent";
import { usePhoneBookStore } from "../../../../store/phonebook/phonebookStore";
import GreyLine from "./GrayLine";

const ComponentTagItem = ({
  isCustomizationWhatsapp = false,
  onToggleSection = () => {},
}) => {
  // Tags list (initial data)
  const [tags, setTags] = useState([
    {
      id: 1,
      label: "Interested",
      color: "text-green-600", // text color
      bgColor: "bg-green-100", // matching background color
      selected: false,
    },
    {
      id: 2,
      label: "Closed",
      color: "text-blue-700", // text color
      bgColor: "bg-blue-100", // matching background color
      selected: false,
    },
    {
      id: 3,
      label: "Not Interested",
      color: "text-red-700", // text color
      bgColor: "bg-red-100", // matching background color
      selected: false,
    },
  ]);

  const { selectedTags, setSelectedTags, setIsUpdateButtonDisabled } =
    usePhoneBookStore();

  useEffect(() => {
    if (selectedTags && selectedTags.length > 0) {
      const updatedTags = selectedTags.map((tag) => {
        const newTag = tags.find((t) => t.id === tag.id);
        if (newTag) {
          return { ...newTag, selected: tag.selected || false };
        }
        return tag;
      });

      // not selected filter tags
      const notSelectedFilterTags = tags.filter((tag) => {
        const selectedTag = selectedTags.find(
          (selectedTag) => selectedTag.id === tag.id
        );
        return !selectedTag;
      });
      setTags([...updatedTags, ...notSelectedFilterTags]);
    }
  }, [selectedTags]);

  const [isAddedNewTag, setIsAddedNewTag] = useState(false); // For the new tag input
  const { tagsName, tagsColor, tagsBgColor, resetTagsAndComponents } =
    useTagsAndComponentsStore();

  // Toggle selection
  const toggleTagSelection = (id) => {
    setIsUpdateButtonDisabled(false);
    onToggleSection();
    setTags((prevTags) => {
      // Toggle the selection state of the clicked tag
      const updatedTags = prevTags.map((tag) =>
        tag.id === id ? { ...tag, selected: !tag.selected } : tag
      );

      // Update selectedTags based on the new state
      const newSelectedTags = updatedTags.filter((tag) => tag.selected);
      setSelectedTags(newSelectedTags);

      return updatedTags; // Return the updated state for tags
    });
  };

  // Add new tag
  const handleAddTag = () => {
    if (tagsName.trim() === "") return; // Prevent empty tags
    setTags((prevTags) => [
      ...prevTags,
      {
        id: Date.now(),
        label: tagsName.trim(),
        color: tagsColor, // Default color for new tags
        bgColor: tagsBgColor,
        selected: false,
      },
    ]);
    setIsAddedNewTag(false);
    resetTagsAndComponents();
  };

  return (
    <div className="p-3  border border-default-400 rounded-lg w-full ">
      {!isAddedNewTag ? (
        <>
          <p className="text-xs font-medium text-default-500 pb-2">
            🏷️ Select Tags
          </p>

          {/* Tags List */}
          <div className="mb-2 h-[6.2rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
            <div className="grid my-3 grid-cols-2 gap-1">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className={cx(
                    "flex items-center justify-between p-2 rounded-md cursor-pointer",
                    tag.selected
                      ? "bg-gray-100 dark:bg-content3"
                      : "hover:bg-gray-200 dark:hover:bg-content2"
                  )}
                  onClick={() => toggleTagSelection(tag.id)}
                >
                  <div className="flex items-center gap-2">
                    {console.log(tag)}
                    <Icon icon="mdi:tag" className={cx("w-4 h-4", tag.color)} />

                    <p className="text-xs text-default-500">{tag.label}</p>
                  </div>
                  {tag.selected && (
                    <Icon
                      icon="material-symbols:check-circle"
                      className="text-green-500 w-4 h-4"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Tag */}
          <div className="mt-2">
            <div className="flex items-center justify-end gap-2">
              <button
                className="flex text-xs items-center gap-1 text-blue-500 hover:underline"
                onClick={() => {
                  setIsAddedNewTag(true);
                }}
              >
                <Icon icon="material-symbols:add-circle" width={13} />
                Add custom tag
              </button>
            </div>
          </div>
        </>
      ) : (
        <ColorPickerModal
          handleCancelHandller={() => {
            resetTagsAndComponents();
            setIsAddedNewTag(false);
          }}
          isCustomizationWhatsapp={isCustomizationWhatsapp}
          handleCreatedHandller={() => {
            handleAddTag();
          }}
        />
      )}
    </div>
  );
};

export default ComponentTagItem;
