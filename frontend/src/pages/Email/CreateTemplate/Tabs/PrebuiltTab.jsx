import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Tabs,
    Tab,
    Tooltip,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    Select,
    SelectItem,
    Radio,
    RadioGroup,
    Chip,
    Divider,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SearchInput from "../../../../components/Buttons/Search";
import { backend_base_url } from "../../../../services/common";

// Template categories configuration

// const TEMPLATE_CATEGORIES = [
//     { key: "ecom", label: "E-Commerce", icon: "icon-park-twotone:shopping",text: "E-Commerce Template" },
//     { key: "finance", label: "Finance", icon: "material-symbols:finance", text: "Finance Template" },
//     { key: "restaurant", label: "Restaurant", icon: "cbi:roomsdining", text: "Restaurant Template" },
//     { key: "fitness", label: "Fitness", icon: "ion:fitness-sharp", text: "Fitness Template" },
//     { key: "education", label: "Education", icon: "zondicons:education", text: "Education Template" },
//     { key: "realestate", label: "Real Estate", icon: "material-symbols-light:real-estate-agent-sharp", text: "Real Estate Template" },
//     { key: "entertainment", label: "Entertainment", icon: "mdi:movie-filter", text: "Entertainment Template" },
//     { key: "fashion", label: "Fashion", icon: "file-icons:styledcomponents", text: "Fashion Template" },
// ];

