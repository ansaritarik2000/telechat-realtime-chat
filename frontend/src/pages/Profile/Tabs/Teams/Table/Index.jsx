import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { z } from "zod";
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
    ModalFooter,
    useDisclosure,
    useRadio,
    Divider,
    Avatar,
    addToast,
} from "@heroui/react";

import TableUser from "../../../../../components/Common/TableUser";
import { columns, users, statusOptions } from "./data";
import { capitalize } from "./utils";
import RoleSelector from "./RoleSelector";
import UserStatus from "./UserStatus";
import { useTranslation } from "react-i18next";
import { useMemberStore } from "../../../../../store/member/memberStore";
import {
    createMemberService,
    deleteMemberService,
    getMembersService,
    updateMemberService,
} from "../../../../../services/members/memberService";
import { formatDate } from "../../../../Email/Reports/ReportsTable/data";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import { PlusIcon } from "../../../../../utils/ReusableIcons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "../../../../../components/phone-input";
import { useQueryClient } from "@tanstack/react-query";

const statusColorMap = {
    active: "success",
    inactive: "danger",
};

const roleColorMap = {
    Admin: "success",
    Agent: "primary",
    Viewer: "warning",
    Campaigner: "secondary",
};

const INITIAL_VISIBLE_COLUMNS = [
    "name",
    "email",
    "created_at",
    "role",
    "status",
    "manage",
    "creator_name",
];

const restrictedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "aol.com",
    "icloud.com",
    "live.com",
    "msn.com",
];

