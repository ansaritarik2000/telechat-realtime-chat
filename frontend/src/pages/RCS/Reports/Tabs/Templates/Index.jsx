import React, {
    useMemo,
    useState,
    useCallback,
    lazy,
    Suspense,
    useEffect,
} from "react";
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
    useDisclosure,
    Tooltip,
    Spinner,
} from "@heroui/react";

import { AndroidMockup } from "react-device-mockup";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import RangeCal from "./RangeCal";
import { getRcsTemplateReportServices } from "../../../../../services/Rcs/rcsReportService";
import { useReportTemplateRcsStore } from "../../../../../store/rcsReportTemplateStore";
import {
    downloadTemplateCSVService,
    downloadTemplateJSONService,
    downloadTemplatePDFService,
} from "../../../../../services/Rcs/rcsTemplateDownloadService";
import PreviewAndroid from "./PreviewAndroid";
import { deleteTemplatesService } from "../../../../../services/Rcs/rcsTemplateService";
import { useTranslation } from "react-i18next";
import toast, { LoaderIcon } from "react-hot-toast";
import { TrashIcon } from "../../../../../utils/ReusableIcons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { parseAsInteger, useQueryState } from "nuqs";

const statusColorMap = {
    approved: "success",
    rejected: "danger",
    pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "template_name",
    "template_id",
    "bot_id",
    "created_at",
    "status",
    "error_description",
    "actions",
];

// Lazy load modal components
const Modal = lazy(() =>
    import("@heroui/react").then((module) => ({ default: module.Modal }))
);
const ModalContent = lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalContent,
    }))
);
const ModalBody = lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalBody,
    }))
);

