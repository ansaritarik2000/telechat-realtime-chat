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
    addToast,
    Divider,
    ModalFooter,
} from "@heroui/react";

import { columns, users, statusOptions } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import CsvUpload from "./CsvUpload";
import {
    createTemplateService,
    deleteSmsTemplatesService,
    getAllTemplateTypesSerivce,
    getHeaderService,
    getHeaderTemplateReportService,
} from "../../../../../../services/Sms/smsTemplateService";
import {
    downloadHeaderTempCSVService,
    downloadHeaderTempPDFService,
} from "../../../../../../services/Sms/smsHeaderTempDownloadService";
import { bulkTemplateUploadService } from "../../../../../../services/Sms/templateFIleServices";
import { AndroidMockup } from "react-device-mockup";
import PreviewAndroid from "../PreviewAndroid";
import { useSmsTemplateStore } from "../../../../../../store/smsTemplateStore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { parseAsInteger, useQueryState } from "nuqs";

const statusColorMap = {
    approved: "success",
    rejected: "danger",
    pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "template_name",
    "header",
    "entity_id",
    "template_id",
    "created_on",
    "template_type",
    "status",
    "actions",
];

export default function TemplateTable({ hasRangeCal }) {
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
    const [modalType, setModalType] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "age",
        direction: "ascending",
    });

    const [users, setUsers] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [offset, setOffset] = useQueryState(
        "offset",
        parseAsInteger.withDefault(0)
    );

    const [templateTypes, setTemplateTypes] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [activeTab, setActiveTab] = useState("template");

    const { t } = useTranslation();

    const [addTemplateValues, setAddTemplateValues] = useState({
        template_name: "",
        template_id: "",
        template_type_id: "",
        entity_id: "457230883412",
        sender_id: "",
        content: "",
        operator: "",
    });

    // zustand store
    const { file, resetFile } = useSmsTemplateStore();

    const {
        content,
        entity_id,
        sender_id,
        template_id,
        template_name,
        template_type_id,
        operator,
    } = addTemplateValues;

    // default date range 1 year
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) // 1 year before today
            .toISOString()
            .split("T")[0],
        end: new Date(new Date().setDate(new Date().getDate() + 1)) // Tomorrow
            .toISOString()
            .split("T")[0],
    });

    // Modal States
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const [page, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );

    const hasSearchFilter = Boolean(filterValue);

    // Fetch template types
    useEffect(() => {
        const fetchTemplateTypes = async () => {
            try {
                const data = await getAllTemplateTypesSerivce();
                if (data && data.length > 0) {
                    setTemplateTypes(data);
                }
            } catch (error) {
                console.error("Error fetching template types:", error);
            }
        };

        // Fetch approved headers
        const fetchHeaders = async () => {
            const { start, end } = dateRange; // 1 year fetch default
            try {
                const response = await getHeaderService({
                    limit: 1000, // set maixmum
                    offset,
                    search: "",
                    status: "approved",
                    start_date: new Date(start),
                    end_date: new Date(end),
                    sort_column: sortDescriptor.column,
                    sort_direction: sortDescriptor.direction,
                });

                if (response.status === "SUCCESS") {
                    if (
                        response.data &&
                        response.data.records &&
                        response.data.records.length > 0
                    ) {
                        setHeaders(response.data.records);
                    }
                }
            } catch (error) {
                console.error("Error fetching Headers:", error);
            }
        };
        fetchTemplateTypes();
        fetchHeaders();
    }, []);

    // fetch header and templates

    const fetchHeaderAndTemplates = async () => {
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

            const response = await getHeaderTemplateReportService(params);

            if (response.status === "SUCCESS") {
                setUsers(response.data.records);
                setTotalRecords(response.data.totalRecords);
            }
        } catch (error) {
            addToast({
                title: "Error fetching RCS campaigns",
                color: "error",
            });
        }
    };

    useEffect(() => {
        fetchHeaderAndTemplates();
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

            await downloadHeaderTempPDFService(params);
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
            await downloadHeaderTempCSVService(params);
        } catch (error) {
            console.log("csv download error", error);
        }
    };

    // Handle date range change from RangeCal component
    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
    };

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

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
                    <div>
                        <Button
                            isIconOnly
                            variant="none"
                            radius="full"
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
    const addTemplateHandller = async () => {
        const response = await createTemplateService({
            content,
            entity_id,
            sender_id,
            template_id,
            template_name,
            template_type_id,
        });
        if (response.status === "SUCCESS") {
            onClose();
            addToast({
                title: "Template Added Successfully",
                color: "success",
            });
            setModalType(null);

            fetchHeaderAndTemplates();
        }
    };

    // this function for add template in bulk

    const saveTemplateHandller = async () => {
        if (file && entity_id) {
            try {
                const response = await bulkTemplateUploadService(
                    file,
                    entity_id
                );

                onClose();
                setModalType(null);
                addToast({
                    title: "File uploaded and created templates successfully!",
                    color: "success",
                });
                fetchHeaderAndTemplates();
            } catch (error) {
                addToast({
                    title:
                        error?.message ||
                        "Failed to upload the file and add temeplates.",
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
    const deleteTemplatesHandller = async () => {
        try {
            const response = await deleteSmsTemplatesService([...selectedKeys]);
            if (response.status === "SUCCESS") {
                addToast({
                    title: "Templates deleted successfully!",
                    color: "success",
                });

                fetchHeaderAndTemplates();
            }
        } catch (error) {
            addToast({
                title: "Error deleting templates!",
                color: "error",
            });
        }
    };

    // this function for reset selection
    const resetHandller = () => {
        resetFile(); // reset file selection
        setAddTemplateValues({
            template_name: "",
            template_id: "",
            template_type_id: "",
            entity_id: "",
            sender_id: "",
            content: "",
            operator: "",
        }); // reset other selection
        onclose(); // modal close
    };

    // handle input change
    const handleInputChange = (name, value) => {
        setAddTemplateValues((prevValues) => ({
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
                        {hasRangeCal && (
                            <RangeCal
                                onDateRangeChange={handleDateRangeChange}
                            />
                        )}
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
                                        {t(capitalize(status.name))}
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
                                    onClick={exportTOCsv}
                                    variant="bordered"
                                    color="primary"
                                    className="text-primary">
                                    {t("CSV")}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <div>
                            <Button
                                color="success"
                                variant="flat"
                                onPress={() => openModal("addtemplate")}>
                                {t("New Template")}
                            </Button>
                        </div>

                        {/* Delete */}
                        {selectedKeys.size === 0 ? null : (
                            <Button
                                onPress={deleteTemplatesHandller}
                                isIconOnly
                                isDisabled={selectedKeys.size === 0}
                                variant="flat"
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
                        {t("Total")} {totalRecords} {t("templates")}
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
        selectedKeys,
        isOpen,
        file,
        onOpen,
        onOpenChange,
        addTemplateValues,
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
                    initialPage={1}
                    color="success"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        );
    }, [selectedKeys, sortedItems, page, pages, hasSearchFilter, file]);

    return (
        <>
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
                            align={
                                column.uid === "actions" ? "center" : "start"
                            }
                            allowsSorting={column.sortable}>
                            {t(column.name)}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={"No templates found"}
                    items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal Content */}
            {modalType === "addtemplate" && isOpen ? (
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
                                        selectedKey={activeTab}
                                        onSelectionChange={(key) => {
                                            setActiveTab(key);
                                        }}
                                        aria-label="Add Template Popup"
                                        size="lg"
                                        color="success"
                                        variant="underlined">
                                        {/* Add Template Tab */}
                                        <Tab
                                            key="template"
                                            title="Add Template">
                                            <div className="flex flex-col gap-3 px-2">
                                                <Input
                                                    autoFocus
                                                    isRequired
                                                    name="template_name"
                                                    defaultValue={template_name}
                                                    label="Template Name"
                                                    variant="flat"
                                                    radius="sm"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e.target.name,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Input
                                                    isRequired
                                                    name="template_id"
                                                    label="Template ID"
                                                    variant="flat"
                                                    radius="sm"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e.target.name,
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <div className="flex gap-2">
                                                    <Select
                                                        isRequired
                                                        name="template_type_id"
                                                        label="Select Type"
                                                        variant="flat"
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "template_type_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        radius="sm">
                                                        {templateTypes?.map(
                                                            (templateType) => (
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
                                                    <Select
                                                        isRequired
                                                        name="sender_id"
                                                        label="Sender ID"
                                                        variant="flat"
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "sender_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        radius="sm">
                                                        {headers?.map(
                                                            (item) => (
                                                                <SelectItem
                                                                    key={
                                                                        item?.id
                                                                    }
                                                                    value={
                                                                        item?.id
                                                                    }>
                                                                    {
                                                                        item?.header_id
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </div>

                                                {/* Entity ID */}
                                                {/* <Input
                                                                    isReadOnly
                                                                    label="Entity ID"
                                                                    name="entity_id"
                                                                    value={
                                                                        entity_id
                                                                    }
                                                                    defaultValue={
                                                                        entity_id
                                                                    }
                                                                    placeholder="457230883412"
                                                                    variant="flat"
                                                                    radius="sm"
                                                                    color="primary"
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
                                                                /> */}

                                                <Textarea
                                                    isRequired
                                                    name="content"
                                                    label="Content"
                                                    placeholder="Enter SMS content here"
                                                    radius="sm"
                                                    defaultValue={content}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e.target.name,
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                {/* 
                                                <div className="flex gap-4 justify-end my-4 mt-2">
                                                    <Button
                                                        color="danger"
                                                        variant="light"
                                                        onPress={onClose}
                                                        radius="sm">
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        color="success"
                                                        variant="flat"
                                                        isDisabled={
                                                            !template_name ||
                                                            !entity_id ||
                                                            !content ||
                                                            !sender_id ||
                                                            !template_type_id ||
                                                            !template_id
                                                        }
                                                        onPress={
                                                            addTemplateHandller
                                                        }
                                                        radius="sm">
                                                        Add
                                                    </Button>
                                                </div> */}
                                            </div>
                                        </Tab>
                                        {/* Right Bulk Upload */}
                                        <Tab
                                            key="bulkupload"
                                            title="Bulk Upload">
                                            <div className="flex flex-col gap-3 px-2">
                                                {/* Entity ID */}
                                                {/* <Input
                                                                    isReadOnly
                                                                    label="Entity ID"
                                                                    name="entity_id"
                                                                    value={
                                                                        entity_id
                                                                    }
                                                                    defaultValue={
                                                                        entity_id
                                                                    }
                                                                    placeholder="457230883412"
                                                                    variant="flat"
                                                                    radius="sm"
                                                                    color="primary"
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
                                                                /> */}

                                                {/* <Select
                                                                    isRequired
                                                                    label="Operator"
                                                                    name="operator"
                                                                    variant="flat"
                                                                    radius="sm"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleInputChange(
                                                                            "operator",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }>
                                                                    <SelectItem
                                                                        key="airtel"
                                                                        value={
                                                                            "airtel"
                                                                        }>
                                                                        Airtel
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        key="bsnl"
                                                                        value="bsnl">
                                                                        BSNL
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        key="jio"
                                                                        value="jio">
                                                                        Jio
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        key="videocon"
                                                                        value="videocon">
                                                                        VideoCon
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        key="vi"
                                                                        value={
                                                                            "vi"
                                                                        }>
                                                                        Vodafone
                                                                        (VI)
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        key="mtnl"
                                                                        value={
                                                                            "mtnl"
                                                                        }>
                                                                        MTNL
                                                                    </SelectItem>
                                                                </Select> */}

                                                <CsvUpload />

                                                {/* <div className="flex gap-4 justify-end my-4 mt-2">
                                                    <Button
                                                        color="danger"
                                                        variant="light"
                                                        onPress={onClose}>
                                                        {t("Cancel")}
                                                    </Button>
                                                    <Button
                                                        color="success"
                                                        variant="flat"
                                                        onPress={
                                                            saveTemplateHandller
                                                        }
                                                        isDisabled={!file}
                                                        radius="sm">
                                                        Save Template
                                                    </Button>
                                                </div> */}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                    <Divider className="my-2" />
                                </ModalBody>

                                <ModalFooter>
                                    <div className="flex gap-4 justify-end">
                                        {/* Cancel Button */}
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                            radius="sm">
                                            Cancel
                                        </Button>

                                        {/* Add/Save Template Button */}
                                        <Button
                                            color="success"
                                            variant="flat"
                                            isDisabled={
                                                activeTab === "template"
                                                    ? !template_name ||
                                                      !entity_id ||
                                                      !content ||
                                                      !sender_id ||
                                                      !template_type_id ||
                                                      !template_id
                                                    : activeTab ===
                                                          "bulkupload" && !file
                                            }
                                            onPress={
                                                activeTab === "template"
                                                    ? addTemplateHandller
                                                    : saveTemplateHandller
                                            }
                                            radius="sm">
                                            {activeTab === "template"
                                                ? "Add"
                                                : "Save Template"}
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            ) : (
                <Modal
                    isOpen={isOpen}
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
                        />
                    }
                    className="bg-transparent"
                    backdrop="blur"
                    onOpenChange={onOpenChange}
                    size="md">
                    <ModalContent className="w-fit">
                        <ModalBody className="flex justify-center items-center">
                            <AndroidMockup
                                screenWidth={280}
                                hideStatusBar
                                // className="bg-white rounded-xl"
                            >
                                <PreviewAndroid template={selectedTemplate} />
                            </AndroidMockup>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}