const companyEmailRegex =
    /^[a-zA-Z0-9._%+-]+@(?!gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|aol\.com|icloud\.com|live\.com|msn\.com)([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i;

const schema = z.object({
    first_name: z
        .string()
        .min(2, "First name cannot be less than 2 characters"),
    last_name: z.string().min(2, "Last name cannot be less than 2 characters"),
    email: z
        .string()
        .email("Please enter valid email address.")
        .regex(companyEmailRegex, "Only company domain emails are allowed."),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone_no: z.string().min(10, "Mobile number must be at least 10 digits"),
    role: z.string().min(1, "Role is required"),
});

export default function TeamsTable() {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [createdOn, setCreatedOn] = useState();
    const [lastModified, setLastModified] = useState();
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedUser, setSelectedUser] = useState({});
    const [isVisibleOld, setIsVisibleOld] = useState(false);
    const { t } = useTranslation();
    const queryClient = useQueryClient(); // Get the query client

    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [modalType, setModalType] = useState(null);

    const toggleVisibilityOld = () => setIsVisibleOld(!isVisibleOld);

    // zustand store
    const {
        email,
        password,
        first_name,
        last_name,
        phone_no,
        country_dial_code,
        role,
        avatar_value,
        avatar_type,
        resetMembers,
        setPhoneNo,
        setCountryDialCode,
        setLastName,
        setFirstName,
        setPassword,
        setEmail,
        setRole,
        status,
        setStatus,
        setAvatarType,
        setAvatarValue,
    } = useMemberStore();

    const [page, setPage] = React.useState(1);
    const [disabledUpdateButton, setDisabledUpdateButton] = useState(true);
    const [emailError, setEmailError] = useState("");
    const token = localStorage.getItem("token");

    const hasSearchFilter = Boolean(filterValue);

    const {
        register,

        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            phone_no: "",
            role: "",
        },
        mode: "onBlur",
    });

    const fetchData = async () => {
        try {
            const search = filterValue;
            const status =
                statusFilter === "all" ? statusFilter : [...statusFilter];

            const response = await getMembersService(
                page,
                rowsPerPage,
                status,
                search,
                token
            );

            if (response.status === "SUCCESS") {
                setUsers(response.data);
                setTotalRecords(response.pagination.totalItems);
            }
        } catch (error) {
            console.error("Error fetching RCS campaigns:", error);
        }
    };

    // this useffect use for api call
    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [
        page,
        rowsPerPage,
        filterValue,
        statusFilter,
        visibleColumns,
        sortDescriptor,
        token,
    ]);

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
                user.name.toLowerCase().includes(filterValue.toLowerCase())
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

    // delete member handller
    const deleteMemberHandller = async () => {
        try {
            const resonse = await deleteMemberService({
                user_id: selectedUser.user_id,
            });
            if (resonse.status === "SUCCESS") {
                addToast({
                    color: "success",
                    title: "Member deleted successfully!",
                });

                fetchData();
                onClose();
            }
        } catch (error) {
            addToast({
                color: "danger",
                title: "Failed to member delete!",
            });
        }
    };

    // Handle modal Open
    const openModal = (type, user) => {
        setSelectedUser(user);
        setModalType(type);
        resetMembers();
        setDisabledUpdateButton(true);
        onOpen();
        reset();
        if (type === "managemember") {
            const {
                email,
                first_name,
                password,
                last_name,
                phone_no,
                country_dial_code,
                role,
                status,
                avatar_value,
                avatar_type,
                created_at,
            } = user;

            setEmail(email);
            setPhoneNo(phone_no);
            setCountryDialCode(country_dial_code);
            setPassword(password);
            setFirstName(first_name);
            setLastName(last_name);
            setRole(role);
            setStatus(status);
            setCreatedOn(created_at);
            setLastModified(created_at);
            setAvatarType(avatar_type);
            setAvatarValue(avatar_value);
        }
    };

    const handleEmailChange = (value) => {
        const emailParts = value.split("@");
        if (emailParts.length > 1) {
            const domain = emailParts[1].toLowerCase();
            if (restrictedDomains.includes(domain)) {
                setEmailError("Only company domain emails are allowed.");
            } else {
                setEmailError("");
            }
        } else {
            setEmailError("");
        }
        setEmail(value);
    };

    // useEffect(() => {
    //     setAvatarValue(`${first_name}${last_name ? " " : ""}${last_name}`);
    // }, [first_name, last_name]);

    const pages = Math.ceil(totalRecords / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

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
                    <TableUser
                        avatarType={user.avatar_type}
                        avatarValue={user.avatar_value}
                        name={cellValue}
                        email={user.email}
                    />
                );
            case "role":
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        color={roleColorMap[user.role]}>
                        {cellValue}
                    </Chip>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.status]}
                        size="sm"
                        variant="dot">
                        <span className="text-default-500">{t(cellValue)}</span>
                    </Chip>
                );
            case "creator_name":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm">{cellValue}</p>
                        <span className="text-xs text-default-500">
                            {user.creator_email}
                        </span>
                    </div>
                );

            case "manage":
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Icon
                            icon="material-symbols:manage-accounts-outline"
                            width="1.9em"
                            height="1.9em"
                            className="text-default-500 hover:cursor-pointer"
                            onClick={() => openModal("managemember", user)}
                        />
                    </div>
                );
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

    const onModalOpenChangeHandller = () => {
        onOpenChange();
        resetMembers();
    };
    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    // add member handller
    const addMemberHandller = async () => {
        try {
            const formData = {
                email,
                password,
                first_name,
                last_name,
                phone_no,
                country_dial_code,
                avatar_value: avatar_value
                    ? avatar_value
                    : `${first_name}${last_name ? " " : ""}${last_name}`,
                avatar_type,
                role,
                status: "active",
            };

            const response = await createMemberService(formData); // Call the service function with form data

            if (response.status === "SUCCESS") {
                addToast({
                    color: "success",
                    title: "Member created successfully!",
                });

                onClose();
                fetchData();
                queryClient.invalidateQueries(["graphMemberData"]); // Refetch graph da
            } else {
                addToast({
                    color: "danger",
                    title: "Failed to create member!",
                });
            }
        } catch (error) {
            addToast({
                color: "danger",
                title: "Error creating member:",
            });
            console.error("Error creating member:", error.message);
            // Optionally, handle error feedback
        }
    };

    // shap type handller
    const shapTypeHandller = (type, value) => {
        setAvatarType(type);
        if (type === "character") {
            const value = `${first_name}${last_name ? " " : ""}${last_name}`;
            setAvatarValue(value);
        } else {
            setAvatarValue(value);
        }
        setDisabledUpdateButton(false);
    };

    // update member handller
    const updateHandller = async () => {
        try {
            const formData = {
                user_id: selectedUser.user_id,
                member_id: selectedUser.id,
                password,
                email,
                first_name,
                last_name,
                phone_no,
                country_dial_code,
                status,
                avatar_value,
                avatar_type,
                role,
            };

            const resposne = await updateMemberService(formData);
            if (resposne.status === "SUCCESS") {
                addToast({
                    color: "success",
                    title: "Member updated successfully!",
                });
                fetchData();
                setDisabledUpdateButton(true);
                queryClient.invalidateQueries(["graphMemberData"]); // Refetch graph da
                onClose();
            } else {
                addToast({
                    color: "danger",
                    title: "Member upadation failed!",
                });
            }
        } catch (error) {
            addToast({
                color: "danger",
                title: "Member upadation failed!",
            });
        }
    };

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

                        {/* Add Member Btn */}
                        <Button
                            color="success"
                            variant="flat"
                            onPress={() => openModal("addmember")}
                            startContent={
                                <PlusIcon customClass="text-success-700" />
                            }>
                            {t("Add Member")}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        {t("Total")} {totalRecords} {t("members")}
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        {t("Rows per page")}:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>

                {/* Add Member Modal */}
                {modalType == "addmember" && (
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        onOpenChange={onModalOpenChangeHandller}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex gap-1 items-center text-md">
                                        {t("Add Member")}
                                    </ModalHeader>
                                    <ModalBody>
                                        <AvatarIndex
                                            value={
                                                avatar_value ||
                                                `${first_name}${
                                                    last_name ? " " : ""
                                                }${last_name}`
                                            }
                                            avatarType={avatar_type}
                                            shapTypeHandller={shapTypeHandller}
                                        />
                                        <form>
                                            {/* First name, Last name, , email id, Password, mobile no */}
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center w-full gap-2">
                                                    <Input
                                                        {...register(
                                                            "first_name"
                                                        )}
                                                        isInvalid={
                                                            errors?.first_name
                                                                ? true
                                                                : false
                                                        }
                                                        errorMessage={
                                                            errors?.first_name
                                                                ?.message
                                                        }
                                                        isRequired
                                                        label={t("First Name")}
                                                        onChange={(e) => {
                                                            setAvatarValue(
                                                                e.target.value
                                                            );
                                                            setFirstName(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={first_name}
                                                        // value={first_name}
                                                        size="sm"
                                                        radius="sm"
                                                    />
                                                    <Input
                                                        {...register(
                                                            "last_name"
                                                        )}
                                                        isInvalid={
                                                            errors?.last_name
                                                                ? true
                                                                : false
                                                        }
                                                        errorMessage={
                                                            errors?.last_name
                                                                ?.message
                                                        }
                                                        isRequired
                                                        label={t("Last Name")}
                                                        onChange={(e) => {
                                                            setAvatarValue(
                                                                first_name +
                                                                    " " +
                                                                    e.target
                                                                        .value
                                                            );
                                                            setLastName(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={last_name}
                                                        size="sm"
                                                        radius="sm"
                                                    />
                                                </div>
                                                <Input
                                                    {...register("email")}
                                                    isInvalid={
                                                        !!emailError ||
                                                        errors?.email
                                                    }
                                                    errorMessage={
                                                        emailError ||
                                                        errors?.email?.message
                                                    }
                                                    isRequired
                                                    label={t("Email")}
                                                    onChange={(e) =>
                                                        handleEmailChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={email}
                                                    size="sm"
                                                    radius="sm"
                                                />
                                                <Input
                                                    isRequired
                                                    {...register("password")}
                                                    isInvalid={
                                                        errors?.password
                                                            ? true
                                                            : false
                                                    }
                                                    errorMessage={
                                                        errors?.password
                                                            ?.message
                                                    }
                                                    onChange={(e) =>
                                                        setPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    type={
                                                        isVisibleOld
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={password}
                                                    label={t("Password")}
                                                    size="sm"
                                                    radius="sm"
                                                    endContent={
                                                        <button
                                                            className="focus:outline-none"
                                                            type="button"
                                                            onClick={
                                                                toggleVisibilityOld
                                                            }>
                                                            {isVisibleOld ? (
                                                                <Icon
                                                                    icon="ant-design:eye-invisible-filled"
                                                                    className="text-2xl text-default-400 pointer-events-none"
                                                                />
                                                            ) : (
                                                                <Icon
                                                                    icon="ant-design:eye-filled"
                                                                    className="text-2xl text-default-400 pointer-events-none"
                                                                />
                                                            )}
                                                        </button>
                                                    }
                                                />

                                                <PhoneInput
                                                    value={phone_no}
                                                    onChange={(value) =>
                                                        setPhoneNo(value)
                                                    }
                                                    countryDialCode={
                                                        country_dial_code
                                                    }
                                                    onCountryChange={(
                                                        country
                                                    ) =>
                                                        setCountryDialCode(
                                                            country?.dial_code
                                                        )
                                                    }
                                                />
                                                {errors?.phone_no && (
                                                    <p className="text-danger">
                                                        {
                                                            errors?.phone_no
                                                                ?.message
                                                        }
                                                    </p>
                                                )}

                                                {/* Select Role : admin, agent, viewer, campaigner */}
                                                <div className="flex flex-col gap-1 p-4 rounded-lg bg-content2">
                                                    <p className="text-md text-default-600">
                                                        {t("Member Role")}
                                                    </p>
                                                    {/* Role Selector */}
                                                    <RoleSelector
                                                        {...register("role")}
                                                        handleRoleSelect={(
                                                            select
                                                        ) => setRole(select)}
                                                        selectRole={role}
                                                    />
                                                    {errors?.role && (
                                                        <p className="text-danger">
                                                            {
                                                                errors?.role
                                                                    ?.message
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                        <Divider />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="default"
                                            variant="light"
                                            onPress={onClose}>
                                            {t("Cancel")}
                                        </Button>
                                        <Button
                                            color="success"
                                            variant="flat"
                                            isDisabled={
                                                errors.phone_no ||
                                                errors.email ||
                                                errors.password ||
                                                errors.first_name ||
                                                errors.last_name ||
                                                errors.role ||
                                                !first_name.trim() ||
                                                !last_name.trim() ||
                                                !email.trim() ||
                                                !password.trim() ||
                                                !phone_no.trim() ||
                                                !role.trim()
                                            }
                                            onPress={addMemberHandller}>
                                            {t("Add")}
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                )}

                {/* Manage Member Modal */}
                {modalType == "managemember" && (
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        onOpenChange={onOpenChange}
                        size="lg">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        {t("Manage")}
                                    </ModalHeader>
                                    <ModalBody>
                                        <AvatarIndex
                                            value={
                                                avatar_value ||
                                                `${first_name}${
                                                    last_name ? " " : ""
                                                }${last_name}`
                                            }
                                            avatarType={avatar_type}
                                            shapTypeHandller={shapTypeHandller}
                                        />
                                        {/* First name, email id, Password, mobile no */}
                                        <div className="flex flex-col gap-4">
                                            {/* Name */}
                                            <Input
                                                {...register("first_name")}
                                                isInvalid={
                                                    errors?.first_name
                                                        ? true
                                                        : false
                                                }
                                                errorMessage={
                                                    errors?.first_name?.message
                                                }
                                                isRequired
                                                label={t("First Name")}
                                                onChange={(e) => {
                                                    setAvatarValue(
                                                        e.target.value
                                                    );
                                                    setFirstName(
                                                        e.target.value
                                                    );
                                                    setDisabledUpdateButton(
                                                        false
                                                    );
                                                }}
                                                value={first_name}
                                                // value={first_name}
                                                size="sm"
                                                radius="sm"
                                            />
                                            <Input
                                                isRequired
                                                {...register("last_name")}
                                                isInvalid={
                                                    errors?.last_name
                                                        ? true
                                                        : false
                                                }
                                                errorMessage={
                                                    errors?.last_name?.message
                                                }
                                                label={t("Last Name")}
                                                onChange={(e) => {
                                                    setAvatarValue(
                                                        first_name +
                                                            " " +
                                                            e.target.value
                                                    );
                                                    setDisabledUpdateButton(
                                                        false
                                                    );
                                                    setLastName(e.target.value);
                                                }}
                                                value={last_name}
                                                size="sm"
                                                radius="sm"
                                            />
                                            <Input
                                                isRequired
                                                label={t("Email")}
                                                {...register("email")}
                                                isInvalid={
                                                    errors?.email ? true : false
                                                }
                                                errorMessage={
                                                    errors?.email?.message
                                                }
                                                value={email}
                                                onChange={(e) =>
                                                    handleEmailChange(
                                                        e.target.value
                                                    )
                                                }
                                                size="sm"
                                                radius="sm"
                                            />
                                            <PhoneInput
                                                value={phone_no}
                                                countryDialCode={
                                                    country_dial_code
                                                }
                                                onChange={(value) => {
                                                    setDisabledUpdateButton(
                                                        false
                                                    );
                                                    setPhoneNo(value);
                                                }}
                                                onCountryChange={(country) => {
                                                    setCountryDialCode(
                                                        country?.dial_code
                                                    );
                                                    setDisabledUpdateButton(
                                                        false
                                                    );
                                                }}
                                            />

                                            <Input
                                                {...register("password")}
                                                isInvalid={
                                                    errors?.password
                                                        ? true
                                                        : false
                                                }
                                                errorMessage={
                                                    errors?.password?.message
                                                }
                                                isRequired
                                                onChange={(e) => {
                                                    setDisabledUpdateButton(
                                                        false
                                                    );
                                                    setPassword(e.target.value);
                                                }}
                                                type={
                                                    isVisibleOld
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                label={t("Password")}
                                                size="sm"
                                                radius="sm"
                                                endContent={
                                                    <button
                                                        className="focus:outline-none"
                                                        type="button"
                                                        onClick={
                                                            toggleVisibilityOld
                                                        }>
                                                        {isVisibleOld ? (
                                                            <Icon
                                                                icon="ant-design:eye-invisible-filled"
                                                                className="text-2xl text-default-400 pointer-events-none"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                icon="ant-design:eye-filled"
                                                                className="text-2xl text-default-400 pointer-events-none"
                                                            />
                                                        )}
                                                    </button>
                                                }
                                            />

                                            {/* Select Role : admin, agent, viewer, campaigner */}
                                            <div className="flex flex-col gap-1 bg-content2  rounded-md border p-3">
                                                <p className="text-sm text-default-600">
                                                    {t("Roles")}
                                                </p>
                                                {/* Role Selector */}
                                                <RoleSelector
                                                    {...register("role")}
                                                    selectRole={role}
                                                    handleRoleSelect={(
                                                        select
                                                    ) => {
                                                        setRole(select);
                                                        setDisabledUpdateButton(
                                                            false
                                                        );
                                                    }}
                                                />
                                                {errors?.role?.message && (
                                                    <p className="text-xs text-red-500">
                                                        {errors?.role?.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status Chip */}
                                            <div className="flex items-center gap-4  bg-content2 rounded-md border p-3">
                                                <p className="text-sm text-default-600">
                                                    {t("Status")}
                                                </p>
                                                <UserStatus
                                                    selected={
                                                        status === "active"
                                                    }
                                                    onChange={(status) => {
                                                        setDisabledUpdateButton(
                                                            false
                                                        );

                                                        setStatus(status);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <Divider />

                                        {/* Created on & Last Modified on */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-default-400">
                                                {t("Created on")}: {createdOn}
                                            </span>
                                            <span className="text-xs text-default-400">
                                                {t("Last Modified on")}:{" "}
                                                {lastModified}
                                            </span>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter className="flex justify-between">
                                        <Button
                                            color="danger"
                                            size="sm"
                                            variant="light"
                                            onClick={deleteMemberHandller}
                                            className="text-danger">
                                            {t("Delete Member")}
                                        </Button>
                                        <Button
                                            variant="flat"
                                            radius="sm"
                                            isDisabled={
                                                disabledUpdateButton ||
                                                errors.phone_no ||
                                                errors.email ||
                                                errors.password ||
                                                errors.first_name ||
                                                errors.last_name ||
                                                errors.role
                                            }
                                            color={"success"}
                                            onPress={updateHandller}>
                                            {t("Update")}
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                )}

                {modalType === "deletemember" && (
                    <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        onClose={onClose}
                        size="md">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        {t("Confirmation")}
                                    </ModalHeader>
                                    <ModalBody>
                                        <p>
                                            {t(
                                                "Are you sure you want to remove"
                                            )}{" "}
                                            <span className="font-bold">
                                                {t("this member")}
                                            </span>{" "}
                                            {t("from the team?")}
                                        </p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onClick={deleteMemberHandller}>
                                            {t("Cancel")}
                                        </Button>
                                        <Button
                                            color="success"
                                            variant="flat"
                                            onPress={onClose}>
                                            {t("Yes")}
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                )}
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        totalRecords,
        onSearchChange,
        hasSearchFilter,
        isVisibleOld,
        isOpen,
        role,
        first_name,
        last_name,
        avatar_type,
        avatar_value,
        status,
        email,
        password,
        phone_no,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${users.length} ${t("of")} ${totalRecords} ${t(
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
    }, [selectedKeys, sortedItems, page, pages, hasSearchFilter]);

    return (
        <Table
            // removeWrapper
            aria-label="table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="inside"
            // selectionMode="multiple"
            // onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            className="px-1">
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