export default function RCSTemplates({ hasRangeCal }) {
    const [filterValue, setFilterValue] = useQueryState("query", {
        defaultValue: "",
    });
    const [previewTemplate, setPreviewTemplate] = useState({});
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useQueryState(
        "rows",
        parseAsInteger.withDefault(5)
    );
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "id",
        direction: "descending",
    });
    const { t } = useTranslation();

    // zustand store
    const { rcsTemplateReport, setRcsTemplateReport } =
        useReportTemplateRcsStore();

    // Modal States
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const openModal = (user) => {
        setPreviewTemplate(user);
        onOpen();
    };

    const [page, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );

    const {
        refetch: fetchTemplates,
        isLoading: isTemplatesLoading,
        error: templateFetchingError,
        isError: isTemplateFetchingHasError,
    } = useQuery({
        queryKey: ["templates"],
        queryFn: async () => {
            const params = {
                page,
                limit: rowsPerPage,
                search: filterValue,
                status:
                    statusFilter === "all" ? statusFilter : [...statusFilter],
            };

            const response = await getRcsTemplateReportServices(params);

            setRcsTemplateReport(response);

            return response;
        },
    });

    const loadingState =
        isTemplatesLoading || rcsTemplateReport?.length === 0
            ? "loading"
            : "idle";

    if (isTemplateFetchingHasError) {
        addToast({
            title: templateFetchingError.name,
            description: templateFetchingError.message,
            color: "danger",
        });
    }

    // export to json
    const exportToJSON = async (selectedKeys) => {
        try {
            const params = {
                selectedKeys: Array.from(selectedKeys),
            };

            await downloadTemplateJSONService(params);
        } catch (error) {
            toast.error("Error downloading JSON");
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [page, rowsPerPage, filterValue, statusFilter]);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const sortedItems = useMemo(() => {
        const items =
            rcsTemplateReport.data && rcsTemplateReport.data.length > 0
                ? [...rcsTemplateReport.data]
                : [];
        return items.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, rcsTemplateReport]);

    const renderCell = useCallback(
        (user, columnKey) => {
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
                            <Tooltip content="View">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="none"
                                    onPress={() => openModal(user)}>
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
        },
        [onOpen, isOpen, openModal]
    );

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            l;
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    // delete templates
    const {
        mutateAsync: deleteTemplatesHandller,
        isPending: isTemplateDeleting,
    } = useMutation({
        mutationFn: async () => {
            if (Array.from(selectedKeys)?.length === 0) {
                throw new Error(
                    "Please select at least one template to delete"
                );
            }

            const response = await deleteTemplatesService([...selectedKeys]);

            return response;
        },
        onError: (e) => {
            addToast({
                title: e.name,
                description: e.message,
                color: "danger",
            });
        },
        onSuccess: () => {
            fetchTemplates();
            addToast({
                title: "Templates Deleted",
                description:
                    "Selected templates have been successfully removed",
                color: "success",
            });
        },
    });

    // const deleteTemplatesHandller = async () => {
    //   try {
    //     const reponse = await deleteTemplatesService([...selectedKeys]);
    //     toast.success("Templates deleted successfully!");
    //     fetchTemplates();
    //   } catch (error) {
    //     toast.error("Error deleting templates");
    //   }
    // };

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
                                    key="exportjson"
                                    startContent={
                                        <Icon
                                            icon="lucide:file-json"
                                            width="1.7em"
                                            height="1.7em"
                                        />
                                    }
                                    onPress={() => exportToJSON(selectedKeys)}
                                    variant="bordered"
                                    color="warning"
                                    isDisabled={selectedKeys.size === 0}
                                    className="text-warning">
                                    {t("JSON")}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Link to="/tempapproval?template=rcs">
                            <Button color="success" variant="flat">
                                {t("New Template")}
                            </Button>
                        </Link>

                        {/* Delete */}
                        <Button
                            isIconOnly
                            onPress={deleteTemplatesHandller}
                            color="danger"
                            isDisabled={isTemplateDeleting}
                            variant="flat">
                            {isTemplateDeleting ? (
                                <LoaderIcon />
                            ) : (
                                <TrashIcon customClass="text-danger" />
                            )}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t("Total")}{" "}
                        {rcsTemplateReport.pagination &&
                            rcsTemplateReport.pagination.totalItems}{" "}
                        {t("templates")}
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        {t("Rows per page")}:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}>
                            <option value="10">10</option>
                            <option value="5">5</option>
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
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        className="bg-transparent"
                        backdrop="blur"
                        size="sm">
                        <ModalContent className="w-fit">
                            {(onClose) => (
                                <ModalContent>
                                    <ModalBody className="flex justify-center items-center">
                                        <AndroidMockup
                                            screenWidth={280}
                                            hideStatusBar
                                            // className="bg-white rounded-xl"
                                        >
                                            <PreviewAndroid
                                                template={previewTemplate}
                                            />
                                        </AndroidMockup>
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
        onSearchChange,
        hasSearchFilter,
        rcsTemplateReport,
        selectedKeys,
        onOpen,
        isOpen,
        onOpenChange,
    ]);

    console.log("selectedKeys", selectedKeys);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${
                              (rcsTemplateReport.data &&
                                  rcsTemplateReport.data.length) ||
                              0
                          } ${t("of")} ${
                              (rcsTemplateReport.pagination &&
                                  rcsTemplateReport.pagination.totalItems) ||
                              0
                          } ${t("selected")}`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="success"
                    page={page}
                    total={rcsTemplateReport?.pagination?.totalPages || 0}
                    onChange={setPage}
                />
            </div>
        );
    }, [selectedKeys, page, rcsTemplateReport, hasSearchFilter]);

    return (
        <>
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
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}>
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === "actions" ? "center" : "start"
                            }
                            // allowsSorting={column.sortable}
                        >
                            {t(column.name)}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    loadingState={loadingState}
                    loadingContent={<Spinner />}
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
        </>
    );
}

{
    /* <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button> */
}
{
    /* <Button color="success" onPress={onClose} variant="solid">
                  Close
                </Button> */
}
