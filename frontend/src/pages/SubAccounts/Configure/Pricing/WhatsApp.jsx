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

export default function WhatsApp() {
    const [selectedRadio, setSelectedRadio] = React.useState("prepaid");

    const {
        marketing_rate,
        marketing_rate_billing_on,
        utility_rate,
        utility_rate_billing_on,
        authentication_rate,
        authentication_rate_billing_on,
        service_rate,
        service_rate_billing_on,
        whatsapp_billing_method,
        setMarketingRate,
        setMarketingRateBillingOn,
        setUtilityRate,
        setUtilityRateBillingOn,
        setAuthenticationRate,
        setAuthenticationRateBillingOn,
        setServiceRate,
        setServiceRateBillingOn,
    } = useSubAccountStore();
    return (
        <div className="flex flex-col gap-4">
            {/* Marketing Rates with Select Billing */}
            <div className="flex gap-4 items-center">
                <Input
                    label="Marketing Rate"
                    value={marketing_rate}
                    onChange={(e) => setMarketingRate(e.target.value)}
                    type="text"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    endContent={<EndContent credit={"0.15"} />}
                />
                <BillingOn
                    creditsType="marketing"
                    value={marketing_rate_billing_on}
                    onChange={(e) => setMarketingRateBillingOn(e.target.value)}
                />
            </div>

            {/* Utility Rates */}
            <div className="flex gap-4 items-center">
                <Input
                    label="Utility Rate"
                    type="text"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    value={utility_rate}
                    onChange={(e) => setUtilityRate(e.target.value)}
                    endContent={<EndContent credit={"0.15"} />}
                />
                <BillingOn
                    creditsType="utility"
                    value={utility_rate_billing_on}
                    onChange={(e) => setUtilityRateBillingOn(e.target.value)}
                />
            </div>

            {/* Authentication Credits */}
            <div className="flex gap-4 items-center">
                <Input
                    label="Authentication Rate"
                    value={authentication_rate}
                    onChange={(e) => setAuthenticationRate(e.target.value)}
                    type="text"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    endContent={<EndContent credit={"0.15"} />}
                />
                <BillingOn
                    creditsType="authentication"
                    value={authentication_rate_billing_on}
                    onChange={(e) =>
                        setAuthenticationRateBillingOn(e.target.value)
                    }
                />
            </div>

            {/* Service Credits */}
            <div className="flex gap-4 items-center">
                <Input
                    label="Service Rate"
                    type="text"
                    size="sm"
                    variant="flat"
                    className="w-1/2"
                    radius="sm"
                    value={service_rate}
                    onChange={(e) => setServiceRate(e.target.value)}
                    endContent={<EndContent credit={"0.15"} />}
                />
                <BillingOn
                    creditsType="service"
                    value={service_rate_billing_on}
                    onChange={(e) => setServiceRateBillingOn(e.target.value)}
                />
            </div>
        </div>
    );
}
