import React, { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { PhoneInput } from "../../components/phone-input";

const description = (
    <>
        <span className="text-red-500">*</span> The verification code will be
        sent to this number.
    </>
);

export default function PhoneVerification({ backAction }) {
    const [timer, setTimer] = useState(60);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [phone, setPhone] = useState("");
    const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isVarified, setIsVarified] = useState(false);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("Sunil Kumar");
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const { t } = useTranslation();
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (isCodeSent) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, isCodeSent]);

    const handleSendCode = (e) => {
        e.preventDefault();
        // Logic to send the code goes here
        setIsCodeSent(true);
        setTimer(30); // Reset timer to 30 seconds
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        // Logic to verify the entered code goes here
        console.log("Verifying code:", verificationCode.join(""));
    };

    const handleCodeChange = (index, value) => {
        const newCode = [...verificationCode];
        newCode[index] = value.slice(-1); // Keep only the last character
        setVerificationCode(newCode);

        // Move to the next input box
        if (value && index < 3) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {!isCodeSent && <PhoneInput countryDialCode={"+91"} />}

            {isCodeSent && !isVarified && (
                <p className="text-default-500 text-sm">
                    We have sent a verification code to your mobile number
                </p>
            )}

            <div className="flex flex-col gap-3">
                {!isCodeSent && (
                    <Button
                        variant="shadow"
                        radius="sm"
                        color="success"
                        type="submit"
                        className="text-white"
                        onClick={handleSendCode}>
                        Send Code
                    </Button>
                )}
                {isCodeSent && !isVarified ? (
                    <>
                        <div className="flex w-full gap-8 justify-center">
                            {/* <InputOtp
                                length={4}
                                variant={"faded"}
                                size="lg"
                                isInvalid={isInvalid}
                                errorMessage="Invalid OTP code"
                            /> */}
                        </div>

                        {/* Resend Code */}
                        <div className="flex justify-between mt-3 gap-1">
                            <p className="text-default-400 text-xs">
                                {timer > 0
                                    ? `You can resend in ${timer} seconds.`
                                    : "Didn’t receive the code?"}
                            </p>

                            {timer === 0 && (
                                <p
                                    className="text-primary-400 text-xs cursor-pointer"
                                    onClick={handleSendCode} // Allow resending the code
                                >
                                    Resend Code
                                </p>
                            )}
                        </div>
                    </>
                ) : isVarified ? (
                    <>
                        <Input
                            className="w-full hover:cursor-not-allowed"
                            color="primary"
                            radius="sm"
                            label="Username"
                            value={username}
                            isDisabled
                        />
                        {/* Password */}
                        <Input
                            isRequired
                            label={t("Enter new password")}
                            endContent={
                                <button
                                    type="button"
                                    onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <Icon
                                            className="pointer-events-none text-2xl text-default-400"
                                            icon="solar:eye-closed-linear"
                                        />
                                    ) : (
                                        <Icon
                                            className="pointer-events-none text-2xl text-default-400"
                                            icon="solar:eye-bold"
                                        />
                                    )}
                                </button>
                            }
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={isVisible ? "text" : "password"}
                            size="sm"
                            variant="flat"
                            className="w-full"
                            radius="sm"
                        />
                        <PasswordStrengthIndicator password={password} />
                    </>
                ) : null}

                {isVarified ? (
                    <Button
                        variant="flat"
                        color="success"
                        radius="sm"
                        onClick={backAction}
                        className="mt-4  hover:bg-content3">
                        Update
                    </Button>
                ) : (
                    <Button
                        variant="faded"
                        radius="sm"
                        onClick={backAction}
                        className="mt-4  hover:bg-content3"
                        startContent={
                            <Icon icon="solar:arrow-left-linear" width={18} />
                        }>
                        Back
                    </Button>
                )}
            </div>
        </div>
    );
}

{
    // Alt Phone Number Field
    /* <Input
          isRequired
          label="Enter your phone number"
          description={description}
          name="phone"
          type="tel"
          radius="sm"
          variant="bordered"
          size="lg"
          classNames={{
            inputWrapper: [
              "group-data-[focus=true]:border-success",
              "!cursor-text",
            ],
          }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        /> */
}

{
    // Verify Code Btn
    /* <Button
              variant="shadow"
              color="success"
              type="submit"
              radius="sm"
              className="text-white"
              onClick={handleVerifyCode}
            >
              Verify Code
            </Button> */
}
