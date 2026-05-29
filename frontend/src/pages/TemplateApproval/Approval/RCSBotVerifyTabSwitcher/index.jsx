import React, { useState, useEffect } from "react";
import Brandig from "./Brandig";
import PointOfContract from "./PointOfContract";
import AssistanceExperience from "./AssistanceExperience";
import AssistancePreview from "./AssistancePreview";
import { Button, Divider } from "@heroui/react";
import { t } from "i18next";
import StepperComponent from "../../../../components/Stepper/Step";
import toast from "react-hot-toast";
import { verifyBotService } from "../../../../services/Rcs/rcsBotService";
import { useRcsBotVerifyStore } from "../../../../store/rcsBotVerifyStore";
import { useLocation } from "react-router-dom";
import {
  LeftBackArrow,
  RightForwardArrow,
} from "../../../../utils/ReusableIcons";

const RcsBotVerifyTabSwitcher = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const {
    pointOfContacts,
    videoUrl,
    botAccessInstructions,
    triggerAction,
    botInteractionTypes,
    webhookUrl,
    optInMessage,
    optOutMessage,
    optOutKeywords,
    brandName,
    industryId,
    industryType,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    revokeOptOutKeywords,
    countryIso,
    contactFirstName,
    contactLastName,
    email,
    mobile,
    brandWebsite,
    brandLogoUrl,
    screenImages,
    panCard,
    aadharCard,
    revokeOptOutMessage,
    contactDesignation,
  } = useRcsBotVerifyStore();

  const location = useLocation();
  const botId = new URLSearchParams(location.search).get("botId");
  const brandId = new URLSearchParams(location.search).get("brandId");
  const token = localStorage.getItem("token");

  const steps = [
    { title: "Branding", component: <Brandig /> },
    { title: "Point of Contact", component: <PointOfContract /> },
    { title: "Assistance Experience", component: <AssistanceExperience /> },
    { title: "Assistance Preview", component: <AssistancePreview /> },
  ];

  // Define required fields for each step
  const requiredFields = [
    [
      brandName,
      brandWebsite,
      industryId,
      addressLine1,
      city,
      state,
      countryIso,
    ], // Branding
    pointOfContacts.map((contact) => [
      contact.firstName,
      contact.lastName,
      contact.email,
      contact.mobile,
    ]),
    [
      webhookUrl,
      optInMessage,
      optOutKeywords,
      optOutMessage,
      botAccessInstructions,
      triggerAction,
      botInteractionTypes,
      revokeOptOutKeywords,
      revokeOptOutMessage,
      videoUrl,
      // ...screenImages,
      // panCard,
      // aadharCard,
    ],
    [],
  ];

  // Validation function
  const validateStep = () => {
    const fields = requiredFields[currentStep];

    if (currentStep === 1) {
      // Ensure pointOfContacts is an array and each contact has required fields
      const isValid =
        Array.isArray(pointOfContacts) &&
        pointOfContacts.length > 0 &&
        pointOfContacts.every(
          (contact) =>
            contact.firstName?.trim() &&
            contact.lastName?.trim() &&
            contact.email?.trim() &&
            contact.mobile?.trim()
        );

      setIsNextDisabled(!isValid);
    } else {
      const isValid = fields.every((field) =>
        Array.isArray(field) ? field.length > 0 : field?.trim()
      );
      setIsNextDisabled(!isValid);
    }
  };

  console.log("pointOfContacts", pointOfContacts);
  // Run validation when step changes
  useEffect(() => {
    validateStep();
  }, [
    optOutKeywords,
    pointOfContacts,
    currentStep,
    brandName,
    brandWebsite,
    addressLine1,
    city,
    state,
    countryIso,
    industryId,
    industryType,
    contactFirstName,
    contactLastName,
    email,
    mobile,
    webhookUrl,
    optInMessage,
    optOutMessage,
    botAccessInstructions,
    botInteractionTypes,
    revokeOptOutKeywords,
    revokeOptOutMessage,
    triggerAction,
    screenImages,
    panCard,
    aadharCard,
    videoUrl,
  ]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // verify Bots Handller
  const verifyBotsHandller = async () => {
    try {
      const botData = {
        botId,
        webhookUrl,
        optInMessage,
        videoUrl,
        botAccessInstructions,
        triggerAction,
        botInteractionTypes,
        screenImages:
          screenImages && [...screenImages].length > 0
            ? [...screenImages].map((item) => {
                console.log("item", item.name);
                image_name: item.name;
              })
            : [],
        optOutKeywords,
        optOutMessage,
        revokeOptOutKeywords,
        revokeOptOutMessage,
        brandName,
        brandId,
        brandLogoUrl,
        industryId,
        industryType,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        countryIso,
        contactFirstName,
        contactLastName,
        contactDesignation,
        email,
        mobile,
        brandWebsite,
        panCardFileName: panCard && panCard.length > 0 ? panCard[0].name : "",
        aadharCardFileName:
          aadharCard && aadharCard.length > 0 ? aadharCard[0].name : "",
        screenImagesFiles: screenImages,
        kycDocsFiles: [
          panCard && panCard.length > 0 ? panCard[0] : null,
          aadharCard && aadharCard.length > 0 ? aadharCard[0] : null,
        ],
      };

      const response = await verifyBotService(token, botData);
      if (response.status === "SUCCESS") {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="rounded-md  flex flex-col gap-4 max-w-5xl mx-auto min-h-[85vh]">
      {/* Stepper */}
      <StepperComponent
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        steps={steps}
      />

      {/* Current Step Component */}
      <div className="flex-grow h-full p-1">{steps[currentStep].component}</div>

      {/* Footer */}
      <div className="flex flex-col gap-6">
        <Divider />

        {/* Buttons */}
        <div className="flex justify-between mb-4">
          {
            <Button
              size="md"
              radius="sm"
              variant="flat"
              isDisabled={currentStep < 1}
              color="success"
              onPress={handlePrevious}
              startContent={<LeftBackArrow customClass="text-success" />}
            >
              {t("Previous")}
            </Button>
          }
          <div className="ml-auto">
            {currentStep < steps.length - 1 && (
              <Button
                size="md"
                variant="flat"
                radius="sm"
                color="success"
                onPress={handleNext}
                isDisabled={isNextDisabled}
                endContent={<RightForwardArrow customClass="text-success" />}
              >
                {t("Next")}
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                size="md"
                radius="sm"
                variant="shadow"
                color="success"
                onPress={() => verifyBotsHandller()}
              >
                {t("Submit")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RcsBotVerifyTabSwitcher;
