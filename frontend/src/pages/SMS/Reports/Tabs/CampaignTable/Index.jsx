import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { getSMSCampaigns } from "../../../../../services/Sms/getSmsService";

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

import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import {
    downloadAllSmsDetailsCSVservice,
    downloadAllSmsDetailsPDFservice,
    exportToCSVservice,
    exportToPDFservice,
} from "../../../../../services/Sms/smsDownloadService";
import { useTranslation } from "react-i18next";
import CustomDateRangePicker from "../../../../../components/DatePicker/CustomDateRangePicker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";

const statusColorMap = {
    completed: "success",
    failed: "danger",
    pending: "warning",
    scheduled: "primary",
};

const INITIAL_VISIBLE_COLUMNS = [
    "campaign_name",
    "date",
    "header_name",
    "route",
    "type",
    "status",
    "actions",
    "submittedCredits",
    "deliveredCredits",
];

export default function CampaignReportsTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = useQueryState(
        "rows",
        parseAsInteger.withDefault(5)
    );
    const [users, setUsers] = useState([]);
    const [page, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );
    const [totalRecords, setTotalRecords] = useState(0);

    const [offset, setOffset] = useQueryState(
        "offset",
        parseAsInteger.withDefault(0)
    );

    const { t } = useTranslation();
    // Get current date in local timezone
    const now = today(getLocalTimeZone());
    // default date range 1 year
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) // 1 year before today
            .toISOString()
            .split("T")[0],
        end: new Date(new Date().setDate(new Date().getDate() + 1)) // Tomorrow
            .toISOString()
            .split("T")[0],
    });
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });

    // Fetch report from server
    const { isLoading, error, isError } = useQuery({
        queryKey: [
            "sms-campaign",
            page,
            rowsPerPage,
            filterValue,
            statusFilter,
            visibleColumns,
            sortDescriptor,
            dateRange,
        ],
        queryFn: async () => {
            const { start, end } = dateRange;

            const offset = (page - 1) * rowsPerPage;
            const params = {
                limit: rowsPerPage,
                offset,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
                start_date: new Date(start),
                end_date: new Date(end),
                // columns: Array.from(visibleColumns).join(","),
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };

            const response = await getSMSCampaigns(params);
            setUsers(response.data);

            setTotalRecords(response.totalRecords);

            return response;
        },
    });

    // this useeffect function is set offset when change page
    useEffect(() => {
        setOffset((page - 1) * rowsPerPage);
    }, [page]);

    // Handle date range change from RangeCal component
    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
    };

    // export table pdf formate
    const exportToPDF = async () => {
        try {
            const { start, end } = dateRange;
            const params = {
                limit: rowsPerPage,
                offset,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
                start_date: new Date(start),
                end_date: new Date(end),
                // columns: Array.from(visibleColumns).join(","),
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };

            await exportToPDFservice(params);
        } catch (error) {
            console.log("pdf download error", error);
        }
    };

    // export table csv formate
    const exportToCSV = async () => {
        try {
            const { start, end } = dateRange;
            const params = {
                limit: rowsPerPage,
                offset,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
                start_date: new Date(start),
                end_date: new Date(end),
                // columns: Array.from(visibleColumns).join(","),
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };
            await exportToCSVservice(params);
        } catch (error) {
            console.log("error", error);
        }
    };

    // export sms details in pdf format
    const exportSmsDetailsPDF = async (campaignId) => {
        try {
            await downloadAllSmsDetailsPDFservice(campaignId); // Export SMS details PDF
        } catch (error) {
            console.log(
                error.message || "Failed download sms details in csv format"
            );
        }
    };

    // export sms details in csv format
    const exportSmsDetailsCSV = async (campaignId) => {
        try {
            await downloadAllSmsDetailsCSVservice(campaignId); // Export SMS details CSV
        } catch (error) {
            console.log(
                error.message || "Failed download sms details in csv format"
            );
        }
    };

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const pages = Math.ceil(totalRecords / rowsPerPage);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
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
                                >
                                    <Link
                                        to={`/smsdetailedreport?campaign_id=${user?.id}&campaignName=${user?.campaign_name}`}
                                    >
                                        {t("Detailed Report")}
                                    </Link>
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
                                    onPress={() =>
                                        exportSmsDetailsPDF(user?.campaign_id)
                                    }
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
                                    onClick={() =>
                                        exportSmsDetailsCSV(user?.campaign_id)
                                    }
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
                        {hasRangeCal && (
                            <>
                                <CustomDateRangePicker
                                    onChange={handleDateRangeChange}
                                    defaultValue={{
                                        start: now.subtract({ years: 1 }),
                                        end: now,
                                    }}
                                />
                                {/* <RangeCal
                                    onDateRangeChange={handleDateRangeChange}
                                /> */}
                            </>
                        )}
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
                                    variant="flat"
                                >
                                    {t("Status")}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize"
                                    >
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
                                    variant="flat"
                                >
                                    {t("Columns")}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize"
                                    >
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
                            onClick={exportToPDF}
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
                            onPress={exportToCSV}
                        >
                            {t("CSV")}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t("Total")} {totalRecords} {t("campaigns")}
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        {t("Rows per page")}:
                        <select
                            defaultValue={rowsPerPage}
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
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
                        : `${users.length} ${t("of")} ${totalRecords} ${t(
                              "selected"
                          )}`}
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
    }, [selectedKeys, totalRecords, users, page, pages, hasSearchFilter]);

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
            <TableBody emptyContent={"No campaigns found"} items={users}>
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
