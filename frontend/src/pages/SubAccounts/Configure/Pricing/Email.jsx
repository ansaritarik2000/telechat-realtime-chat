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
    promoCredits: (
        <Tooltip content="Price should not be less than 0.2">
            <Icon
                icon="ph:info-light"
                className="cursor-pointer text-primary"
                width="1.3em"
            />
        </Tooltip>
    ),
    transCredits: (
        <Tooltip content="Price should not be less than 0.25">
            <Icon
                icon="ph:info-light"
                className="cursor-pointer text-primary"
                width="1.3em"
            />
        </Tooltip>
    ),
    otpCredits: (
        <Tooltip content="Price should not be less than 0.1">
            <Icon
                icon="ph:info-light"
                className="cursor-pointer text-primary"
                width="1.3em"
            />
        </Tooltip>
    ),
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

export default function EmailService() {
    const [selectedRadio, setSelectedRadio] = React.useState("prepaid");

    const {
        email_promo_credits,
        email_promo_credits_billing_on,
        email_transactional_rates,
        email_transactional_rates_billing_on,
        email_email_billing_method,
        setEmailPromoCredits,
        setEmailPromoCreditsBillingOn,
        setEmailTransactionalRates,
        setEmailTransactionalRatesBillingOn,
    } = useSubAccountStore();
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                {/* Promo Credits */}
                <Input
                    label="Promo Credits"
                    type="text"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    endContent={InfoTips.promoCredits}
                    value={email_promo_credits}
                    onChange={(e) => setEmailPromoCredits(e.target.value)}
                />

                <BillingOn
                    creditsType="promo"
                    value={email_promo_credits_billing_on}
                    onChange={(e) =>
                        setEmailPromoCreditsBillingOn(e.target.value)
                    }
                />
            </div>

            <div className="flex gap-4 items-center">
                {/* Transactional Rates with Select */}
                <Input
                    label="Transactional Rates"
                    value={email_transactional_rates}
                    onChange={(e) => setEmailTransactionalRates(e.target.value)}
                    type="text"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    endContent={InfoTips.transCredits}
                />

                <BillingOn
                    creditsType="transactional"
                    value={email_transactional_rates_billing_on}
                    onChange={(e) =>
                        setEmailTransactionalRatesBillingOn(e.target.value)
                    }
                />
            </div>
        </div>
    );
}
