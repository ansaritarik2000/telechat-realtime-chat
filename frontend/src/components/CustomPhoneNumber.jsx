"use client";
import React, { useEffect, useState } from "react";
import { Input, Autocomplete, AutocompleteItem } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import countries from "../json/countries.json"; // Import JSON file

const PhoneNumberInput = ({ phoneNumber, onChange, isRequired = false }) => {
    const [countryDialCode, setCountryDialCode] = useState("");
    console.log("phoneNumber", phoneNumber);
    useEffect(() => {
        if (phoneNumber) {
            extractCountryFromNumber(phoneNumber);
        }
    }, [phoneNumber]);

    const extractCountryFromNumber = (number) => {
        const matchedCountry = countries.find((country) =>
            number.startsWith(country.dial_code)
        );

        if (matchedCountry) {
            setCountryDialCode(matchedCountry.dial_code);
        }
    };

    return (
        <div className="w-full flex  gap-2">
            <Autocomplete
                aria-label="Search countries"
                inputValue={countryDialCode}
                defaultSelectedKey={countryDialCode}
                allowsCustomValue={true}
                size="lg"
                className="w-3/4"
                radius="sm"
                onInputChange={(value) => {
                    setCountryDialCode(value);
                    onChange(value);
                }}
                variant="flat">
                {countries?.map((country) => (
                    <AutocompleteItem
                        key={country.dial_code}
                        value={country.dial_code}
                        textValue={country.dial_code}>
                        <div className="flex items-center gap-2">
                            <Icon icon={country.flag} width="24" height="24" />
                            <span>{country.dial_code}</span>
                        </div>
                    </AutocompleteItem>
                ))}
            </Autocomplete>

            <Input
                isRequired={isRequired}
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onValueChange={onChange}
                className=" w-full"
                size="lg"
                radius="sm"
            />
        </div>
    );
};

export default PhoneNumberInput;
