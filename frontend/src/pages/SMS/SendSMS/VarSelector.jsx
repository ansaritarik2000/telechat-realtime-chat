import React from "react";
import { Select, SelectItem } from "@heroui/react";
import { useSendSmsStore } from "../../../store/sendSmsStore";

export default function VarSelector({
    label = "{{Var1}}",
    availableColumns = [],
    onColumnSelect,
}) {
    // zustand sms store
    const { shortUrl } = useSendSmsStore();

    const columnsWithShortUrl = React.useMemo(() => {
        if (shortUrl) {
            return [...availableColumns, "short url"];
        }
        return availableColumns;
    }, [availableColumns, shortUrl]);

    const handleSelectChange = (e) => {
        const { value } = e.target;
        onColumnSelect(label, value); // Pass the selected column back to the parent
    };

    return (
        <div className="w-fit">
            <Select
                // label={label}
                // labelPlacement="outside-left"
                onChange={handleSelectChange}
                placeholder={label}
                size="sm"
                radius="sm"
                color="default"
                variant="flat"
                className="min-w-[140px]">
                {columnsWithShortUrl.map((column) => (
                    <SelectItem key={column} value={column}>
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}

export function VarSelectorEx(props) {
    const { label = "Var1" } = props;
    return (
        <div className="w-fit">
            <Select
                label={label}
                labelPlacement="outside"
                // placeholder="{#var1#}"
                size="sm"
                radius="sm"
                color="default"
                variant="flat"
                className="min-w-[140px]">
                {colNames.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
            </Select>
        </div>
    );
}
