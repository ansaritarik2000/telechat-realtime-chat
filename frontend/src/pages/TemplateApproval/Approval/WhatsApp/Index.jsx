import React, { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Input,
  SelectSection,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { countries } from "../../../../constants/countries";
import { useWhatsappTemplateStore } from "../../../../store/templateApprovalStore";
import HeaderInput from "./ActionButtons/InputFilelds/HeaderInput";
import WrapperComponents from "./ActionButtons/InputFilelds/WrapperComponents";
import CarouselBody from "./ActionButtons/InputFilelds/CarouselBody";
import {
  MediaType,
  TimeOfferInput,
} from "./ActionButtons/InputFilelds/MediaType";
import CatalogIndex from "./CatalogMsg/CatalogIndex";

const wabaIds = [
  { key: "waba-id-1", label: "+91-1234567890" },
  { key: "waba-id-2", label: "+91-9876543210" },
  { key: "waba-id-3", label: "+91-8765432100" },
];

// Carousel Template Types
const carouselTemplateTypes = [
  { key: "text", label: "Text" },
  { key: "document", label: "Document" },
  { key: "image", label: "Image" },
  { key: "video", label: "Video" },
  { key: "location", label: "Location" },
  { key: "carousel", label: "Carousel" },
];
const LTO = [
  { key: "WithExpiration", label: "With Expiration Time" },
  { key: "WithoutExpiration", label: "Without Expiration Time" },
];
const Products = [
  { key: "Catalogue-product", label: "Catalogue Message" },
  { key: "Multi-product", label: "Multi-product Messages" },
];
export default function WhatsAppIndex() {
  const maxChars = 16;
  const headingClasses =
    "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-50 shadow-small rounded-md";
  const {
    updateField,
    setTextMessageContent,
    selectedCategory,
    selectedTemplateType,
    selectedWabaid,
    resetStore,
    setCountryLable,
    templateName,
  } = useWhatsappTemplateStore();
  useEffect(() => {
    resetStore();
  }, []);
  // Handle selection change properly
  const handleChange = (e) => {
    setTextMessageContent({
      textMessage: "",
      variables: [],
    });

    updateField(e.target.name, e.target.value);
    // show the country name
    const country = countries?.find((cnt) => cnt.key === e.target.value);
    setCountryLable(country?.label);
  };
  const handleChangeTemplate = (e) => {
    updateField(e.target.name, e.target.value);
  };
  const handleChangeTemplateName = (e) => {
    // const value = e.target.value.replace(/\s+/g, "_").toLowerCase();
    const value = e.target.value
      .replace(/\s+/g, "_") // Replace spaces with underscores
      // .replace(/[^a-z0-9_]/g, "")  // Remove anything that is not a-z, 0-9, or _
      .toLowerCase();
    updateField(e.target.name, value);
  };
  return (
    <div className="flex gap-6 flex-col h-full r">
      {/* WABA ID & Category */}
      <div className="flex justify-between gap-4 items-center">
        {/* Select WABA ID */}
        <Select
          isRequired
          label="Select WABA ID "
          className="max-w-xs"
          size="md"
          radius="sm"
          name="selectedWabaid"
          onChange={handleChange}
          value={selectedWabaid ?? ""}
        >
          {wabaIds.map((wabaid) => (
            <SelectItem key={wabaid.key}>{wabaid.label}</SelectItem>
          ))}
        </Select>

        {/* Category Select */}
        <Select
          isRequired
          label="Category"
          className="max-w-xs"
          size="md"
          radius="sm"
          name="selectedCategory"
          isDisabled={!selectedWabaid}
          onChange={handleChange}
          value={selectedCategory || ""}
          disallowEmptySelection={true}
        >
          <SelectItem key="marketing">Marketing</SelectItem>
          <SelectItem key="utility">Utility</SelectItem>
        </Select>

        {/* Template Type */}
        <Select
          isRequired
          label="Template Type"
          className="max-w-xs "
          size="md"
          radius="sm"
          value={selectedTemplateType || ""}
          name="selectedTemplateType"
          isDisabled={!selectedWabaid || !selectedCategory}
          onChange={handleChange}
          disallowEmptySelection={true}
        >
          <SelectSection
            classNames={{
              heading: headingClasses,
            }}
            title="Media"
          >
            {carouselTemplateTypes.map((templateType) => (
              <SelectItem key={templateType.key}>
                {templateType.label}
              </SelectItem>
            ))}
          </SelectSection>
          {selectedCategory === "marketing" ? (
            <>
              <SelectSection
                classNames={{
                  heading: headingClasses,
                }}
                title="Product Messages"
              >
                {Products?.map((product) => (
                  <SelectItem key={product.key}>{product.label}</SelectItem>
                ))}
              </SelectSection>
              <SelectSection
                classNames={{
                  heading: headingClasses,
                }}
                title="Limited Time Offer"
              >
                {LTO?.map((lto) => (
                  <SelectItem key={lto.key}>{lto.label}</SelectItem>
                ))}
              </SelectSection>
            </>
          ) : null}
        </Select>
      </div>

      {/* Template Name, Language */}
      {!selectedTemplateType ? null : (
        <div className="flex justify-around  gap-4 items-center">
          {/* Template Name */}
          <Input
            isRequired
            label="Template Name"
            className="flex-1 "
            size="md"
            radius="sm"
            name="templateName"
            pattern="[a-z0-9_]+"
            value={templateName}
            onChange={handleChangeTemplateName}
          />

          {/* Language */}
          {selectedTemplateType !== "Catalogue-product" && (
            <Select
              isRequired
              label="Language"
              className="max-w-xs"
              size="md"
              radius="sm"
              name="selectedCountry"
              onChange={handleChange}
            >
              {countries.map((country) => (
                <SelectItem key={country.key} value={country.key}>
                  {country.label}
                </SelectItem>
              ))}
            </Select>
          )}
        </div>
      )}

      {/* Catalogue Message */}
      {selectedTemplateType === "Catalogue-product" && <CatalogIndex />}

      {/* Message Box */}
      {selectedTemplateType === "text" ? (
        <div>
          <HeaderInput />
          <WrapperComponents />{" "}
        </div>
      ) : selectedTemplateType === "document" ? (
        // <FileUploadIndex />
        <>
          {" "}
          <WrapperComponents />{" "}
        </>
      ) : selectedTemplateType === "image" ? (
        // <ImageUpload />
        <>
          <WrapperComponents />
        </>
      ) : selectedTemplateType === "video" ? (
        // <VideoUpload />
        <>
          <WrapperComponents />
        </>
      ) : selectedTemplateType === "location" ? (
        <WrapperComponents />
      ) : selectedTemplateType === "carousel" ? (
        <>
          <CarouselBody />
          <WrapperComponents />
        </>
      ) : ["WithExpiration", "WithoutExpiration"].includes(
          selectedTemplateType
        ) ? (
        <>
          <MediaType />
          <WrapperComponents />
        </>
      ) : null}
    </div>
  );
}
