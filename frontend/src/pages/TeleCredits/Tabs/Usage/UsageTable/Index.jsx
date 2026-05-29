import React, { useEffect, useMemo, useState } from "react";

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
import { Icon } from "@iconify-icon/react";
import RangeCal from "./RangeCal";
import { getTeleCreditsUsesService } from "../../../../../services/telecredits/teleCreditsServices";
import { formatDateWithTime } from "../../../../../utils/formatDate";

const statusColorMap = {
    successful: "success",
    awaiting: "warning",
    failed: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
    "campaign_id",
    "campaign_name",
    "date",
    "service",
    "type",
    "delivered_credits",
    "submitted_credits",
    "cost",
];

export default function UsageTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const [users, setUsers] = useState([]);
    const [page, setPage] = React.useState(1);

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const [dateRange, setDateRange] = useState({
        start: oneWeekAgo.toISOString().split("T")[0],
        end: today.toISOString().split("T")[0],
    });

    // handle date range change from RangeCal component
    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
    };

    // this useffect use for api call
    useEffect(() => {
        const fetchData = async () => {
            const { start, end } = dateRange;
            const offset = (page - 1) * rowsPerPage;
            const params = {
                limit: rowsPerPage,
                offset,
                start_date: new Date(start),
                end_date: new Date(end),
                user_id: userId,
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };

            const response = await getTeleCreditsUsesService({
                params,
                token,
            });
            setUsers(response.data);
            setTotalRecords(response.totalCount);
        };

        fetchData();
    }, [
        page,
        rowsPerPage,
        visibleColumns,
        sortDescriptor,
        dateRange,
        userId,
        token,
    ]);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const pages = Math.ceil(totalRecords / rowsPerPage);

    const sortedItems = React.useMemo(() => {
        return [...users].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, users]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "campaign_id":
                return (
                    <>
                        {user?.rcscampaign?.sendRCS &&
                        user?.rcscampaign?.sendRCS.length > 0
                            ? user?.rcscampaign?.sendRCS[0]?.user_id
                            : ""}
                    </>
                );

            case "campaign_name":
                return <>{user?.rcscampaign?.campaign_name}</>;
            case "date":
                return (
                    <>
                        {user?.created_at
                            ? formatDateWithTime(new Date(user?.created_at))
                            : ""}
                    </>
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
                        {cellValue}
                    </Chip>
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
                <div className="flex justify-end gap-3 items-end">
                    <div className="flex gap-3">
                        {hasRangeCal && (
                            <RangeCal
                                onDateRangeChange={handleDateRangeChange}
                            />
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small"></span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
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
                    showShadow
                    color="success"
                    page={page}
                    total={pages}
                    onChange={setPage}
                    //   className={{
                    //     wrapper: "text-white",
                    //   }}
                />
                {/* <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div> */}
            </div>
        );
    }, [selectedKeys, users, page, pages, hasSearchFilter]);

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
            selectionMode="single"
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
                        {column.name}
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
