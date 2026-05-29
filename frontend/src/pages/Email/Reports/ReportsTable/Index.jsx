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
} from "@heroui/react";

import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import { getRCSCampaigns } from "../../../../services/Rcs/getRcsService";
import {
    downloadRcsDetailsCSVservice,
    downloadRcsDetailsPDFservice,
    exportToCSVservice,
    exportToPDFservice,
} from "../../../../services/Rcs/rcsDownloadService";
import { Link } from "react-router-dom";

const statusColorMap = {
    completed: "success",
    failed: "danger",
    pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "created_at",
    "header_name",
    "template_name",
    "status",
    "actions",
    "submittedCredits",
    "deliveredCredits",
];

export default function RCSReportsTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = useState([]);
    const [page, setPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [offset, setOffset] = useState(0);

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

    // this useffect use for api call
    useEffect(() => {
        const fetchData = async () => {
            const { start, end } = dateRange;
            try {
                const offset = (page - 1) * rowsPerPage;
                const params = {
                    limit: rowsPerPage,
                    offset,
                    search: filterValue,
                    status:
                        statusFilter === "all"
                            ? statusFilter
                            : [...statusFilter],
                    start_date: new Date(start),
                    end_date: new Date(end),
                    // columns: Array.from(visibleColumns).join(","),
                    sort_column: sortDescriptor.column,
                    sort_direction: sortDescriptor.direction,
                };

                const response = await getRCSCampaigns(params);

                if (response.status === "SUCCESS") {
                    setUsers(response.data);
                    setTotalRecords(response.totalRecords);
                }
            } catch (error) {
                console.error("Error fetching RCS campaigns:", error);
            }
        };

        fetchData();
    }, [
        page,
        rowsPerPage,
        filterValue,
        statusFilter,
        visibleColumns,
        sortDescriptor,
        dateRange,
    ]);

    // this useeffect function is set offset when change page
    useEffect(() => {
        setOffset((page - 1) * rowsPerPage);
    }, [page]);

    const exportRcsDetailsPDF = async (campaignId) => {
        try {
            await downloadRcsDetailsPDFservice(campaignId); // Export RCS details PDF
        } catch (error) {
            console.log(
                error.message || "Failed download rcs details in csv format"
            );
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

    // const filteredItems = React.useMemo(() => {
    //     let filteredUsers = [...users];

    //     if (hasSearchFilter) {
    //         filteredUsers = filteredUsers.filter((user) =>
    //             user.name.toLowerCase().includes(filterValue.toLowerCase())
    //         );
    //     }
    //     if (
    //         statusFilter !== "all" &&
    //         Array.from(statusFilter).length !== statusOptions.length
    //     ) {
    //         filteredUsers = filteredUsers.filter((user) =>
    //             Array.from(statusFilter).includes(user.status)
    //         );
    //     }

    //     return filteredUsers;
    // }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(totalRecords / rowsPerPage);

    // const items = React.useMemo(() => {
    //     const start = (page - 1) * rowsPerPage;
    //     const end = start + rowsPerPage;

    //     return filteredItems.slice(start, end);
    // }, [page, filteredItems, rowsPerPage]);

    // const sortedItems = React.useMemo(() => {
    //     return [...items].sort((a, b) => {
    //         const first = a[sortDescriptor.column];
    //         const second = b[sortDescriptor.column];
    //         const cmp = first < second ? -1 : first > second ? 1 : 0;

    //         return sortDescriptor.direction === "descending" ? -cmp : cmp;
    //     });
    // }, [sortDescriptor, items]);

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
                        {cellValue}
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
                                    <Link to="/rcsdetailedreport">
                                        Detailed Report
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
                                    onClick={exportToPDF}
                                    className="text-danger"
                                >
                                    Export PDF
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
                                    onClick={exportToCSV}
                                    className="text-primary"
                                >
                                    Export CSV
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
                        placeholder="Search..."
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
                            <RangeCal onDateRangeChange={setDateRange} />
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
                                    Status
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
                                        {capitalize(status.name)}
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
                                    Columns
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
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            className="text-white bg-red-500"
                            endContent={
                                <Icon
                                    icon="mi:document-download"
                                    width="1.7em"
                                    height="1.7em"
                                />
                            }
                            onClick={exportToPDF}
                        >
                            PDF
                        </Button>
                        <Button
                            color="primary"
                            className="text-white"
                            endContent={
                                <Icon
                                    icon="mi:document-download"
                                    width="1.7em"
                                    height="1.7em"
                                />
                            }
                            onClick={exportToCSV}
                        >
                            CSV
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {totalRecords} users
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
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
                        : `${users.length} of ${totalRecords} selected`}
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
            selectionMode="multiple"
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
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={users}>
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
