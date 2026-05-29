import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

export const SelectSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const { t } = useTranslation();

    const toggleDropdown = () => {
        setIsOpen((prevState) => !prevState);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setIsOpen(false); // Close the dropdown
        setSearchTerm("");
    };

    const items = ["Educational Group", "Marketing", "Salaried", "Bachelors"];

    return (
        <div className="flex items-center z-10">
            <div className="relative group">
                <button
                    id="dropdown-button"
                    className="inline-flex justify-center w-full  px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                    onClick={toggleDropdown}>
                    <span className="mr-2">
                        {selectedItem || t("Select Group")}
                    </span>
                    <Icon
                        icon="ri:arrow-drop-down-line"
                        width={20}
                        className=""
                    />
                </button>
                {isOpen && (
                    <div
                        id="dropdown-menu"
                        className="absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1">
                        <input
                            id="search-input"
                            className="block w-full px-2 py-2 text-gray-800 text-sm border rounded-md border-gray-300 focus:outline-none"
                            type="text"
                            placeholder={t("Search items")}
                            autoComplete="off"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        {items
                            .filter((item) =>
                                item
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            )
                            .map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                                    onClick={() => handleSelectItem(item)}>
                                    {item}
                                </a>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};
