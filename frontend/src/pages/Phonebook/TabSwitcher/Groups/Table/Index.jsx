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
  Pagination,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";

import { columns, users, statusOptions } from "./data";
import { capitalize } from "../../../../../utils/capitalize";

import { useTranslation } from "react-i18next";
import TableUser from "../../../../../components/Common/TableUser";
import {
  getContactsService,
  getTagOptionsService,
} from "../../../../../services/phonebook/phonebookContactService";
import toast from "react-hot-toast";
import { usePhoneBookStore } from "../../../../../store/phonebook/phonebookStore";
import {
  getGroupContactsService,
  updateGroupService,
} from "../../../../../services/phonebook/phonebookService";
import { get } from "lodash";

const statusColorMap = {
  interested: "success",
  "Not Interested": "danger",
  closed: "primary",
};

const channelIcons = [
  {
    name: "SMS",
    icon: (
      <Icon
        icon="fluent:chat-12-filled"
        className="!text-[#fdc842]"
        width={"1.4em"}
      />
    ),
  },
  {
    name: "RCS",
    icon: (
      <Icon
        icon="pajamas:image-comment-dark"
        className="text-[#699df8]"
        width={"1.4em"}
      />
    ),
  },
  {
    name: "WhatsApp",
    icon: <Icon icon="logos:whatsapp-icon" width={"1.4em"} />,
  },
  {
    name: "Email",
    icon: <Icon icon="skill-icons:gmail-light" width={"1.4em"} />,
  },
];

const INITIAL_VISIBLE_COLUMNS = [
  "contact_name",
  "phone_no",
  "channels",
  "tags",
  "status",
  "actions",
];

