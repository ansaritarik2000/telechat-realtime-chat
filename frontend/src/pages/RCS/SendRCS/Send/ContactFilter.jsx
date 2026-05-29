import React, { useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { Icon } from "@iconify-icon/react";
import LogicFilterContact from "./LogicFilterContact";
import { getContactsByLogicService } from "../../../../services/phonebook/phonebookContactService";
import { useSendRcStore } from "../../../../store/sendRcsStore";
import { useTranslation } from "react-i18next";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { useSendWhatsappStore } from "../../../../store/whatsapp/whatsappStore";
import emailCampaingnStore from "../../../../store/emailCampaign/emailCampaignStore";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "../../../../utils/ReusableIcons";

const filterItems = [
  {
    key: "contact_name",
    label: "Name",
    icon: "iconamoon:profile-circle-light",
  },
  {
    key: "first_name",
    label: "First Name",
    icon: "solar:text-circle-outline",
  },
  { key: "last_name", label: "Last Name", icon: "solar:text-circle-outline" },
  { key: "email", label: "Email", icon: "mdi:email-outline" },
  { key: "phone_no", label: "Phone number", icon: "solar:phone-outline" },
  { key: "channel", label: "Channels", icon: "material-symbols:sms-outline" },
  { key: "created_at", label: "Created at", icon: "gridicons:time" },
  { key: "tags", label: "Tags", icon: "flowbite:tag-outline" },
];

const filterOptions = [
  { key: "contains", label: "contains" },
  { key: "not_contains", label: "not contains" },
  { key: "starts_with", label: "starts with" },
  { key: "ends_with", label: "ends with" },
  { key: "is", label: "is" },
  { key: "is_not", label: "is not" },
  { key: "empty", label: "empty" },
  { key: "not_empty", label: "not empty" },
];

const ContactFilter = ({ type = "" }) => {
  // zustand store
  const { setPhoneNumbers: setRcsPhoneNumbers } = useSendRcStore();
  const { setPhoneNumbers: setSmsPhoneNumbers } = useSendSmsStore();
  const { setPhoneNumbers: setWhatsAppPhoneNumbers } = useSendWhatsappStore();
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const today = new Date();
  const { emailCampaingnData, setEmailCampaingnData } = emailCampaingnStore();

  // Calculate start of the day (12:00 AM)
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );

  // Calculate end of the day (11:59 PM)
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );
  const [logicFilterContactField, setLogicFilterContactField] = useState([
    {
      id: 1,
      field: "",
      operator: "",
      value: "",
      logic: "",
      selectedChannels: [],
      selectedTags: [],
      createdAtRange: {
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString(),
      },
    },
  ]);

  // remove filter
  const removeFilter = (id) => {
    setLogicFilterContactField((prevState) => {
      if (prevState.length <= 1) {
        // Prevent removal if only one filter exists
        return prevState;
      }

      // Remove the filter with the specified ID
      return prevState.filter((item) => item.id !== id);
    });
  };

  // onSelectFieldChange
  const onSelectFieldChange = (e, index) => {
    setLogicFilterContactField((prevState) => {
      const newState = [...prevState];
      newState[index].field = e.target.value;
      return newState;
    });
  };

  // onSelectOperatorChange
  const onSelectOperatorChange = (e, index) => {
    setLogicFilterContactField((prevState) => {
      const newState = [...prevState];
      newState[index].operator = e.target.value;
      return newState;
    });
  };

  // onSelectValueChange
  const onSelectValueChange = (e, index) => {
    setLogicFilterContactField((prevState) => {
      const newState = [...prevState];
      newState[index].value = e.target.value;
      return newState;
    });
  };

  //onSelectLogicChange
  const onSelectLogicChange = (e, index) => {
    setLogicFilterContactField((prevState) => {
      const newState = [...prevState];
      newState[index].logic = e.target.value;
      return newState;
    });
  };

  // onSelection channel change
  const onChannelSelection = (channels, index) => {
    setLogicFilterContactField((prevState) => {
      const newState = [...prevState];
      newState[index].selectedChannels = channels;
      return newState;
    });
  };
  // onSelection tag change
  const onSelectionTagChange = (selectedTags, index) => {
    setLogicFilterContactField((prevState) => {
      const newState = [...prevState];
      newState[index].selectedTags = selectedTags;
      return newState;
    });
  };

  // onDateRangeChange
  const onDateRangeChange = (date, index) => {
    setLogicFilterContactField((prevState) => {
      const newState = [...prevState];
      newState[index].createdAtRange = date;
      return newState;
    });
  };

  const addFilterHandler = () => {
    setLogicFilterContactField((prevState) => {
      if (prevState.length >= 5) {
        // Optional: Show a message to the user
        addToast({
          title: "Alert!",
          description: "Maximum of 5 filters can be added.",
          color: "warning",
        });
        return prevState; // Prevent adding more filters
      }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      return [
        ...prevState,
        {
          id: prevState.length + 1,
          field: "",
          operator: "",
          value: "",
          logic: "and",
          selectedChannels: [],
          selectedTags: [],
          createdAtRange: [
            startOfDay.toISOString().replace("Z", "[Asia/Kolkata]"),
            endOfDay.toISOString().replace("Z", "[Asia/Kolkata]"),
          ],
        },
      ];
    });
  };

  const targetAudienceHandler = useMutation({
    mutationFn: async () => {
      if (
        logicFilterContactField.some(
          (filter) => !filter.field || !filter.operator || !filter.value
        )
      ) {
        throw new Error(
          "You may have left a filter selector empty. Please ensure all filters are properly filled out."
        );
      }

      const response = await getContactsByLogicService(token, {
        filters: logicFilterContactField,
      });

      const { data } = response;

      const phoneNumbers = data.map((item) => item.phone_no);

      switch (type) {
        case "rcs":
          setRcsPhoneNumbers(phoneNumbers);
          break;
        case "sms":
          setSmsPhoneNumbers(phoneNumbers);
          break;
        case "whatsapp":
          setWhatsAppPhoneNumbers(phoneNumbers);
          break;
        case "email":
          setEmailCampaingnData("phoneGroupEmails", phoneNumbers);
          break;
        default:
          break;
      }
    },
    onError: (e) => {
      setSmsPhoneNumbers([]);
      setRcsPhoneNumbers([]);
      setWhatsAppPhoneNumbers([]);
      addToast({
        title: e.name,
        description: e.message,
        color: "danger",
      });
    },
  });

  return (
    <div className="flex flex-col gap-2 -mt-3">
      <div className="flex justify-end items-center">
        {/* FIlter Button */}
        <Button
          size="sm"
          variant="flat"
          radius="sm"
          color="primary"
          startContent={
            <Icon icon="memory:plus" width={20} className="-mr-2" />
          }
          onPress={addFilterHandler}
        >
          {t("Add Filter")}
        </Button>
      </div>

      {logicFilterContactField.map(
        ({ id, field, operator, value, logic }, index) => (
          <LogicFilterContact
            key={id}
            id={id}
            field={field}
            operator={operator}
            value={value}
            logic={logic}
            filterItems={filterItems}
            filterOptions={filterOptions}
            onSelectFieldChange={(e) => {
              onSelectFieldChange(e, index);
            }}
            onSelectOperatorChange={(e) => {
              onSelectOperatorChange(e, index);
            }}
            onValueChange={(e) => {
              onSelectValueChange(e, index);
            }}
            onSelectionLogicChange={(e) => {
              onSelectLogicChange(e, index);
            }}
            onChannelSelected={(selectedChannel) =>
              onChannelSelection(selectedChannel, index)
            }
            isAndOrSelectVisible={index !== 0}
            onDelete={() => removeFilter(id)}
            onSelectionTagChange={(selectedTags) => {
              onSelectionTagChange(selectedTags, index);
            }}
            onDateRangeChange={(date) => onDateRangeChange(date, index)}
          />
        )
      )}

      <div className="flex justify-end items-center">
        {/* Apply Button */}
        <Button
          size="sm"
          variant="flat"
          radius="sm"
          color="default"
          className="mt-2"
          startContent={targetAudienceHandler.isPending ? <LoaderIcon /> : null}
          isDisabled={targetAudienceHandler.isPending}
          onPress={() => targetAudienceHandler.mutateAsync()}
        >
          {t("Target")}
        </Button>
      </div>
    </div>
  );
};

export default ContactFilter;
