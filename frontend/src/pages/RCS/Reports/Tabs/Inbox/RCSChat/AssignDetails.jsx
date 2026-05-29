import React, { useEffect, useState } from "react";
import { Button, Textarea } from "@heroui/react";
import CommandTagItem from "../../../../../Phonebook/TabSwitcher/Contacts/ComponentTagItem";
import { usePhoneBookStore } from "../../../../../../store/phonebook/phonebookStore";
import { updateContactService } from "../../../../../../services/phonebook/phonebookContactService";
import toast from "react-hot-toast";

export default function AssignDetails({ item }) {
  const { setSelectedTags, selectedTags } = usePhoneBookStore();
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
      } else {
        toast.error("Failed to update contact");
      }
    } catch (error) {
      toast.error("Failed to update contact");
    }
  };

  return (
    <div className="space-y-2">
      {/* Add Tags */}
      <CommandTagItem isCustomizationWhatsapp={true} />

      <div className="flex flex-col w-full-end gap-2">
        {/* Add Note */}
        <Textarea
          size="sm"
          variant="bordered"
          label="✍🏻 Add Note"
          rows={1}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {/* Save Button */}
        <Button
          size="sm"
          variant="flat"
          radius="sm"
          color="default"
          // Add
          onPress={updateContactHandller}
          className="w-full self-end"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
