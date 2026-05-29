import React, { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import ContactsTable from "./Contacts/Index";
import Groups from "./Groups/Index";
import { useTranslation } from "react-i18next";

export default function TabIndex() {
    const [selected, setSelected] = useState("groups");
    const { t } = useTranslation();

    const handleTabChange = (key) => {
        setSelected(key);
    };

    return (
        <div className="flex flex-col gap-4 my-4 h-full">
            <Tabs
                aria-label="Tabs"
                selectedKey={selected}
                variant="solid"
                radius="full"
                color="success"
                onSelectionChange={handleTabChange}
                size="md"
                classNames={{
                    tab: "group-data-[selected=true]:bg-green-500",
                }}>
                <Tab key="groups" title={t("Groups")}>
                    <Groups />
                </Tab>
                <Tab key="contacts" title={t("Contacts")}>
                    <ContactsTable />
                </Tab>
            </Tabs>
        </div>
    );
}
