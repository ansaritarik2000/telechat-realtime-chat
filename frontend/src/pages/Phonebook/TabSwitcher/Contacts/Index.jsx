import React, { useState, useEffect, useContext } from "react";
import { Icon } from "@iconify-icon/react";
import CsvUpload from "./CsvUpload";

import {
    Avatar,
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
    Tabs,
    Tab,
    Textarea,
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tooltip,
    Divider,
    Select,
    SelectItem,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";

import { columns, users, statusOptions } from "./data";
import { capitalize } from "../../../../utils/capitalize";
import { useTranslation } from "react-i18next";
import AvatarIndex from "../../../../components/AvatarGen/Index";
import { usePhoneBookStore } from "../../../../store/phonebook/phonebookStore";
import { getGroupsService } from "../../../../services/phonebook/phonebookService";
import toast from "react-hot-toast";
import CommandTagItem from "./ComponentTagItem";
import { IPInfoContext } from "ip-info-react";
import {
    createContactService,
    deleteContactService,
    getContactsService,
    getTagOptionsService,
    updateContactService,
    uploadContactsFromExcelService,
} from "../../../../services/phonebook/phonebookContactService";
import TableUser from "../../../../components/Common/TableUser";
import { formatDateWithTime } from "../../../../utils/formatDate";
import {
    downloadPhonebookCSVService,
    downloadPhonebookPDFService,
} from "../../../../services/phonebook/downloadPhoneBookService";
import { set } from "lodash";
import { PhoneInput } from "../../../../components/phone-input";

const statusColorMap = {
    interested: "success",
    "Not Interested": "danger",
    closed: "primary",
};

export const groups = [
    { key: "educational", label: "Educational" },
    { key: "marketing", label: "Marketing" },
    { key: "bachelors", label: "Bachelors" },
    { key: "promotional", label: "Promotional" },
    { key: "sales", label: "Sales" },
];

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
    "last_interaction",
    "tags",
    "route",
    "type",
    "status",
    "actions",
];

