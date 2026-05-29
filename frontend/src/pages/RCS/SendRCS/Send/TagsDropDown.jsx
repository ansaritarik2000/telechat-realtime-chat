import React, { useEffect } from "react";
import { getTagOptionsService } from "../../../../services/phonebook/phonebookContactService";
import toast from "react-hot-toast";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useTranslation } from "react-i18next";

const TagsDropDown = ({ onSelectionTagChange, isWhatsappTags = false }) => {
  const [statusOptions, setStatusOptions] = React.useState([]);
  const { t } = useTranslation();

  // This function is used for fetching tags options
  const fetchTagOptions = async () => {
    try {
      const response = await getTagOptionsService();
      if (response.status === "SUCCESS") {
        setStatusOptions(response.data);
      } else {
        addToast({
          title: "Error!",
          description: "Failed to fetch status options",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Error!",
        description: "Failed to fetch status options",
        color: "danger",
      });
    }
  };

  useEffect(() => {
    fetchTagOptions();
  }, []);

  console.log("statusOptions", statusOptions);

  return (
    <>
      <Select
        items={statusOptions}
        selectionMode="multiple"
        placeholder={isWhatsappTags ? "Select Tags" : ""}
        isMultiline={true}
        radius="sm"
        onSelectionChange={(keys) => onSelectionTagChange(Array.from(keys))}
        className={isWhatsappTags ? "ml-0" : "ml-4"}
        // Update the state
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item.key}
                  className={`inline-flex items-center rounded-full ${
                    item?.data?.bgColor || "bg-gray-100"
                  } px-2 py-1  text-xs ${
                    item?.data?.color || "text-gray-600"
                  } `}
                >
                  {item?.data?.name}
                </span>
              ))}
            </div>
          );
        }}
      >
        {(tag) => (
          <SelectItem key={tag?.uid} textValue={tag?.name}>
            <span
              key={tag.uid}
              className={`inline-flex items-center rounded-full ${
                tag?.bgColor || "bg-gray-100"
              } px-2 py-1  text-xs ${tag?.color || "text-gray-600"} `}
            >
              {tag?.name}
            </span>
          </SelectItem>
        )}
      </Select>
    </>
  );
};

export default TagsDropDown;
