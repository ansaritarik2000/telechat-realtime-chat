import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useSearchParams } from "react-router-dom";
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

import { columns, statusOptions } from "./newdata";

import RangeCal from "./RangeCal";
import axios from "axios";
import { downloadRcsDetailsCSVservice } from "../../../../../services/Rcs/rcsDownloadService";
import { axiosServerInstance } from "../../../../../utils/axios/config";

const statusColorMap = {
    Completed: "success",
    Failed: "danger",
    pending: "danger",
    Scheduled: "warning",
};
const engagementIconMap = {
    open: "ri:check-double-fill",
    "Not Read": "ri:check-double-fill",
    "N/A": "fluent-mdl2:touch",
};

const INITIAL_VISIBLE_COLUMNS = [
    "tucId",
    "campaignName",
    "emailID",
    "uuid",
    "platform",
    "mobile",
    "templateType",
    "circle",
    "date",
    "submitTs",
    "deliveryTs",
    "message",
    "status",
    "errorId",
    "engagement",
];

export default function DetailedTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [users, setUsers] = useState([]);
    const [URLSearchParams] = useSearchParams();

    const [statusFilter, setStatusFilter] = React.useState("all");
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [campaignName, setCampaignName] = useState("");
    // get data for details campaign Report
    useEffect(() => {
        const campaign_id = URLSearchParams.get("campaign_id");
        // console.log("campaign_id:",campaign_id)
        const fetchData = async () => {
            try {
                const res = await axiosServerInstance.get(
                    `/email/getCampaignDataById/${campaign_id}`
                );
                const data = res.data;
                setUsers(data.data);

                setCampaignName(data.data[0].campaignName);
            } catch (error) {
                console.log("error", error.message);
                throw error;
            }
        };
        fetchData();
    }, []);
    // export the details  of email campaign into csv
    const exportRcsDetailsCSV = () => {
        const tableElement = document.getElementById("table-to-export");
        const rows = tableElement.querySelectorAll("tr");
        let csvContent = `"${campaignName}",\n`; // Add campaign name dynamically at the top

        // Iterate through each row of the table
        rows.forEach((row) => {
            const cells = Array.from(row.querySelectorAll("th, td"));
            const rowContent = cells
                .slice(1, -1)
                .map((cell) => `"${cell.innerText}"`)
                .join(",");
            csvContent += rowContent + "\n";
        });

        // Create a downloadable blob
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "table-export.csv"; // Filename for the CSV
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
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
                user.name.toLowerCase().includes(filterValue.toLowerCase())
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
            case "UUID":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.emailID}
                        name={cellValue}>
                        {user.uuid}
                    </User>
                );
            case "name":
                return <User>{user.emailID}</User>;

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
                    <div className="relative flex justify-start items-center gap-1">
                        <Chip
                            className="capitalize"
                            color={
                                statusColorMap[user.campaignReportData.status]
                            } // Adjust color based on status
                            size="sm"
                            variant="flat">
                            {user.campaignReportData.status}
                        </Chip>
                    </div>
                );
            case "platform":
                return (
                    <div className="relative flex justify-start items-center gap-1">
                        <p>{user.campaignReportData.platform}</p>
                    </div>
                );
            case "engagement":
                return (
                    <div className="relative flex justify-start items-center gap-1">
                        <Icon
                            icon={
                                engagementIconMap[
                                    user.campaignReportData.engagement
                                ]
                            }
                            width={"1.2em"}
                            className={
                                user.campaignReportData.engagement === "open"
                                    ? "text-primary"
                                    : "text-default-500"
                            }
                        />
                        <p>{user.campaignReportData.engagement}</p>
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
                                    Detailed Report
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
                                    className="text-primary">
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
                        // onValueChange={onSearchChange}
                    />

                    <div className="flex gap-3">
                        {hasRangeCal && <RangeCal />}

                        <Button
                            color="danger"
                            variant="flat"
                            endContent={
                                <Icon
                                    icon="mi:document-download"
                                    width="1.7em"
                                    height="1.7em"
                                />
                            }>
                            PDF
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
                            onClick={exportRcsDetailsCSV}>
                            CSV
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {users.length} users
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
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>
                {/* Pagination is removed since rows are no longer paginated */}
            </div>
        );
    }, [selectedKeys, filteredItems.length]);

    return (
        <Table
            id="table-to-export"
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky="true"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="inside"
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
