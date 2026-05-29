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
    useDisclosure,
    Select,
    SelectItem,
    Textarea,
    Tabs,
    Tab,
    ModalFooter,
    addToast,
    Divider,
} from "@heroui/react";

import { columns, users, statusOptions } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import CsvUpload from "./CsvUpload";
import { useSmsHeaderStore } from "../../../../../../store/smsTemplateStore";
import {
    createHeaderServices,
    deleteSmsHeadersService,
    getAllTemplateTypesSerivce,
    getHeaderService,
} from "../../../../../../services/Sms/smsTemplateService";
import {
    downloadHeaderCSVService,
    downloadHeaderPDFService,
} from "../../../../../../services/Sms/smsHeaderTempDownloadService";
import { bulkHeaderUploadService } from "../../../../../../services/Sms/templateFIleServices";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { parseAsInteger, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";

const statusColorMap = {
    approved: "success",
    rejected: "danger",
    pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "header_id",
    "entity_name",
    "approvedUnder",
    "dlt_id",
    "entity_id",
    "created_on",
    "status",
];

export default function HeaderTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useQueryState(
        "rows",
        parseAsInteger.withDefault(5)
    );

    // Modal States
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [modalType, setModalType] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "age",
        direction: "ascending",
    });

    const [users, setUsers] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [activeTab, setActiveTab] = useState("header");
    const [offset, setOffset] = useQueryState(
        "offset",
        parseAsInteger.withDefault(0)
    );

    const { t } = useTranslation();
    console.log("activeTab", activeTab);
    const [addHeaderValues, setAddHeaderValues] = useState({
        entity_name: "Telepie",
        template_type_id: "",
        entity_id: "457230883412",
        header_id: "",
        dlt_id: "",
    });

    // zustand store
    const { file, resetFile } = useSmsHeaderStore();

    const { entity_id, entity_name, template_type_id, header_id, dlt_id } =
        addHeaderValues;

    const {
        data: templateTypes,
        error: templateTypesError,
        isLoading: templateTypeIsLoading,
    } = useQuery({
        queryKey: ["template-types"],
        queryFn: getAllTemplateTypesSerivce,
        enabled: isOpen,
    });

    if (templateTypesError) {
        addToast({
            title: "Error fetching template types",
            color: "error",
        });
    }

    // default date range 1 year
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) // 1 year before today
            .toISOString()
            .split("T")[0],
        end: new Date(new Date().setDate(new Date().getDate() + 1)) // Tomorrow
            .toISOString()
            .split("T")[0],
    });

    const [page, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    // fetch header and templates

    const fetchHeaders = async () => {
        const { start, end } = dateRange;
        try {
            const offset = (page - 1) * rowsPerPage;
            const params = {
                limit: rowsPerPage,
                offset,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
                start_date: new Date(start),
                end_date: new Date(end),
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };

            const response = await getHeaderService(params);

            if (response.status === "SUCCESS") {
                setUsers(response.data.records);
                setTotalRecords(response.data.totalRecords);
            }
        } catch (error) {
            console.error("Error fetching RCS campaigns:", error);
        }
    };

    // this useeffect is used for get headers
    useEffect(() => {
        fetchHeaders();
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

    // PDF Export Function
    const exportToPDF = async () => {
        try {
            const { start, end } = dateRange;
            const params = {
                limit: rowsPerPage,
                offset,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
                start_date: new Date(start),
                end_date: new Date(end),
                // columns: Array.from(visibleColumns).join(","),
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };

            await downloadHeaderPDFService(params);
        } catch (error) {
            console.log("pdf download error", error);
        }
    };

    // CSV Export Function
    const exportTOCsv = async () => {
        try {
            const { start, end } = dateRange;
            const params = {
                limit: rowsPerPage,
                offset,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
                start_date: new Date(start),
                end_date: new Date(end),
                // columns: Array.from(visibleColumns).join(","),
                sort_column: sortDescriptor.column,
                sort_direction: sortDescriptor.direction,
            };
            await downloadHeaderCSVService(params);
        } catch (error) {
            console.log("csv download error", error);
        }
    };

    // Handle date range change from RangeCal component
    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
    };

    // Open Modal
    const openModal = (type, template = null) => {
        setModalType(type);
        setSelectedTemplate(template);
        onOpen();
    };

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
                        name={cellValue}>
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
                        variant="flat">
                        {t(cellValue)}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-start items-center ">
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => openModal("viewtemplate", user)}>
                            <Icon
                                icon="majesticons:eye-line"
                                width="1.4em"
                                height="1.4em"
                                className="text-default-500"
                            />
                        </Button>
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

    // this function for add template
    const addHeaderHandller = async () => {
        const response = await createHeaderServices({
            entity_name,
            template_type_id,
            entity_id,
            header_id,
            dlt_id,
        });
        if (response.status === "SUCCESS") {
            onClose();
            addToast({
                title: "Header Added",
                color: "success",
            });
            setAddHeaderValues({
                entity_name: "",
                entity_id: "",
                header_id: "",
                dlt_id: "",
            });

            fetchHeaders();
        }
    };

    // this function for add header in bulk

    const saveHeaderHandller = async () => {
        if (file && entity_id) {
            try {
                const response = await bulkHeaderUploadService(file, entity_id);
                console.log("File uploaded successfully:", response);
                onClose();
                addToast({
                    title: "File uploaded and headers added successfully",
                    color: "success",
                });
                resetFile();
                fetchHeaders();
            } catch (error) {
                console.log("Error during file upload:", error);
                addToast({
                    title:
                        error.message ||
                        "Failed to upload the file and add headers",
                    color: "error",
                });
            }
        } else {
            addToast({
                title: "Please select a file and enter entity ID.",
                color: "error",
            });
        }
    };

    // delete sms templates
    const deleteHeadersHandller = async () => {
        try {
            const response = await deleteSmsHeadersService([...selectedKeys]);
            if (response.status === "SUCCESS") {
                addToast({
                    title: "Headers deleted successfully!",
                    color: "success",
                });

                fetchHeaders();
            }
        } catch (error) {
            addToast({
                title: "Error deleting headers",
                color: "error",
            });
        }
    };

    const onHandleTabChange = (key) => {
        setActiveTab(key);
    };

    // this function for reset selection
    const resetHandller = () => {
        resetFile(); // reset file selection
        setAddHeaderValues({
            entity_name: "",
            entity_id: "",
            header_id: "",
            dlt_id: "",
        }); // reset other selection
        onclose(); // modal close
    };

    // handle input change
    const handleInputChange = (name, value) => {
        setAddHeaderValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    // Top Table Content
    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-[20%] sm:max-w-[44%]"
                        placeholder={t("Search by...")}
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
                        {/* Calendar */}
                        {hasRangeCal && <RangeCal />}
                        {/* Status  */}
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
                                    variant="flat">
                                    {t("Status")}
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}>
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        {/* Export */}
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
                                    variant="flat">
                                    {t("Export")}
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu>
                                <DropdownItem
                                    key="exportpdf"
                                    startContent={
                                        <Icon
                                            icon="mi:document-download"
                                            width="1.7em"
                                            height="1.7em"
                                        />
                                    }
                                    variant="bordered"
                                    color="danger"
                                    onPress={exportToPDF}
                                    className="text-danger">
                                    {t("PDF")}
                                </DropdownItem>

                                <DropdownItem
                                    key="exportcsv"
                                    startContent={
                                        <Icon
                                            icon="mi:document-download"
                                            width="1.7em"
                                            height="1.7em"
                                        />
                                    }
                                    variant="bordered"
                                    color="primary"
                                    onPress={exportTOCsv}
                                    className="text-primary">
                                    {t("CSV")}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <div>
                            <Button
                                className=""
                                color="success"
                                variant="flat"
                                onPress={() => openModal("addheader")}>
                                {t("New Header")}
                            </Button>

                            {/* Modal Content */}
                            {modalType === "addheader" && isOpen && (
                                <Modal
                                    isOpen={isOpen}
                                    onOpenChange={onOpenChange}
                                    placement="top-center"
                                    size="2xl">
                                    <ModalContent>
                                        {(onClose) => (
                                            <>
                                                <ModalHeader />
                                                <ModalBody>
                                                    {/* Tabs */}
                                                    <Tabs
                                                        aria-label="Add Header Modal"
                                                        defaultSelectedKey={
                                                            activeTab
                                                        }
                                                        onSelectionChange={(
                                                            key
                                                        ) => {
                                                            setActiveTab(key);
                                                        }}
                                                        size="lg"
                                                        color="success"
                                                        variant="underlined">
                                                        {/* Add Header Tab */}
                                                        <Tab
                                                            key="header"
                                                            title="Add Header">
                                                            <div className="flex flex-col gap-3 px-2">
                                                                {/* Dlt ID */}
                                                                <Input
                                                                    label="Dlt ID"
                                                                    name="dlt_id"
                                                                    value={
                                                                        dlt_id
                                                                    }
                                                                    isRequired
                                                                    variant="flat"
                                                                    radius="sm"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleInputChange(
                                                                            e
                                                                                .target
                                                                                .name,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                {/* Header ID */}
                                                                <Input
                                                                    isRequired
                                                                    label="Header ID"
                                                                    name="header_id"
                                                                    value={
                                                                        header_id
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleInputChange(
                                                                            e
                                                                                .target
                                                                                .name,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    description="Header ID must be 3 to 15 characters long"
                                                                    variant="flat"
                                                                    radius="sm"
                                                                />
                                                                <Select
                                                                    isRequired
                                                                    name="template_type_id"
                                                                    label="Select Type"
                                                                    variant="flat"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleInputChange(
                                                                            "template_type_id",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    radius="sm">
                                                                    {templateTypes?.map(
                                                                        (
                                                                            templateType
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    templateType?.id
                                                                                }
                                                                                value={
                                                                                    templateType?.id
                                                                                }>
                                                                                {
                                                                                    templateType?.name
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </Select>
                                                            </div>
                                                        </Tab>

                                                        {/* Bulk Upload Tab */}
                                                        <Tab
                                                            key="bulkupload"
                                                            title="Bulk Upload">
                                                            <div className="flex flex-col gap-3 px-2">
                                                                <CsvUpload />
                                                            </div>
                                                        </Tab>
                                                    </Tabs>
                                                    <Divider className="my-2" />
                                                </ModalBody>

                                                {/* Common Modal Footer */}
                                                <ModalFooter className="p-4">
                                                    <Button
                                                        color="danger"
                                                        variant="light"
                                                        onPress={onClose}
                                                        radius="sm">
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        color="success"
                                                        onPress={
                                                            activeTab ===
                                                            "header"
                                                                ? addHeaderHandller
                                                                : saveHeaderHandller
                                                        }
                                                        isDisabled={
                                                            activeTab ===
                                                            "header"
                                                                ? dlt_id ===
                                                                      "" ||
                                                                  template_type_id ===
                                                                      "" ||
                                                                  header_id.length <
                                                                      4 ||
                                                                  header_id.length >
                                                                      15 // Validation for "Add Header" tab
                                                                : activeTab ===
                                                                      "bulkupload" &&
                                                                  !file // Validation for "Bulk Upload" tab
                                                        }
                                                        radius="sm"
                                                        variant="flat">
                                                        {activeTab === "header"
                                                            ? "Add"
                                                            : "Save"}
                                                        {console.log(
                                                            "activeTab",
                                                            activeTab
                                                        )}
                                                        {/* Dynamic button label */}
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal>
                            )}

                            {/* View  Template Modal */}
                            {modalType === "viewtemp" && isOpen && (
                                <Modal
                                    isOpen={isOpen}
                                    onOpenChange={onOpenChange}
                                    size="md"
                                    backdrop="blur">
                                    <ModalContent>
                                        <ModalBody>
                                            {selectedTemplate?.content}
                                        </ModalBody>
                                    </ModalContent>
                                </Modal>
                            )}
                        </div>

                        {/* Delete */}
                        {selectedKeys.size === 0 ? null : (
                            <Button
                                onPress={deleteHeadersHandller}
                                isIconOnly
                                variant="flat"
                                isDisabled={selectedKeys.size === 0}
                                color="danger"
                                radius="md"
                                className="text-danger">
                                <Icon
                                    icon="iconamoon:trash-light"
                                    width="1.4em"
                                    height="1.4em"
                                />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Second Row Total users & No of rows in a page */}
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t("Total")} {totalRecords} {t("headers")}
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        {t("Rows per page")}:
                        <select
                            defaultValue={rowsPerPage}
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
        isOpen,
        onOpen,
        onOpenChange,
        selectedKeys,
        addHeaderValues,
        file,
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
                />
            </div>
        );
    }, [selectedKeys, sortedItems, page, pages, hasSearchFilter]);

    return (
        <Table
            id="table-to-export"
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
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
                        {t(column.name)}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No headers found"} items={sortedItems}>
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
