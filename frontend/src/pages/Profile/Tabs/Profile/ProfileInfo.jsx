import React from "react";
import { Input, Button } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "../../../../store/profile/profileStore";
import AvatarIndex from "../../../../components/AvatarGen/Index";
import { PhoneInput } from "../../../../components/phone-input";

export default function ProfileInfo() {
    const { t } = useTranslation();
    const {
        business_name,
        email,
        first_name,
        last_name,
        phone_no,
        country_dial_code,
        role,
        avatar_type,
        avatar_value,
        setAvatarType,
        setAvatarValue,
        setPhoneNo,
        setCountryDialCode,
        setLastName,
        setFirstName,
        setEmail,
        setBusinessName,
        setIsProfileChanged,
    } = useProfileStore();

    // shap type handller
    const shapTypeHandller = (type, value) => {
        setIsProfileChanged(true);
        setAvatarType(type);
        if (type === "character") {
            const value = `${first_name}${last_name ? " " : ""}${last_name}`;
            setAvatarValue(value);
        } else {
            setAvatarValue(value);
        }
    };

    return (
        <div className="flex flex-col gap-4 mb-2">
            <AvatarIndex
                avatarType={avatar_type}
                shapTypeHandller={shapTypeHandller}
                value={
                    avatar_value ||
                    `${first_name}${last_name ? " " : ""}${last_name}`
                }
                size={100}
            />
            {/* Comapny Name */}
            {/* <div className="flex flex-col gap-2">
        <Input
          disabled={
            role.toLowerCase() !== "admin" &&
            role.toLowerCase() !== "superadmin"
          }
          autofocus
          label="Company Name"
          labelPlacement="outside"
          value={business_name}
          onChange={(e) => {
            setIsProfileChanged(true);
            setBusinessName(e.target.value);
          }}
          size="lg"
          placeholder="Telepie Technologies"
          variant="bordered"
          radius="sm"
        />
      </div> */}

            <div className="flex gap-2 ">
                {/* Person First Name */}
                <Input
                    label="Profile First Name"
                    labelPlacement="outside"
                    disabled={
                        role.toLowerCase() !== "admin" &&
                        role.toLowerCase() !== "superadmin"
                    }
                    value={first_name}
                    onChange={(e) => {
                        setIsProfileChanged(true);
                        setFirstName(e.target.value);
                    }}
                    size="lg"
                    placeholder="Nawaz Ali"
                    variant="bordered"
                    radius="sm"
                    className="w-full"
                />

                {/* Person Last Name */}
                <Input
                    label="Profile Last Name"
                    labelPlacement="outside"
                    disabled={
                        role.toLowerCase() !== "admin" &&
                        role.toLowerCase() !== "superadmin"
                    }
                    value={last_name}
                    onChange={(e) => {
                        setIsProfileChanged(true);
                        setLastName(e.target.value);
                    }}
                    size="lg"
                    placeholder="Nawaz Ali"
                    variant="bordered"
                    radius="sm"
                    className="w-full"
                />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
                <Input
                    label="Email"
                    labelPlacement="outside"
                    disabled={
                        role.toLowerCase() !== "admin" &&
                        role.toLowerCase() !== "superadmin"
                    }
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setIsProfileChanged(true);
                        setEmail(e.target.value);
                    }}
                    size="lg"
                    placeholder="abc@telepie.com"
                    variant="bordered"
                    radius="sm"
                    startContent={
                        <Icon
                            icon="material-symbols:mail-outline"
                            width="1.2em"
                            height="1.2em"
                        />
                    }
                />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
                <p className=" text-md text-default-700 ">
                    {t("Phone number")}
                </p>
                <PhoneInput
                    countryDialCode={country_dial_code}
                    onChange={(value) => {
                        setPhoneNo(value);
                        setIsProfileChanged(true);
                    }}
                    onCountryChange={(country) => {
                        setCountryDialCode(country?.dial_code);
                        setIsProfileChanged(true);
                    }}
                    value={phone_no}
                    isRequired={true}
                />
            </div>
        </div>
    );
}
