import React, { useState } from "react";
import {
    Input,
    Checkbox,
    useCheckbox,
    Chip,
    VisuallyHidden,
    tv,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useSubAccountStore } from "../../../store/subAccount/subAccountStore";
import AvatarIndex from "../../../components/AvatarGen/Index";
import DividerLabel from "../../../components/Common/DividerLabel/Index";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "../../../components/phone-input";

const companyEmailRegex =
    /^[a-zA-Z0-9._%+-]+@(?!gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|aol\.com|icloud\.com|live\.com|msn\.com)([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i;

const schema = z.object({
    first_name: z.string().min(2, "First name can't be less then 2 letters"),
    last_name: z.string().min(2, "Last name can't be less then 2 letters"),
    email: z
        .string()
        .email("Please enter valid email address.")
        .regex(companyEmailRegex, "Only company domain emails are allowed."),
    phone_no: z.string().min(10, "Please enter valid phone number"),
    rel_mng_name: z
        .string()
        .min(2, "Relationship manager can't be less then 2 letters"),
    rel_mng_phone: z.string().min(10, "Please enter phone number"),
    rel_mng_email: z
        .string()
        .email("Please enter valid email address")
        .regex(companyEmailRegex, "Only company domain emails are allowed."),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const checkbox = tv({
    slots: {
        base: "border-default hover:bg-default-200",
        content: "text-default-500 text-xs px-4 ",
    },
    variants: {
        isSelected: {
            true: {
                base: "border-success bg-success hover:bg-success-500 hover:border-success-500",
                content: "text-success-foreground pl-1",
            },
        },
        isFocusVisible: {
            true: {
                base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
            },
        },
    },
});

export default function DefaultUser() {
    const [isChecked, setIsChecked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const {
        children,
        isSelected,
        isFocusVisible,
        getBaseProps,
        getLabelProps,
        getInputProps,
    } = useCheckbox({
        defaultSelected: true,
    });

    // zustand store
    const {
        first_name,
        last_name,
        phone_no,
        country_dial_code,
        email,
        password,
        rel_mng_name,
        rel_mng_email,
        rel_mng_phone,
        rel_mng_country_dial_code,
        setFirstName,
        max_sub_acc,
        status,
        avatar_value,
        avatar_type,
        setStatus,
        setMaxSubAcc,
        setLastName,
        setEmail,
        setPhoneNo,
        setCountryDialCode,
        setPassword,
        setRelMngName,
        setRelMngEmail,
        setRelMngPhone,
        setRelMngCountryDialCode,
        setAvatarType,
        setAvatarValue,
    } = useSubAccountStore();

    const styles = checkbox({ isSelected, isFocusVisible });
    const toggleVisibility = () => setIsVisible(!isVisible);

    // Handle checkbox change
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    // Add this handler function
    const handleStatusChange = () => {
        setStatus(status === "active" ? "disabled" : "active");
    };

    // shap type handller
    const shapTypeHandller = (type, value) => {
        setAvatarType(type);
        setAvatarValue(value);
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(schema),
        mode: "all", // Validate on change
    });

    return (
        <form>
            <div className="flex flex-col  gap-4 px-10">
                <AvatarIndex
                    value={avatar_value}
                    avatarType={avatar_type}
                    shapTypeHandller={shapTypeHandller}
                />
                <div className="flex justify-between gap-2">
                    {/* First Name */}
                    <Input
                        {...register("first_name")}
                        isInvalid={errors?.first_name ? true : false}
                        errorMessage={errors?.first_name?.message}
                        isRequired
                        label="First Name"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        size="sm"
                        radius="sm"
                        variant="flat"
                        color="primary"
                        className="w-1/2"
                    />
                    {/* Last Name */}
                    <Input
                        {...register("last_name")}
                        isInvalid={errors?.last_name ? true : false}
                        errorMessage={errors?.last_name?.message}
                        isRequired
                        label="Last Name"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        size="sm"
                        radius="sm"
                        variant="flat"
                        color="primary"
                        className="w-1/2"
                    />
                </div>

                <div className="flex justify-between gap-2">
                    {/* Email */}
                    <Input
                        {...register("email")}
                        isInvalid={errors?.email ? true : false}
                        errorMessage={errors?.email?.message}
                        isRequired
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="sm"
                        variant="flat"
                        className="w-1/3"
                        radius="sm"
                    />

                    {/* Phone no */}
                    <PhoneInput
                        countryDialCode={country_dial_code}
                        onChange={(value) => setPhoneNo(value)}
                        onCountryChange={(country) =>
                            setCountryDialCode(country?.dial_code)
                        }
                        value={phone_no}
                        isRequired={true}
                    />

                    {/* Password */}
                    <Input
                        {...register("password")}
                        isInvalid={errors?.password ? true : false}
                        errorMessage={errors?.password?.message}
                        isRequired
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
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
                        label="Password"
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="sm"
                        variant="flat"
                        className="w-1/2"
                        radius="sm"
                    />
                </div>

                <div className="border rounded-lg p-4 flex flex-col gap-1">
                    {/* Chip Status */}

                    <div className="w-1/2 flex gap-4 items-center ">
                        <p>Account status</p>
                        <label {...getBaseProps()} onClick={handleStatusChange}>
                            <VisuallyHidden>
                                <input {...getInputProps()} />
                            </VisuallyHidden>
                            <Chip
                                classNames={{
                                    base: styles.base(),
                                    content: styles.content(),
                                }}
                                size="sm"
                                color="success"
                                startContent={
                                    status === "active" ? (
                                        <Icon
                                            icon="bi:check-lg"
                                            width={"1.3em"}
                                        />
                                    ) : null
                                }
                                variant="faded"
                                {...getLabelProps()}>
                                {status === "active" ? "Enabled" : "Disabled"}
                            </Chip>
                        </label>
                    </div>

                    {/* Checkbox */}
                    <div className=" flex gap-2 w-full items-center">
                        <Checkbox
                            size="sm"
                            color="success"
                            checked={max_sub_acc > 0}
                            onChange={handleCheckboxChange}>
                            Allow user to create Sub accounts upto
                        </Checkbox>

                        <Input
                            isRequired
                            isDisabled={!isChecked}
                            value={isChecked ? max_sub_acc : 0}
                            onChange={(e) =>
                                isChecked
                                    ? setMaxSubAcc(e.target.value)
                                    : setMaxSubAcc(0)
                            }
                            placeholder="Enter number"
                            type="number"
                            size="sm"
                            className="max-w-[100px]"
                        />
                    </div>
                </div>

                {/* Label */}
                <DividerLabel label="Relationship Manager" />

                <div className="flex  gap-2">
                    {/* Name */}
                    <Input
                        {...register("rel_mng_name")}
                        isInvalid={errors?.rel_mng_name ? true : false}
                        errorMessage={errors?.rel_mng_name?.message}
                        isRequired
                        label="Name"
                        value={rel_mng_name}
                        onChange={(e) => setRelMngName(e.target.value)}
                        size="sm"
                        radius="sm"
                        type="text"
                        className="w-1/2"
                    />

                    {/* Phone Number */}
                    <PhoneInput
                        countryDialCode={rel_mng_country_dial_code}
                        onChange={(value) => setRelMngPhone(value)}
                        onCountryChange={(country) =>
                            setRelMngCountryDialCode(country?.dial_code)
                        }
                        value={rel_mng_phone}
                        isRequired={true}
                    />

                    {/* Email */}
                    <Input
                        {...register("rel_mng_email")}
                        isInvalid={errors?.rel_mng_email ? true : false}
                        errorMessage={errors?.rel_mng_email?.message}
                        isRequired
                        label="Email"
                        size="sm"
                        radius="sm"
                        type="email"
                        value={rel_mng_email}
                        onChange={(e) => setRelMngEmail(e.target.value)}
                        className="w-1/2"
                    />
                </div>
            </div>
        </form>
    );
}
