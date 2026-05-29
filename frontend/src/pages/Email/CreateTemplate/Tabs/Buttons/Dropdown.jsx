import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useTranslation } from "react-i18next";
import {
    getAllTemplateTypesSerivce,
    getTemplateBasedOnTypeIdService,
} from "../../../../../services/Sms/smsTemplateService";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";
import { backend_base_url } from "../../../../../services/common";

export default function DropdownMenu({ setEmail }) {
    const { t } = useTranslation();
    const [emailValue, setEmailValue] = useState(null); // State for Email ID
    const [templateValue, setTemplateValue] = useState(null); // State for Template
    const [templateNameValue, setTemplateNameValue] = useState(null); // State for Template Name
    const [nameTemp, setName] = useState(null);
    const [type, setType] = useState([]);
    // get temlate name and id

    useEffect(() => {
        const templateTypes = async () => {
            try {
                const res = await fetch(
                    `${backend_base_url}/email/template-type`
                );
                if (!res.ok) {
                    console.log("Bad Response");
                }
                const result = await res.json();
                setType(result.data);
            } catch (error) {
                console.error("Failed to fetch template types:", error.message);
            }
        };
        templateTypes();
        setEmail(emailValue);
    }, [emailValue]);

    const getName = async (type_id) => {
        if (nameTemp?.some((name) => name.type_id === type_id)) return; // Skip if already fetched
        try {
            const res = await fetch(`/email/templateName/${type_id}`);
            if (!res.ok) {
                console.log("Bad Response");
            }
            const result = await res.json();
            setName(result.data);
            console.log("Name of tempn", result.data);
        } catch (error) {
            console.error("Failed to fetch template types:", error.message);
        }
    };
    // Dropdown options
    const emailOptions = [
        { label: "abcd@example.com", value: "abcd@example.com" },
        { label: "sudhir@example.com", value: "sudhir@example.com" },
        { label: "rishab@example.com", value: "rishab@example.com" },
        { label: "syeda@example.com", value: "syeda@example.com" },
        { label: "karan@example.com", value: "karan@example.com" },
    ];

    // Dynamic options for the second dropdown
    const templateOptions = {
        // "abcd@example.com": [{ label: "Marketing", value: "Marketing" },{ label: "Transactional", value: "Transactional" }],
        // "sudhir@example.com": [{ label: "dog-template-1", value: "dog-template-1" },{ label: "Transactional", value: "Transactional" }],
        // Default templates
        default: type?.map((tp) => ({
            label: tp.typename,
            value: tp.typename,
        })),
        //[{ label: "Marketing", value: "Marketing" },{ label: "Transactional", value: "Transactional" }],
    };

    // Dynamic options for the third dropdown
    const templateNameOptions = {
        [templateValue]: nameTemp
            ? nameTemp.map((name) => ({
                  label: name.templatename,
                  value: name.templatename,
              }))
            : [],
        default: nameTemp
            ? nameTemp.map((name) => ({
                  label: name.templatename,
                  value: name.templatename,
              }))
            : [],
    };
    // zustand store
    const setEmailCampaingnData = emailCampaingnStore(
        (state) => state.setEmailCampaingnData
    );
    // store template type in zustand store
    const handleSelectionTemplateType = (key) => {
        // console.log(key)
        const selectedType = type.find((item) => item.typename === key);
        //  console.log('slected id',selectedType.id);
        getName(selectedType.id);
        setTemplateValue(key);
        setEmailCampaingnData("templateType", key);
        setTemplateNameValue(null); // Reset dependent dropdown
    };
    // store email id in zustand store
    const handleSelectionEmail = (key) => {
        // console.log(key)
        setEmailValue(key);
        setEmailCampaingnData("emailID", key);
        setTemplateNameValue(null); // Reset dependent dropdown
    };
    // store template name in zustand store
    const handleTemplateValue = (key) => {
        setTemplateNameValue(key);
        setEmailCampaingnData("templateName", key);
    };
    //    console.log(emailCampaingnStore.getState().emailCampaingnData)

    return (
        <div className="flex gap-4 w-full">
            {/* Email ID Autocomplete */}
            <Autocomplete
                label="Email ID"
                isRequired
                variant="flat"
                defaultItems={emailOptions}
                // className="max-w-xs"
                selectedKey={emailValue}
                onSelectionChange={handleSelectionEmail}
            >
                {(item) => (
                    <AutocompleteItem key={item.value}>
                        {item.label}
                    </AutocompleteItem>
                )}
            </Autocomplete>

            {/* Template Autocomplete */}
            <div className="flex w-full max-w-xs flex-col gap-1">
                <Autocomplete
                    name="templateTpye"
                    label="Template Type"
                    isRequired
                    variant="flat"
                    defaultItems={
                        templateOptions[type] || templateOptions.default
                    }
                    className="max-w-xs"
                    selectedKey={templateValue}
                    onSelectionChange={handleSelectionTemplateType}
                >
                    {(item) => (
                        <AutocompleteItem key={item.value}>
                            {item.label}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </div>

            {/* Template Name Autocomplete */}
            <div className="flex w-full max-w-xs flex-col gap-1">
                <Autocomplete
                    label="Template Name"
                    isRequired
                    variant="flat"
                    defaultItems={
                        templateNameOptions[templateValue] ||
                        templateNameOptions.default
                    }
                    className="max-w-xs"
                    selectedKey={templateNameValue}
                    onSelectionChange={handleTemplateValue}
                >
                    {(item) => (
                        <AutocompleteItem key={item.value}>
                            {item.label}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </div>
        </div>
    );
}
