import React from "react";
import { Input, Tooltip, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
import { useSubAccountStore } from "../../../../store/subAccount/subAccountStore";
import { t } from "i18next";

// Common EndContent Component
const EndContent = ({ credit }) => (
    <Tooltip content={`Price should not be less than ${credit}`}>
        <Icon
            icon="ph:info-light"
            className="cursor-pointer text-primary"
            width="1.3em"
        />
    </Tooltip>
);

// Select Billing on Component
const BillingOn = ({ value, onChange }) => {
    const { t } = useTranslation();
    return (
        <Select
            variant="flat"
            label={t("Billing")}
            value={value}
            onChange={onChange}
            defaultSelectedKeys={[value]}
            className="w-1/2"
            size="sm"
            radius="sm">
            <SelectItem key="submission">On Submission</SelectItem>
            <SelectItem key="delivery">On Delivery</SelectItem>
        </Select>
    );
};

export default function RCSService() {
    const {
        rcs_text_credits,
        rcs_text_credits_billing_on,
        rcs_multimedia_credits,
        rcs_multimedia_credits_billing_on,
        setRcsTextCredits,
        setRcsTextCreditsBillingOn,
        setRcsMultimediaCredits,
        setRcsMultimediaCreditsBillingOn,
    } = useSubAccountStore();

    return (
        <div className="flex flex-col gap-4">
            {/* Text Credits */}
            <div className="flex gap-4 items-center">
                <Input
                    label={t("Text Credits")}
                    type="text"
                    size="sm"
                    variant="flat"
                    value={rcs_text_credits}
                    onChange={(e) => setRcsTextCredits(e.target.value)}
                    className="w-1/2"
                    radius="sm"
                />

                <BillingOn
                    creditsType="global"
                    value={rcs_text_credits_billing_on}
                    onChange={(e) => setRcsTextCreditsBillingOn(e.target.value)}
                />
            </div>
            {/* Multimedia Credits */}
            <div className="flex gap-4 items-center">
                <Input
                    label={t("Multimedia Credits")}
                    type="text"
                    size="sm"
                    variant="flat"
                    value={rcs_multimedia_credits}
                    onChange={(e) => setRcsMultimediaCredits(e.target.value)}
                    className="w-1/2"
                    radius="sm"
                />

                <BillingOn
                    creditsType="global"
                    value={rcs_multimedia_credits_billing_on}
                    onChange={(e) =>
                        setRcsMultimediaCreditsBillingOn(e.target.value)
                    }
                />
            </div>

            {/* Business Initiated */}
            {/* <div className="flex gap-4 items-center">
                <Input
                    label="Business Initiated"
                    type="text"
                    radius="sm"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    endContent={<EndContent credit={0.22} />}
                />
                <BillingOn />
            </div> */}

            {/* User Initiated */}
            {/* <div className="flex gap-4 items-center">
                <Input
                    label="User Initiated"
                    type="text"
                    radius="sm"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    endContent={<EndContent credit={0.15} />}
                />
                <BillingOn />
            </div> */}
        </div>
    );
}
