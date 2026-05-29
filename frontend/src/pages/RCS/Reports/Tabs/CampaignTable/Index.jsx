import React, { useEffect, useMemo, useState } from "react";
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
    Spinner,
} from "@heroui/react";

import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import { getRCSCampaigns } from "../../../../../services/Rcs/getRcsService";
import {
    downloadRcsDetailsCSVservice,
    downloadRcsDetailsPDFservice,
    exportToCSVservice,
    exportToPDFservice,
} from "../../../../../services/Rcs/rcsDownloadService";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import CustomDateRangePicker from "../../../../../components/DatePicker/CustomDateRangePicker";
import { getLocalTimeZone, today } from "@internationalized/date";

const statusColorMap = {
    completed: "success",
    failed: "danger",
    pending: "warning",
    scheduled: "primary",
};

const INITIAL_VISIBLE_COLUMNS = [
    "created_at",
    "header_name",
    "rcs_devices",
    "nonrcs_devices",
    "template_name",
    "status",
    "actions",
    "total",
    "deliveredCredits",
    "campaign_name",
];

export default function RCSReportsTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = useQueryState("query", {
        defaultValue: "",
    }); // using for storing search
    // Get current date in local timezone
    const now = today(getLocalTimeZone());
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));

    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");

    const [rowsPerPage, setRowsPerPage] = useQueryState(
        "rows",
        parseAsInteger.withDefault(5)
    );
    const [campaignReport, setCampaignReport] = useState([]);

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

    // default date range 1 year
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) // 1 year before today
            .toISOString()
            .split("T")[0],
        end: new Date(new Date().setDate(new Date().getDate() + 1)) // Tomorrow
            .toISOString()
            .split("T")[0],
    });

    const [loadingState, setLoadingState] = useState("loading");

    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "id",
        direction: "descending",
    });

    // Fetch report from server
    const { isLoading, error, isError } = useQuery({
        queryKey: [
            "rcs-campaign",
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

            const response = await getRCSCampaigns(params);

            setCampaignReport(response.data);
            setTotalRecords(response.totalRecords);

            return response;
        },
    });

    useEffect(() => {
        if (isLoading) {
            setLoadingState("loading");
            return;
        }

        if (campaignReport && campaignReport.length === 0) {
            setLoadingState("loading");
            return;
        }

        setLoadingState("idle");
    }, [isLoading, campaignReport]);

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
                    statusFilter === "all"
                        ? statusFilter
                        : Array.from(statusFilter),
                start_date: new Date(start),
                end_date: new Date(end),
                // columns: Array.from(visibleColumns).join(","),
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };
            await exportToCSVservice(params);
        } catch (error) {
            addToast({
                title: "Export Failed",
                description:
                    error.message || "Failed to export data to CSV format",
            });
        }
    };

    const exportRcsDetailsPDF = async (campaignId) => {
        try {
            await downloadRcsDetailsPDFservice(campaignId); // Export RCS details PDF
        } catch (error) {
            addToast({
                title: "PDF Export Failed",
                description:
                    error.message ||
                    "Failed to export RCS campaign details to PDF format",
            });
        }
    };

    const exportRcsDetailsCSV = async (campaignId) => {
        try {
            await downloadRcsDetailsCSVservice(campaignId); // Export RCS details PDF
        } catch (error) {
            console.log(
                error.message || "Failed download rcs details in csv format"
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
                                    {/* passing here dyamic campaign_id query params*/}
                                    <Link
                                        to={`/rcsdetailedreport?campaign_id=${user?.campaign_id}&campaignName=${user?.campaign_name}`}
                                    >
                                        {" "}
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
                                    onPress={() =>
                                        exportRcsDetailsPDF(user?.campaign_id)
                                    }
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
                                    onPress={() =>
                                        exportRcsDetailsCSV(user?.campaign_id)
                                    }
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
                            <CustomDateRangePicker
                                onChange={handleDateRangeChange}
                                defaultValue={{
                                    start: now.subtract({ years: 1 }),
                                    end: now,
                                }}
                            />
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
                            color="danger"
                            variant="flat"
                            endContent={
                                <Icon
                                    icon="mi:document-download"
                                    width="1.7em"
                                    height="1.7em"
                                />
                            }
                            onPress={exportToPDF}
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
                            value={rowsPerPage}
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
        campaignReport,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${campaignReport && campaignReport.length} ${t(
                              "of"
                          )} ${totalRecords} ${t("selected")}`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="success"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        );
    }, [
        selectedKeys,
        totalRecords,
        campaignReport,
        page,
        pages,
        hasSearchFilter,
    ]);

    if (isError) {
        addToast({
            title: error.name,
            description: error.message,
        });
    }

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
                        // allowsSorting={column.sortable}
                    >
                        {t(column.name)}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                loadingState={loadingState}
                emptyContent={"No campaign found"}
                loadingContent={<Spinner />}
                items={campaignReport}
            >
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
