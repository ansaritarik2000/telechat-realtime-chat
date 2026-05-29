import {
  Input,
  Select,
  SelectItem,
  Image,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { t } from "i18next";
import React from "react";
import { useRcsBotVerifyStore } from "../../../../store/rcsBotVerifyStore";
import InputField from "../RCSBot/InputField";
import { Icon } from "@iconify/react";

// industries
const industries = [
  { key: 1, label: "Advertising/Marketing" },
  { key: 2, label: "Arts & Entertainment" },
  { key: 3, label: "Commercial and Industrial" },
  { key: 4, label: "Education" },
  { key: 5, label: "Telecom" },
  { key: 6, label: "Finance" },
  { key: 7, label: "Hotel and B&B" },
  { key: 8, label: "Legal" },
  { key: 9, label: "Local Service" },
  { key: 10, label: "Media/News Company" },
  { key: 11, label: "Non-Governmental Organization (NGO)" },
  { key: 12, label: "Non-Profit Organization" },
  { key: 13, label: "Property" },
  { key: 14, label: "Science, Technology, and Engineering" },
  { key: 15, label: "Shopping & Retail" },
  { key: 16, label: "Sport & Recreation" },
  { key: 17, label: "Community Organization" },
  { key: 18, label: "Other" },
  { key: 19, label: "Not Available" },
  { key: 20, label: "Government" },
];

const Brandig = () => {
  const {
    videoUrl,
    setVideoUrl,
    botAccessInstructions,
    setBotAccessInstructions,
    triggerAction,
    setTriggerAction,
    botInteractionTypes,
    setBotInteractionTypes,
    webhookUrl,
    setWebhookUrl,
    optInMessage,
    setOptInMessage,
    optOutMessage,
    setOptOutMessage,
    optOutKeywords,
    setOptOutKeywords,
    brandName,
    setBrandName,
    revokeOptOutMessage,
    setRevokeOptOutMessage,
    revokeOptOutKeywords,
    setRevokeOptOutKeywords,
    industryId,
    setIndustryId,
    industryType,
    setIndustryType,
    addressLine1,
    setAddressLine1,
    addressLine2,
    setAddressLine2,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    countryIso,
    setCountryIso,
    contactFirstName,
    setContactFirstName,
    contactLastName,
    setContactLastName,
    contactDesignation,
    setContactDesignation,
    email,
    setEmail,
    mobile,
    setMobile,
    brandWebsite,
    setBrandWebsite,
    brandLogoUrl,
    setBrandLogoUrl,
    screenImages,
    panCard,
    aadharCard,
  } = useRcsBotVerifyStore();
  return (
    <Card className="max-w-5xl mx-auto shadow-lg h-full border border-transparent dark:border-default">
      <CardHeader className="bg-primary-50 p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon icon="icons8:organization" width="1.4em" height="1.4em" />
          Brand Information
        </h2>
      </CardHeader>
      <CardBody className="p-10">
        <h1 className="text-md font-medium mb-3 -mt-4">
          Let's get to know your brand better.
        </h1>
        <div className="flex flex-col gap-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              size="sm"
              radius="sm"
              variant="flat"
              isRequired
              label={t("Brand Name")}
              onValueChange={(value) => setBrandName(value)}
              value={brandName}
            />
            <Input
              size="sm"
              radius="sm"
              variant="flat"
              isRequired
              label="Brand website"
              value={brandWebsite}
              onValueChange={(value) => setBrandWebsite(value)}
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              size="sm"
              radius="sm"
              variant="flat"
              label={t("Brand Logo URL")}
              value={brandLogoUrl}
              onValueChange={(value) => setBrandLogoUrl(value)}
            />
            <Select
              size="sm"
              radius="sm"
              variant="flat"
              isRequired
              label={t("Industry Type")}
              items={industries}
              value={industryId}
              onChange={(e) => setIndustryId(e.target.value)}
            >
              {(industries) => <SelectItem>{industries.label}</SelectItem>}
            </Select>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("Address Line 1")}
              info="false"
              value={addressLine1}
              charsAllowed={100}
              onChange={(value) => setAddressLine1(value)}
            />
            <InputField
              label={t("Address Line 2")}
              info="false"
              value={addressLine2}
              charsAllowed={100}
              onChange={(value) => setAddressLine2(value)}
            />
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("City")}
              info="false"
              charsAllowed={100}
              value={city}
              onChange={(value) => setCity(value)}
            />
            <InputField
              label={t("State")}
              info="false"
              charsAllowed={128}
              value={state}
              onChange={(value) => setState(value)}
            />
          </div>

          {/* Fifth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("Zip Code")}
              info="false"
              charsAllowed={128}
              value={zipCode}
              onChange={(value) => setZipCode(value)}
            />
            <Input
              size="sm"
              radius="sm"
              variant="flat"
              isRequired
              label={t("Country Short Code")}
              placeholder="IN"
              value={countryIso}
              onValueChange={(value) => setCountryIso(value)}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Brandig;
