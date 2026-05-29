import React, { useEffect, useMemo, useState, Suspense } from "react";
import { Icon } from "@iconify-icon/react";
import jsPDF from "jspdf";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Chip,
    User,
    useDisclosure,
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    addToast,
} from "@heroui/react";

import { columns, users, statusOptions } from "./newdata";
import {
    capitalize,
    downloadSingleWADetailsPDFservice,
    downloadWADetailsCSVservice,
    getWhatsappAdditionalDetails,
} from "./utils";
import RangeCal from "./RangeCal";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../Tabs/TemplateTable/data";
import WATemplatePreview from "../../../../../components/WAMockup/WATemplatePreview/Index";

const statusColorMap = {
    delivered: "success",
    failed: "danger",
    pending: "warning",
    scheduled: "warning",
};

const engagementIconMap = {
    Sent: "ri:check-double-fill",
    "Not Read": "ri:check-double-fill",
    Clicked: "fluent-mdl2:touch",
};

const INITIAL_VISIBLE_COLUMNS = [
    "tucId",
    "campaign_name",
    "waba_id",
    "uuid",
    "header",
    "type",
    "phoneNumbers",
    "operator",
    "country",
    "created_at",
    "submitTs",
    "deliveryTs",
    "message",
    "status",
    "error_code",
    "engagement",
    "error",
];

export default function DetailedTable({ hasRangeCal }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [URLSearchParams] = useSearchParams();
    const campaignId = URLSearchParams.get("campaignId");
    const token = localStorage.getItem("token");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [users, setUsers] = useState([]);

    const [page, setPage] = React.useState(1);
    const [previewTemplate, setPreviewTemplate] = React.useState({});
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { t } = useTranslation();
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
                user?.phone_number
                    ?.toLowerCase()
                    .includes(filterValue.toLowerCase())
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

    // this use effect function are used for called rcs-additional-data
    useEffect(() => {
        if (campaignId) {
            const fetchWhatsAppDetails = async () => {
                try {
                    const response = await getWhatsappAdditionalDetails(
                        campaignId
                    );
                    setUsers(response.Campaign);
                } catch (error) {
                    addToast({
                        title: "Alert!",
                        description:
                            "Error in fetching WhatsApp additional details",
                        color: "danger",
                    });
                    // console.log("error", error);
                }
            };

            fetchWhatsAppDetails();
        }
    }, [campaignId]);

    // export table pdf formate
    const exportToPDF = async () => {
        try {
            const response = await downloadSingleWADetailsPDFservice(
                campaignId
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
    const exportToCSV = async () => {
        try {
            await downloadWADetailsCSVservice(campaignId); // Export RCS details PDF
        } catch (error) {
            console.log(
                error.message || "Failed download rcs details in csv format"
            );
        }
    };

    // Show the template preview
    const openModal = (user) => {
        setPreviewTemplate(user);
        onOpen();
        // console.log("user",user)
    };

    const renderCell = React.useCallback(
        (user, columnKey) => {
            const cellValue = user[columnKey];

            switch (columnKey) {
                case "name":
                    return <User>{user.waba_id}</User>;
                case "created_at":
                    const dateApprovedOn = formatDate(user.created_at);
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">
                                {dateApprovedOn}
                            </p>
                        </div>
                    );
                case "type":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">
                                {user.type}
                            </p>
                        </div>
                    );
                case "phoneNumbers":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">
                                +91{user.phone_number}
                            </p>
                            <p className="text-bold text-tiny capitalize text-default-400">
                                {user.team}
                            </p>
                        </div>
                    );
                case "country":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">
                                {user.country}
                            </p>
                            <p className="text-bold text-tiny capitalize text-default-400">
                                {user.team}
                            </p>
                        </div>
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
                            variant="flat"
                        >
                            {cellValue}
                        </Chip>
                    );
                case "engagement":
                    return (
                        <div className="relative flex justify-start items-center gap-1">
                            <Icon
                                icon={engagementIconMap[user.engagement]}
                                width={"1.2em"}
                                className={
                                    user.engagement === "Read"
                                        ? "text-primary"
                                        : "text-default-500"
                                }
                            />
                            <p>{cellValue}</p>
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        [onOpen, isOpen, openModal]
    );

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
                            variant="flat"
                            color="success"
                            endContent={
                                <Icon
                                    icon="majesticons:eye-line"
                                    width="1.6em"
                                    height="1.6em"
                                    classNames={{
                                        backdrop:
                                            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                                    }}
                                />
                            }
                            onPress={() =>
                                openModal(users[0].singleTemplateData[0])
                            }
                        >
                            Template
                        </Button>
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
                        Total {users.length} campaign
                    </span>
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
                        // className="bg-transparent"
                        backdrop="blur"
                        size="sm"
                    >
                        <ModalContent className="w-fit">
                            {(onClose) => (
                                <ModalContent>
                                    <ModalBody className="flex justify-center items-center">
                                        <WATemplatePreview
                                            content={previewTemplate}
                                        />
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
        users.length,
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
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
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
