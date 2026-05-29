import React from "react";
import {
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
    parsePhoneNumber,
    isValidPhoneNumber,
    getExampleNumber,
} from "libphonenumber-js/max";
import examples from "libphonenumber-js/mobile/examples";
import { countryCodes } from "./data/country-codes";

export const PhoneInput = ({
    value,
    countryDialCode,
    onChange,
    onCountryChange,
    isRequired = false,
}) => {
    const [selectedCountry, setSelectedCountry] = React.useState(
        countryCodes.find((c) => c.dial_code === countryDialCode)
    );
    const [phoneNumber, setPhoneNumber] = React.useState(value);
    const [isValid, setIsValid] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isTouched, setIsTouched] = React.useState(false);

    const getMaxLength = React.useCallback((countryCode) => {
        try {
            const example = getExampleNumber(countryCode, examples);
            return example?.nationalNumber.length || null;
        } catch {
            return null;
        }
    }, []);

    const maxLength = React.useMemo(
        () => getMaxLength(selectedCountry.code),
        [selectedCountry.code, getMaxLength]
    );

    const filteredCountries = React.useMemo(() => {
        if (!searchQuery.trim()) return countryCodes;
        const query = searchQuery.toLowerCase().trim();
        return countryCodes.filter(
            (country) =>
                country.name.toLowerCase().includes(query) ||
                country.dial_code.includes(query) ||
                country.code.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handlePhoneChange = (newValue) => {
        // Only allow numbers
        const numbersOnly = newValue.replace(/[^\d]/g, "");

        // Restrict to max length if available
        const truncatedValue = maxLength
            ? numbersOnly.slice(0, maxLength)
            : numbersOnly;

        setPhoneNumber(truncatedValue);

        // Handle pasted or typed numbers with country code
        if (newValue.startsWith("+")) {
            try {
                const parsedNumber = parsePhoneNumber(newValue);
                if (parsedNumber) {
                    const countryCode = parsedNumber.countryCallingCode;
                    const nationalNumber = parsedNumber.nationalNumber;

                    const matchedCountry = countryCodes.find(
                        (c) => c.dial_code === `+${countryCode}`
                    );

                    if (matchedCountry) {
                        setSelectedCountry(matchedCountry);
                        onCountryChange?.(matchedCountry);
                        setPhoneNumber(nationalNumber);
                        onChange(nationalNumber);
                        return;
                    }
                }
            } catch (error) {
                // If parsing fails, continue with normal handling
            }
        }

        try {
            const fullNumber = selectedCountry.dial_code + truncatedValue;
            const isValidNumber = isValidPhoneNumber(fullNumber);
            setIsValid(isValidNumber);
            onChange(truncatedValue);
        } catch (error) {
            setIsValid(false);
            onChange(truncatedValue);
        }
    };

    const handleCountrySelect = (key) => {
        if (key === "search") return;
        const country = countryCodes.find((c) => c.code === key);
        if (country) {
            setSelectedCountry(country);
            onCountryChange?.(country);
            setSearchQuery("");
            // Revalidate number with new country code
            if (phoneNumber) {
                const fullNumber = country.dial_code + phoneNumber;
                setIsValid(isValidPhoneNumber(fullNumber));
            }
        }
    };

    const preventDropdownClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Handle initial value if it includes country code
    React.useEffect(() => {
        if (value && value.startsWith("+")) {
            handlePhoneChange(value);
        }
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full justify-between">
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="flat"
                            // className="min-w-[120px] h-[56px] px-2"
                            size="md"
                            endContent={
                                <Icon
                                    icon="lucide:chevron-down"
                                    className="text-small"
                                />
                            }>
                            <div className="flex items-center gap-2">
                                <img
                                    src={selectedCountry.flag}
                                    alt={`${selectedCountry.name} flag`}
                                    className="w-5 h-4 object-cover rounded-sm"
                                />
                                <span className="text-small">
                                    {selectedCountry.dial_code}
                                </span>
                            </div>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Country selection"
                        className="min-w-[280px]"
                        onAction={handleCountrySelect}
                        selectionMode="single"
                        selectedKeys={[selectedCountry.code]}
                        shouldBlockScroll={false}>
                        <DropdownSection>
                            <DropdownItem
                                key="search"
                                className="h-auto p-2 border-b border-divider"
                                textValue="Search countries">
                                <div
                                    onClick={preventDropdownClose}
                                    onKeyDown={preventDropdownClose}>
                                    <Input
                                        placeholder="Search country or code..."
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                        startContent={
                                            <Icon
                                                icon="lucide:search"
                                                className="text-default-400"
                                            />
                                        }
                                        size="sm"
                                        classNames={{
                                            input: "text-small",
                                            inputWrapper: "shadow-none",
                                        }}
                                        autoComplete="off"
                                    />
                                </div>
                            </DropdownItem>
                        </DropdownSection>
                        <DropdownSection className="max-h-[300px] overflow-auto">
                            {filteredCountries.map((country) => (
                                <DropdownItem
                                    key={country.code}
                                    startContent={
                                        <img
                                            src={country.flag}
                                            alt={`${country.name} flag`}
                                            className="w-5 h-4 object-cover rounded-sm"
                                        />
                                    }
                                    className="text-small">
                                    <div className="flex items-center gap-1">
                                        <span>{country.name}</span>
                                        <span className="text-default-400">
                                            {country.dial_code}
                                        </span>
                                    </div>
                                </DropdownItem>
                            ))}
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>
                <Input
                    type="tel"
                    isRequired={isRequired}
                    // label="Phone Number"
                    // labelPlacement="inside"
                    value={phoneNumber}
                    defaultValue={phoneNumber}
                    onValueChange={handlePhoneChange}
                    onBlur={() => setIsTouched(true)}
                    placeholder="Enter Phone Number"
                    isInvalid={!isValid && isTouched}
                    errorMessage={
                        !isValid && isTouched
                            ? "Please enter a valid phone number"
                            : undefined
                    }
                    className="flex-1 w-full"
                    // startContent={
                    //     <span className="text-default-400">
                    //         {selectedCountry.dial_code}
                    //     </span>
                    // }
                />
            </div>
        </div>
    );
};
