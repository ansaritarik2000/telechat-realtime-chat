import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

export default function SearchInput(props) {
  const [filterValue, setFilterValue] = useState("");
  const { t } = useTranslation();

  const {
    Icon: IconComponent = (
      <Icon icon="majesticons:search-line" width="1.2em" height="1.2em" />
    ),
    Placeholder = t("Search..."),
    onSearch,
  } = props;

  const handleInput = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    onSearch(value); // Call the search callback on input change
  };

  const handleClear = () => {
    setFilterValue("");
    onSearch(""); // Reset search when input is cleared
  };
  return (
    <div>
      <Input
        isClearable
        className="w-full"
        placeholder={Placeholder}
        startContent={IconComponent}
        value={filterValue}
        onClear={handleClear}
        onChange={handleInput}
      />
    </div>
  );
}
