import React, { useState } from "react";
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
  Pagination,
  Link,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  PlusIcon,
  PreviewIcon,
  SettingsIcon,
  SyncIcon,
  ThreeDotsIcon,
} from "../../../../../../utils/ReusableIcons";

// Flow status options for filtering
const statusOptions = [
  { name: "Published", uid: "published" },
  { name: "Deprecated", uid: "deprecated" },
];

// Dummy flows data
const flows = [
  {
    id: 1,
    flowName: "Appointment Booking",
    flowStatus: "published",
    flowId: "123456789012345",
    flowToken: "abfab72c-e24c-4bda-a989-9cbdffb4d9d8",
  },
  {
    id: 2,
    flowName: "Product Catalog",
    flowStatus: "published",
    flowId: "234567890123456",
    flowToken: "bcdef72c-e24c-4bda-a989-9cbdffb4d9d9",
  },
  {
    id: 3,
    flowName: "Customer Feedback",
    flowStatus: "deprecated",
    flowId: "345678901234567",
    flowToken: "cdefg72c-e24c-4bda-a989-9cbdffb4d9da",
  },
  {
    id: 4,
    flowName: "Lead Generation",
    flowStatus: "published",
    flowId: "456789012345678",
    flowToken: "defgh72c-e24c-4bda-a989-9cbdffb4d9db",
  },
  {
    id: 5,
    flowName: "Order Tracking",
    flowStatus: "published",
    flowId: "567890123456789",
    flowToken: "efghi72c-e24c-4bda-a989-9cbdffb4d9dc",
  },
];

// Table columns definition
const columns = [
  { name: "Flow Name", uid: "flowName", sortable: true },
  { name: "Flow Status", uid: "flowStatus", sortable: true },
  { name: "Flow Id", uid: "flowId", sortable: true },
  { name: "Flow Token", uid: "flowToken" },
  { name: "Actions", uid: "actions" },
];

// Status color mapping
const statusColorMap = {
  published: "success",
  deprecated: "danger",
};

// Helper function to capitalize strings
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

export default function UserFlowIndex() {
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "flowName",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  // Filter flows based on search and status
  const filteredItems = React.useMemo(() => {
    let filteredFlows = [...flows];

    if (hasSearchFilter) {
      filteredFlows = filteredFlows.filter((flow) =>
        flow.flowName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredFlows = filteredFlows.filter((flow) =>
        Array.from(statusFilter).includes(flow.flowStatus)
      );
    }

    return filteredFlows;
  }, [flows, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  // Get items for current page
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // Sort items
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Render cell content
  const renderCell = React.useCallback((flow, columnKey) => {
    const cellValue = flow[columnKey];

    switch (columnKey) {
      case "flowStatus":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[flow.flowStatus]}
            size="sm"
            variant="flat"
          >
            {capitalize(cellValue)}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip content="Configure List">
              <Button isIconOnly size="sm" variant="none">
                <SettingsIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Preview Flow">
              <Button isIconOnly size="sm" variant="none">
                <PreviewIcon size="1.4em" />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  // Handle rows per page change
  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  // Handle search change
  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  // Clear search
  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Top content with search and filters
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-default-50 dark:bg-default-100/20 p-6 rounded-xl shadow-sm mb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">User Flows</h1>
              <p className="text-default-500 max-w-3xl text-sm mt-1">
                You can use Flows to book appointments, browse products, collect
                customer feedback, get new sales leads, or anything else where
                structured communication is more natural or comfortable for your
                customers. You can store flows form responses to Telepie List,
                making all your collected data easily accessible for
                segmentation and tagging.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button
                as={Link}
                variant="bordered"
                color="primary"
                radius="sm"
                startContent={<PlusIcon customClass="text-primary" />}
                href="https://business.facebook.com/wa/manage/flows"
              >
                Create Flow in Meta
              </Button>
              <Button
                color="primary"
                radius="sm"
                variant="flat"
                startContent={<SyncIcon customClass="text-primary-700" />}
              >
                Sync with Meta
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[28%]"
            placeholder="Search by..."
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={filterValue}
            Powered
            by
            Telepie
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon
                      icon="solar:alt-arrow-down-linear"
                      className="text-small"
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
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {flows.length} flows
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
    onRowsPerPageChange,
    flows.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  // Bottom content with pagination
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showShadow
          color="success"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  return (
    <div className="p-2">
      <Table
        isHeaderSticky
        aria-label="User Flows table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        selectedKeys={selectedKeys}
        selectionMode="none"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
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
        <TableBody emptyContent={"No flows found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
