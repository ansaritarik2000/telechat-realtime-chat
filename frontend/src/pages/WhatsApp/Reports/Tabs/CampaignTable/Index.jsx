import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    addToast,
} from "@heroui/react";

import { columns, users, statusOptions, getCampaignDetails } from "./data";
import {
    capitalize,
    downloadSingleWADetailsPDFservice,
    downloadWADetailsCSVservice,
    downloadWADetailsPDFservice,
} from "./utils";
import RangeCal from "./RangeCal";
import toast from "react-hot-toast";
import { formatDate } from "../TemplateTable/data";
import { useTranslation } from "react-i18next";
const statusColorMap = {
    delivered: "success",
    failed: "danger",
    pending: "warning",
    scheduled: "primary",
};

const INITIAL_VISIBLE_COLUMNS = [
    "campaignName",
    "created_at",
    "header",
    "route",
    "selectedTemplateTypeSend",
    "status",
    "actions",
    "submittedCredits",
    "deliveredCredits",
];

export default function ReportsTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [users, setUsers] = React.useState([]);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "created_at",
        direction: "descending",
    });
    const token = localStorage.getItem("token");

    // default date range 1 year
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) // 1 year before today
            .toISOString()
            .split("T")[0],
        end: new Date(new Date().setDate(new Date().getDate() + 1)) // Tomorrow
            .toISOString()
            .split("T")[0],
    });

    // Handle date range change from RangeCal component
    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
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
                user.campaignName
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (statusFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status)
            );
        }

        filteredUsers = filteredUsers.filter((user) => {
            const userDate = new Date(user.created_at)
                .toISOString()
                .split("T")[0];
            return userDate >= dateRange.start && userDate <= dateRange.end;
        });

        return filteredUsers;
    }, [users, filterValue, hasSearchFilter]);

    const sortedItems = React.useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);
    // Paginated items
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const paginatedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [sortedItems, page, rowsPerPage]);

    // this useffect use for api call
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCampaignDetails();
                const campaign = result.data.data.Campaign;
                setUsers(campaign);
                setTotalRecords(result.data.data.totalRecords);
            } catch (error) {
                addToast({
                    title: "Alert!",
                    description: "Error fetching WhatsApp campaigns",
                    color: "warning",
                });
                // console.error("Error fetching WhatsApp campaigns:", error);
            }
        };

        if (token) {
            fetchData();
        }
    }, [
        page,
        rowsPerPage,
        filterValue,
        statusFilter,
        visibleColumns,
        sortDescriptor,
        dateRange,
        token,
    ]);

    // export table pdf formate
    const exportToPDF = async () => {
        try {
            const response = await downloadWADetailsPDFservice(
                rowsPerPage,
                page
            );
            if (response) {
                addToast({
                    title: "PDF Download",
                    description: "PDF Downloaded successfully",
                    color: "Success".toLowerCase(),
                });
            }
        } catch (error) {
            throw error;
        }
    };
    // export table csv formate
    const exportToCSV = () => {
        // console.log("CSV");
        const tableElement = document.getElementById("table-to-export");
        const rows = tableElement.querySelectorAll("tr");
        let csvContent = "";

        // Iterate through each row of the table
        rows.forEach((row) => {
            const cells = Array.from(row.querySelectorAll("th, td"));
            const rowContent = cells
                .map((cell) => `"${cell.innerText}"`)
                .join(",");
            csvContent += rowContent + "\n";
        });

        // Create a downloadable blob
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Whatsapp_Details.csv"; // Filename for the CSV
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    };

    const exportToCSVOne = async (user) => {
        const campaign_id = user.campaignId;
        try {
            await downloadWADetailsCSVservice(campaign_id); // Export RCS details PDF
        } catch (error) {
            console.log(
                error.message || "Failed download rcs details in csv format"
            );
        }
    };

    // export the details  of one email campaign into pdf
    const exportToPDFOne = async (user) => {
        const campaign_id = user.campaignId;
        // console.log(user)
        try {
            const response = await downloadSingleWADetailsPDFservice(
                campaign_id
            );
            if (response) {
                addToast({
                    title: "PDF Download",
                    description: "PDF Downloaded successfully",
                    color: "Success".toLowerCase(),
                });
            }
        } catch (error) {
            throw error;
        }
    };
    useEffect(() => {
        setPage(1); // Reset to the first page whenever filters change
    }, [filterValue, statusFilter, dateRange]);
    // Cancel the scheduled campaign fuctionality
    const handleCancelScheduled = (campaignId) => {
        onOpen();
    };
    const renderCell = React.useCallback(
        (user, columnKey) => {
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
                case "created_at":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">
                                {formatDate(cellValue)}
                            </p>
                            {/* <p className="text-bold text-tiny capitalize text-default-400">
                {user.team}
              </p> */}
                        </div>
                    );
                case "selectedTemplateTypeSend":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">
                                {capitalize(cellValue)}
                            </p>
                            {/* <p className="text-bold text-tiny capitalize text-default-400">
              {user.team}
            </p> */}
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
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                    >
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
                                            to={`/wadetailedreport?campaignId=${user?.campaignId}&campaignName=${user?.campaignName}`}
                                        >
                                            Detailed Report
                                        </Link>
                                    </DropdownItem>
                                    {user.status === "scheduled" && (
                                        <DropdownItem
                                            startContent={
                                                <Icon
                                                    icon="material-symbols-light:cancel-outline"
                                                    width="1.6em"
                                                    height="1.6em"
                                                />
                                            }
                                            key="cancel"
                                            color="danger"
                                            className="text-danger"
                                            onPress={() =>
                                                handleCancelScheduled(
                                                    user.campaignId
                                                )
                                            }
                                        >
                                            Cancel Scheduled
                                        </DropdownItem>
                                    )}
                                    <DropdownItem
                                        startContent={
                                            <Icon
                                                icon="mi:document-download"
                                                width="1.7em"
                                                height="1.7em"
                                            />
                                        }
                                        onClick={() => exportToPDFOne(user)}
                                        key="pdf"
                                        color="danger"
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
                                        onClick={() => exportToCSVOne(user)}
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
        },
        [onOpen, isOpen, handleCancelScheduled]
    );

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
                            <RangeCal
                                onDateRangeChange={handleDateRangeChange}
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
                            onClick={exportToCSV}
                        >
                            CSV
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {totalRecords} campaign
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
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex justify-start items-center gap-1">
                                    <Icon
                                        icon="si:check-circle-duotone"
                                        width="24"
                                        height="24"
                                        className="text-success"
                                    />
                                    {t("Confirmation")}
                                </ModalHeader>
                                <ModalBody>
                                    <p>
                                        Are you sure you want to cancel this
                                        campaign?
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        {t("Cancel")}
                                    </Button>
                                    <Button
                                        color="success"
                                        variant="flat"
                                        onPress={() => {
                                            addToast({
                                                title: "Success",
                                                description: `Cancel the scheduled campaign successfully`,
                                                color: "Success".toLowerCase(),
                                            });
                                            onClose();
                                        }}
                                    >
                                        {t("Yes")}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        totalRecords,
        onSearchChange,
        hasSearchFilter,
        onOpen,
        isOpen,
        onOpenChange,
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
                />
            </div>
        );
    }, [selectedKeys, totalRecords, page, pages, hasSearchFilter]);

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
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No Campaign found"}
                items={paginatedItems}
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
