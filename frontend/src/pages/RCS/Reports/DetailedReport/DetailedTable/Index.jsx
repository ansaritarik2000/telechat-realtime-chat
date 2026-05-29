import React, { useEffect, useState } from "react";
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
} from "@heroui/react";

import { columns, users, statusOptions } from "./newdata";
import RangeCal from "./RangeCal";
import { useSearchParams } from "react-router-dom";
import { getRcsAdditionalDetailsService } from "../../../../../services/Rcs/rcsAdditionalDetailsService";
import {
  downloadRcsDetailsCSVservice,
  downloadRcsDetailsPDFservice,
} from "../../../../../services/Rcs/rcsDownloadService";
import { useTranslation } from "react-i18next";

const statusColorMap = {
  delivered: "success",
  failed: "danger",
  pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "campaign_name",
  "message_id",
  "phone_number",
  "bot_id",
  "date",
  "campaign_type",
  "device",
  "status",
  "engagement",
  "country",
];

const engagementIconMap = {
  read: "ri:check-double-fill",
  delivered: "ri:check-double-fill",
  clicked: "fluent-mdl2:touch",
  sent: "ri:check-single-fill",
};

export default function DetailedTable({ hasRangeCal }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });

  const [URLSearchParams] = useSearchParams();
  const campaign_id = URLSearchParams.get("campaign_id");

  // this use effect function are used for called rcs-additional-data
  useEffect(() => {
    if (campaign_id) {
      const fetchRcsDetails = async () => {
        try {
          const response = await getRcsAdditionalDetailsService(campaign_id);

          if (response.status === "SUCCESS") {
            setUsers(response.data);
          } else {
            console.log("Error in fetching RCS additional details");
          }
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchRcsDetails();
    }
  }, [campaign_id]);

  // export to pdf
  const exportRcsDetailsPDF = async (campaignId) => {
    try {
      await downloadRcsDetailsPDFservice(campaign_id); // Export RCS details PDF
    } catch (error) {
      console.log(error.message || "Failed download rcs details in csv format");
    }
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
        user?.phone_number?.toLowerCase().includes(filterValue.toLowerCase())
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

  const exportRcsDetailsCSV = async () => {
    try {
      await downloadRcsDetailsCSVservice(campaign_id); // Export RCS details PDF
    } catch (error) {
      console.log(error.message || "Failed download rcs details in csv format");
    }
  };

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
              <DropdownMenu variant="bordered" aria-label="Dropdown actions">
                <DropdownItem
                  startContent={
                    <Icon
                      icon="majesticons:eye-line"
                      width="1.6em"
                      height="1.6em"
                    />
                  }
                  key="view"
                  href="/"
                >
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
                  className="text-primary"
                >
                  Export CSV
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "engagement":
        return (
          <div className="relative flex justify-start items-center gap-1">
            <Icon
              icon={engagementIconMap[user.engagement]}
              width={"1.2em"}
              className={
                user.engagement === "read" ? "text-primary" : "text-default-500"
              }
            />
            <p>
              {cellValue &&
                cellValue.charAt(0).toUpperCase() + cellValue.slice(1)}
            </p>
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
            placeholder={t("Search...")}
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
              }
              onClick={exportRcsDetailsPDF}
            >
              {t("PDF")}
            </Button>
            <Button
              color="primary"
              variant="flat"
              onClick={exportRcsDetailsCSV}
              endContent={
                <Icon
                  icon="mi:document-download"
                  width="1.7em"
                  height="1.7em"
                />
              }
            >
              {t("CSV")}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t("Total")} {sortedItems.length} {t("users")}
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
            : `${selectedKeys.size} ${t("of")} ${filteredItems.length} ${t(
                "selected"
              )}`}
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
      selectionMode="none"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="inside"
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
