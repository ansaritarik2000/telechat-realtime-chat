import React, { useState } from "react";
import {
    Input,
    Tooltip,
    Select,
    SelectItem,
    RadioGroup,
    Radio,
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

export default function SMSService() {
    const {
        sms_promo_credits,
        sms_promo_credits_billing_on,
        sms_transactional_rates,
        sms_transactional_rates_billing_on,
        sms_otp_credits,
        sms_otp_credits_billing_on,
        sms_global_credits,
        sms_global_credits_billing_on,
        sms_billing_method,
        setSmsPromoCredits,
        setSmsPromoCreditsBillingOn,
        setSmsTransactionalRates,
        setSmsTransactionalRatesBillingOn,
        setSmsOtpCredits,
        setSmsOtpCreditsBillingOn,
        setSmsGlobalCredits,
        setSmsGlobalCreditsBillingOn,
    } = useSubAccountStore();

    console.log(
        sms_promo_credits,
        sms_promo_credits_billing_on,
        sms_transactional_rates,
        sms_transactional_rates_billing_on,
        sms_otp_credits,
        sms_otp_credits_billing_on,
        sms_global_credits,
        sms_global_credits_billing_on,
        sms_billing_method
    );

    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-4">
            {/* Promo Credits  */}
            <div className="flex gap-4 items-center">
                <Input
                    label={t("Promo Credits")}
                    type="text"
                    value={sms_promo_credits}
                    onChange={(e) => setSmsPromoCredits(e.target.value)}
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    endContent={InfoTips.promoCredits}
                />

                <BillingOn
                    creditsType="promo"
                    onChange={(e) =>
                        setSmsPromoCreditsBillingOn(e.target.value)
                    }
                    value={sms_promo_credits_billing_on}
                />
            </div>

            {/* Transactional Rates with Select */}
            <div className="flex gap-4 items-center">
                <Input
                    label={t("Transactional Rates")}
                    value={sms_transactional_rates}
                    onChange={(e) => setSmsTransactionalRates(e.target.value)}
                    type="text"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    endContent={InfoTips.transCredits}
                />

                <BillingOn
                    creditsType="transactional"
                    value={sms_transactional_rates_billing_on}
                    onChange={(e) =>
                        setSmsTransactionalRatesBillingOn(e.target.value)
                    }
                />
            </div>

            {/* OTP Credits */}
            <div className="flex gap-4 items-center">
                <Input
                    label={t("OTP Credits")}
                    value={sms_otp_credits}
                    onChange={(e) => setSmsOtpCredits(e.target.value)}
                    type="text"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    endContent={InfoTips.otpCredits}
                />

                <BillingOn
                    creditsType="otp"
                    value={sms_otp_credits_billing_on}
                    onChange={(e) => setSmsOtpCreditsBillingOn(e.target.value)}
                />
            </div>
        </div>
    );
}
