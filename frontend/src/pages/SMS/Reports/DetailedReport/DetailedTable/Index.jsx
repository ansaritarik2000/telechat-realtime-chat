import React, { useEffect, useState } from "react";

import { Icon } from "@iconify-icon/react";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";

import { columns, statusOptions } from "./newdata";
import { getSmsAdditionalDetailsService } from "../../../../../services/Sms/smsAdditionalDetailsService";
import { useSearchParams } from "react-router-dom";
import {
    downloadAllSmsDetailsCSVservice,
    downloadAllSmsDetailsPDFservice,
} from "../../../../../services/Sms/smsDownloadService";
import { useTranslation } from "react-i18next";

const statusColorMap = {
    delivered: "success",
    failed: "danger",
    pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "message_id",
    "header_name",
    "phone_number",
    "operator",
    "circle",
    "received_at",
    "submitted_at",
    "delivered_at",
    "message",
    "status",
    "error_code",
    "error_description",
];

export default function DetailedTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [users, setUsers] = useState([]);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const { t } = useTranslation();
    const [URLSearchParams] = useSearchParams();
    const campaign_id = URLSearchParams.get("campaign_id");

    // this use effect function are used for called sms-additional-data
    useEffect(() => {
        if (campaign_id) {
            const fetchRcsDetails = async () => {
                try {
                    const response = await getSmsAdditionalDetailsService(
                        campaign_id
                    );

                    if (response.status === "SUCCESS") {
                        setUsers(response.data);
                    } else {
                        console.log("Error in fetching RCS additional details");
                    }
                } catch (error) {
                    console.log("error", error);
                }
            };

            fetchRcsDetails();
        }
    }, [campaign_id]);

    // export sms details in pdf format
    const exportSmsDetailsPDF = async () => {
        try {
            await downloadAllSmsDetailsPDFservice(campaign_id); // Export SMS details PDF
        } catch (error) {
            console.log(
                error.message || "Failed download sms details in csv format"
            );
        }
    };

    // export sms details in csv format

    const exportSmsDetailsCSV = async () => {
        try {
            await downloadAllSmsDetailsCSVservice(campaign_id); // Export SMS details PDF
        } catch (error) {
            console.log(
                error.message || "Failed download sms details in csv format"
            );
        }
    };

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.phone_number
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (
            statusFilter !== "all" &&
            Array.from(statusFilter).length !== statusOptions.length
        ) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status)
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    // Display all rows instead of paginating
    const items = React.useMemo(() => filteredItems, [filteredItems]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                        <p className="text-bold text-tiny capitalize text-default-400">
                            {user.team}
                        </p>
                    </div>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.status]}
                        size="sm"
                        variant="flat"
                    >
                        {t(cellValue)}
                    </Chip>
                );

            case "message":
                return (
                    <div className="relative">
                        <Popover>
                            <PopoverTrigger>
                                <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                                    {/* Truncated Message */}
                                    <span className="truncate max-w-xs">
                                        {user?.message?.length > 20
                                            ? `${user.message.substring(
                                                  0,
                                                  20
                                              )}...`
                                            : user.message}
                                    </span>
                                    {/* Information Icon */}
                                    <Icon
                                        icon="heroicons-outline:information-circle"
                                        className="w-5 h-5 mt-2 text-gray-500 dark:text-gray-400"
                                    />
                                </button>
                            </PopoverTrigger>

                            {/* Content */}
                            <PopoverContent
                                className="p-4 rounded-xl shadow-lg border max-w-[25rem]"
                                placement="bottom"
                                showArrow
                            >
                                <p className="text-xs text-wrap">
                                    {user?.message}
                                </p>
                            </PopoverContent>
                        </Popover>
                    </div>
                );

            case "actions":
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <Icon
                                        icon="f7:chevron-down-square"
                                        width="1.9em"
                                        height="1.9em"
                                    />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                variant="bordered"
                                aria-label="Dropdown actions"
                            >
                                <DropdownItem
                                    startContent={
                                        <Icon
                                            icon="majesticons:eye-line"
                                            width="1.6em"
                                            height="1.6em"
                                        />
                                    }
                                    key="view"
                                    href="/"
                                >
                                    {t("Detailed Report")}
                                </DropdownItem>
                                <DropdownItem
                                    startContent={
                                        <Icon
                                            icon="mi:document-download"
                                            width="1.7em"
                                            height="1.7em"
                                        />
                                    }
                                    key="pdf"
                                    color="danger"
                                    className="text-danger"
                                >
                                    {t("Export PDF")}
                                </DropdownItem>
                                <DropdownItem
                                    startContent={
                                        <Icon
                                            icon="mi:document-download"
                                            width="1.7em"
                                            height="1.7em"
                                        />
                                    }
                                    // shortcut="⌘⇧C"
                                    key="csv"
                                    color="primary"
                                    className="text-primary"
                                >
                                    {t("Export CSV")}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    // Top Table Content
    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-[20%] sm:max-w-[44%]"
                        placeholder={t("Search by...")}
                        startContent={
                            <Icon
                                icon="majesticons:search-line"
                                width="1.2em"
                                height="1.2em"
                            />
                        }
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />

                    <div className="flex gap-3">
                        <Button
                            color="danger"
                            variant="flat"
                            endContent={
                                <Icon
                                    icon="mi:document-download"
                                    width="1.7em"
                                    height="1.7em"
                                />
                            }
                            onClick={exportSmsDetailsPDF}
                        >
                            {t("PDF")}
                        </Button>
                        <Button
                            color="primary"
                            variant="flat"
                            endContent={
                                <Icon
                                    icon="mi:document-download"
                                    width="1.7em"
                                    height="1.7em"
                                />
                            }
                            onClick={exportSmsDetailsCSV}
                        >
                            {t("CSV")}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t("Total")} {users.length} {t("users")}
                    </span>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        users.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} ${t("of")} ${
                              filteredItems.length
                          } ${t("selected")}`}
                </span>
                {/* Pagination is removed since rows are no longer paginated */}
            </div>
        );
    }, [selectedKeys, filteredItems.length]);

    return (
        <Table
            id="table-to-export"
            aria-label="table with custom cells, pagination and sorting"
            isHeaderSticky="true"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="inside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {t(column.name)}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No data found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
