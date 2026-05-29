import React, { useState } from "react";
import { Input, Checkbox, Button, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import GooglePayButton from "@google-pay/button-react";
import { saveTeleCreditsService } from "../../../services/telecredits/teleCreditsServices";
import toast from "react-hot-toast";
import { getWalletDetailsService } from "../../../services/wallet/getWalletService";
import { useWalletStore } from "../../../store/wallets/walletStore";

export default function TopupCard() {
    const [inrValue, setInrValue] = useState("");
    const [totalWithGST, setTotalWithGST] = useState("");
    const [teleCreditsValue, setTeleCreditsValue] = useState("");
    const { setWalletBalance } = useWalletStore();
    const token = localStorage.getItem("token");
    const calculateTotalWithGST = (amount) => {
        if (!isNaN(amount)) {
            const gstAmount = amount * 0.18; // Calculate 18% of the amount as GST
            const totalAmount = amount + gstAmount; // Calculate total amount including GST
            setTotalWithGST(totalAmount.toFixed(2)); // Set total with GST rounded to 2 decimal places

            const teleCreditsAmount = amount;
            setTeleCreditsValue(teleCreditsAmount.toFixed(2));
        } else {
            setTotalWithGST(""); // Clear total if input amount is invalid
            setTeleCreditsValue("");
        }
    };

    // get wallet balance
    const getWalletBalance = async () => {
        try {
            const response = await getWalletDetailsService(
                { user_id: localStorage.getItem("user_id") },
                token
            );

            if (response.status === "SUCCESS") {
                setWalletBalance(response.data.wallet_balance);
            } else {
                toast.error("Failed to get wallet balance!");
            }
        } catch (error) {
            toast.error("Error getting wallet balance:", error);
        }
    };
    // save telecredits
    const saveTeleCredits = async (paymentRequest) => {
        try {
            const params = {
                user_id: localStorage.getItem("user_id"),
                transaction_id:
                    paymentRequest?.transactionInfo?.transactionId ||
                    `tnx${new Date().getTime()}`, // this transaction id is currently hardcoded this will be removed
                topup_amount: inrValue,
                total_with_gst: totalWithGST,
                tele_credits: teleCreditsValue,
                status: "success", // this status is currently hardcoded this will be removed
                mode: "CARD", // this mode is currently hardcoded this will be removed
            };
            const response = await saveTeleCreditsService({ params, token });

            if (response.status === "SUCCESS") {
                toast.success("TeleCredits saved successfully!");
                getWalletBalance();
                setInrValue("");
                setTotalWithGST("");
                setTeleCreditsValue("");
            } else {
                toast.error("Failed to save TeleCredits!");
            }
        } catch (error) {
            toast.error("Error saving TeleCredits:", error);
        }
    };

    const handleInputChange = (e) => {
        const amount = parseFloat(e.target.value);
        setInrValue(e.target.value);
        calculateTotalWithGST(amount);
    };

    return (
        <div className="flex-1 h-full flex flex-col justify-center gap-6 shadow rounded-lg p-8 border border-success relative">
            <div className="absolute top-10 right-[50px] h-30 w-30">
                <Image
                    src="telecredits-moneystack.png"
                    className=""
                    width={150}
                />
            </div>
            <h1 className="text-2xl font-bold ">Top up</h1>
            <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center gap-2">
                    <div className="w-1/2">
                        <span className="text-sm">Amount</span>
                        <Input
                            type="number"
                            className="mt-1"
                            placeholder="0.00"
                            labelPlacement="outside"
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">
                                        ₨
                                    </span>
                                </div>
                            }
                            size="md"
                            value={inrValue}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="w-1/2 mr-4">
                        <span className="text-sm">
                            Payable Amount{" "}
                            <span className="text-xs text-default-400">
                                (incl. GST 18%)
                            </span>
                        </span>
                        <Input
                            isReadOnly
                            className="mt-1"
                            placeholder="0.00"
                            labelPlacement="outside"
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">
                                        Rs
                                    </span>
                                </div>
                            }
                            size="md"
                            color="success"
                            value={totalWithGST}
                        />
                    </div>
                    <div className="w-1/2">
                        <span className="text-sm">TeleCredits</span>
                        <Input
                            readOnly
                            className="mt-1"
                            size="md"
                            variant="flat"
                            value={teleCreditsValue}
                            color="primary"
                            startContent={
                                <Icon
                                    icon="bitcoin-icons:lightning-circle-outline"
                                    width={30}
                                />
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <div>
                    <div className="text-sm flex justify-between items-center -ml-1">
                        <Icon
                            icon="iconamoon:shield-yes-duotone"
                            width="25px"
                            height="25px"
                            style={{ color: "#17c964" }}
                            className="ml-0"
                        />
                        <span className="text-default-400">
                            Your data is securely protected
                        </span>
                    </div>
                    <Checkbox defaultSelected color="success" size="sm">
                        I agree with
                        <span className="text-blue-500">
                            {" "}
                            terms & conditions
                        </span>
                    </Checkbox>
                </div>
                {/* <Button
                    color="success"
                    size="md"
                    className="text-white"
                    variant="solid"
                    radius="full"
                    endContent={
                        <Icon
                            icon="charm:paper-plane"
                            width="1.5em"
                            height="1.5em"
                        />
                    }>
                    Proceed to payment
                </Button> */}

                <div className="mt-4">
                    <GooglePayButton
                        environment="TEST"
                        paymentRequest={{
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            allowedPaymentMethods: [
                                {
                                    type: "CARD",
                                    parameters: {
                                        allowedAuthMethods: [
                                            "PAN_ONLY",
                                            "CRYPTOGRAM_3DS",
                                        ],
                                        allowedCardNetworks: [
                                            "VISA",
                                            "MASTERCARD",
                                            "DISCOVER",
                                        ],
                                    },
                                    tokenizationSpecification: {
                                        type: "PAYMENT_GATEWAY",
                                        parameters: {
                                            gateway: "example",
                                        },
                                    },
                                },
                                // {
                                //     type: "UPI",
                                //     parameters: {
                                //         supportedMethods: ["upi"],
                                //     },
                                // },
                            ],
                            merchantInfo: {
                                merchantId: "12213123213", // Replace with your Merchant ID
                                merchantName: "Telepie Test",
                            },
                            transactionInfo: {
                                totalPriceStatus: "FINAL",
                                totalPriceLabel: "Total",
                                totalPrice: totalWithGST.toString(),
                                currencyCode: "INR",
                                countryCode: "IN",
                            },
                        }}
                        onLoadPaymentData={(paymentRequest) => {
                            console.log("Payment Success", paymentRequest);
                            saveTeleCredits(paymentRequest);
                        }}
                        buttonColor="black"
                        buttonType="pay"
                    />
                </div>
            </div>
        </div>
    );
}
