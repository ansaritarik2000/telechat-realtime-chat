import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Textarea,
  Avatar,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react"; // Ensure you have this package installed
import { agents } from "../../../../../../utils/agents";
import CommandTagItem from "../../../../../Phonebook/TabSwitcher/Contacts/ComponentTagItem";
import { usePhoneBookStore } from "../../../../../../store/phonebook/phonebookStore";
import { updateContactService } from "../../../../../../services/phonebook/phonebookContactService";
import toast from "react-hot-toast";

const initialTags = [
  { id: 1, name: "Interested", color: "success" },
  { id: 2, name: "Not Interested", color: "warning" },
  { id: 3, name: "Closed", color: "primary" },
  { id: 4, name: "Spam", color: "danger" },
];

export default function AssignDetails({ item }) {
  const { setSelectedTags, selectedTags } = usePhoneBookStore();
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
  const [notes, setNotes] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("items tags", item?.tags);
    if (item) {
      if (item?.tags && item?.tags.length > 0) {
        setSelectedTags(item?.tags);
      }
      if (item?.notes) {
        setNotes(item?.notes);
      }
    }
  }, [item]);

  // this function is used for update contact
  const updateContactHandller = async () => {
    const {
      id,
      contact_name,
      phone_no,
      country_code,
      email,
      groups,
      channels,
      avatar_type,
      avatar_value,
    } = item;
    try {
      const contactData = {
        id: id,
        contact_name,
        phone_no,
        country_code: country_code,
        email,
        groups: groups,
        channels: channels,
        tags: selectedTags,
        avatar_type,
        avatar_value,
        notes,
      };

      const response = await updateContactService(token, contactData);
      if (response.status === "SUCCESS") {
        toast.success("Contact updated successfully");
        setUpdateButtonDisabled(true);
      } else {
        toast.error("Failed to update contact");
      }
    } catch (error) {
      toast.error("Failed to update contact");
    }
  };

  // this function for toggle selection  for identify selection
  const onToggleSelectionHandller = () => {
    setUpdateButtonDisabled(false);
  };
  return (
    <div className="flex flex-col gap-1">
      {/* Select Agent */}
      <Select
        items={agents}
        placeholder="Assign Agent"
        labelPlacement="outside"
        classNames={{
          base: "max-w-xs",
          trigger: "h-12",
        }}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <Avatar
                alt={item.data.name}
                className="flex-shrink-0"
                size="sm"
                src={item.data.avatar}
              />
              <div className="flex flex-col">
                <span>{item.data.name}</span>
                <span className="text-default-500 text-tiny">
                  ({item.data.email})
                </span>
              </div>
            </div>
          ));
        }}
      >
        {(user) => (
          <SelectItem key={user.id} textValue={user.name}>
            <div className="flex gap-2 items-center">
              <Avatar
                alt={user.name}
                className="flex-shrink-0"
                size="sm"
                src={user.avatar}
              />
              <div className="flex flex-col">
                <span className="text-small">{user.name}</span>
                <span className="text-tiny text-default-400">{user.email}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>

      {/* Add Tags */}
      <div className="mt-1">
        <CommandTagItem
          onToggleSection={onToggleSelectionHandller}
          isCustomizationWhatsapp={true}
        />
      </div>

      {/* Add Note */}
      <Textarea
        size="sm"
        variant="bordered"
        label="✍🏻 Add Note"
        className="mt-1"
        rows={1}
        value={notes}
        onChange={(e) => {
          setUpdateButtonDisabled(false);
          setNotes(e.target.value);
        }}
      />
      <Button
        size="sm"
        variant="flat"
        radius="sm"
        startContent={
          !updateButtonDisabled ? (
            <Icon icon="ph:floppy-disk-duotone" width="18" height="18" />
          ) : null
        }
        color="default"
        isDisabled={updateButtonDisabled}
        onPress={updateContactHandller}
        className="w-full self-end"
      >
        Save Changes
      </Button>
    </div>
  );
}