export default function GroupsTable({ groupTitle, groupId, fetchGroups }) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [selectionType, setSelectionType] = useState("none");
  const [groupViewData, setGroupViewData] = useState({});
  const [statusOptions, setStatusOptions] = useState([]);
  const { t } = useTranslation();

  const [page, setPage] = useState(1);

  // this function for contacts
  const fetchContacts = async () => {
    try {
      const params = {
        page,
        limit: rowsPerPage,
        search: filterValue,
        tags: statusFilter !== "all" ? [...statusFilter] : "all",
      };

      const response = await getContactsService(token, params);
      if (response.status === "SUCCESS") {
        console.log("response", response);
        setUsers(response.data);
        setTotal(response.total);
      } else {
        toast.error("Failed to fetch contacts");
      }
    } catch (error) {
      toast.error("Failed to fetch contacts");
    }
  };

  // This function is used for fetching tags options
  const fetchTagOptions = async () => {
    try {
      const response = await getTagOptionsService();
      if (response.status === "SUCCESS") {
        setStatusOptions(response.data);
      } else {
        toast.error("Failed to fetch status options");
      }
    } catch (error) {
      console.log("Failed to fetch status options", error);
      toast.error("Failed to fetch status options");
    }
  };

  useEffect(() => {
    fetchTagOptions();
  }, []);

  console.log("groupViewData", groupViewData);
  // this function is used for get group contacts
  const getGroupContact = async () => {
    const params = {
      group_id: groupId,
      page,
      limit: rowsPerPage,
      search: filterValue,
      tags: statusFilter !== "all" ? [...statusFilter] : "all",
    };

    const response = await getGroupContactsService(params, token);

    if (response.status === "SUCCESS") {
      const responseData = response.data;
      setGroupViewData(responseData);
      setUsers(responseData?.contactsData || []);
      setTotal(responseData?.contactsData?.length || 0);
      setSelectedKeys(
        new Set(
          responseData?.contact_ids
            ? responseData?.contact_ids?.map((id) => id.toString())
            : []
        )
      );
    } else {
      toast.error("Failed to get group contacts");
    }
  };

  useEffect(() => {
    if (selectionType === "multiple") {
      fetchContacts();
    } else {
      getGroupContact();
    }
  }, [
    selectionType,
    page,
    rowsPerPage,
    filterValue,
    statusFilter,
    groupId,
    token,
  ]);

  // this function is used for update  group

  const updateGroupHandler = async (type) => {
    try {
      const groupData = {
        // group_name: groupTitle,
        // avatar_type: avatarType,
        // avatar_value: avatarValue,
        group_id: groupId,
        contact_ids: [...selectedKeys],
      };
      const response = await updateGroupService(groupData, token);
      if (response.status === "SUCCESS") {
        toast.success("Group updated successfully");
        fetchGroups();
        handleSelectionType(type);
      } else {
        toast.error("Failed to update group");
      }
    } catch (error) {
      toast.error("Failed to update group");
    }
  };
  const handleSelectionType = (type) => {
    // Toggle the selectionType
    setSelectionType((prevType) => {
      const newType = prevType === type ? "none" : type;

      // Modify visibleColumns based on the new selectionType
      setVisibleColumns((prevVisibleColumns) => {
        const newVisibleColumns = new Set(prevVisibleColumns);

        if (newType === "none") {
          // If selectionType is "none", ensure "actions" is visible
          newVisibleColumns.add("actions");
        } else {
          // If selectionType is not "none", remove "actions"
          newVisibleColumns.delete("actions");
        }

        return newVisibleColumns;
      });

      return newType;
    });
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const pages = Math.ceil(total / rowsPerPage);

  const sortedItems = React.useMemo(() => {
    return [...users].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, users]);

  // Channel Icons Functions
  const getChannelIcon = (channel) => {
    const channelData = channelIcons.find((c) => c.name === channel);
    return channelData ? channelData.icon : null;
  };

  const renderUserChannels = (channels) => {
    return channels.map((channel) => {
      const icon = getChannelIcon(channel);
      return (
        <div key={channel} className="flex gap-1">
          <Tooltip content={channel}>{icon}</Tooltip>
        </div>
      );
    });
  };

  //  this function is used for remove contact from group
  const deleteContactHandller = async (id, selectedKeys) => {
    try {
      const filteredKeys = [...selectedKeys].filter(
        (key) => key !== id.toString()
      );
      const groupData = {
        group_id: groupId,
        contact_ids: filteredKeys,
      };

      const response = await updateGroupService(groupData, token);
      if (response.status === "SUCCESS") {
        toast.success("Contact removed successfully");
        setSelectedKeys(new Set(filteredKeys));
        await getGroupContact();
        // await fetchGroups();
      } else {
        toast.error("Failed to remove contact");
      }
    } catch (error) {
      toast.error("Failed to remove contact");
    }
  };

  // Render Status Function (Chips) Tags
  const renderStatusChips = (tags = []) => {
    const visibleChips = tags.slice(0, 3); // Show only the first two chips
    const remainingChipsCount = tags.length - 3;

    return (
      <div className="flex items-center">
        {visibleChips.map((tag) => (
          <>
            <span
              className={`inline-flex items-center rounded-full ${
                tag?.bgColor || "bg-gray-100"
              } px-2 py-1 mr-1 text-xs ${tag?.color || "text-gray-600"} `}
            >
              {t(capitalize(tag?.label))}
            </span>
            {/* <Chip
                            className={`capitalize mr-1 text-white ${
                                tag?.color ? tag?.bgColor : "bg-default-500"
                            }`}
                            color={tag?.color || "default-500"}
                            size="sm"
                            variant="flat">
                            {t(capitalize(tag?.label))}
                        </Chip> */}
          </>
        ))}

        {remainingChipsCount > 0 && (
          <Popover placement="bottom">
            <PopoverTrigger>
              {/* <Tooltip content="Click to exapand"> */}
              <div className="flex items-center rounded-full py-1 px-2 hover:bg-default-100 bg-default-200 text-sm  cursor-pointer">
                <span className="text-xs">+{remainingChipsCount}</span>
              </div>
              {/* </Tooltip> */}
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                {tags.slice(3).map((tag) => (
                  <span
                    className={`inline-flex items-center rounded-full ${
                      tag?.bgColor || "bg-gray-100"
                    } px-2 py-1 mr-1 text-xs ${tag?.color || "text-gray-600"} `}
                  >
                    {t(capitalize(tag?.label))}
                  </span>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };

  const renderCell = React.useCallback((user, columnKey, selectedKeys) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "contact_name":
        return (
          <TableUser
            avatarType={user.avatar_type || "character"}
            avatarValue={user.avatar_value || cellValue}
            name={cellValue}
            email={user.email}
          />
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
      case "phone_no":
        return (
          <div className="flex items-center">
            {user?.country_code}-{user?.phone_no}
          </div>
        );
      case "tags":
        return <div>{renderStatusChips(user.tags || [])}</div>;
      case "actions":
        return (
          <div className="flex justify-start items-center">
            <Tooltip content={t("Delete")}>
              <Button
                isIconOnly
                onClick={() => deleteContactHandller(user.id, selectedKeys)}
                variant="none"
                color="none"
                size="sm"
                radius="sm"
              >
                <Icon
                  icon="iconamoon:trash-light"
                  width={"1.5em"}
                  height={"1.5em"}
                  className="text-danger "
                />
              </Button>
            </Tooltip>
          </div>
        );
      case "channels":
        return <div className="flex">{renderUserChannels(user.channels)}</div>;
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
        <div className="mt-4">
          <p className="text-lg font-semibold">
            {selectionType === "none" ? `${groupTitle} group` : "Contacts"}
          </p>
        </div>
        <div className="flex justify-between gap-3 items-end">
          {/* Search */}
          <Input
            isClearable
            radius="sm"
            className="w-fit sm:max-w-[44%]"
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
            {/* Add Member Btn  */}
            <Button
              variant="flat"
              color="primary"
              radius="sm"
              onPress={() =>
                selectionType === "none"
                  ? handleSelectionType("multiple")
                  : updateGroupHandler("multiple")
              }
            >
              {selectionType === "none" ? "Add Members" : "Save Changes"}
            </Button>
            {/* Status DropDown */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  radius="sm"
                  endContent={
                    <Icon
                      icon="fluent:chevron-down-16-regular"
                      width="1.2em"
                      height="1.2em"
                    />
                  }
                  variant="flat"
                >
                  {t("Tags")}
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                className=" overflow-y-auto"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {t(capitalize(status.name))}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* Channels DropDown */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  radius="sm"
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
                  <DropdownItem key={column.uid} className="capitalize">
                    {t(capitalize(column.name))}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {selectionType === "none"
              ? "List of groups members"
              : "Select the contacts to add & save changes"}
          </span>
          <label className="flex items-center text-default-400 text-small">
            {t("Rows per page")}:
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
    selectedKeys,
    groupViewData,
    selectionType,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected, "
            : `${selectedKeys.size} ${t("of")} ${total} ${t("selected, ")}`}
          {t("Total")} {total} {t("users")}
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
  }, [selectedKeys, users, total, page, pages, hasSearchFilter]);

  return (
    <Table
      id="table-to-export"
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      selectionMode={selectionType}
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
            {t(column.name)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey, selectedKeys)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
