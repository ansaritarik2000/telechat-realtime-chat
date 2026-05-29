import React, { useEffect, useMemo, useState } from "react";

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
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
  Avatar,
  Divider,
  addToast,
} from "@heroui/react";

import { columns, users, statusOptions } from "./data";
import { capitalize } from "./utils";
import TabSwitcher from "../Configure/TabsSwitcher";
import AddTabSwitcher from "../Add/TabsSwitcher";
import { useTranslation } from "react-i18next";
import {
  configureUpdateService,
  getSubAccountByUserIdService,
  getSubAccountsService,
  loginSubAccountService,
  purgSubAccountService,
} from "../../../services/Subaccount/subAccountService";
import { useNavigate } from "react-router-dom";
import { useSubAccountStore } from "../../../store/subAccount/subAccountStore";
import { z } from "zod";
import AvatarIndex from "../../../components/AvatarGen/Index";

const statusColorMap = {
  active: "success",
  disabled: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "id",
  "email",
  "date",
  "company",
  "status",
  "last_login",
  "actions",
];

// Define Zod validation schemas for each step
const schema = z.object({
  business_name: z
    .string()
    .min(2, "Business name Should be at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "Business name must contain only letters"),
  pan_no: z
    .string()
    .min(10, "PAN number Should be 10 digits")
    .regex(/^[A-Z0-9]+$/, "PAN number must be uppercase and alphanumeric"),
  gst_no: z
    .string()
    .min(5, "GST number Should be 5 digits")
    .regex(/^[A-Z0-9]+$/, "GST number must be uppercase and alphanumeric"),
  dlt_entity_id: z
    .string()
    .min(5, "CIN No. must be at least 5 characters")
    .regex(/^\d+$/, "CIN No. must contain only numbers"),

  address: z.string().min(5, "Address Should be at least 5 characters"),
  city: z.string().min(2, "City should be at least 2 characters"),
  state: z.string().min(2, "State should be at least 2 characters"),

  // pin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits"),
  country: z.string().min(2, "Country should be at least 2 characters"),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_no: z.string().min(10, "Phone number is required"),
  rel_mng_name: z.string().min(2, "Relationship manager name is required"),
  rel_mng_phone: z
    .string()
    .min(10, "Relationship manager phone number is required"),
  rel_mng_email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  auto_add_credits: z.boolean(),
});
export default function SubAccountsTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [organizatonName, setOrganizationName] = useState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [page, setPage] = React.useState(1);
  const token = localStorage.getItem("token");
  const hasSearchFilter = Boolean(filterValue);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  const subAccountStore = useSubAccountStore();

  const validateValues = () => {
    try {
      schema.parse(subAccountStore);

      setSaveButtonDisabled(false); // Enable Next button
    } catch (error) {
      console.log("error in validate", error.message);
      if (error instanceof z.ZodError) {
        setSaveButtonDisabled(true); // Disable Next button
      }
    }
  };

  // zustand store

  const {
    userId,
    business_name,
    email,
    password,
    first_name,
    last_name,
    phone_no,
    role,
    max_sub_acc,
    rel_mng_name,
    rel_mng_phone,
    rel_mng_email,
    pan_no,
    gst_no,
    dlt_entity_id,
    address,
    city,
    state,
    pin,
    country,
    url,
    status,
    avatar_value,
    avatar_type,
    // sms service pricing
    sms_promo_credits,
    sms_promo_credits_billing_on,
    sms_transactional_rates,
    sms_transactional_rates_billing_on,
    sms_otp_credits,
    sms_otp_credits_billing_on,
    sms_global_credits,
    sms_global_credits_billing_on,
    sms_billing_method,
    // RCS pricing parameters
    rcs_text_credits,
    rcs_text_credits_billing_on,
    rcs_multimedia_credits,
    rcs_multimedia_credits_billing_on,
    rcs_billing_method,
    // WhatsApp pricing parameters
    marketing_rate,
    marketing_rate_billing_on,
    utility_rate,
    utility_rate_billing_on,
    authentication_rate,
    authentication_rate_billing_on,
    service_rate,
    service_rate_billing_on,
    whatsapp_billing_method,
    // Email service pricing parameters
    email_promo_credits,
    email_promo_credits_billing_on,
    email_transactional_rates,
    email_transactional_rates_billing_on,
    email_email_billing_method,
    // credit and history parameters
    auto_add_credits,

    // setter
    setUserId,
    setBusinessName,
    setEmail,
    setPassword,
    setFirstName,
    setLastName,
    setPhoneNo,
    setMaxSubAcc,
    setRelMngName,
    setRelMngPhone,
    setRelMngEmail,
    setPanNo,
    setGstNo,
    setDltEntityId,
    setAddress,
    setCity,
    setState,
    setPin,
    setCountry,
    setUrl,
    setStatus,
    setAvatarType,
    setAvatarValue,
    // Setters for SMS service pricing
    setSmsPromoCredits,
    setSmsPromoCreditsBillingOn,
    setSmsTransactionalRates,
    setSmsTransactionalRatesBillingOn,
    setSmsOtpCredits,
    setSmsOtpCreditsBillingOn,
    setSmsGlobalCredits,
    setSmsGlobalCreditsBillingOn,

    // Setters for RCS pricing parameters
    setRcsTextCredits,
    setRcsTextCreditsBillingOn,
    setRcsMultimediaCredits,
    setRcsMultimediaCreditsBillingOn,
    // Setters for WhatsApp pricing parameters
    setMarketingRate,
    setMarketingRateBillingOn,
    setUtilityRate,
    setUtilityRateBillingOn,
    setAuthenticationRate,
    setAuthenticationRateBillingOn,
    setServiceRate,
    setServiceRateBillingOn,

    // Setters for Email service pricing parameters
    setEmailPromoCredits,
    setEmailPromoCreditsBillingOn,
    setEmailTransactionalRates,
    setEmailTransactionalRatesBillingOn,
    setAutoAddCredits,
    resetSubAccounts,
  } = useSubAccountStore();

  // Validate form when inputs change
  useEffect(() => {
    validateValues();
  }, [subAccountStore]);
  // fetch subaccounts data
  const fetchData = async () => {
    try {
      // get token from localstorage
      const token = localStorage.getItem("token");

      const search = filterValue;
      const status = statusFilter === "all" ? statusFilter : [...statusFilter];

      const response = await getSubAccountsService(
        page,
        rowsPerPage,
        token,
        status,
        search
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
    fetchData();
  }, [
    page,
    rowsPerPage,
    filterValue,
    statusFilter,
    visibleColumns,
    sortDescriptor,
  ]);

  // Handle modal Open
  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    resetSubAccounts();
    onOpen();
  };

  // configure modal open

  const configureModalOpen = async (selectedUser) => {
    // reset previous selection
    resetSubAccounts();
    // configure modal open
    openModal("configure");
    // set selected user
    setSelectedUser(selectedUser);
    setUserId(selectedUser.user_id);
    try {
      // call get subaccounts details
      const response = await getSubAccountByUserIdService(selectedUser.user_id);
      if (response.status === "SUCCESS") {
        //extract data and set in state

        // user
        const {
          password,
          status,
          max_sub_acc,
          rel_mng_name,
          rel_mng_email,
          rel_mng_phone,
          avatar_value,
          avatar_type,
          users,
        } = response.data;

        const {
          email,
          first_name,
          last_name,
          phone_no,
          company_details,
          sms_pricing,
          rcs_pricing,
          whatsapp_pricing,
          email_pricing,
          credit_history,
        } = users;

        // comapny details
        const {
          address,
          business_name,
          city,
          country,
          dlt_entity_id,
          gst_no,
          pan_no,
          pin,
          state,
          url,
        } =
          company_details && company_details.length > 0
            ? company_details[0]
            : {};

        // sms pricing
        const smsPriceResponse =
          sms_pricing && sms_pricing.length > 0 ? sms_pricing[0] : {};
        // rcs pricing
        const rcsPriceResponse =
          rcs_pricing && rcs_pricing.length > 0 ? rcs_pricing[0] : {};
        // whatsapp pricing
        const whatsappPriceResponse =
          whatsapp_pricing && whatsapp_pricing.length > 0
            ? whatsapp_pricing[0]
            : {};
        // whatsapp pricing
        const emailPriceResponse =
          email_pricing && email_pricing.length > 0 ? email_pricing[0] : {};

        // credit and history
        const { auto_add_credits } =
          credit_history && credit_history.length > 0 ? credit_history[0] : {};

        // set responses
        setAvatarType(avatar_type);
        setAvatarValue(
          avatar_value || `${first_name}${last_name ? " " : ""}${last_name}`
        );
        setPassword(password);
        setEmail(email);
        setMaxSubAcc(max_sub_acc);
        setRelMngName(rel_mng_name);
        setRelMngEmail(rel_mng_email);
        setRelMngPhone(rel_mng_phone);
        setFirstName(first_name);
        setLastName(last_name);
        setPhoneNo(phone_no);
        setBusinessName(business_name);
        setAddress(address);
        setCity(city);
        setCountry(country);
        setDltEntityId(dlt_entity_id);
        setGstNo(gst_no);
        setPanNo(pan_no);
        setPin(pin);
        setState(state);
        setUrl(url && url.replace(/^https?:\/\//, ""));
        setStatus(status);
        setSmsGlobalCredits(smsPriceResponse.global_credits);
        setSmsGlobalCreditsBillingOn(
          smsPriceResponse.global_credits_billing_on
        );
        setSmsOtpCredits(smsPriceResponse.otp_credits);
        setSmsOtpCreditsBillingOn(smsPriceResponse.otp_credits_billing_on);
        setSmsGlobalCreditsBillingOn(smsPriceResponse.otp_credits_billing_on);
        setSmsPromoCredits(smsPriceResponse.promo_credits);
        setSmsPromoCreditsBillingOn(smsPriceResponse.promo_credits_billing_on);
        setSmsTransactionalRates(smsPriceResponse.transactional_rates);
        setSmsTransactionalRatesBillingOn(
          smsPriceResponse.transactional_rates_billing_on
        );

        setRcsTextCredits(rcsPriceResponse.rcs_text_credits);
        setRcsTextCreditsBillingOn(
          rcsPriceResponse.rcs_text_credits_billing_on
        );
        setRcsMultimediaCredits(rcsPriceResponse.rcs_multimedia_credits);
        setRcsMultimediaCreditsBillingOn(
          rcsPriceResponse.rcs_multimedia_credits_billing_on
        );
        setMarketingRate(whatsappPriceResponse.marketing_rate);
        setMarketingRateBillingOn(
          whatsappPriceResponse.marketing_rate_billing_on
        );
        setUtilityRate(whatsappPriceResponse.utility_rate);
        setUtilityRateBillingOn(whatsappPriceResponse.utility_rate_billing_on);
        setAuthenticationRate(whatsappPriceResponse.authentication_rate);
        setAuthenticationRateBillingOn(
          whatsappPriceResponse.authentication_rate_billing_on
        );
        setServiceRate(whatsappPriceResponse.service_rate);
        setServiceRateBillingOn(whatsappPriceResponse.service_rate_billing_on);

        setEmailPromoCredits(emailPriceResponse.promo_credits);
        setEmailPromoCreditsBillingOn(
          emailPriceResponse.promo_credits_billing_on
        );
        setEmailTransactionalRates(emailPriceResponse.transactional_rates);
        setEmailTransactionalRatesBillingOn(
          emailPriceResponse.transactional_rates_billing_on
        );
        setAutoAddCredits(auto_add_credits);
      } else {
        console.log("error", response.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // configure/update account handller
  const configureUpdateHandller = async () => {
    try {
      const formData = {
        user_id: selectedUser.user_id,
        business_name,
        email,
        password,
        first_name,
        last_name,
        phone_no,
        role,
        status,
        max_sub_acc,
        rel_mng_name,
        rel_mng_phone,
        rel_mng_email,
        pan_no,
        gst_no,
        dlt_entity_id,
        address,
        city,
        state,
        pin,
        country,
        url,
        // sms service pricing
        sms_promo_credits,
        sms_promo_credits_billing_on,
        sms_transactional_rates,
        sms_transactional_rates_billing_on,
        sms_otp_credits,
        sms_otp_credits_billing_on,
        sms_global_credits,
        sms_global_credits_billing_on,
        sms_billing_method,
        // RCS pricing parameters
        rcs_text_credits,
        rcs_text_credits_billing_on,
        rcs_multimedia_credits,
        rcs_multimedia_credits_billing_on,
        rcs_billing_method,

        // WhatsApp pricing parameters
        marketing_rate,
        marketing_rate_billing_on,
        utility_rate,
        utility_rate_billing_on,
        authentication_rate,
        authentication_rate_billing_on,
        service_rate,
        service_rate_billing_on,
        whatsapp_billing_method,
        // Email service pricing parameters
        email_promo_credits,
        email_promo_credits_billing_on,
        email_transactional_rates,
        email_transactional_rates_billing_on,
        email_email_billing_method,
        // credit and history parameters
        auto_add_credits,
      };

      const resposne = await configureUpdateService(formData, token);
      if (resposne.status === "SUCCESS") {
        addToast({
          color: "success",
          title: "Account configure successfully",
        });
        onClose();
        fetchData();
      } else {
        addToast({
          color: "danger",
          title: "Account configure failed!",
        });
      }
    } catch (error) {
      addToast({
        color: "danger",
        title: "Account configuration error!",
      });
    }
  };

  // purg account handller
  const purgeHandller = async () => {
    // matched enter organization name and existing organizatin name
    if (selectedUser?.company.trim() === organizatonName.trim()) {
      console.log("selectedUser", selectedUser);
      try {
        const resonse = await purgSubAccountService(selectedUser.user_id);
        if (resonse.status === "SUCCESS") {
          addToast({
            color: "success",
            title: "Account purge successfully",
          });

          onClose();
          fetchData();
        }
      } catch (error) {
        addToast({
          color: "danger",
          title: "Account purge failed",
        });
      }
    } else {
      console.log(
        "Organization name not matched your entered organization name"
      );
    }
  };

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

  const pages = Math.ceil(totalRecords / rowsPerPage);

  const sortedItems = React.useMemo(() => {
    return [...users].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, users]);

  // login as handller
  const loginAsUserHandller = async (user) => {
    try {
      const loginData = {
        email: user.email,
        user_id: user.user_id,
        phone_no: user.phone_no,
      };

      const response = await loginSubAccountService(loginData, token);

      if (response.status === "SUCCESS") {
        localStorage.setItem("loginUser_id", response.user.id); // handling for chat
        localStorage.setItem("token", response.token);
        localStorage.setItem("first_name", response.user.first_name);
        localStorage.setItem("last_name", response.user.last_name);
        localStorage.setItem("role", response.user.role);
        localStorage.setItem("avatar_type", response.user.avatar_type);
        localStorage.setItem("avatar_value", response.user.avatar_value);
        localStorage.setItem("user_id", response.user.id);

        navigate("/");
      } else {
        console.log("login failed", response.message);
      }
    } catch (error) {
      console.log("loginError", error);
    }

    console.log("user", user);
  };

  // render cell
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex gap-2 items-center">
            <AvatarIndex
              isEditable={false}
              avatarType="character"
              borderColor="red"
              value={cellValue}
              size={35}
            />

            <p className="text-bold text-small">{cellValue}</p>
          </div>
        );
      case "company":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
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
                {/* Configure */}
                <DropdownItem
                  startContent={
                    <Icon icon="fluent:building-people-24-regular" width={23} />
                  }
                  key="view"
                  onClick={() => configureModalOpen(user)}
                >
                  {t("Configure")}
                </DropdownItem>
                {/* Login as */}
                <DropdownItem
                  startContent={<Icon icon="ic:round-login" width={23} />}
                  onPress={() => loginAsUserHandller(user)}
                  key="loginas"
                  color="primary"
                  variant="bordered"
                  className="text-primary"
                >
                  {t("Login as")}
                </DropdownItem>
                {/* Purge all */}
                <DropdownItem
                  startContent={
                    <Icon icon="iconamoon:trash-light" width={23} />
                  }
                  key="delete"
                  color="danger"
                  variant="bordered"
                  className="text-danger"
                  onPress={() => openModal("delete", user)}
                >
                  {t("Purge all data")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
            className="w-[20%]"
            // className="w-[20%] sm:max-w-[44%]"
            placeholder={`${t("Search")}...`}
            startContent={
              <Icon icon="majesticons:search-line" width={"1.2em"} />
            }
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />

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
                  {t("Status")}
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

            {/* Add account btn */}
            <Button
              variant="flat"
              color="success"
              startContent={<Icon icon="memory:plus" width={20} />}
              onClick={() => openModal("addaccount")}
            >
              {t("Add SubAccount")}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t("Total")} {totalRecords} {t("subaccounts")}
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

        {/* Add SubAccount Modal Rendering */}
        {modalType === "addaccount" && isOpen && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            size="5xl"
            backdrop="blur"
            className=" py-6 px-4"
          >
            <ModalContent>
              {(onClose) => (
                <ModalContent>
                  <ModalHeader className="flex flex-col gap-1">
                    {t("Add SubAccount")}
                  </ModalHeader>
                  <ModalBody>
                    {/* Tab Switcher */}
                    <AddTabSwitcher
                      onClose={onClose}
                      fetchTableData={fetchData}
                    />
                  </ModalBody>
                  {/* <Divider /> */}
                  {/* <ModalFooter>
                    <Button
                      size="md"
                      color="none"
                      variant="light"
                      onPress={onClose}
                    >
                      Discard
                    </Button>
                    <Button
                      size="md"
                      variant="flat"
                      color="success"
                      onPress={onClose}
                    >
                      Add
                    </Button>
                  </ModalFooter> */}
                </ModalContent>
              )}
            </ModalContent>
          </Modal>
        )}

        {/*  Modal rendering */}
        {modalType === "configure" && isOpen && (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
            size="5xl"
            // className="h-[70vh]"
          >
            <ModalContent>
              {(onClose) => (
                <ModalContent>
                  <ModalHeader className="flex flex-col gap-1">
                    <div className="flex text-xl text-default-700 gap-1 items-center">
                      <Icon
                        icon="fluent:building-people-24-regular"
                        width={30}
                      />
                      {t("Configure User")}
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    {/* Tab Switcher */}
                    <TabSwitcher />
                  </ModalBody>
                  <ModalFooter className="flex flex-col gap-4">
                    {/* Divider */}
                    <Divider />

                    <div className="flex justify-end gap-2">
                      <Button
                        size="md"
                        color="danger"
                        variant="light"
                        onPress={onClose}
                      >
                        Discard
                      </Button>
                      <Button
                        size="md"
                        variant="flat"
                        color="success"
                        isDisabled={saveButtonDisabled}
                        onPress={configureUpdateHandller}
                      >
                        {t("Save")}
                      </Button>
                    </div>
                  </ModalFooter>
                </ModalContent>
              )}
            </ModalContent>
          </Modal>
        )}

        {/* Purge Confirmation Modal */}
        {modalType === "delete" && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            size="lg"
            backdrop="blur"
          >
            <ModalContent>
              {(onClose) => (
                <ModalContent>
                  <ModalHeader>
                    <Icon
                      icon="ph:warning-duotone"
                      width="30"
                      height="30"
                      className="mr-1"
                      style={{ color: "#d51e1e" }}
                    />
                    {t("Confirmation")}
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      {/* Show name */}
                      This irreversable action will destroy all data related to
                      <b> {selectedUser?.company}</b> organization. Are you sure
                      you want to proceed?
                    </p>

                    {/* Input org name to confirm */}
                    <Input
                      color="danger"
                      variant="bordered"
                      placeholder="Organization Name"
                      onChange={(e) => setOrganizationName(e.target.value)}
                      description="Enter organization name to confirm"
                      size="md"
                      radius="sm"
                    />
                    {/* <span>
                      {selectedUser?.company} <br /> {organizatonName}
                    </span> */}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      size="md"
                      color="none"
                      variant="light"
                      onPress={onClose}
                    >
                      {t("Discard")}
                    </Button>
                    <Button
                      // Disable true if organization name is not matched
                      isDisabled={
                        !organizatonName ||
                        organizatonName !== selectedUser?.company
                      }
                      size="md"
                      variant="flat"
                      color="danger"
                      onPress={purgeHandller}
                      // onPress={onClose}
                    >
                      {t("Purge")}
                    </Button>
                  </ModalFooter>
                </ModalContent>
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
    isOpen,
    organizatonName,
    subAccountStore,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${users.length} ${t("of")} ${totalRecords} ${t("selected")}`}
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
    <>
      <Table
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
        // selectionMode="multiple"
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
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
