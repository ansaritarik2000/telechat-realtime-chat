import { useState } from "react";
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import TemplateTable from "./TemplateTable/Index";
import { Icon } from "@iconify-icon/react";
import HeaderTable from "./HeaderTable/Index";
import { useTranslation } from "react-i18next";

export default function HeaderAndTemplateIndex() {
    const [selectedOption, setSelectedOption] = useState(new Set(["template"]));
    let selectedOptionValue = Array.from(selectedOption)[0];
    const { t } = useTranslation();

    const labelsMap = {
        template: t("Template Table"),
        header: t("Header Table"),
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Button Group */}
            <div className="flex justify-end items-center ">
                {/* Table Label */}

                {/* Button Group */}
                <ButtonGroup variant="flat" size="md">
                    <Button className="px-4 border-r-1 border-stone-500">
                        {labelsMap[selectedOptionValue]}
                    </Button>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button isIconOnly className="min-w-[50px]">
                                <Icon
                                    icon="fluent:chevron-down-16-regular"
                                    width="1.2em"
                                    height="1.2em"
                                />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Merge options"
                            selectedKeys={selectedOption}
                            selectionMode="single"
                            onSelectionChange={setSelectedOption}
                            className="max-w-[300px]">
                            <DropdownItem key="template">
                                {labelsMap["template"]}
                            </DropdownItem>
                            <DropdownItem key="header">
                                {labelsMap["header"]}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </ButtonGroup>
            </div>

            {/* Template Table */}
            {selectedOptionValue === "template" && <TemplateTable />}

            {/* Header Table */}
            {selectedOptionValue === "header" && <HeaderTable />}
        </div>
    );
}