export default function PrebuiltTab() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // States
    const [selected, setSelected] = useState("all");
    const [templateName, setTemplateName] = useState("");
    const [categoryType, setCategoryType] = useState("");
    const [templateType, setTemplateType] = useState("");
    const [savedTemplates, setSavedTemplates] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [savedCategory, setSavedCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load templates on mount
    useEffect(() => {
        loadTemplates();
        getCategory();
    }, []);
    const getCategory = async () => {
        try {
            const response = await fetch(
                `${backend_base_url}/email/template-category`
            );
            const templateCategoryAre = await response.json();
            setSavedCategory(templateCategoryAre.data);
            console.log(templateCategoryAre.data);
        } catch (error) {
            console.log(error);
        }
    };
    const loadTemplates = () => {
        setIsLoading(true);
        try {
            const temp = localStorage.getItem("emailTemplateData");
            if (temp) {
                const parsedTemp = JSON.parse(temp);
                setSavedTemplates(Array.isArray(parsedTemp) ? parsedTemp : []);
            }
        } catch (error) {
            console.error("Failed to load templates:", error);
            setSavedTemplates([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTemplate = async () => {
        if (!templateName.trim()) {
            alert("Please enter a template name");
            return;
        }
        if (!templateType.trim()) {
            alert("Please select template type");
            return;
        }

        const newTemplateData = {
            typename: templateType,
            category_name: categoryType || "general",
            templatename: templateName,
        };
        //    console.log(newTemplateData)
        try {
            const response = await fetch("/email/templates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Corrected the header key
                },
                body: JSON.stringify(newTemplateData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Response data:", data);
            } else {
                console.error("Error:", response.status, response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
        navigate("/emailbuilder");
    };

    // const handlePreview = (template) => {
    //     localStorage.setItem('currentPreviewTemplate', JSON.stringify(template));
    //     navigate(`/email-template/${template.id}`);
    // };

    const handleEdit = (template) => {
        localStorage.setItem("currentEditTemplate", JSON.stringify(template));
        navigate(`/createemailtemplate?edit=${template.id}`);
    };

    const handleDelete = (templateId) => {
        if (
            window.confirm(
                "Are you sure you want to delete this template. This action is ir-reversible."
            )
        ) {
            const updatedTemplates = savedTemplates.filter(
                (template) => template.id !== templateId
            );
            localStorage.setItem(
                "emailTemplateData",
                JSON.stringify(updatedTemplates)
            );
            setSavedTemplates(updatedTemplates);
        }
    };

    const renderTemplateCard = (template, index) => (
        <div
            key={template.id || index}
            className="relative group w-64 h-96 overflow-hidden rounded-lg shadow-lg mb-4"
        >
            {/* Preview Section */}
            {/* I comment this to prevent build error */}
            {/* <div className="w-full h-2/3 bg-gray-100 p-4">
                <Reader document={template.template} rootBlockId="root" />
            </div> */}

            {/* Template Info */}
            <div className="absolute bottom-2 right-2 z-10 bg-opacity-70 p-2 rounded-md ">
                <h3 className="text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {templateName}
                </h3>
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <Tooltip content="Preview">
                    <Button
                        isIconOnly
                        variant="borderd"
                        className="text-white hover:text-green-500 cursor-pointer"
                        onPress={() =>
                            navigate(`/email-template/${template.id}`)
                        }
                    >
                        <Icon
                            icon="ic:twotone-visibility"
                            width="24"
                            height="24"
                        />
                    </Button>
                </Tooltip>

                <Tooltip content="Edit">
                    <Button
                        isIconOnly
                        variant="borderd"
                        className="flex flex-col items-center text-white hover:text-green-500 cursor-pointer"
                        onClick={() => handleEdit(template)}
                    >
                        <Icon icon="ic:twotone-edit" width="30" height="30" />
                    </Button>
                </Tooltip>
            </div>

            {/* Delete Icon */}
            <Tooltip content="Delete">
                {/* <Button
                    isIconOnly
                    color="danger"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    variant="bordered"
                    onClick={() => handleDelete(template.id)}
                >
                    <Icon icon="mdi:delete" width="30" height="30" />
                </Button> */}
                <Chip
                    color="danger"
                    variant="bordered"
                    radius="sm"
                    className="absolute top-4 right-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                >
                    Delete
                </Chip>
            </Tooltip>
        </div>
    );

    const filteredTemplates = savedTemplates.filter((template) => {
        if (selected === "all") return true;

        return template.type === selected;
    });

    console.log(savedCategory);

    return (
        <>
            <div className="flex justify-between mb-4">
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                />
                <Button
                    onPress={onOpen}
                    className="g-0 flex items-center gap-[1px]"
                    startContent={
                        <Icon
                            icon="tdesign:plus"
                            width="1.5em"
                            height="1.5em"
                            className="text-success-800"
                        />
                    }
                    variant="flat"
                    color="success"
                >
                    Create Template
                </Button>
            </div>

            {/* Create Template Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Create New Template</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Template Name"
                                        value={templateName}
                                        onChange={(e) =>
                                            setTemplateName(e.target.value)
                                        }
                                        isRequired
                                        className="col-span-2 md:col-span-1 md:w-[125%]"
                                    />
                                    <Select
                                        label="Category"
                                        value={categoryType}
                                        onChange={(e) =>
                                            setCategoryType(
                                                e.target.value.trim()
                                            )
                                        }
                                        isRequired
                                        className="justify-self-end w-full md:w-3/4"
                                    >
                                        {savedCategory.map((category) => (
                                            <SelectItem
                                                key={category.category_name}
                                            >
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <div className="col-span-2 text-gray-500">
                                        Select Template Type
                                    </div>
                                    <div className="col-span-2">
                                        <RadioGroup
                                            color="success"
                                            orientation="horizontal"
                                            value={templateType}
                                            onValueChange={setTemplateType}
                                            defaultValue="marketing"
                                        >
                                            <Radio
                                                value="marketing"
                                                className="mr-4"
                                            >
                                                Marketing
                                            </Radio>
                                            <Radio
                                                value="transactional"
                                                className="mr-4"
                                            >
                                                Transactional
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter className="flex flex-col gap-4">
                                <Divider />
                                {/* Btns */}
                                <div className="self-end flex gap-2">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        {t("Cancel")}
                                    </Button>
                                    <Button
                                        color="success"
                                        variant="flat"
                                        onPress={handleCreateTemplate}
                                    >
                                        {t("Create Temaplate")}
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Templates Display */}
            <Tabs
                selectedKey={selected}
                onSelectionChange={setSelected}
                variant="light"
                size="md"
                className="mt-4"
            >
                <Tab
                    key="all"
                    title={
                        <div className="flex items-center space-x-2">
                            <Icon
                                icon="ic:twotone-list"
                                className={
                                    selected === "all"
                                        ? "text-success"
                                        : "text-default-500"
                                }
                            />
                            <span>All ({savedTemplates.length})</span>
                        </div>
                    }
                >
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <span>Loading templates...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[8rem] p-4">
                            {filteredTemplates.length > 0 ? (
                                filteredTemplates.map((template, index) =>
                                    renderTemplateCard(template, index)
                                )
                            ) : (
                                <div className="col-span-full text-center p-8">
                                    <p>No templates found</p>
                                </div>
                            )}
                        </div>
                    )}
                </Tab>

                {savedCategory.map((category) => (
                    <Tab
                        key={category.category_name}
                        title={
                            <div className="flex items-center space-x-2">
                                <Icon
                                    className={
                                        selected === category.key
                                            ? "text-success"
                                            : "text-default-500"
                                    }
                                />
                                <span>
                                    {category.category_name} (
                                    {
                                        savedTemplates.filter(
                                            (t) => t.type === category.key
                                        ).length
                                    }
                                    )
                                </span>
                            </div>
                        }
                    >
                        {/* {category.text} */}
                        <div className="col-span-full text-center p-8">
                            <p>{category.text}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                            {filteredTemplates
                                .filter((t) => t.type === category.key)
                                .map((template, index) =>
                                    renderTemplateCard(template, index)
                                )}
                        </div>
                    </Tab>
                ))}
            </Tabs>
        </>
    );
}
