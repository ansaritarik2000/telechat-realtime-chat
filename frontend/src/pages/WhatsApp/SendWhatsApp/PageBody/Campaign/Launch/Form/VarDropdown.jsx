import { useState } from "react";
import { Select, SelectItem } from "@heroui/react";

const VarDropdown = ({ options, sections, onMappingChange }) => {
  const [headerMappings, setHeaderMappings] = useState({});

  const handleSelectChange = (variable, selectedHeader) => {
    const newMappings = {
      ...headerMappings,
      [variable]: selectedHeader
    };
    setHeaderMappings(newMappings);
    onMappingChange(newMappings);
  };
  // console.log(headerMappings)
  const getAvailableOptions = (currentVariable) => {
    // Filter out already selected headers except for the current dropdown
    return options?.filter(
      option =>
        !Object.values(headerMappings).includes(option) || 
        headerMappings[currentVariable] === option
    );
  };

  return (
    <div className="flex gap-0 bg-default-100 py-0">
      {sections?.map((variable, i) => (
        <div key={i} className="w-fit">
          <Select
            aria-label="Select"
            placeholder={variable}
            size="sm"
            radius="sm"
            color="default"
            variant="flat"
            className="min-w-[140px]"
            selectedKeys={headerMappings[variable] ? [headerMappings[variable]] : []}
            onChange={(e) => handleSelectChange(variable, e.target.value)}
          >
            {getAvailableOptions(variable)?.map((opt, j) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </Select>
        </div>
      ))}
    </div>
  );
};

export default VarDropdown;