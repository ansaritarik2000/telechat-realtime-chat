import React, { useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { states } from "./states";
import { useProfileStore } from "../../../../store/profile/profileStore";

export default function Address({
    fieldsDisabled = true,
    addressValue,
    onChange,
    cityValue,
    stateValue,
    pinValue,
    countryValue,
}) {
    const [selected, setSelected] = useState(null);
    const { profileData, setProfileData } = useProfileStore();

    const handleStateChange = (value) => {
        setSelected(value);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Address */}
            <Input
                isDisabled={fieldsDisabled}
                value={addressValue}
                name="address"
                onChange={onChange}
                label="Address"
                size="sm"
                className="w-full"
                color="default"
            />
            <div className="flex gap-2">
                {/* City */}
                <Input
                    isDisabled={fieldsDisabled}
                    value={cityValue}
                    onChange={onChange}
                    name="city"
                    label="City"
                    size="sm"
                    className="w-full"
                    color="default"
                />
                {/* Select State  */}
                <Select
                    size="sm"
                    isDisabled={fieldsDisabled}
                    label="State"
                    name="state"
                    defaultSelectedKeys={[stateValue]}
                    value={stateValue}
                    onChange={onChange}
                    className="max-w-xs"
                    disabled={fieldsDisabled}
                    scrollShadowProps={{
                        isEnabled: false,
                    }}>
                    {states.map((state) => (
                        <SelectItem key={state.key} value={state.key}>
                            {state.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="flex gap-2">
                {/* PIN Code */}
                <Input
                    isDisabled={fieldsDisabled}
                    value={pinValue}
                    name="pin"
                    onChange={onChange}
                    label="PIN"
                    size="sm"
                    className="w-full"
                    color="default"
                />

                {/* Country */}
                <Input
                    isDisabled={fieldsDisabled}
                    value={countryValue}
                    onChange={onChange}
                    label="Country"
                    size="sm"
                    className="w-full"
                    color="default"
                />
            </div>
        </div>
    );
}
