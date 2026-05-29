import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    useDisclosure,
    Tooltip,
} from "@heroui/react";

import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import { useReportBotStore } from "../../../../../store/useReportBotStore";
import {
    deleteBotsService,
    getRCSReportBots,
} from "../../../../../services/Rcs/rcsBotService";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { parseAsInteger, useQueryState } from "nuqs";

const statusColorMap = {
    active: "success",
    inactive: "warning",
    pending: "primary",
};

const INITIAL_VISIBLE_COLUMNS = [
    "bot_name",
    "bot_id",
    // "client_id",
    "bot_type",
    "message_type",
    "created_at",
    "status",
    "errormsg",
    "actions",
];

export default function RCSBots({ hasRangeCal }) {
    const [filterValue, setFilterValue] = useQueryState("query", {
        defaultValue: "",
    });
    const { rcsBotReport, setRcsBotReport } = useReportBotStore();
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useQueryState(
        "rows",
        parseAsInteger.withDefault(5)
    );
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "age",
        direction: "ascending",
    });
    const navigate = useNavigate();
    const { t } = useTranslation();

    // PDF Export Function

    const [page, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    // Fetch data on page/rowsPerPage change

    const fetchBots = async () => {
        try {
            const params = {
                page,
                limit: rowsPerPage,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
            };

            const response = await getRCSReportBots(params);
            setRcsBotReport(response);
        } catch (err) {
            console.log("error", err);
        }
    };

    useEffect(() => {
        fetchBots();
    }, [page, rowsPerPage, filterValue, statusFilter]);

    console.log("selectedKeys", selectedKeys);

    // delete bots
    const deleteBotHandller = async () => {
        try {
            const reponse = await deleteBotsService(Array.from(selectedKeys));
            toast.success("Bots deleted successfully!");

            fetchBots();
        } catch (error) {
            toast.error("Error deleting bots");
        }
    };
    // edit bot
    const onEditHandller = async (user) => {
        navigate(
            `/tempapproval/?botId=${user.bot_id}&brandId=${user.brand_id}`
        );
    };

    const sortedItems = useMemo(() => {
        const items =
            rcsBotReport.data && rcsBotReport.data.length > 0
                ? [...rcsBotReport.data]
                : [];

        return items.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, rcsBotReport]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}>
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
                        variant="flat">
                        {t(cellValue)}
                    </Chip>
                );
            case "actions":
                return (
                    <div>
                        <Tooltip content="Edit">
                            <Button
                                size="sm"
                                isIconOnly
                                variant="none"
                                onPress={() => onEditHandller(user)}>
                                <Icon
                                    icon="fluent:edit-24-regular"
                                    width="1.4em"
                                    height="1.4em"
                                />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    // const onNextPage = React.useCallback(() => {
    //     if (page < pages) {
    //         setPage(page + 1);
    //     }
    // }, [page, pages]);

    // const onPreviousPage = React.useCallback(() => {
    //     if (page > 1) {
    //         setPage(page - 1);
    //     }
    // }, [page]);

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
    const topContent = useMemo(() => {
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
                        {/* Calendar */}
                        {hasRangeCal && <RangeCal />}
                        {/* Status  */}
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

                        <Link to="/tempapproval/?selected=rcsbots">
                            <Button color="success" variant="flat">
                                {t("Deploy New Bot")}
                            </Button>
                        </Link>

                        {/* Delete */}
                        <Button
                            isIconOnly
                            onPress={deleteBotHandller}
                            color="danger"
                            variant="flat">
                            <Icon
                                icon="iconamoon:trash-light"
                                width="1.4em"
                                height="1.4em"
                            />
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t("Total")}{" "}
                        {rcsBotReport.pagination &&
                            rcsBotReport.pagination.totalItems}{" "}
                        {t("users")}
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        {t("Rows per page")}:
                        <select
                            value={rowsPerPage}
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
        selectedKeys,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        rcsBotReport,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${
                              (rcsBotReport.data && rcsBotReport.data.length) ||
                              0
                          } ${t("of")} ${
                              (rcsBotReport.pagination &&
                                  rcsBotReport.pagination.totalItems) ||
                              0
                          } ${t("selected")}`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="success"
                    page={page}
                    total={rcsBotReport?.pagination?.totalPages || 0}
                    onChange={setPage}
                />
            </div>
        );
    }, [selectedKeys, rcsBotReport, page, hasSearchFilter]);

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
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            rowHeight="40">
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
            <TableBody emptyContent={"No users found"} items={sortedItems}>
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
