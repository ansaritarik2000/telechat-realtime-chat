import React from "react";
import {
    Input,
    Tooltip,
    Select,
    SelectItem,
    Radio,
    RadioGroup,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
import { useSubAccountStore } from "../../../../store/subAccount/subAccountStore";

// Input Fields end Icon tooltips
const InfoTips = {
    globalCredits: (
        <Tooltip content="Price should not be less than 0.15">
            <Icon
                icon="ph:info-light"
                className="cursor-pointer text-primary"
                width="1.3em"
            />
        </Tooltip>
    ),
};

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
    const { t } = useTranslation();
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
                    endContent={InfoTips.globalCredits}
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
                    endContent={InfoTips.globalCredits}
                />

                <BillingOn
                    creditsType="global"
                    value={rcs_multimedia_credits_billing_on}
                    onChange={(e) =>
                        setRcsMultimediaCreditsBillingOn(e.target.value)
                    }
                />
            </div>
        </div>
    );
}
