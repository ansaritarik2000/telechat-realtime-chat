import React, { useState } from "react";
import { Input, Checkbox } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useSubAccountStore } from "../../../store/subAccount/subAccountStore";
import { Icon } from "@iconify-icon/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AvatarIndex from "../../../components/AvatarGen/Index";
import PhoneNumberInput from "../../../components/CustomPhoneNumber";
import countries from "../../../json/countries.json";
import { PhoneInput } from "../../../components/phone-input";

const restrictedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "aol.com",
    "icloud.com",
    "live.com",
    "msn.com",
];

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

export default function DefaultUser() {
    const [isChecked, setIsChecked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [emailError, setEmailError] = useState("");
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(schema),
        mode: "all", // Validate on change
    });

    // Handle checkbox change
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const {
        first_name,
        last_name,
        email,
        phone_no,
        country_dial_code,
        password,
        rel_mng_name,
        rel_mng_email,
        rel_mng_phone,
        rel_mng_country_dial_code,
        setFirstName,
        max_sub_acc,
        avatar_value,
        avatar_type,
        setMaxSubAcc,
        setLastName,
        setEmail,
        setPassword,
        setRelMngName,
        setRelMngEmail,
        setAvatarType,
        setAvatarValue,
        setPhoneNo,
        setRelMngPhone,
        setCountryDialCode,
        setRelMngCountryDialCode,
    } = useSubAccountStore();

    const handleEmailChange = (value) => {
        const emailParts = value.split("@");
        if (emailParts.length > 1) {
            const domain = emailParts[1].toLowerCase();
            if (restrictedDomains.includes(domain)) {
                setEmailError("Only company domain emails are allowed.");
            } else {
                setEmailError("");
            }
        } else {
            setEmailError("");
        }
        setEmail(value);
    };

    const toggleVisibility = () => setIsVisible(!isVisible);

    // shap type handller
    const shapTypeHandller = (type, value) => {
        setAvatarType(type);
        setAvatarValue(value);
    };

    return (
        <form>
            <div className="flex flex-col  gap-8 ">
                {/* User Details */}
                <div className="flex flex-col  gap-4 border rounded-lg p-4">
                    <AvatarIndex
                        value={`${first_name}${
                            last_name ? " " : ""
                        }${last_name}`}
                        avatarType={avatar_type}
                        shapTypeHandller={shapTypeHandller}
                    />
                    {/* Label */}
                    <p className="text-default-500 text-sm">
                        {" "}
                        {t("User details")}
                    </p>
                    <div className="flex justify-between gap-2">
                        {/* First Name */}
                        <Input
                            {...register("first_name")}
                            isRequired
                            label={t("First Name")}
                            value={first_name}
                            isInvalid={errors?.first_name ? true : false}
                            errorMessage={errors?.first_name?.message}
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
                            isRequired
                            isInvalid={errors?.last_name ? true : false}
                            errorMessage={errors?.last_name?.message}
                            label={t("Last Name")}
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
                            isRequired
                            label={t("Email")}
                            isInvalid={!!emailError || errors?.email}
                            errorMessage={emailError || errors?.email?.message}
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            type="email"
                            size="sm"
                            variant="flat"
                            className="w-1/3"
                            radius="sm"
                        />

                        {/* Phone no */}
                        <div className="w-1/3">
                            <PhoneInput
                                countryDialCode={country_dial_code}
                                onChange={(value) => setPhoneNo(value)}
                                onCountryChange={(country) =>
                                    setCountryDialCode(country?.dial_code)
                                }
                                value={phone_no}
                                isRequired={true}
                            />
                        </div>

                        {/* Password */}
                        <Input
                            {...register("password")}
                            isRequired
                            isInvalid={errors?.password ? true : false}
                            errorMessage={errors?.password?.message}
                            label={t("Password")}
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
                            className="w-1/3"
                            radius="sm"
                        />
                    </div>

                    <div className=" p-2 flex  justify-between items-center">
                        {/* Checkbox */}
                        <div className=" flex gap-2 w-full items-center">
                            <Checkbox
                                size="sm"
                                color="success"
                                onChange={handleCheckboxChange}>
                                {t("Allow user to create Sub accounts upto")}
                            </Checkbox>

                            <Input
                                isRequired
                                isDisabled={!isChecked}
                                placeholder={t("Enter number")}
                                value={max_sub_acc}
                                onChange={(e) => setMaxSubAcc(e.target.value)}
                                type="number"
                                size="sm"
                                className="max-w-[100px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Relationship Manager */}
                <div className="flex flex-col  gap-4 border rounded-lg p-4">
                    {/* Label */}
                    <p className="text-default-500 text-sm ">
                        {t("Relationship Manager")}
                    </p>

                    <div className="flex  gap-2">
                        {/* Name */}
                        <Input
                            {...register("rel_mng_name")}
                            isRequired
                            label={t("Name")}
                            size="sm"
                            radius="sm"
                            isInvalid={errors?.rel_mng_name ? true : false}
                            errorMessage={errors?.rel_mng_name?.message}
                            type="text"
                            className="w-1/2"
                            value={rel_mng_name}
                            onChange={(e) => setRelMngName(e.target.value)}
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
                            isRequired
                            label={t("Email")}
                            value={rel_mng_email}
                            onChange={(e) => setRelMngEmail(e.target.value)}
                            size="sm"
                            radius="sm"
                            type="email"
                            className="w-1/2"
                            isInvalid={errors?.rel_mng_email ? true : false}
                            errorMessage={errors?.rel_mng_email?.message}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
