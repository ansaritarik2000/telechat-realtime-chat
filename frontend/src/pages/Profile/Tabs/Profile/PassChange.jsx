import React, { useEffect, useState } from "react";
import { Input, Button, addToast } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
import { updatePasswordService } from "../../../../services/profile/profileService";
import { useProfileStore } from "../../../../store/profile/profileStore";
import PassStrengthChecker from "./PassStrengthChecker";

export default function PasswordChange() {
    const { t } = useTranslation();
    const [isVisibleOld, setIsVisibleOld] = useState(false);
    const [isVisibleNew, setIsVisibleNew] = useState(false);
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(""); // New error state

    const { isPasswordChanged, setIsPasswordChanged } = useProfileStore();
    const token = localStorage.getItem("token");

    useEffect(() => {
        setIsPasswordChanged(false);
    }, []);

    const handleUpdatePassword = async () => {
        // Validate inputs
        if (!oldPassword || !newPassword || !confirmPassword) {
            addToast({
                color: "danger",
                title: "All fields are required.",
            });

            return;
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError(
                "New Password and Confirm Password do not match."
            );
            return;
        } else {
            setConfirmPasswordError("");
        }

        // Call the update password service
        const response = await updatePasswordService(
            { oldPassword, newPassword },
            token
        );

        if (response.status === "SUCCESS") {
            addToast({
                color: "success",
                title: "Password updated successfully.",
            });
            setNewPassword("");
            setOldPassword("");
            setConfirmPassword("");
            setIsPasswordChanged(false);
        } else {
            addToast({
                color: "danger",
                title: "Failed to update password.",
            });
        }
    };

    return (
        <div className="flex flex-col gap-4 border dark:border-content2 rounded-lg p-10">
            {/* Old Password */}
            <Input
                isRequired
                label={t("Old Password")}
                onChange={(e) => {
                    setOldPassword(e.target.value);
                    setIsPasswordChanged(true);
                }}
                value={oldPassword}
                type={isVisibleOld ? "text" : "password"}
                size="sm"
                variant="flat"
                radius="sm"
                endContent={
                    <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => setIsVisibleOld(!isVisibleOld)}>
                        <Icon
                            icon={
                                isVisibleOld
                                    ? "ant-design:eye-invisible-filled"
                                    : "ant-design:eye-filled"
                            }
                            className="text-2xl text-default-400 pointer-events-none"
                        />
                    </button>
                }
            />

            {/* New Password */}
            <Input
                isRequired
                label={t("New Password")}
                type={isVisibleNew ? "text" : "password"}
                onChange={(e) => {
                    setIsPasswordChanged(true);
                    setNewPassword(e.target.value);
                }}
                value={newPassword}
                size="sm"
                variant="flat"
                radius="sm"
                description={
                    !isPasswordFocused ? (
                        t(
                            "Please add all necessary characters to create a safe password"
                        )
                    ) : (
                        <PassStrengthChecker password={newPassword} />
                    )
                }
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                endContent={
                    <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => setIsVisibleNew(!isVisibleNew)}>
                        <Icon
                            icon={
                                isVisibleNew
                                    ? "ant-design:eye-invisible-filled"
                                    : "ant-design:eye-filled"
                            }
                            className="text-2xl text-default-400 pointer-events-none"
                        />
                    </button>
                }
            />

            {/* Confirm New Password */}
            <div className="flex flex-col">
                <Input
                    isRequired
                    label={t("Confirm New Password")}
                    onChange={(e) => {
                        setIsPasswordChanged(true);
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordError(""); // Clear error on change
                    }}
                    value={confirmPassword}
                    type={isVisibleConfirm ? "text" : "password"}
                    size="sm"
                    variant="flat"
                    radius="sm"
                    status={confirmPasswordError ? "error" : "default"} // Set error style
                    endContent={
                        <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() =>
                                setIsVisibleConfirm(!isVisibleConfirm)
                            }>
                            <Icon
                                icon={
                                    isVisibleConfirm
                                        ? "ant-design:eye-invisible-filled"
                                        : "ant-design:eye-filled"
                                }
                                className="text-2xl text-default-400 pointer-events-none"
                            />
                        </button>
                    }
                />
                {confirmPasswordError && (
                    <p className="text-red-500 text-sm mt-1">
                        {confirmPasswordError}
                    </p>
                )}
            </div>

            {/* Update Button */}
            <div className="flex justify-end">
                <Button
                    isDisabled={!isPasswordChanged}
                    radius="sm"
                    variant="flat"
                    color={"success"}
                    onPress={handleUpdatePassword}>
                    {t("Update Password")}
                </Button>
            </div>
        </div>
    );
}
