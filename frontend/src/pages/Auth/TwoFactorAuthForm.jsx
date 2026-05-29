import { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";

// Add this component to your codebase
const TwoFactorAuthForm = ({ email, phone, medium = "email" }) => {
    const [timer, setTimer] = useState(60);
    const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);

    // Mask email or phone for display
    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, "$1****$3")
        : "";
    const maskedPhone = phone
        ? phone.replace(/(\d{2})(\d+)(\d{2})/, "$1******$3")
        : "";

    // Determine which contact to display based on medium
    const contactDisplay = medium === "email" ? maskedEmail : maskedPhone;

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

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
            <p className="text-default-500 text-sm">
                A verification code has been sent to your{" "}
                {medium === "email"
                    ? "email"
                    : medium === "sms"
                    ? "phone"
                    : "WhatsApp"}
                <span className="font-semibold"> {contactDisplay}</span>. Please
                enter the code below to continue.
            </p>

            <div className="flex w-full gap-2 justify-center">
                {verificationCode.map((code, index) => (
                    <Input
                        key={index}
                        id={`code-input-${index}`}
                        value={code}
                        onChange={(e) =>
                            handleCodeChange(index, e.target.value)
                        }
                        maxLength={1}
                        className="w-12 h-12 text-center"
                        variant="flat"
                        size="lg"
                        radius="sm"
                    />
                ))}
            </div>

            <div className="flex justify-between mt-3">
                <p className="text-default-400 text-xs">
                    {timer > 0
                        ? `You can resend in ${timer} seconds.`
                        : "Didn't receive the code?"}
                </p>

                {timer === 0 && (
                    <p
                        className="text-primary-400 text-xs cursor-pointer"
                        onClick={() => setTimer(60)}
                    >
                        Resend Code
                    </p>
                )}
            </div>

            <Button
                variant="shadow"
                color="success"
                type="submit"
                radius="sm"
                className="text-white mt-2"
            >
                Verify
            </Button>
        </div>
    );
};
