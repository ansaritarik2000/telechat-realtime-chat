import React, { useEffect, useState } from "react";
import {
    Checkbox,
    Button,
    ButtonGroup,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Select,
    SelectItem,
    Input,
    Chip,
    Alert,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import TransactionTable from "./Table/Index";
import { useSubAccountStore } from "../../../../store/subAccount/subAccountStore";
import { getWalletDetailsService } from "../../../../services/wallet/getWalletService";
import {
    createTransactionService,
    getUserTransactionsService,
} from "../../../../services/Subaccount/subAccountService";
import { useWalletStore } from "../../../../store/wallets/walletStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreditsHistoryIndex() {
    const [selectedOption, setSelectedOption] = useState(new Set(["select"]));
    const { userId, auto_add_credits, setAutoAddCredits } =
        useSubAccountStore();
    const {
        wallet_balance: creatorWalletBalance,
        setWalletBalance: setCreatorWalletBalance,
    } = useWalletStore();
    const [showFields, setShowFields] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [serviceType, setServiceType] = useState("");
    const [amount, setAmount] = useState(0);
    const queryClient = useQueryClient();

    const token = localStorage.getItem("token");
    const creator_id = localStorage.getItem("user_id");

    // this  function is used to get user wallet balance
    const getUserWalletBalance = async (userId) => {
        try {
            const response = await getWalletDetailsService(
                { user_id: userId },
                token
            );

            setWalletBalance(response.data.wallet_balance);
        } catch (error) {
            addToast({
                color: "danger",
                title: "Error fetching wallet balance",
            });

            console.error("Error fetching wallet balance:", error);
        }
    };

    // this  function is used to get creator wallet balance
    const getCreatorWalletBalance = async (userId) => {
        try {
            const response = await getWalletDetailsService(
                { user_id: userId },
                token
            );

            setCreatorWalletBalance(response.data.wallet_balance);
        } catch (error) {
            addToast({
                color: "danger",
                title: "Error fetching creator wallet balance",
            });
        }
    };

    useEffect(() => {
        if (userId && token) {
            getUserWalletBalance(userId);
            getCreatorWalletBalance(creator_id);
        }
    }, [userId, token]);

    const labelsMap = {
        add: "Add TeleCredits",
        remove: "Deduct TeleCredits",
        select: "Select Action",
    };

    // Handle action type
    const handleActionType = () => {
        selectedOptionValue === "select"
            ? setShowFields(false)
            : setShowFields(true);
    };

    // Handle Select Action
    const handleSelectAction = () => {
        // Set color & fields based on select option
        if (selectedOptionValue === "add") {
            setShowFields(true);
        } else if (selectedOptionValue === "remove") {
            setShowFields(true);
        } else {
            setShowFields(false);
        }
    };

    // Handle Checkbox Selection
    const handleCheckboxSelection = () => {
        selectedOptionValue = "select";
        selectedOption(selectedOptionValue);
        setShowFields(false);
    };

    let selectedOptionValue = Array.from(selectedOption)[0];

    // Handle Create Transaction
    const { mutate: createTransaction } = useMutation({
        mutationFn: async ({
            type,
            userId,
            creator_id,
            serviceType,
            amount,
            token,
        }) => {
            const transactionData = {
                user_id: userId,
                creator_id,
                action_type: type,
                service_type: serviceType,
                amount: amount,
            };
            const response = await createTransactionService(
                transactionData,
                token
            );
            if (response.status !== "SUCCESS") {
                throw new Error("Failed to create transaction");
            }
            return response;
        },
        onSuccess: (_, { userId }) => {
            addToast({
                color: "success",
                title: "Transaction created successfully!",
            });

            // Invalidate relevant queries
            queryClient.invalidateQueries([
                "subaccountcreditTransaction",
                userId,
            ]);

            getCreatorWalletBalance(creator_id);
            getUserWalletBalance(userId);
        },
        onError: () => {
            addToast({
                color: "danger",
                title: "Error creating transaction",
            });
        },
    });

    const createTransactionHandller = (type) => {
        createTransaction({
            type,
            userId,
            creator_id,
            serviceType,
            amount,
            token,
        });
    };

    return (
        <div className="px-2 flex flex-col gap-4">
            {/* Checkbox & Description  */}
            <div className="flex flex-col gap-2">
                {/* Show Alert if the balance is insufficient */}
                {(selectedOptionValue === "add" &&
                    amount > creatorWalletBalance) ||
                (selectedOptionValue === "remove" && amount > walletBalance) ? (
                    <Alert
                        color="danger"
                        title="Insufficient Balance"
                        radius="sm"
                        className="w-full">
                        You do not have enough balance to complete this
                        transaction.
                    </Alert>
                ) : null}
                {/* Checkbox */}
                <Checkbox
                    defaultSelected={auto_add_credits}
                    size="md"
                    color="success"
                    // onValueChange={setIsCheckboxSelected}
                    onChange={(e) => setAutoAddCredits(e.target.checked)}>
                    Users can auto add credits via TeleCredits page
                </Checkbox>

                {/* Description */}
                {auto_add_credits && (
                    <div className="text-xs text-default-400 mt-1">
                        <p>
                            If disabled, account manager will have to add /
                            remove TeleCredits manually. The account manager
                            will be notified via mail upon low TeleCredits. The
                            low TeleCredit notification limit can be set in
                            Profile <span>{">"}</span> Security & Alert
                        </p>
                    </div>
                )}
            </div>

            {/* Conditional Render */}
            {!auto_add_credits && (
                <>
                    <div className="flex justify-between items-center ">
                        {/* Current Balance */}
                        {showFields == true ? (
                            <Chip
                                color="success"
                                variant="flat"
                                size="lg"
                                radius="sm"
                                className="py-5 px-y pl-4 cursor-pointer"
                                startContent={
                                    <Icon
                                        icon="lets-icons:wallet-duotone-line"
                                        width="1.4em"
                                        height="1.4em"
                                    />
                                }>
                                <div className="flex gap-1 items-center">
                                    <span>{walletBalance}</span>
                                </div>
                            </Chip>
                        ) : (
                            <div></div>
                        )}

                        {/* Drop down btn */}
                        <ButtonGroup variant="flat" className="self-end">
                            <Button onClick={handleActionType}>
                                {labelsMap[selectedOptionValue]}
                            </Button>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Button isIconOnly>
                                        <Icon
                                            icon="fluent:chevron-down-16-regular"
                                            width="1.2em"
                                            height="1.2em"
                                        />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Add or Deduct TeleCredits"
                                    selectedKeys={selectedOption}
                                    selectionMode="single"
                                    onSelectionChange={setSelectedOption}
                                    className="max-w-[300px]">
                                    <DropdownItem
                                        key="select"
                                        onClick={handleSelectAction}>
                                        {labelsMap["select"]}
                                    </DropdownItem>
                                    <DropdownItem
                                        key="add"
                                        onClick={handleSelectAction}>
                                        {labelsMap["add"]}
                                    </DropdownItem>
                                    <DropdownItem
                                        key="remove"
                                        onClick={handleSelectAction}>
                                        {labelsMap["remove"]}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </ButtonGroup>
                    </div>

                    {/* Input Field, Select & Button */}
                    {showFields && (
                        <div className="flex gap-2 items-center justify-between">
                            <div className="flex gap-2 items-center w-1/2">
                                {/* Amount Input Field */}
                                <Input
                                    isRequired
                                    label="Amount"
                                    variant="flat"
                                    radius="sm"
                                    size="sm"
                                    type="number"
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-1/2"
                                />
                                {/* Service Type */}
                                <Select
                                    isRequired
                                    label="Service Type"
                                    variant="flat"
                                    radius="sm"
                                    size="sm"
                                    onChange={(e) =>
                                        setServiceType(e.target.value)
                                    }
                                    className="w-1/2">
                                    <SelectItem key="sms">SMS</SelectItem>
                                    <SelectItem key="rcs">RCS</SelectItem>
                                    <SelectItem key="whatsapp">
                                        WhatsApp
                                    </SelectItem>
                                    <SelectItem key="email">Email</SelectItem>
                                </Select>
                            </div>

                            {/* Button with Add Icon */}
                            <Button
                                color={
                                    selectedOptionValue === "add"
                                        ? "success"
                                        : "primary"
                                }
                                onPress={() =>
                                    selectedOptionValue === "add"
                                        ? createTransactionHandller("add")
                                        : createTransactionHandller("deduct")
                                }
                                size="md"
                                variant="flat"
                                radius="sm"
                                isDisabled={
                                    (selectedOptionValue === "add" &&
                                        amount > creatorWalletBalance) ||
                                    (selectedOptionValue === "remove" &&
                                        amount > walletBalance)
                                }
                                className="py-6 px-8 text-md">
                                {selectedOptionValue === "add"
                                    ? "Top Up"
                                    : "Deduct"}
                            </Button>
                        </div>
                    )}

                    {/* Table */}
                    <TransactionTable />
                </>
            )}
        </div>
    );
}
