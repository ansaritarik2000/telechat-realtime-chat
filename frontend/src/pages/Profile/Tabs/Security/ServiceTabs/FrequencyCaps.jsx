import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
    Slider,
    Button,
    Select,
    SelectItem,
    Tooltip,
    Input,
    addToast,
} from "@heroui/react";
import { updateFrequencyCapService } from "../../../../../services/profile/profileService";

// **Form Validation Schema using Zod**
const frequencyCapSchema = z.object({
    frequencyCap: z.number().min(10000, "Minimum value is 10,000"),
    frequencyBase: z.enum(["daily", "weekly"], {
        required_error: "Please select a frequency base",
    }),
    notifyVia: z.enum(["sms", "email", "whatsapp"], {
        required_error: "Please select a notification method",
    }),
});

export default function FrequencyCaps({ serviceType }) {
    const token = localStorage.getItem("token"); // Get token from auth state

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { isValid, errors },
    } = useForm({
        resolver: zodResolver(frequencyCapSchema),
        mode: "onChange", // Validate form on input change
        defaultValues: {
            frequencyCap: 10000, // Default value for slider
            frequencyBase: "", // No default value
            notifyVia: "", // No default value
        },
    });

    const frequencyCap = watch("frequencyCap");
    const frequencyBase = watch("frequencyBase");
    const notifyVia = watch("notifyVia");

    const handleChange = (value) => {
        if (isNaN(Number(value))) return;

        setValue(value);
        setInputValue(value.toString());
    };

    // **Mutation to update frequency cap**
    const mutation = useMutation({
        mutationFn: async (formData) =>
            updateFrequencyCapService(formData, token),
        onSuccess: (data) => {
            addToast({
                color: "success",
                description: data.message,
            });
        },
        onError: (error) => {
            addToast({
                color: "danger",
                description: error.message,
            });
        },
    });

    // **Submit Handler**
    const onSubmit = async (formData) => {
        mutation.mutate({
            ...formData,
            serviceType: serviceType?.toLowerCase(),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                {/* Frequency Cap Slider */}
                <div className="flex flex-col gap-2 py-2">
                    <Slider
                        classNames={{
                            base: "max-w-3xl gap-2",
                            label: "font-light text-md",
                            track: "border-s-primary-200",
                            filler: "bg-gradient-to-r from-primary-200 to-primary-500",
                        }}
                        color="primary"
                        label={`${serviceType} Frequency Cap`}
                        size="md"
                        showTooltip={true}
                        maxValue={200000}
                        minValue={10000}
                        renderValue={({ children, ...props }) => (
                            <output {...props} className="flex gap-2">
                                <Select
                                    {...register("frequencyBase")}
                                    isRequired
                                    variant="bordered"
                                    defaultSelectedKeys={["select"]}
                                    // className="max-w-[250px]"
                                    placeholder="Select"
                                    size="sm"
                                    classNames={{
                                        trigger: "w-[120px]",
                                        listbox: "w-[120px]",
                                    }}
                                    onChange={(e) =>
                                        setValue(
                                            "frequencyBase",
                                            e.target.value
                                        )
                                    }
                                    value={frequencyBase}
                                    radius="sm">
                                    <SelectItem key="daily">Daily</SelectItem>
                                    <SelectItem key="weekly">Weekly</SelectItem>
                                </Select>
                                <Tooltip
                                    className="text-tiny text-default-500 rounded-md"
                                    content="Enter the cap value"
                                    placement="left">
                                    <Input
                                        aria-label="Input value"
                                        type="number"
                                        size="sm"
                                        className="max-w-[7rem]"
                                        value={frequencyCap}
                                        onChange={(e) =>
                                            setValue(
                                                "frequencyCap",
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" &&
                                                !isNaN(Number(frequencyCap))
                                            ) {
                                                setValue(
                                                    "frequencyCap",
                                                    e.target.value
                                                );
                                            }
                                        }}
                                    />
                                </Tooltip>
                            </output>
                        )}
                        step={1}
                        value={frequencyCap}
                        onChange={(value) => setValue("frequencyCap", value)}
                    />

                    <p className="text-sm">Current cap: {frequencyCap}</p>

                    {/* Notify  */}
                    <div className="flex gap-2 items-center py-4  ">
                        <p>
                            When frequency cap is reached notify me via
                            <span className="text-danger text-lg">∗</span>
                        </p>

                        <Select
                            {...register("notifyVia")}
                            isRequired
                            variant="bordered"
                            placeholder="Select"
                            className="max-w-[200px]"
                            size="sm"
                            radius="sm"
                            value={notifyVia}
                            onChange={(e) =>
                                setValue("notifyVia", e.target.value)
                            }>
                            <SelectItem key="sms">SMS</SelectItem>
                            <SelectItem key="email">Email</SelectItem>
                            <SelectItem key="whatsapp">Whatsapp</SelectItem>
                            {/* <SelectItem key="both">Both SMS & Email</SelectItem> */}
                        </Select>
                    </div>
                </div>

                {/* Star Notification   */}
                <div className="flex justify-between py-2 w-4/5 items-center">
                    {/* Text */}
                    <p className="text-xs text-default-400">
                        <span className="text-danger text-lg">∗</span>
                        The notification will be sent on your primary email and
                        phone no provided in the profile tab
                    </p>
                    {/* Save Button */}
                    <Button
                        className="w-fit self-end"
                        variant="ghost"
                        color="primary"
                        radius="sm"
                        type="submit"
                        size="md"
                        isDisabled={
                            !frequencyBase ||
                            !frequencyCap ||
                            !notifyVia ||
                            errors.frequencyCap ||
                            errors.frequencyBase ||
                            errors.notifyVia ||
                            mutation.isLoading
                        }>
                        {mutation.isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </form>
    );
}

{
    /* <Slider
          size="md"
          showTooltip={true}
          color="primary"
          label={`${serviceType} Frequency Cap`}
          step={20000}
          showSteps={true}
          onChange={setFrequencyCap}
          marks={[
            { value: 20000, label: "20K" },
            { value: 40000, label: "40K" },
            { value: 60000, label: "60K" },
            { value: 80000, label: "80K" },
            { value: 100000, label: "100K" },
            { value: 120000, label: "120K" },
            { value: 140000, label: "140K" },
            { value: 160000, label: "160K" },
            { value: 180000, label: "180K" },
            { value: 200000, label: "200K" },
          ]}
          maxValue={200000}
          minValue={20000}
          defaultValue={40000}
          className="w-2/3 mt-3"
        /> */
}
