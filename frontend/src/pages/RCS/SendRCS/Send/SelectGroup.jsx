import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import {
    getGroupContactsByGroupIdsService,
    getGroupsService,
} from "../../../../services/phonebook/phonebookService";
import toast from "react-hot-toast";
import { usePhoneBookStore } from "../../../../store/phonebook/phonebookStore";
import AvatarIndex from "../../../../components/AvatarGen/Index";
import { useTranslation } from "react-i18next";
import { useSendRcStore } from "../../../../store/sendRcsStore";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { useSendWhatsappStore } from "../../../../store/whatsapp/whatsappStore";
import emailCampaingnStore from "../../../../store/emailCampaign/emailCampaignStore";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { LoaderIcon } from "../../../../utils/ReusableIcons";

const SelectGroup = ({ type = "" }) => {
    const token = localStorage.getItem("token");
    const { t } = useTranslation();

    //zustand store
    const { selectedGroups, setSelectedGroups } = usePhoneBookStore();

    const {
        setPhoneNumbers: setRcsPhoneNumbers,
        setContactUploadedFrom: setRcsContactUploadedForm,
        groups,
        setGroups,
    } = useSendRcStore();

    const {
        setPhoneNumbers: setSmsPhoneNumbers,
        setContactUploadedFrom: setSmsContactUploadedForm,
    } = useSendSmsStore();

    const { setPhoneNumbers: setWhatsAppPhoneNumbers } = useSendWhatsappStore();

    const { emailCampaingnData, setEmailCampaingnData, onSelect } =
        emailCampaingnStore();

    // This will fetch intial contacts lists
    const fetchGroup = useQuery({
        queryKey: ["group", token],
        queryFn: async () => {
            if (emailCampaingnData.phoneGroupEmails.length >= 1) {
                onSelect(false);
            } else {
                onSelect(true);
            }

            const response = await getGroupsService(token);

            setSelectedGroups([]);

            setGroups(response.data);

            return "SUCCESS";
        },
        enabled: !!token,
    });

    // This will run on user select contact list
    const groupContacts = useQuery({
        queryKey: ["group-contacts-by-group-ids-service", selectedGroups],
        queryFn: async () => {
            const params = {
                group_ids: selectedGroups,
            };

            const response = await getGroupContactsByGroupIdsService(
                token,
                params
            );

            const phoneNumbers = response.data.map((item) => item.phone_no);
            const emails = response.data.map((item) => item.email);
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
                    setEmailCampaingnData("phoneGroupEmails", emails);
                    break;
                default:
                    break;
            }

            return "SUCCESS";
        },
        enabled: selectedGroups?.length > 0,
    });

    if (groupContacts.isError) {
        addToast({
            title: groupContacts.error.name,
            description: groupContacts.error.message,
            color: "danger",
        });
    }

    if (fetchGroup.isError) {
        addToast({
            title: fetchGroup.error.name,
            description: fetchGroup.error.message,
            color: "danger",
        });
    }

    return (
        <>
            <Select
                label={t("Select Group")}
                isDisabled={groupContacts.isLoading || fetchGroup.isLoading}
                startContent={
                    groupContacts.isLoading || fetchGroup.isLoading ? (
                        <LoaderIcon />
                    ) : null
                }
                items={groups}
                selectionMode="multiple"
                isMultiline={true}
                radius="sm"
                defaultSelectedKeys={selectedGroups?.map((item) => {
                    return item?.toString();
                })} // Set the default selected keys here
                selectedKeys={selectedGroups?.map((item) => {
                    return item?.toString();
                })}
                onSelectionChange={(keys) => {
                    setRcsContactUploadedForm("phonebook");
                    setSmsContactUploadedForm("phonebook");
                    setSelectedGroups(Array.from(keys));
                }} // Update the state
                renderValue={(items) => {
                    return (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                                <span
                                    key={item.key}
                                    className="px-2 py-1 bg-gray-200 dark:bg-content3 rounded-md">
                                    {item.data.group_name}
                                </span>
                            ))}
                        </div>
                    );
                }}>
                {(group) => (
                    <SelectItem key={group?.id} textValue={group?.group_name}>
                        <div className="flex items-center gap-2">
                            <AvatarIndex
                                isEditable={false}
                                avatarType={group?.avatar_type || "character"}
                                value={group?.avatar_value || group?.group_name}
                                size={35}
                            />
                            <span>{t(group?.group_name)}</span>
                        </div>
                    </SelectItem>
                )}
            </Select>
        </>
    );
};

export default SelectGroup;
