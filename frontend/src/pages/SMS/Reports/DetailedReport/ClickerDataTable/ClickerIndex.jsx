import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Chip,
} from "@heroui/react";
import {
    SearchIcon,
    ChevronDownIcon,
    ClickedIcon,
    SentIcon,
} from "../../../../../utils/ReusableIcons";

// Table columns
const columns = [
    { name: "Shortened URL", uid: "shortened_url" },
    { name: "Phone Number", uid: "phoneNumber" },
    { name: "Tracker ID", uid: "tracker_id" },
    { name: "Message ID", uid: "message_id" },
    { name: "Engagement", uid: "engagement" },
    { name: "No of Clicks", uid: "no_of_clicks" },
];

// Initial visible columns
const INITIAL_VISIBLE_COLUMNS = new Set([
    "shortened_url",
    "phoneNumber",
    "tracker_id",
    "message_id",
    "engagement",
    "no_of_clicks",
]);

// Sample data
const data = [
    {
        uid: "1",
        phoneNumber: "+91-9876543210",
        shortened_url: "https://1tp.in/abc123",
        tracker_id: "TID001",
        message_id: "MID001",
        engagement: "clicked",
        no_of_clicks: 67,
    },
    {
        uid: "2",
        phoneNumber: "+91-9876510210",
        shortened_url: "https://1tp.in/xyz456",
        tracker_id: "TID002",
        message_id: "MID002",
        engagement: "sent",
        no_of_clicks: 0,
    },
    {
        uid: "3",
        phoneNumber: "+91-9876510290",
        shortened_url: "https://t1p.in/cbv782",
        tracker_id: "TID003",
        message_id: "MID003",
        engagement: "clicked",
        no_of_clicks: 100,
    },
    {
        uid: "4",
        phoneNumber: "+91-9076510210",
        shortened_url: "https://t1p.in/hjk499",
        tracker_id: "TID003",
        message_id: "MID003",
        engagement: "clicked",
        no_of_clicks: 100,
    },
    {
        uid: "5",
        phoneNumber: "+91-9076510211",
        shortened_url: "https://t1p.in/nel893",
        tracker_id: "TID003",
        message_id: "MID003",
        engagement: "clicked",
        no_of_clicks: 100,
    },
    {
        uid: "6",
        phoneNumber: "+91-9876510210",
        shortened_url: "https://t1p.in/URL_ADDRESS",
        tracker_id: "TID003",
        message_id: "MID003",
        engagement: "clicked",
        no_of_clicks: 100,
    },
];

export default function ClickerDataTable() {
    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState(
        INITIAL_VISIBLE_COLUMNS
    );
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const onSearchChange = React.useCallback((value) => {
        setFilterValue(value.toLowerCase());
        setPage(1);
    }, []);

    const filteredData = React.useMemo(() => {
        if (!filterValue) return data;
        return data.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(filterValue)
            )
        );
    }, [filterValue]);

    const pages = Math.ceil(filteredData.length / rowsPerPage);

    const paginatedData = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredData.slice(start, end);
    }, [filteredData, page, rowsPerPage]);

    const headerColumns = React.useMemo(() => {
        return columns.filter((col) => visibleColumns.has(col.uid));
    }, [visibleColumns]);

    const renderCell = React.useCallback((row, columnKey) => {
        const cellValue = row[columnKey];

        if (columnKey === "shortened_url") {
            return (
                <span className="text-sm font-medium text-foreground">
                    {cellValue}
                </span>
            );
        }

        if (columnKey === "engagement") {
            return (
                <div className="flex items-center gap-1 capitalize">
                    <span>
                        {cellValue === "clicked" ? (
                            <ClickedIcon />
                        ) : (
                            <SentIcon size="1.5em" />
                        )}
                    </span>
                    <span>{cellValue}</span>
                </div>
            );
        }

        if (columnKey === "phoneNumber") {
            return <span className="text-sm">{cellValue}</span>;
        }

        return <span className="text-sm">{cellValue}</span>;
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col ">
                {/* <h2 className="text-md font-semibold mb-4">Clicker Report</h2> */}

                {/* Top Controls */}
                <div className="flex justify-between gap-3 mb-2 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-xs"
                        placeholder="Search by..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onValueChange={onSearchChange}
                        onClear={() => setFilterValue("")}
                    />

                    <div className="flex gap-3 items-end">
                        <Dropdown size="sm">
                            <DropdownTrigger>
                                <Button
                                    variant="flat"
                                    endContent={
                                        <ChevronDownIcon className="text-sm" />
                                    }
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Select visible columns"
                                selectionMode="multiple"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                onSelectionChange={setVisibleColumns}
                                disallowEmptySelection
                            >
                                {columns.map((col) => (
                                    <DropdownItem key={col.uid}>
                                        {col.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

                <div className="flex justify-end items-end mb-2">
                    <label className="text-xs text-default-500 flex items-center gap-2">
                        <span className="text-xs">Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="bg-transparent border-none text-xs text-default-500 outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, visibleColumns, rowsPerPage, page]);

    return (
        <div className="">
            {/* Table */}
            <Table
                aria-label="Clicker data table"
                isHeaderSticky="true"
                topContent={topContent}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn key={column.uid}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={paginatedData}>
                    {(item) => (
                        <TableRow key={item.uid}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination Footer */}
            <div className="flex justify-end mt-4">
                <Pagination
                    isCompact
                    showShadow
                    color="success"
                    size="sm"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        </div>
    );
}
