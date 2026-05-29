import React, { useMemo, useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { generateInvoice } from "../../../../../utils/invoiceGenerator";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
} from "@heroui/react";

import { columns, statusOptions, invoiceHardCodedData } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import { getTeleCreditsService } from "../../../../../services/telecredits/teleCreditsServices";
import { formatDateWithTime } from "../../../../../utils/formatDate";
import { getProfileDetailsService } from "../../../../../services/profile/profileService";
import { useProfileStore } from "../../../../../store/profile/profileStore";
import toast from "react-hot-toast";

const statusColorMap = {
  success: "success",
  awaiting: "warning",
  failed: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "date",
  "mode",
  "status",
  "actions",
  "tele_credits",
  "total_with_gst",
];

export default function CreditHistoryTable({ hasRangeCal }) {
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
  const [users, setUsers] = React.useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  const {
    profileData,
    setProfileData,
    organizationAddress,
    billingAddress,
    setOrganizationAddress,
    setBillingAddress,
  } = useProfileStore();
  const [page, setPage] = React.useState(1);
  const [invoiceData, setInvoiceData] = useState(invoiceHardCodedData);

  // Function to fetch profile details
  const fetchProfileDetails = async () => {
    const response = await getProfileDetailsService(token);

    if (response.status === "SUCCESS") {
      const profileData = response.data;
      setOrganizationAddress({
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        pin: profileData.pin,
        country: profileData.country,
      });
      setBillingAddress({
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        pin: profileData.pin,
        country: profileData.country,
      });
      setProfileData(profileData);
    } else {
      toast.error("Failed to fetch profile details");
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfileDetails();
    }
  }, [token]);

  // Invoice generation
  const handleInvoiceDownload = async (user) => {
    try {
      const updatedInvoiceData = {
        ...invoiceData,
        from: `${organizationAddress.address}, ${organizationAddress.city}, ${organizationAddress.pin}, ${organizationAddress.state},  ${organizationAddress.country}`,
        to: `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.pin}, ${billingAddress.state}, ${billingAddress.country}`,
        custom_fields: [
          {
            name: "GSTIN",
            value: profileData.gst_no,
          },
        ],
        items: [
          // required
          {
            name: "Telecredits (Global Credits)", // required
            quantity: 1, // required
            unit_cost: user?.topup_amount, // required
          },
        ],
        amount_paid: user?.total_with_gst,
        tax: 18,
        date: today.toISOString().split("T")[0],
      };

      await generateInvoice(updatedInvoiceData);
      console.log("Invoice generated successfully!");
    } catch (error) {
      console.error("📍Error generating the invoice:", error);
      alert("Failed to generate the invoice. Please try again.");
    }
  };

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const [dateRange, setDateRange] = useState({
    start: oneWeekAgo.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  });

  // this is the function to get credit history
  const getCreditHistory = async () => {
    const { start, end } = dateRange;
    try {
      const offset = (page - 1) * rowsPerPage;
      const params = {
        limit: rowsPerPage,
        offset,
        user_id: userId,
        search: filterValue,
        start_date: new Date(start),
        end_date: new Date(end),
        status: statusFilter === "all" ? statusFilter : [...statusFilter],
        sort_column: sortDescriptor.column,
        sort_direction: sortDescriptor.direction,
      };
      const response = await getTeleCreditsService({
        params,
        token,
      });
      setUsers(response?.data);

      setTotalRecords(response?.totalRecords);
    } catch (error) {
      console.error("Error fetching credit history:", error);
    }
  };

  useEffect(() => {
    if (userId && token) {
      getCreditHistory();
    }
  }, [
    userId,
    token,
    page,
    dateRange,
    rowsPerPage,
    filterValue,
    statusFilter,
    visibleColumns,
    sortDescriptor,
  ]);

  // handle date range change from RangeCal component
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

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
            <p className="text-bold text-small capitalize">{cellValue}</p>
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
          <div>
            {/* Invoice Download */}
            <Tooltip content="Download PDF">
              <Button
                isIconOnly
                size="sm"
                variant="none"
                color="danger"
                onPress={() => handleInvoiceDownload(user)}
              >
                <Icon
                  icon="mi:document-download"
                  width={25}
                  className="cursor-pointer text-danger"
                />
              </Button>
            </Tooltip>
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
        <div className="flex justify-end gap-3 items-end">
          <div className="flex gap-3">
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
                  <DropdownItem key={status.uid} className="capitalize">
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
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {hasRangeCal && (
              <RangeCal onDateRangeChange={handleDateRangeChange} />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small"></span>
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
      // selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.uid} allowsSorting={column.sortable}>
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
