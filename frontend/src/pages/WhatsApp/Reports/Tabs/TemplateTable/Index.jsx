import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  Button,
  useDisclosure,
  Tooltip,
  addToast
} from "@heroui/react";
import { columns, formatDate, formatStatus, statusOptions } from "./data";
import { capitalize, deleteTemplate } from "./utils";
import RangeCal from "./RangeCal";
import CreateBtn from "../../../../../components/Buttons/CreateBtn";
import toast from "react-hot-toast";
import { getTemplateData } from "../../../../TemplateApproval/Approval/WhatsApp/utils/sendTemplatesForApproval";
import { useTranslation } from "react-i18next";
import WATemplatePreview from "../../../../../components/WAMockup/WATemplatePreview/Index";
import { SyncIcon, TrashIcon } from "../../../../../utils/ReusableIcons";

const statusColorMap = {
  APPROVED: "success",
  REJECTED: "danger",
  PENDING: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "templateName",
  "templateType",
  "selectedCategory",
  "id",
  "selectedCountryLable",
  "created_at",
  "status",
  "actions",
];

export default function HeaderAndTemplateTable({ hasRangeCal }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState([]);
  const [previewTemplate, setPreviewTemplate] =React.useState({})
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();
  
  const {
    isOpen: isViewModalOpen,
    onOpen: onViewModalOpen,
    onOpenChange: onViewModalOpenChange,
  } = useDisclosure();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]); // Manage users with state
  const lastSyncTimeRef = useRef(null);
  const [message, setMessage] = useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "created_at",
    direction: "descending",
  });
  const openViewModal = (user) => {
    setPreviewTemplate(user);
    onViewModalOpen(); // Open the View modal
  };
  const openDeleteModal = () => {
    if (selectedKeys.length === 0) {
      addToast({
        title: "Alert!",
        description: "Please select at least one template to delete.",
        color: 'Warning'.toLowerCase(),
      })
      return;
    }
    onDeleteModalOpen(); // Open the Delete modal
  };
  useEffect(() => {
    if (Object.keys(previewTemplate).length > 0) {
    }
  }, [previewTemplate]);
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);
  useEffect(() => {
    const getData = async () => {
      const response = await getTemplateData();
      setUsers(response.templates);
      // console.log(response.templates);
    };
    getData();
  }, []);
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers?.filter((user) =>
        user.templateName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>{
        return Array.from(statusFilter).includes(user.status)
      }
       
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const handleStatusFilterData = (keys) => {
    setStatusFilter(new Set(keys));
    // console.log(statusFilter)
  }
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    // Sort before slicing to maintain correct order across pages
    const sorted = [...filteredItems].sort((a, b) => {
      if (sortDescriptor.column === 'created_at') {
        const first = new Date(a[sortDescriptor.column]);
        const second = new Date(b[sortDescriptor.column]);
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      } else {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    });

    return sorted.slice(start, end);
  }, [page, filteredItems, rowsPerPage, sortDescriptor]);

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
      case "templateType":
        return (
          <p className="text-bold text-small capitalize">
            <span>{user.selectedTemplateType}</span>
          </p>
        );
       
      case "id":
        return (
          <p className="text-bold text-small capitalize">
            <span>{user.meta_Id}</span>
          </p>
        );
        case "selectedCategory":
          return (
            <p className="text-bold text-small capitalize">
              <span>{user.selectedCategory}</span>
            </p>
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
      case "created_at":
        const dateApprovedOn = formatDate(user.created_at);
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{dateApprovedOn}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-400">
              {user.created_at}
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
            {formatStatus(cellValue)}
          </Chip>
        );
      case "actions":
        return (
          <div>
          <Tooltip content="View">
            <Button
              isIconOnly
              size="sm"
              variant="none"
              onPress={() => openViewModal(user)}
            >
              <Icon
                icon="majesticons:eye-line"
                width="1.6em"
                height="1.6em"
                className="cursor-pointer"
                classNames={{
                  backdrop:
                    "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                }}
              />
            </Button>
          </Tooltip>
        </div>
        );
      default:
        return cellValue;
    }
  }, [isViewModalOpen,onViewModalOpenChange,onViewModalOpen]);

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

  const handleSelectionChange = (keys) => {
    setSelectedKeys(Array.from(keys));
  };

  const handleDelete = async () => {
    if (selectedKeys.length === 0) {
      addToast({
        title: "Alert!",
        description: "Please select at least one template to delete.",
        color: "warning",
      });
      return;
    }
  
    try {
      // Convert selectedKeys to array of numbers
      const numericKeys = Array.from(selectedKeys).map(key => Number(key));
      console.log(numericKeys)
      // Call backend API
      const result = await deleteTemplate(numericKeys);
      
      // Update frontend state if backend deletion was successful
      setUsers(prevUsers => prevUsers.filter(user => !numericKeys.includes(Number(user.id))));
      
      addToast({
        title: "Success!",
        description: result.message || `${numericKeys.length} templates deleted successfully!`,
        color: "success",
      });
      
      // Clear selection
      setSelectedKeys([]);
    } catch (error) {
      addToast({
        title: "Error!",
        description: error.response?.data?.message || "Failed to delete templates",
        color: "danger",
      });
    }
  };

  const downloadJson = () => {
    setSelectedKeys((prevSelectedKeys) => {
      // Check if any items are selected
      if (prevSelectedKeys.length === 0) {
        addToast({
          title:'Alert!',
          description:"Please select at least one template to export.",
          color:'warning'
        })
        return prevSelectedKeys;
      }
      const selectedItems = users.filter((user) =>
        prevSelectedKeys.includes(String(user.id))
      );
      let selectedJson = selectedItems?.map((item)=> item?.templateJson );
      console.log(selectedJson)
      const jsonString = JSON.stringify(selectedJson, null, 2); // 2 spaces for indentation

      // Create a Blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "whatsapp_templates.json"; // File name

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast({
        title:'Success',
        description:"Selected templates exported successfully!",
        color:'success'
      })
      return prevSelectedKeys;
    });
  };

  const syncWhatsapp = async () => {
    const now = Date.now();
    if (lastSyncTimeRef.current && now - lastSyncTimeRef.current < 30000) {
      toast.success("Data already synced, wait 30 seconds for next sync");
      return;
    }
    console.log("Syncing WhatsApp...");

    lastSyncTimeRef.current = now;
    setMessage("");

    setTimeout(() => {
      lastSyncTimeRef.current = null;
    }, 30000);
  };

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
            {hasRangeCal && <RangeCal />}
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
                onSelectionChange={handleStatusFilterData}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {selectedKeys.length >0 ? (<Dropdown>
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
                  Export
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem
                  key="exportjson"
                  startContent={
                    <Icon
                      icon="lucide:file-json"
                      width="1.7em"
                      height="1.7em"
                    />
                  }
                  variant="bordered"
                  color="warning"
                  className="text-warning"
                  onClick={downloadJson}
                >
                  JSON
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>) :null}

            <Button
              radius="sm"
              variant="flat"
              color="success"
              startContent={<SyncIcon customClass="text-success-700" />}
              onPress={syncWhatsapp}
            >
              Sync Templates
            </Button>

            <CreateBtn
              Text="Manage Templates on Meta"
              Color="primary"
              Variant="flat"
              Path="#"
              IconComponent={
                <Icon
                  icon="mingcute:external-link-line"
                  width="1.2em"
                  height="1.2em"
                />
              }
            />
            
           {selectedKeys.length>0 ?  <Button onPress={openDeleteModal} className="w-10 px-0 py-0.5 flex justify-center items-center rounded-lg cursor-pointer bg-red-100 text-red-600 min-w-0">
  <Icon icon="iconamoon:trash-bold" width="1.5em" height="1.5em" />
</Button>: null}
           <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
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
                          Are you sure you want to delete this template?
                          </p>
                        </ModalBody>
              <ModalFooter>
                <Button  variant="light" onPress={onClose}>
                {t("Cancel")}
                </Button>
                <Button color="danger" variant="flat"  onPress={() => {
              handleDelete();
              onClose();
            }}  >
                              {t("Yes")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
           </Modal> 

          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} Template
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

        {/* Modal Content */}
        <Suspense fallback={null}>
          <Modal
            closeButton={
              <Icon
                icon="iconamoon:close"
                width="1.6em"
                height="1.6em"
                style={{
                  color: "red",
                  position: "absolute",
                  right: "0",
                }}
                className="cursor-pointer"
              />
            }
            isOpen={isViewModalOpen}
            onOpenChange={onViewModalOpenChange}
            // className="bg-transparent"
            backdrop="blur"
            size="sm"
          >
            <ModalContent className="w-fit">
              {(onClose) => (
                <ModalContent>
                  <ModalBody className="flex justify-center items-center">
                      <WATemplatePreview content={previewTemplate} />
                  </ModalBody>
                </ModalContent>
              )}
            </ModalContent>
          </Modal>
        </Suspense>
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
    isViewModalOpen,
    onViewModalOpenChange,
    onViewModalOpen,
    onDeleteModalOpenChange,
    onDeleteModalOpen,
    isDeleteModalOpen,
    handleDelete

  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.length} of ${filteredItems.length} selected`}
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
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

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
      onSelectionChange={handleSelectionChange}
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
      <TableBody emptyContent={"No Template found"} items={sortedItems}>
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
