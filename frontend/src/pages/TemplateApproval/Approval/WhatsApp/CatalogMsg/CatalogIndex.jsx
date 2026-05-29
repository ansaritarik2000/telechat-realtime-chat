import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";

// Reusable button component
const MetaButton = ({ children, href }) => (
  <Button
    isExternal
    showAnchorIcon
    as={Link}
    href={href}
    rel="noopener noreferrer"
    size="sm"
    color="primary"
    variant="bordered"
    className="w-fit shadow-sm"
  >
    {children}
  </Button>
);

// Reusable card component
const StepCard = ({ step, title, description, children, hasMeta }) => (
  <Card className="shadow-md border border-green-100 dark:border-green-700/50">
    <CardHeader className="p-4 bg-success-50/50">
      <h3 className="text-md text-green-700 dark:text-green-300 flex items-center gap-2">
        <Icon icon="lets-icons:check-fill" width="20" height="20" />
        <span>Step {step} :</span>
        <span>{title}</span>
      </h3>
    </CardHeader>
    <CardBody className="p-6">
      {hasMeta ? (
        <div className="flex justify-between items-center gap-4">
          <p className="text-default-500 text-sm dark:text-default-400 flex-1">
            {description}
          </p>
          {children}
        </div>
      ) : (
        <>
          <p className="text-default-500 text-sm dark:text-default-400 mb-4">
            {description}
          </p>
          {children}
        </>
      )}
    </CardBody>
  </Card>
);

export default function CatalogIndex() {
  const [catalogId, setCatalogId] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [isListSelected, setIsListSelected] = useState(false);

  // Dummy list options
  const listOptions = [
    { key: "list1", label: "List 1" },
    { key: "list2", label: "List 2" },
  ];

  const handleConnectClick = () => {
    // console.log("Connecting to catalog with ID:", catalogId);
  };

  const handleListSelect = (keys) => {
    const listKey = Array.from(keys)[0];
    setSelectedList(listKey);
    setIsListSelected(true);
  };

  const handleUpdateListClick = () => {
    // console.log("Updating list with ID:", selectedList);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1: Create Catalog */}
      <StepCard
        step={1}
        hasMeta={true}
        title="Create Catalog"
        description="Create a catalog in Meta using the same account linked to your WhatsApp number. Add items manually, or link with data sources like Google Sheets, or Shopify. Head back to Telepie Dashboard once the catalog is set up with items."
      >
        <MetaButton href="https://business.facebook.com/">
          Go to Meta
        </MetaButton>
      </StepCard>

      {/* Step 2: Connect Catalog To Whatsapp Account */}
      <StepCard
        step={2}
        hasMeta={true}
        title="Connect Catalog To Whatsapp Account"
        description="Now, link the catalog to your WhatsApp number. Go to Meta and connect them."
      >
        <MetaButton href="https://business.facebook.com/">
          Go to Meta
        </MetaButton>
      </StepCard>

      {/* Step 3: Assign Telepie as Catalog Partner */}
      <StepCard
        step={3}
        hasMeta={true}
        title="Assign Telepie as Catalog Partner"
        description={`Navigate to Business Manager settings > Data Sources > Catalog > Partner tab. Click "Assign Partner," choose the Business ID option, enter Telepie's Business Manager ID (833839258439950), and save the settings.`}
      >
        <MetaButton href="https://business.facebook.com/">
          Go to Meta
        </MetaButton>
      </StepCard>

      {/* Step 4: Enter Facebook Catalog ID */}
      <StepCard
        step={4}
        hasMeta={false}
        title="Enter Facebook Catalog ID"
        description="Copy Catalog ID from Business Settings page and paste in field below and Hit the Connect button."
      >
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            type="text"
            placeholder="Enter Catalog ID"
            value={catalogId}
            onChange={(e) => setCatalogId(e.target.value)}
            className="flex-1"
            radius="sm"
            variant="bordered"
          />
          <Button
            color="success"
            onPress={handleConnectClick}
            radius="sm"
            variant="flat"
            className="w-fit"
            startContent={<Icon icon="bx:refresh" width="20" height="20" />}
          >
            Connect & Refresh Products
          </Button>
        </div>
      </StepCard>

      {/* Step 5: Link Telepie's List (Optional) */}
      <StepCard
        step={5}
        hasMeta={false}
        title="Link Telepie's List (Optional)"
        description="Store new orders in the Telepie List and connect them with the respective customers. We've made it easy with the 'WhatsApp Product Orders' template. Simply go to the navigation, select 'Add List,' choose the template, and return here to link it."
      >
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Select
            placeholder="Select the list to link"
            selectedKeys={selectedList ? new Set([selectedList]) : new Set([])}
            onSelectionChange={handleListSelect}
            className="flex-1"
            variant="bordered"
          >
            {listOptions.map((list) => (
              <SelectItem key={list.key} value={list.key}>
                {list.label}
              </SelectItem>
            ))}
          </Select>
          <Button
            color="success"
            onPress={handleUpdateListClick}
            isDisabled={!isListSelected}
            radius="sm"
            variant="flat"
            className="w-fit"
            startContent={<Icon icon="bx:refresh" width="20" height="20" />}
          >
            Update List
          </Button>
        </div>
      </StepCard>
    </div>
  );
}
