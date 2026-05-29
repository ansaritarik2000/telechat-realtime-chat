import React, { useState } from "react";
import {
    Input,
    Checkbox,
    Select,
    SelectItem,
    Button,
    Divider,
    addToast,
} from "@heroui/react";
import AuditTable from "./AuditTable/Index";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
import ServiceTabsSwitcher from "./ServiceTabs/TabsSwitcher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { updateSecurityAlertService } from "../../../../services/profile/profileService";

// Validation Schema using Zod
const securitySchema = z.object({
    twoFactorAuthRoute: z.enum(["sms", "email", "whatsapp"], {
        required_error: "Please select an authentication method.",
    }),
    balanceThreshold: z
        .string()
        .min(1, "Balance threshold is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid number"),
    notifyVia: z.enum(["sms", "email", "whatsapp"], {
        required_error: "Please select a notification method.",
    }),
});

export default function Security() {
    const { t } = useTranslation();
    const token = localStorage.getItem("token");

    const toggleAuth = (selectedAuth) => {
        setTwoFactorAuthRoute(selectedAuth);
    };
    // React Hook Form
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(securitySchema),
        mode: "onChange",
    });

    const twoFactorAuthRoute = watch("twoFactorAuthRoute");
    const balanceThreshold = watch("balanceThreshold");
    const notifyVia = watch("notifyVia");

    // React Query Mutation
    const mutation = useMutation({
        mutationFn: (data) => updateSecurityAlertService(data, token),
        onSuccess: (response) => {
            addToast({
                color: "success",
                title: "Security settings updated successfully!",
            });
        },
        onError: (error) => {
            addToast({
                color: "danger",
                title: "Failed to update security settings",
            });
            console.error("Update Failed:", error);
        },
    });

    // Form Submission
    const onSubmit = (data) => {
        const formatedData = {
            ...data,
            two_fact_auth_via: twoFactorAuthRoute,
            balance_drop_notify_via: notifyVia,
            droppable_balance: balanceThreshold,
        };
        mutation.mutate(formatedData);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full py-10 px-12 flex flex-col gap-6 border-2 dark:border-content2 rounded-lg shadow-md">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6 w-4/5 rounded-xl">
                    {/* Two-Factor Authentication */}
                    <div className="flex gap-1 items-center">
                        <Icon
                            icon="fluent-emoji:locked-with-key"
                            width="26"
                            height="26"
                            className="text-default"
                        />
                        <p>
                            {t("Enable Two Factor Authentication")}{" "}
                            <span className="text-danger text-lg">∗</span>
                        </p>

                        <Select
                            isRequired
                            className="max-w-[200px]"
                            size="sm"
                            radius="sm"
                            {...register("twoFactorAuthRoute")}>
                            <SelectItem key="sms">SMS</SelectItem>
                            <SelectItem key="email">Email</SelectItem>
                            <SelectItem key="whatsapp">Whatsapp</SelectItem>
                        </Select>
                    </div>
                    {errors.twoFactorAuthRoute && (
                        <p className="text-red-500 text-sm">
                            {errors.twoFactorAuthRoute.message}
                        </p>
                    )}

                    {/* Balance Alert */}
                    <div className="flex gap-1 items-center">
                        <Icon
                            icon="fluent-emoji:bell"
                            width="24"
                            height="24"
                            className="text-default"
                        />
                        <p>
                            {t("Notify me when balance drops to")}{" "}
                            <span className="text-danger text-lg">∗</span>
                        </p>

                        <Input
                            size="sm"
                            type="number"
                            className="max-w-[140px]"
                            placeholder="0.00"
                            {...register("balanceThreshold")}
                            startContent={
                                <span className="text-default-400 text-small">
                                    ₹
                                </span>
                            }
                        />
                        {errors.balanceThreshold && (
                            <p className="text-red-500 text-sm">
                                {errors.balanceThreshold.message}
                            </p>
                        )}

                        <span className="px-1">{t("via")}</span>

                        <Select
                            isRequired
                            className="max-w-[200px]"
                            size="sm"
                            radius="sm"
                            {...register("notifyVia")}>
                            <SelectItem key="sms">SMS</SelectItem>
                            <SelectItem key="email">Email</SelectItem>
                            <SelectItem key="whatsapp">Whatsapp</SelectItem>
                        </Select>
                    </div>
                    {errors.notifyVia && (
                        <p className="text-red-500 text-sm">
                            {errors.notifyVia.message}
                        </p>
                    )}

                    {/* Save Button */}
                    <Button
                        type="submit"
                        className="w-fit self-end"
                        size="md"
                        variant="ghost"
                        color="primary"
                        radius="sm"
                        isDisabled={!isValid}>
                        {mutation.isLoading ? "Saving..." : t("Save Changes")}
                    </Button>
                </form>

                <Divider />

                <ServiceTabsSwitcher />
            </div>

            {/* Audit Table */}
            <AuditTable />
        </div>
    );
}
