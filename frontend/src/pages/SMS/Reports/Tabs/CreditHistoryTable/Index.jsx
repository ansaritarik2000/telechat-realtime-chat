import React, { useState } from "react";
import jsPDF from "jspdf";
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
    Pagination,
} from "@heroui/react";

import { columns, users, statusOptions } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getSmsCreditHistoryService } from "../../../../../services/Sms/smsCreditHistoryService";
import { formatDateWithTime } from "../../../../../utils/formatDate";
import { parseAsInteger, useQueryState } from "nuqs";
import toast from "react-hot-toast";
import {
    downloadSmsCreditHistoryCSVService,
    downloadSmsCreditHistoryPdfService,
} from "../../../../../services/Sms/downloadSmsCreditHistoryService";

const statusColorMap = {
    credited: "success",
    deducted: "primary",
};

const INITIAL_VISIBLE_COLUMNS = [
    "campaignName",
    "date",
    "route",
    "type",
    "status",
    "actions",
    "submitted_credits",
    "deliverd_credits",
];

export default function CreditsHistoryTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const [statusFilter, setStatusFilter] = React.useState("all");
    const [users, setUsers] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useQueryState(
        "rows",
        parseAsInteger.withDefault(5)
    );

    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const userId = localStorage.getItem("user_id");
    const { t } = useTranslation();

    const [page, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const offset = (page - 1) * rowsPerPage;

    const { data } = useQuery({
        queryKey: [
            "smsCreditHistory",
            userId,
            rowsPerPage,
            offset,
            filterValue,
            statusFilter,
            ...statusFilter,
            sortDescriptor.column,
            sortDescriptor.direction,
        ],
        queryFn: async () => {
            try {
                const offset = (page - 1) * rowsPerPage;
                const params = {
                    user_id: userId,
                    limit: rowsPerPage,
                    offset,
                    search: filterValue,
                    status:
                        statusFilter === "all"
                            ? statusFilter
                            : [...statusFilter],

                    sort_column: sortDescriptor.column,
                    sort_direction: sortDescriptor.direction,
                };

                const response = await getSmsCreditHistoryService(params);

                if (response.status === "SUCCESS") {
                    setUsers(response?.data || []);
                    setTotalRecords(response?.totalRecords || 0);
                }
            } catch (error) {
                toast.error("Error fetching SMS Credit history");
            }
        },
        enabled: !!userId,
    });

    const pages = Math.ceil(totalRecords / rowsPerPage);

    const sortedItems = React.useMemo(() => {
        return [...users].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, users]);

    // export to pdf function
    const exportToPDF = async (user) => {
        try {
            const offset = (page - 1) * rowsPerPage;
            const params = {
                limit: rowsPerPage,
                offset,
                user_id: userId,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };
            const response = await downloadSmsCreditHistoryPdfService(params);
        } catch (error) {
            console.log("Error exporting to PDF:", error);
            toast.error("Error exporting to PDF");
        }
    };

    // this function is used for export to csv
    const exportToCSV = async (user) => {
        try {
            const offset = (page - 1) * rowsPerPage;
            const params = {
                limit: rowsPerPage,
                offset,
                user_id: userId,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };
            await downloadSmsCreditHistoryCSVService(params);
        } catch (error) {
            console.log("Error exporting to CSV:", error);
            toast.error("Error exporting to CSV");
        }
    };

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "campaignName":
                return <p>{user?.smscampaign?.campaign_name}</p>;
            case "date":
                return (
                    <>
                        {user?.created_at
                            ? formatDateWithTime(new Date(user?.created_at))
                            : ""}
                    </>
                );
            case "route":
                return <p>{user?.smscampaign?.route}</p>;
            case "type":
                return (
                    <p>
                        {" "}
                        {
                            user?.smscampaign?.sms_templates?.sms_template_types
                                ?.name
                        }
                    </p>
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
                        variant="flat">
                        {t(cellValue)}
                    </Chip>
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
                                aria-label="Dropdown actions">
                                <DropdownItem
                                    startContent={
                                        <Icon
                                            icon="majesticons:eye-line"
                                            width="1.6em"
                                            height="1.6em"
                                        />
                                    }
                                    key="view"
                                    href="/">
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
                                    className="text-danger">
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
                                    className="text-primary">
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

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
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
                        placeholder={t("Search...")}
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
                        {/* Calendar  */}
                        {hasRangeCal && <RangeCal />}
                        {/* Status DropDown */}
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <Icon
                                            icon="fluent:chevron-down-16-regular"
                                            width="1.2em"
                                            height="1.2em"
                                        />
                                    }
                                    variant="flat">
                                    {t("Status")}
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}>
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize">
                                        {t(capitalize(status.name))}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <Icon
                                            icon="fluent:chevron-down-16-regular"
                                            width="1.2em"
                                            height="1.2em"
                                        />
                                    }
                                    variant="flat">
                                    {t("Columns")}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}>
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize">
                                        {t(capitalize(column.name))}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            variant="flat"
                            color="danger"
                            endContent={
                                <Icon
                                    icon="mi:document-download"
                                    width="1.7em"
                                    height="1.7em"
                                />
                            }
                            onPress={exportToPDF}>
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
                            onPress={exportToCSV}>
                            {t("CSV")}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t("Total")} {totalRecords}{" "}
                        {t("credit history records")}
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        {t("Rows per page")}:
                        <select
                            defaultValue={rowsPerPage}
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
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
                        : `${selectedKeys.size} of ${totalRecords} selected`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    initialPage={1}
                    showShadow
                    color="success"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        );
    }, [selectedKeys, sortedItems, totalRecords, page, pages, hasSearchFilter]);

    return (
        <Table
            id="table-to-export"
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={
                {
                    // wrapper: "max-h-[382px]",
                    // wrapper: "max-h-[600px]",
                }
            }
            selectedKeys={selectedKeys}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}>
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}>
                        {t(column.name)}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No credit history found"}
                items={sortedItems}>
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
