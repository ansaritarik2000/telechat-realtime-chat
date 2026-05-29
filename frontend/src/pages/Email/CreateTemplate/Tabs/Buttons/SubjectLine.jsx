import React, { useState, useMemo } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Input,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";
import { HtmlTemplate } from "./ActionButtonFun";

export default function PersonalizationInput({
    setSelectedPersonalization,
    setInputValuePersonalization,
}) {
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [inputValue, setInutValue] = useState("");
    const [subject, setSubject] = useState("");
    const setEmailCampaingnData = emailCampaingnStore(
        (state) => state.setEmailCampaingnData
    );
    // Convert selected keys to a list for rendering chips
    const selectedValues = useMemo(
        () => Array.from(selectedKeys),
        [selectedKeys]
    );
    // combined the value of input and select token from personalization
    const combinedValue = () => {
        const placeholders = selectedValues
            .map((value) => `{{${value}}}`)
            .join(", ");

        return `${inputValue}${
            inputValue && placeholders ? ", " : ""
        }${placeholders}`;
    };

    // Notify parent component of selected personalization
    React.useEffect(() => {
        setSelectedPersonalization(selectedValues);
        setInputValuePersonalization(inputValue);
        setEmailCampaingnData("subjectLine", combinedValue());
    }, [selectedValues, setSelectedPersonalization, inputValue]);

    // Adding the value of selector and input field
    const handleChange = (e) => {
        setSelectedKeys(new Set());
        setInutValue(e.target.value);
        console.log(e.target.name, e.target.value);
    };

    const handleSelectionChange = (keys) => {
        // Restrict selection to a maximum of 2 items
        if (keys.size <= 2) {
            setSelectedKeys(keys);
        } else {
            addToast({
                title: "Alert",
                description: "Personalization options can't be more than 2",
                color: "warning",
            });
        }
    };

    // const templateData = async()=>{
    //  const data = await HtmlTemplate("Zero%20Cast","Transactional")
    //  console.log("Html",data.data)
    // }

    return (
        <div className="relative w-full">
            {/* <button onClick={templateData}>Check</button> */}
            <Input
                type="text"
                isRequired
                radius="sm"
                label="Subject Line"
                variant="flat"
                name="subjectLine"
                className="w-full"
                value={combinedValue()}
                onChange={handleChange}
            />

            {/* Dropdown for personalization */}
            <div className="absolute right-1 top-1">
                <Dropdown
                    isOpen={isDropdownOpen}
                    onOpenChange={(open) => setIsDropdownOpen(open)}
                >
                    <DropdownTrigger>
                        <Button
                            disableAnimation
                            variant="none"
                            size="lg"
                            className="flex-center"
                            endContent={
                                <>
                                    {isDropdownOpen ? (
                                        <Icon
                                            icon="iconamoon:arrow-up-2"
                                            width="20"
                                            height="20"
                                        />
                                    ) : (
                                        <Icon
                                            icon="iconamoon:arrow-down-2"
                                            width="20"
                                            height="20"
                                        />
                                    )}
                                </>
                            }
                        >
                            <span className="text-sm">Personalize</span>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Personalization Options"
                        variant="flat"
                        closeOnSelect={false}
                        selectionMode="multiple"
                        selectedKeys={selectedKeys}
                        // onSelectionChange={setSelectedKeys}
                        onSelectionChange={handleSelectionChange}
                    >
                        <DropdownItem key="Name">Name</DropdownItem>
                        <DropdownItem key="Last Name">Last Name</DropdownItem>
                        <DropdownItem key="Email">Email</DropdownItem>

                        <DropdownItem key="EmailPartBeforeAt">
                            Email part before @
                        </DropdownItem>
                        <DropdownItem key="List Name">List Name</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}
