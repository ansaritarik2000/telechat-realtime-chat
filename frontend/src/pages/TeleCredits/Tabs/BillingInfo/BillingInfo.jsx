import React, { useState } from "react";
import { Input, Checkbox } from "@heroui/react";
import Address from "./Address";
import { useProfileStore } from "../../../../store/profile/profileStore";

export default function BillingInfo() {
    const [sameAsCompanyAddress, setSameAsCompanyAddress] = useState(true);
    const {
        profileData,
        setBillingAddress,
        setOrganizationAddress,
        billingAddress,
        organizationAddress,
    } = useProfileStore();

    // Handle checkbox change
    const handleCheckboxChange = (e) => {
        setSameAsCompanyAddress(e.target.checked);
        if (e.target.checked) {
            setBillingAddress({
                ...organizationAddress,
            });
        } else {
            setBillingAddress({
                ...billingAddress,
            });
        }
    };

    // Handle organization address change
    const handleOrgAddressChange = (e) => {
        setOrganizationAddress({
            ...organizationAddress,
            [e.target.name]: e.target.value,
        });
        if (sameAsCompanyAddress) {
            setBillingAddress({
                ...billingAddress,
                [e.target.name]: e.target.value,
            });
        }
    };

    // Handle billing address change
    const handleBillingAddressChange = (e) => {
        setBillingAddress({
            ...billingAddress,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="col-span-1 flex flex-col gap-4">
                <h1 className="text-xl font-bold text-default-700">
                    Your Organization Details
                </h1>
                {/* Fixed Inputs */}
                <div className="flex flex-col gap-2">
                    <Input
                        isReadOnly
                        label="Organization Name"
                        value={profileData?.business_name}
                        size="lg"
                        className="w-full hover:cursor-not-allowed"
                        color="primary"
                    />
                    <div className="flex gap-2">
                        <Input
                            isReadOnly
                            label={"PAN No."}
                            value={profileData?.pan_no}
                            size="md"
                            className="w-1/3"
                            color="primary"
                        />
                        <Input
                            isReadOnly
                            label={"GST No."}
                            value={profileData?.gst_no}
                            size="md"
                            className="w-1/3"
                            color="primary"
                        />
                        <Input
                            isReadOnly
                            label={"CIN No."}
                            value={profileData?.dlt_entity_id}
                            size="md"
                            className="w-1/3"
                            color="primary"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold text-default-700">
                        Organization Address
                    </h1>
                    {/* Input Fields */}
                    <Address
                        fieldsDisabled={true}
                        onChange={handleOrgAddressChange}
                        addressValue={organizationAddress.address}
                        cityValue={organizationAddress.city}
                        stateValue={organizationAddress.state}
                        pinValue={organizationAddress.pin}
                        countryValue={organizationAddress.country}
                    />
                </div>
            </div>

            {/* Right Column */}
            <div className="flex justify-end flex-col gap-4">
                <div className="flex justify-between ">
                    <h1 className="text-xl font-bold text-default-700">
                        Billing Address
                    </h1>
                    <Checkbox
                        defaultSelected
                        onChange={handleCheckboxChange}
                        size="sm"
                        color="success">
                        Same as Organization Address
                    </Checkbox>
                </div>
                {/* Address field if the checkbox is checked fieldsDisabled should be true */}
                <Address
                    fieldsDisabled={sameAsCompanyAddress}
                    onChange={handleBillingAddressChange}
                    addressValue={billingAddress.address}
                    cityValue={billingAddress.city}
                    stateValue={billingAddress.state}
                    pinValue={billingAddress.pin}
                    countryValue={billingAddress.country}
                />
            </div>
        </div>
    );
}