export default function ContactsTable({ renderInsideGroup = false, rows }) {
    const [filterValue, setFilterValue] = useState("");
    const userInfo = useContext(IPInfoContext);

    //zustand store
    const {
        contact_name,
        phone_no,
        countryCode,
        email,
        selectedGroups,
        selectedChannels,
        selectedTags,
        file,
        notes,
        avatar_type,
        avatar_value,
        isUpdateButtonDisabled,

        setContactName,
        selectedKeys,
        setEmail,
        setSelectedGroups,
        setSelectedChannels,
        setAvatarType,
        setAvatarValue,
        setNotes,
        setPhoneNo,
        setCountryCode,
        setSelectedTags,
        resetPhonebookAccounts,
        setIsUpdateButtonDisabled,
        setSelectedKeys,
    } = usePhoneBookStore();

    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(renderInsideGroup ? 5 : 10);
    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "age",
        direction: "ascending",
    });
    const [groups, setGroups] = useState([]);
    const token = localStorage.getItem("token");
    const [assignedChannels, setAssignedChannels] = useState([]);
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [statusOptions, setStatusOptions] = useState([]);
    const { t } = useTranslation();

    const openModal = (type, user = null) => {
        resetPhonebookAccounts();
        setModalType(type);
        setSelectedUser(user);

        onOpen();
        if (type === "details") {
            setAvatarType(user.avatar_type || "character");
            setAvatarValue(user.avatar_value);
            setContactName(user.contact_name);
            setPhoneNo(user.phone_no);
            setCountryCode(
                user.country_code ? user.country_code.replace("+", "") : ""
            );
            setEmail(user.email);
            setSelectedGroups(user.groups);
            setSelectedChannels(user.channels);
            setSelectedTags(user.tags);
            setNotes(user.notes);
        }
    };

    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    useEffect(() => {
        const getGroups = async () => {
            const response = await getGroupsService(token);
            if (response.status === "SUCCESS") {
                setGroups(response.data);
            } else {
                toast.error("Failed to get groups");
            }
        };
        getGroups();
    }, [token]);

    // Channel Icons Functions
    const getChannelIcon = (channel) => {
        const channelData = channelIcons.find((c) => c.name === channel);
        return channelData ? channelData.icon : null;
    };

    const renderUserChannels = (channels) => {
        return channels.map((channel) => {
            const icon = getChannelIcon(channel.trim());
            return (
                <div key={channel} className="flex gap-1">
                    <Tooltip content={channel}>{icon}</Tooltip>
                </div>
            );
        });
    };

    // Toggle channel
    const toggleChannel = (channelName) => {
        const newSelectedChannels = selectedChannels.includes(channelName)
            ? selectedChannels.filter((name) => name !== channelName)
            : [...selectedChannels, channelName];
        setSelectedChannels(newSelectedChannels);
    };

    // export to csv
    const exportToCsv = async () => {
        try {
            const params = {
                page,
                limit: rowsPerPage,
                search: filterValue,
                tags: statusFilter !== "all" ? [...statusFilter] : "all",
            };
            await downloadPhonebookCSVService(params, token);
        } catch (error) {
            toast.error("CSV download error");
        }
    };

    // export to pdf
    const exportToPDF = async () => {
        try {
            const params = {
                page,
                limit: rowsPerPage,
                search: filterValue,
                tags: statusFilter !== "all" ? [...statusFilter] : "all",
            };
            await downloadPhonebookPDFService(params, token);
        } catch (error) {
            toast.error("PDF download error");
        }
    };

    // Render Status Function (Chips) Tags
    const renderStatusChips = (tags = []) => {
        const currentShow = renderInsideGroup ? 2 : 3; // show first two or three chips based on renderInsideGroup
        const visibleChips = tags.slice(0, currentShow);
        const remainingChipsCount = tags.length - currentShow;

        return (
            <div className="flex items-center">
                {visibleChips.map((tag) => (
                    <>
                        <span
                            className={`inline-flex items-center rounded-full ${
                                tag?.bgColor || "bg-gray-100"
                            } px-2 py-1 mr-1 text-xs ${
                                tag?.color || "text-gray-600"
                            } `}>
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
                                <span className="text-xs">
                                    +{remainingChipsCount}
                                </span>
                            </div>
                            {/* </Tooltip> */}
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2">
                                {tags.slice(currentShow).map((tag) => (
                                    <span
                                        className={`inline-flex items-center rounded-full ${
                                            tag?.bgColor || "bg-gray-100"
                                        } px-2 py-1 mr-1 text-xs ${
                                            tag?.color || "text-gray-600"
                                        } `}>
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
            toast.error("Failed to fetch status options");
        }
    };

    // This function is used for delete contact
    const deleteContactHandller = async (id) => {
        try {
            const response = await deleteContactService(token, id);
            if (response.status === "SUCCESS") {
                toast.success("Contact deleted successfully");
                fetchContacts();
                fetchTagOptions();
            } else {
                toast.error("Failed to delete contact");
            }
        } catch (error) {
            toast.error("Failed to delete contact");
        }
    };

    // this function is used for update contact
    const updateContactHandller = async (id) => {
        try {
            const contactData = {
                id: selectedUser.id,
                contact_name,
                phone_no,
                country_code: `+${countryCode}`,
                email,
                groups: selectedGroups,
                channels: selectedChannels,
                tags: selectedTags,
                avatar_type,
                avatar_value,
                notes,
            };

            const response = await updateContactService(token, contactData);
            if (response.status === "SUCCESS") {
                toast.success("Contact updated successfully");
                setIsUpdateButtonDisabled(true);
                onClose();
                fetchTagOptions();
                fetchContacts();
            } else {
                toast.error("Failed to update contact");
            }
        } catch (error) {
            toast.error("Failed to update contact");
        }
    };

    // this useeffect is used for fetching contacts
    useEffect(() => {
        if (token) {
            fetchContacts();
        }
    }, [page, rowsPerPage, filterValue, statusFilter, token]);

    // this useeffect is used for fetching tags options
    useEffect(() => {
        fetchTagOptions();
    }, []);

    const pages = Math.ceil(total / rowsPerPage);

    const sortedItems = React.useMemo(() => {
        return [...users].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, users]);

    // Render cell

    const renderCell = React.useCallback(
        (user, columnKey) => {
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

                case "phone_no":
                    return (
                        <div className="flex items-center">
                            {user?.country_code}-{user?.phone_no}
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
                case "tags":
                    return <div>{renderStatusChips(user.tags || [])}</div>;

                case "channels":
                    return (
                        <div className="flex">
                            {renderUserChannels(user.channels)}
                        </div>
                    );
                case "last_interaction":
                    return (
                        <div>
                            {cellValue
                                ? formatDateWithTime(new Date(cellValue))
                                : ""}
                        </div>
                    );
                case "actions":
                    return (
                        <div className="relative flex items-center gap-2">
                            <Tooltip content="Details">
                                <span
                                    className="text-lg cursor-pointer active:opacity-50"
                                    // Open Modal
                                    onClick={() => openModal("details", user)}>
                                    <Icon
                                        icon="iconamoon:eye"
                                        width={"1.2em"}
                                        className="text-default-500"
                                    />
                                </span>
                            </Tooltip>

                            <Tooltip content="Delete user">
                                <span
                                    className="text-lg text-danger-400 cursor-pointer active:opacity-50"
                                    onClick={() =>
                                        deleteContactHandller(user.id)
                                    }>
                                    <Icon
                                        icon="iconamoon:trash-light"
                                        width={"1.2em"}
                                    />
                                </span>
                            </Tooltip>
                        </div>
                    );
                case "date":
                    return <p className="text-xs">{cellValue}</p>;
                default:
                    return cellValue;
            }
        },
        [isOpen]
    );

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

    // Remove "actions" from visibleColumns
    const removeActionsFromVisibleColumns = () => {
        const newVisibleColumns = new Set(visibleColumns);
        newVisibleColumns.delete("actions");
        return newVisibleColumns;
    };

    // Run above function if renderInsideGroup is true
    useEffect(() => {
        if (renderInsideGroup) {
            setVisibleColumns(removeActionsFromVisibleColumns());
        }
    }, [renderInsideGroup]);

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

    // import contacts handller
    const importContactsHandler = async () => {
        const contactData = {
            contact_name: contact_name,
            phone_no: phone_no,
            country_code: countryCode,
            email: email,
            groups: [...selectedGroups],
            channels: selectedChannels,
            tags: selectedTags,
        };
        const response = await createContactService(contactData, token);
        if (response.status === "SUCCESS") {
            toast.success("Contacts imported successfully");
            fetchContacts();
            fetchTagOptions();
            onClose();
        } else {
            toast.error("Failed to import contacts");
        }
    };

    // Import Contacts from Excel
    const hanldeImportContactsFromExcel = async (e) => {
        e.preventDefault();
        const fileLimit = 5000000; // 5MB limit
        if (file && file.size <= fileLimit) {
            // Call the service function
            const result = await uploadContactsFromExcelService(file, token, {
                country_code: userInfo.country_calling_code,
            });
            console.log(file); // Perform your submit logic here
            // Handle success or error response
            if (result.status === "SUCCESS") {
                toast.success(`Conatcts uploaded successfully`);
                fetchContacts();
                fetchTagOptions();
                onClose();
            } else {
                toast.error(`Upload failed: ${result.message}`);
            }
        } else {
            toast.error("File is over 5MB!");
        }
    };

    // avatar handller
    const shapTypeHandller = (type, value) => {
        setAvatarType(type);
        setIsUpdateButtonDisabled(false);
        if (type === "character") {
            const value = `${contact_name}`;
            setAvatarValue(value);
        } else {
            setAvatarValue(value);
        }
    };

    console.log("selectedKeys", selectedKeys);

    // Top Table Content
    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    {/* Search  */}
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
                        {/* Status DropDown */}
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
                                    {t("Tags")}
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu
                                disallowEmptySelection
                                className=" overflow-y-auto"
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
                        {/* Column DropDown */}
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
                                    {t("Columns")}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}>
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize">
                                        {t(capitalize(column.name))}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        {!renderInsideGroup && (
                            <div className="flex gap-2">
                                {/* Export Btns DropDown */}
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
                                            color="primary">
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
                                            onClick={exportToPDF}
                                            variant="bordered"
                                            color="danger"
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
                                            onClick={exportToCsv}
                                            className="text-primary">
                                            {t("CSV")}
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>

                                {/* Import Contacts */}
                                <div>
                                    <Button
                                        color="success"
                                        variant="flat"
                                        onClick={() => {
                                            resetPhonebookAccounts();
                                            openModal("import");
                                        }}>
                                        {t("Import")}
                                    </Button>

                                    {/* Modal Content */}
                                    {modalType === "import" ? (
                                        <Modal
                                            isOpen={isOpen}
                                            onClose={onClose}
                                            onOpenChange={onOpenChange}
                                            placement="top-center"
                                            size="xl">
                                            <ModalContent>
                                                {(onClose) => (
                                                    <>
                                                        <ModalHeader className="flex flex-col gap-1"></ModalHeader>

                                                        <ModalBody>
                                                            {/* Tabs */}
                                                            <Tabs
                                                                aria-label="Import Contacts"
                                                                size="lg"
                                                                color="success"
                                                                variant="underlined">
                                                                {/* Add Template Tab */}
                                                                <Tab
                                                                    key="template"
                                                                    title={t(
                                                                        "Single"
                                                                    )}>
                                                                    <div className="flex flex-col gap-3 px-2">
                                                                        <p className="text-sm  font-light text-default-400">
                                                                            {t(
                                                                                "Import single contact"
                                                                            )}
                                                                        </p>
                                                                        <Input
                                                                            autoFocus
                                                                            isRequired
                                                                            label={t(
                                                                                "Contact Name"
                                                                            )}
                                                                            variant="flat"
                                                                            radius="sm"
                                                                            defaultValue={
                                                                                contact_name
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setContactName(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />

                                                                        {/* Phone Number */}
                                                                        <PhoneInput
                                                                            value={
                                                                                phone_no
                                                                            }
                                                                            countryDialCode={
                                                                                countryCode
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                setPhoneNo(
                                                                                    value
                                                                                );
                                                                                setIsUpdateButtonDisabled(
                                                                                    false
                                                                                );
                                                                            }}
                                                                            onCountryChange={(
                                                                                country
                                                                            ) => {
                                                                                setCountryCode(
                                                                                    country?.dial_code
                                                                                );
                                                                                setIsUpdateButtonDisabled(
                                                                                    false
                                                                                );
                                                                            }}
                                                                            isRequired={
                                                                                true
                                                                            }
                                                                        />

                                                                        {/* Email Input */}
                                                                        <Input
                                                                            isRequired
                                                                            type="email"
                                                                            label={t(
                                                                                "Email"
                                                                            )}
                                                                            defaultValue={
                                                                                email
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setEmail(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            variant="flat"
                                                                            radius="sm"
                                                                        />

                                                                        {/* Add to groups Select (multiselect) */}
                                                                        <Select
                                                                            label={t(
                                                                                "Add to groups"
                                                                            )}
                                                                            items={
                                                                                groups
                                                                            }
                                                                            selectionMode="multiple"
                                                                            isMultiline={
                                                                                true
                                                                            }
                                                                            radius="sm"
                                                                            defaultSelectedKeys={selectedGroups?.map(
                                                                                (
                                                                                    item
                                                                                ) => {
                                                                                    return item?.toString();
                                                                                }
                                                                            )} // Set the default selected keys here
                                                                            selectedKeys={selectedGroups?.map(
                                                                                (
                                                                                    item
                                                                                ) => {
                                                                                    return item?.toString();
                                                                                }
                                                                            )}
                                                                            onSelectionChange={(
                                                                                keys
                                                                            ) =>
                                                                                setSelectedGroups(
                                                                                    Array.from(
                                                                                        keys
                                                                                    )
                                                                                )
                                                                            } // Update the state
                                                                            renderValue={(
                                                                                items
                                                                            ) => {
                                                                                return (
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                        {items.map(
                                                                                            (
                                                                                                item
                                                                                            ) => (
                                                                                                <span
                                                                                                    key={
                                                                                                        item.key
                                                                                                    }
                                                                                                    className="px-2 py-1 bg-gray-200 rounded-md">
                                                                                                    {
                                                                                                        item
                                                                                                            .data
                                                                                                            .group_name
                                                                                                    }
                                                                                                </span>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            }}>
                                                                            {(
                                                                                group
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        group?.id
                                                                                    }
                                                                                    textValue={
                                                                                        group?.group_name
                                                                                    }>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <AvatarIndex
                                                                                            isEditable={
                                                                                                false
                                                                                            }
                                                                                            avatarType={
                                                                                                group?.avatar_type ||
                                                                                                "character"
                                                                                            }
                                                                                            value={
                                                                                                group?.avatar_value ||
                                                                                                group?.group_name
                                                                                            }
                                                                                            size={
                                                                                                35
                                                                                            }
                                                                                        />
                                                                                        <span>
                                                                                            {t(
                                                                                                group?.group_name
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                </SelectItem>
                                                                            )}
                                                                        </Select>

                                                                        {/* Channels */}
                                                                        <div className="relative flex flex-col gap-0 py-6 px-6 rounded-md  bg-content2">
                                                                            <div className="flex gap-1">
                                                                                <span className="text-md text-default-500">
                                                                                    {t(
                                                                                        "Channels"
                                                                                    )}

                                                                                    :
                                                                                </span>
                                                                                {channelIcons.map(
                                                                                    (
                                                                                        channel
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                channel.name
                                                                                            }
                                                                                            className="flex cursor-pointer relative ">
                                                                                            <Tooltip
                                                                                                content={t(
                                                                                                    channel.name
                                                                                                )}>
                                                                                                <div
                                                                                                    onClick={() =>
                                                                                                        toggleChannel(
                                                                                                            channel.name
                                                                                                        )
                                                                                                    }>
                                                                                                    {
                                                                                                        channel.icon
                                                                                                    }
                                                                                                    {/* Show tick icon above the selected icon */}
                                                                                                    {selectedChannels?.includes(
                                                                                                        channel.name
                                                                                                    ) && (
                                                                                                        <Icon
                                                                                                            icon="mdi:check-circle"
                                                                                                            className="absolute -top-3 right-0 text-green-500"
                                                                                                            width={
                                                                                                                "0.9em"
                                                                                                            }
                                                                                                        />
                                                                                                    )}
                                                                                                </div>
                                                                                            </Tooltip>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>

                                                                            {/* Show assigned / selected channels names */}
                                                                            <p className="text-xs text-default-400 ">
                                                                                {
                                                                                    "Selected Channels"
                                                                                }

                                                                                :{" "}
                                                                                {selectedChannels.join(
                                                                                    ", "
                                                                                ) ||
                                                                                    t(
                                                                                        "None"
                                                                                    )}
                                                                            </p>
                                                                        </div>

                                                                        <div className="mt-2">
                                                                            <CommandTagItem />
                                                                        </div>

                                                                        <div className="flex gap-4 justify-end my-4">
                                                                            <Button
                                                                                color="danger"
                                                                                variant="light"
                                                                                onPress={
                                                                                    onClose
                                                                                }
                                                                                radius="sm">
                                                                                {t(
                                                                                    "Cancel"
                                                                                )}
                                                                            </Button>
                                                                            <Button
                                                                                color="success"
                                                                                variant="flat"
                                                                                onPress={
                                                                                    importContactsHandler
                                                                                }
                                                                                radius="sm">
                                                                                {t(
                                                                                    "Import"
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </Tab>
                                                                {/* Right Bulk Upload */}
                                                                <Tab
                                                                    key="bulkupload"
                                                                    title={t(
                                                                        "Bulk Upload"
                                                                    )}>
                                                                    <div className="flex flex-col gap-3 px-2">
                                                                        <div className="flex flex-col gap-2">
                                                                            <p className="text-sm font-light text-default-400">
                                                                                {t(
                                                                                    "Import bulk contacts"
                                                                                )}
                                                                            </p>
                                                                        </div>

                                                                        <CsvUpload />

                                                                        {/* Download sample file */}
                                                                        <a
                                                                            href="contact-import.csv"
                                                                            download
                                                                            className="flex items-center gap-1 cursor-pointer hover:underline hover:text-success text-sm text-default-500">
                                                                            {t(
                                                                                "Download sample file"
                                                                            )}

                                                                            <Icon
                                                                                icon="iconamoon:cloud-download-light"
                                                                                width="1.3em"
                                                                                height="1.3em"
                                                                                className="hover:text-success"
                                                                            />
                                                                        </a>

                                                                        <div className="flex gap-4 justify-end my-4">
                                                                            <Button
                                                                                color="danger"
                                                                                variant="light"
                                                                                onPress={
                                                                                    onClose
                                                                                }
                                                                                radius="sm">
                                                                                {t(
                                                                                    "Cancel"
                                                                                )}
                                                                            </Button>
                                                                            <Button
                                                                                color="success"
                                                                                variant="flat"
                                                                                onClick={
                                                                                    hanldeImportContactsFromExcel
                                                                                }
                                                                                radius="sm">
                                                                                {t(
                                                                                    "Import"
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </Tab>
                                                            </Tabs>
                                                            <div className="flex gap-4"></div>
                                                        </ModalBody>
                                                    </>
                                                )}
                                            </ModalContent>
                                        </Modal>
                                    ) : (
                                        <Modal
                                            // {/* User Details modal */}
                                            isOpen={isOpen}
                                            onClose={onClose}
                                            onOpenChange={onOpenChange}
                                            placement="top-center"
                                            size="xl"
                                            backdrop="blur"
                                            className="py-2">
                                            <ModalContent>
                                                {(onClose) => (
                                                    <>
                                                        <ModalHeader className="flex flex-col gap-1 ">
                                                            <h2 className="flex items-center gap-2">
                                                                <Icon
                                                                    icon="iconamoon:profile-circle-duotone"
                                                                    // className="text-success"
                                                                    width={
                                                                        "1.3em"
                                                                    }
                                                                />
                                                                User Details
                                                            </h2>{" "}
                                                            {/* Add title or other content */}
                                                        </ModalHeader>

                                                        <ModalBody className="flex flex-col gap-3">
                                                            {/* User details content goes here */}

                                                            {/* Avatar */}
                                                            {/* <Avatar
                            isBordered
                            color="default"
                            src={selectedUser.avatar}
                            size="lg"
                            className="w-[10em] h-[10em] mx-auto"
                          /> */}
                                                            <AvatarIndex
                                                                value={
                                                                    avatar_value ||
                                                                    contact_name
                                                                }
                                                                avatarType={
                                                                    avatar_type ||
                                                                    "character"
                                                                }
                                                                shapTypeHandller={
                                                                    shapTypeHandller
                                                                }
                                                            />

                                                            {/* Name */}
                                                            <Input
                                                                label="Name"
                                                                placeholder={
                                                                    selectedUser.name
                                                                }
                                                                value={
                                                                    contact_name
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setContactName(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    setIsUpdateButtonDisabled(
                                                                        false
                                                                    );
                                                                }}
                                                                variant="flat"
                                                                radius="sm"
                                                            />

                                                            {/* Phone */}
                                                            <PhoneInput
                                                                value={phone_no}
                                                                countryDialCode={
                                                                    countryCode
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) => {
                                                                    setPhoneNo(
                                                                        value
                                                                    );
                                                                    setIsUpdateButtonDisabled(
                                                                        false
                                                                    );
                                                                }}
                                                                onCountryChange={(
                                                                    country
                                                                ) => {
                                                                    setCountryCode(
                                                                        country?.dial_code
                                                                    );
                                                                    setIsUpdateButtonDisabled(
                                                                        false
                                                                    );
                                                                }}
                                                                isRequired={
                                                                    true
                                                                }
                                                            />

                                                            {/* Email */}
                                                            <Input
                                                                label="Email"
                                                                placeholder={
                                                                    selectedUser.email
                                                                }
                                                                value={email}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setEmail(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    setIsUpdateButtonDisabled(
                                                                        false
                                                                    );
                                                                }}
                                                                variant="flat"
                                                                radius="sm"
                                                            />

                                                            {/* Notes */}
                                                            <Textarea
                                                                label="Notes"
                                                                placeholder={
                                                                    selectedUser.notes
                                                                }
                                                                value={notes}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setNotes(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    setIsUpdateButtonDisabled(
                                                                        false
                                                                    );
                                                                }}
                                                                radius="sm"
                                                                color="warning"
                                                            />

                                                            {/* Add to group Select (multiselect) */}
                                                            <Select
                                                                label={t(
                                                                    "Add to groups"
                                                                )}
                                                                items={groups}
                                                                selectionMode="multiple"
                                                                isMultiline={
                                                                    true
                                                                }
                                                                radius="sm"
                                                                size="sm"
                                                                defaultSelectedKeys={selectedGroups?.map(
                                                                    (item) => {
                                                                        return item?.toString();
                                                                    }
                                                                )}
                                                                selectedKeys={selectedGroups?.map(
                                                                    (item) => {
                                                                        return item?.toString();
                                                                    }
                                                                )} // Bind the current selected state
                                                                onSelectionChange={(
                                                                    keys
                                                                ) => {
                                                                    setIsUpdateButtonDisabled(
                                                                        false
                                                                    );
                                                                    setSelectedGroups(
                                                                        Array.from(
                                                                            keys
                                                                        )
                                                                    );
                                                                }} // Update the state
                                                                renderValue={(
                                                                    items
                                                                ) => {
                                                                    return (
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {items.map(
                                                                                (
                                                                                    item
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            item.key
                                                                                        }
                                                                                        className="px-2 py-1 bg-content3  rounded-md">
                                                                                        {
                                                                                            item
                                                                                                .data
                                                                                                .group_name
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    );
                                                                }}>
                                                                {(group) => (
                                                                    <SelectItem
                                                                        key={
                                                                            group?.id
                                                                        }
                                                                        textValue={
                                                                            group?.group_name
                                                                        }>
                                                                        <div className="flex items-center gap-2">
                                                                            <AvatarIndex
                                                                                isEditable={
                                                                                    false
                                                                                }
                                                                                avatarType={
                                                                                    group?.avatar_type ||
                                                                                    "character"
                                                                                }
                                                                                value={
                                                                                    group?.avatar_value ||
                                                                                    group?.group_name
                                                                                }
                                                                                size={
                                                                                    35
                                                                                }
                                                                            />
                                                                            <span>
                                                                                {t(
                                                                                    group?.group_name
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                )}
                                                            </Select>

                                                            {/* Channels */}
                                                            <div className="relative flex flex-col gap-0 py-6 px-6 rounded-md  bg-content2">
                                                                <div className="flex gap-1">
                                                                    <span className="text-md text-default-500">
                                                                        {t(
                                                                            "Channels"
                                                                        )}
                                                                        :
                                                                    </span>
                                                                    {channelIcons.map(
                                                                        (
                                                                            channel
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    channel.name
                                                                                }
                                                                                className="flex cursor-pointer relative ">
                                                                                <Tooltip
                                                                                    content={t(
                                                                                        channel.name
                                                                                    )}>
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            toggleChannel(
                                                                                                channel.name
                                                                                            );
                                                                                            setIsUpdateButtonDisabled(
                                                                                                false
                                                                                            );
                                                                                        }}>
                                                                                        {
                                                                                            channel.icon
                                                                                        }
                                                                                        {/* Show tick icon above the selected icon */}
                                                                                        {selectedChannels?.includes(
                                                                                            channel.name
                                                                                        ) && (
                                                                                            <Icon
                                                                                                icon="mdi:check-circle"
                                                                                                className="absolute -top-3 right-0 text-green-500"
                                                                                                width={
                                                                                                    "0.9em"
                                                                                                }
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                </Tooltip>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>

                                                                {/* Show assigned / selected channels names */}
                                                                <p className="text-xs text-default-400 ">
                                                                    {
                                                                        "Selected Channels"
                                                                    }
                                                                    :{" "}
                                                                    {selectedChannels.join(
                                                                        ", "
                                                                    ) ||
                                                                        t(
                                                                            "None"
                                                                        )}
                                                                </p>
                                                            </div>

                                                            <div className="mt-2">
                                                                <CommandTagItem />
                                                            </div>

                                                            {/* Added Modified on */}
                                                            <Divider />
                                                            <div className="text-xs text-default-400 font-md flex justify-between">
                                                                <span>
                                                                    Added:{" "}
                                                                    {selectedUser.created_at
                                                                        ? formatDateWithTime(
                                                                              new Date(
                                                                                  selectedUser.created_at
                                                                              )
                                                                          )
                                                                        : ""}
                                                                </span>
                                                                <span>
                                                                    Modified:{" "}
                                                                    {selectedUser.last_interaction
                                                                        ? formatDateWithTime(
                                                                              new Date(
                                                                                  selectedUser.last_interaction
                                                                              )
                                                                          )
                                                                        : ""}
                                                                </span>
                                                            </div>
                                                        </ModalBody>

                                                        <ModalFooter>
                                                            <Button
                                                                color={
                                                                    isUpdateButtonDisabled
                                                                        ? "default"
                                                                        : "success"
                                                                }
                                                                variant="flat"
                                                                isDisabled={
                                                                    isUpdateButtonDisabled
                                                                }
                                                                onPress={
                                                                    updateContactHandller
                                                                }
                                                                radius="sm">
                                                                Update
                                                            </Button>
                                                        </ModalFooter>
                                                    </>
                                                )}
                                            </ModalContent>
                                        </Modal>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t("Total")} {total} {t("users")}
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
        contact_name,
        phone_no, // phone number
        email, // email
        selectedGroups, // groups
        selectedChannels, // channels
        selectedTags, // selectedTags
        avatar_type,
        avatar_value,
        notes,
        modalType,
        file,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${users.length} ${t("of")} ${total} ${t(
                              "selected"
                          )}`}
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
    }, [selectedKeys, users.length, page, pages, hasSearchFilter]);

    return (
        <Table
            id="table-to-export"
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode={renderInsideGroup ? "multiple" : "none"}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
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
            <TableBody emptyContent={"No users found"} items={sortedItems}>
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
