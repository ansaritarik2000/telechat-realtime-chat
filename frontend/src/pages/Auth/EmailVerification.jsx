import React, { useState, useEffect } from "react";
import { Button, Input, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { backend_base_url } from "../../services/common";

const description = (
    <>
        <span className="text-red-500">*</span> The reset link will be sent to
        this email address.
    </>
);

export default function EmailVerification({ backAction }) {
    const [timer, setTimer] = useState(60);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (isCodeSent) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, isCodeSent]);

    const handleSendResetLink = async (e) => {
        e.preventDefault();
        // Logic to send the reset link goes here
        try {
            const response = await fetch(
                `${backend_base_url}/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );
            if (response.ok) {
                addToast({
                    title: "Success 🎉",
                    description: "Reset link sent.",
                    color: "success",
                });
                setIsCodeSent(true); // Set to true once the link is sent
                setTimer(60); // Reset timer to 60 seconds
            } else {
                const data = await response.json();
                console.log(data);
            }
        } catch (error) {
            console.error("Error sending reset link:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {!isCodeSent ? (
                <>
                    <Input
                        isRequired
                        placeholder="Email Address1"
                        name="email"
                        type="email"
                        variant="flat"
                        size="lg"
                        radius="sm"
                        description={description}
                        classNames={{
                            inputWrapper: [
                                "group-data-[focus=true]:border-success",
                                "!cursor-text",
                            ],
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        startContent={
                            <Icon
                                icon="ic:round-email"
                                width={25}
                                className="text-default-400"
                            />
                        }
                    />
                    <Button
                        variant="shadow"
                        color="success"
                        type="submit"
                        radius="sm"
                        className="text-white"
                        onClick={handleSendResetLink}
                    >
                        Send Reset Link
                    </Button>
                </>
            ) : (
                <div className="flex flex-col  gap-4">
                    <p className="text-default-500 text-sm">
                        A reset link has been sent to {email}. Please check your
                        inbox!
                    </p>

                    <div className="flex justify-between ">
                        <p className="text-default-400 text-xs">
                            {timer > 0
                                ? `You can resend in ${timer} seconds. `
                                : "Didn’t receive the link? "}
                        </p>
                        {timer === 0 && (
                            <p
                                className="text-primary-400 text-xs cursor-pointer"
                                onClick={handleSendResetLink}
                            >
                                Resend Link
                            </p>
                        )}
                    </div>
                </div>
            )}
            <Button
                variant="faded"
                radius="sm"
                onClick={backAction}
                className="hover:bg-content3"
                startContent={
                    <Icon
                        className="hover:bg-content3"
                        icon="solar:arrow-left-linear"
                        width={18}
                    />
                }
            >
                Back
            </Button>
        </div>
    );
}
