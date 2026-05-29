import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import CustomInputText from "./CustomInputText";
import UploadFile from "./UploadFile";
import { useRcsBotVerifyStore } from "../../../../store/rcsBotVerifyStore";

const AssistanceExperience = () => {
  const {
    screenImages,
    setScreenImages,
    screenImagesFileNames,
    setScreenImagesFileNames,
    panCardFileName,
    aadharCardFileName,
    setPanCardFileName,
    setAadharCardFileName,
    panCard,
    setPanCard,
    aadharCard,
    setAadharCard,
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
    revokeOptOutMessage,
    setRevokeOptOutMessage,
    revokeOptOutKeywords,
    setRevokeOptOutKeywords,
  } = useRcsBotVerifyStore();

  // Handle screen images change
  const handleScreenImagesChange = (e) => {
    const fileList = Array.from(e.target.files); // Convert FileList to an array
    setScreenImages(fileList); // Now it's a proper array

    if (fileList.length === 1) {
      setScreenImagesFileNames(fileList[0].name);
    } else if (fileList.length > 1) {
      const fileNames = fileList.map((file) => file.name).join(", ");
      setScreenImagesFileNames(fileNames);
    } else {
      setScreenImagesFileNames("");
    }
  };

  // Handle PAN card change
  const handlePanCardChange = (e) => {
    const fileList = e.target.files;
    setPanCard(fileList && fileList[0]);

    if (fileList?.length === 1) {
      setPanCardFileName(fileList[0].name);
    } else {
      setPanCardFileName("");
    }
  };

  // Handle Aadhaar card change
  const handleAadharCardChange = (e) => {
    const fileList = e.target.files;
    setAadharCard(fileList && fileList[0]);

    if (fileList?.length === 1) {
      setAadharCardFileName(fileList[0].name);
    } else {
      setAadharCardFileName("");
    }
  };

  return (
    <Card className="max-w-5xl mx-auto shadow-lg border border-transparent dark:border-default">
      <CardHeader className="bg-primary-50 p-6">
        <h2 className="text-xl font-semibold dark:text-white flex items-center justify-center">
          <Icon icon="bx:bot" width="1.5em" height="1.5em" className="mr-1" />
          Assistance Experience
        </h2>
      </CardHeader>
      <CardBody className="p-6">
        <div className="flex flex-col gap-6">
          {/* Bot Interactions Section */}
          <h2 className="text-md font-semibold ">{t("Bot Interactions")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInputText
              label={t("What actions trigger messages to users?")}
              info="false"
              charsAllowed={3072}
              value={triggerAction}
              onChange={(value) => setTriggerAction(value)}
            />
            <CustomInputText
              label={t(
                "What types of interactions will the bot have with users?"
              )}
              info="false"
              charsAllowed={3072}
              value={botInteractionTypes}
              onChange={(value) => setBotInteractionTypes(value)}
            />
          </div>

          {/* Consent Management Section */}
          <h2 className="text-md font-semibold ">{t("Consent Management")}</h2>
          <div className="w-full gap-4">
            <CustomInputText
              label={t(
                "How do you ensure consent, so that only the users who have opted-in will receive messages from your bot?*"
              )}
              info="false"
              charsAllowed={3072}
              value={optInMessage}
              onChange={(value) => setOptInMessage(value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInputText
              label={t("What are the opt-out keywords for the bot?")}
              info="true"
              description={t(
                "Please note that your bot should also process the opt-out keywords and honor the user request."
              )}
              charsAllowed={512}
              isRequired={false}
              value={optOutKeywords}
              onChange={(value) => setOptOutKeywords(value)}
            />
            <CustomInputText
              label={t("What message does the bot send when a user opts out?")}
              info="true"
              description="Please note that even if your bot sends a message in response to the opt-out request, it will not be sent to users as the platform blocks any further A2P messages from the bot."
              charsAllowed={512}
              value={optOutMessage}
              onChange={(value) => setOptOutMessage(value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInputText
              label={t(
                "What keywords from user can be used to start receiving messages again?"
              )}
              info="true"
              description="Please note that your bot should also process these keywords to cancel the opt-out from the user."
              charsAllowed={512}
              value={revokeOptOutKeywords}
              onChange={(value) => setRevokeOptOutKeywords(value)}
            />
            <CustomInputText
              label={t(
                "What message does the bot send when a user revokes opt-out?"
              )}
              info="false"
              charsAllowed={512}
              value={revokeOptOutMessage}
              onChange={(value) => setRevokeOptOutMessage(value)}
            />
          </div>

          {/* Bot Access Instructions Section */}
          <h2 className="text-md font-semibold ">{t("Bot Configuration")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInputText
              label={t("Bot Access Instructions")}
              info="false"
              inputType="input"
              charsAllowed={512}
              value={botAccessInstructions}
              onChange={(value) => setBotAccessInstructions(value)}
            />
            <CustomInputText
              label={t("Webhook URL")}
              info="false"
              inputType="input"
              charsAllowed={2048}
              value={webhookUrl}
              onChange={(value) => setWebhookUrl(value)}
            />
            <CustomInputText
              label={t("Video Url")}
              info="true"
              charsAllowed={2048}
              inputType="input"
              description="Please provide a valid Google Drive URL or publicly accessible URL."
              value={videoUrl}
              onChange={(value) => setVideoUrl(value)}
            />
          </div>

          {/* File Upload Section */}
          <h2 className="text-md font-semibold ">{t("Document Uploads")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UploadFile
              placeholder="Upload Screenshots"
              multiple={true}
              fileName={screenImagesFileNames}
              handleFileChange={handleScreenImagesChange}
            />
            <UploadFile
              placeholder="Upload PAN Card"
              fileName={panCardFileName}
              handleFileChange={handlePanCardChange}
            />
            <UploadFile
              placeholder="Upload Aadhaar Card"
              fileName={aadharCardFileName}
              handleFileChange={handleAadharCardChange}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AssistanceExperience;
