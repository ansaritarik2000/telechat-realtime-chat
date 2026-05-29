import { DateRangePicker, Input, Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify-icon/react";
import ChannelsOption from "./ChannelsOption";
import TagsDropDown from "./TagsDropDown";
import { parseZonedDateTime } from "@internationalized/date";

const LogicFilterContact = ({
    field,
    filterItems,
    filterOptions,
    onSelectionLogicChange,
    onSelectFieldChange,
    onSelectOperatorChange,
    onSelectionTagChange,
    onDateRangeChange,
    onValueChange,
    onChannelSelected,
    isAndOrSelectVisible = false,
    onDelete,
}) => {
    const { t } = useTranslation();
    const today = new Date();

    // Calculate start of the day (12:00 AM)
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
    );

    // Calculate end of the day (11:59 PM)
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
    );
    const [showOperatorOptions, setShowOperatorOptions] =
        useState(filterOptions);

    useEffect(() => {
        switch (field) {
            case "phone_no":
                const phoneNumberOperators = [
                    "is",
                    "is_not",
                    "empty",
                    "ends_with",
                    "contains",
                    "not_contains",
                ];

                setShowOperatorOptions([
                    ...filterOptions.filter(
                        (option) => !phoneNumberOperators.includes(option.key)
                    ),
                    {
                        key: "not_start_with",
                        label: "not start with",
                        icon: "fluent:phone-number-24-regular",
                    },
                ]);
                break;

            default:
                setShowOperatorOptions(filterOptions);
                break;
        }
    }, [field]);

    return (
        <>
            <div className="flex gap-2 items-center">
                {isAndOrSelectVisible && (
                    <div>
                        <Select
                            radius="sm"
                            className="w-[85px]"
                            defaultSelectedKeys={["and"]}
                            
                            onChange={onSelectionLogicChange}>
                            <SelectItem key="and">{t("AND")}</SelectItem>
                            <SelectItem key="or">{t("OR")}</SelectItem>
                        </Select>
                    </div>
                )}
                {!isAndOrSelectVisible && <span>{t("When")} </span>}

                {/* Filter Name.. */}

                <Select
                    items={filterItems}
                    variant="flat"
                    radius="sm"
                    onChange={onSelectFieldChange}
                    classNames={{
                        trigger: "h-6 w-44",
                    }}
                    className={
                        field === "channel" || field === "tags"
                            ? "w-[170px]"
                            : ""
                    }
                    renderValue={(items) => {
                        return items.map((item) => (
                            <div
                                key={item.key}
                                className="flex items-center gap-1">
                                <Icon icon={item.data.icon} width={17} />
                                <span>{t(item.data.label)}</span>
                            </div>
                        ));
                    }}>
                    {(item) => (
                        <SelectItem
                            key={item.key}
                            // textValue={item.label}
                        >
                            <div className="flex gap-2 items-center">
                                <Icon icon={item.icon} width={17} />
                                <span>{t(item.label)}</span>
                            </div>
                        </SelectItem>
                    )}
                </Select>

                {/* Contains filter value */}
                {field !== "channel" &&
                    field !== "tags" &&
                    field !== "created_at" && (
                        <Select
                            radius="sm"
                            size="sm"
                            onChange={onSelectOperatorChange}
                            classNames={{
                                trigger: "h-10",
                            }}>
                            {showOperatorOptions.map((option) => (
                                <SelectItem key={option.key} value={option.key}>
                                    {t(option.label)}
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                {/* show only for channel */}

                {field === "channel" && (
                    <ChannelsOption onChannelSelected={onChannelSelected} />
                )}

                {/* show only for tags */}
                {field === "tags" && (
                    <TagsDropDown onSelectionTagChange={onSelectionTagChange} />
                )}

                {/* show only for created_at */}
                {field === "created_at" && (
                    <DateRangePicker
                        label="Select date and time range"
                        onChange={onDateRangeChange}
                        hideTimeZone
                        defaultValue={{
                            start: parseZonedDateTime(
                                startOfDay
                                    .toISOString()
                                    .replace("Z", "[Asia/Kolkata]")
                            ),
                            end: parseZonedDateTime(
                                endOfDay
                                    .toISOString()
                                    .replace("Z", "[Asia/Kolkata]")
                            ),
                        }}
                    />
                )}

                {/* Input Value */}
                {field !== "channel" &&
                    field !== "tags" &&
                    field !== "created_at" && (
                        <Input
                            onChange={onValueChange}
                            size="sm"
                            radius="sm"
                            placeholder={t("value")}
                            classNames={{
                                inputWrapper: "h-10 ",
                            }}
                        />
                    )}
                {/* Delete Icon */}
                {isAndOrSelectVisible && (
                    <Icon
                        icon="iconamoon:trash-light"
                        className="text-danger-400 cursor-pointer"
                        onClick={onDelete}
                        width={23}
                    />
                )}
            </div>
        </>
    );
};

export default LogicFilterContact;
