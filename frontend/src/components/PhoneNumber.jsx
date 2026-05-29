import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRcsBotStore } from "../store/templateApprovalStore";
import { useTranslation } from "react-i18next";
import { useSubAccountStore } from "../store/subAccount/subAccountStore";
import { useMemberStore } from "../store/member/memberStore";
import { useProfileStore } from "../store/profile/profileStore";
import { usePhoneBookStore } from "../store/phonebook/phonebookStore";

const PhoneNumber = ({
    user,
    defaultValue,
    onPhoneChangeHandller,
    showPhoneNumberLabel = true,
}) => {
    const {
        rcsPhoneInfo,
        rcsCountryCodeInfo,
        setRcsCountryCodeInfo,
        setRcsPhoneInfo,
    } = useRcsBotStore();

    const { setPhoneNo, setRelMngPhone } = useSubAccountStore();
    // zustand store
    const { setPhoneNo: setMemberPhoneNumber } = useMemberStore();
    // zustand store
    const {
        setPhoneNo: setPhoneBookPhoneNo,
        setCountryCode,
        setIsUpdateButtonDisabled,
    } = usePhoneBookStore();
    const { setIsProfileChanged, setPhoneNo: setPhoneProfile } =
        useProfileStore();
    const [value, setValue] = useState(defaultValue);

    // useEffect(() => {
    //     setValue(defaultValue);
    // }, [defaultValue]);
    console.log("defaultValue", defaultValue);

    const { t } = useTranslation();

    const handlePhoneChange = (phone, countryData) => {
        const { dialCode } = countryData;
        console.log("countryData", countryData);
        setValue(phone);
        setRcsCountryCodeInfo(dialCode);
        setRcsPhoneInfo({
            ...rcsPhoneInfo,
            value: phone.slice(dialCode.length), // `phone` includes the country code
        });

        const phonNumberWithoutCountryCode = phone.slice(dialCode.length);

        switch (user) {
            case "defaultUser":
                setPhoneNo(phone); // set user phone number
                break;
            case "relationShipManager":
                setRelMngPhone(phone); // set relation ship manager phone number--->sub accounts
                break;
            case "member":
                setMemberPhoneNumber(phone); // set member phone number
                break;
            case "profile":
                setIsProfileChanged(true);
                setPhoneProfile(phone); // set member phone number
                break;
            case "phonebook":
                setPhoneBookPhoneNo(phonNumberWithoutCountryCode); // set member phone number
                setCountryCode(dialCode);
                setIsUpdateButtonDisabled(false);
                break;
            case "rcsbot":
                setRcsPhoneInfo({ ...rcsPhoneInfo, value: phone });
                break;
            default:
                onPhoneChangeHandller(phone);
                break;
        }
    };

    return (
        <>
            <div
                className={`flex flex-col bg-gray-100 dark:bg-content2 ${
                    showPhoneNumberLabel ? "py-1" : "py-2"
                } px-3 z-2 rounded-lg focus:ring-2 focus:ring-blue-500`}>
                {showPhoneNumberLabel && (
                    <label className="text-xs text-gray-500">
                        {t("Phone No.")} <span className="text-red-500">*</span>
                    </label>
                )}
                <PhoneInput
                    country={"in"} // Set default country
                    value={value}
                    onChange={handlePhoneChange}
                    inputProps={{
                        required: true,
                        autoFocus: true,
                        className:
                            "border-transparent bg-gray-100 dark:bg-content2 px-1 ml-10 -mt-1 outline-none focus:border-blue-500",
                    }}
                    enableSearch={true}
                    searchPlaceholder="Search country"
                    className="rounded-xl dark:bg-content2 border-transparent pt-1 pb-0 focus:ring-2 focus:ring-blue-500"
                    containerClass="dark:bg-content2 "
                    buttonClass="bg-transparent py-2 px-4 rounded-md"
                    dropdownClass="!dark:bg-content2 !bg-content2  border hover:text-black"
                />
            </div>
        </>
    );
};

export default PhoneNumber;
