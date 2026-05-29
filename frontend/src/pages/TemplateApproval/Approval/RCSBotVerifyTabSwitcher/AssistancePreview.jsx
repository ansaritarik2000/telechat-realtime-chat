import React from "react";
import { Icon } from "@iconify/react";
import { useRcsBotVerifyStore } from "../../../../store/rcsBotVerifyStore";
import { Card, CardBody, CardHeader } from "@heroui/react";
import InfoRow from "./InoRow";
import InfoRowLink from "./InfoRowLink";

const AssistancePreview = () => {
  const {
    brandName,
    botId,
    videoUrl,
    botAccessInstructions,
    triggerAction,
    botInteractionTypes,
    webhookUrl,
    brandWebsite,
    brandLogoUrl,
    industryId,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    countryIso,
    pointOfContacts,
    optInMessage,
    optOutKeywords,
    optOutMessage,
    revokeOptOutKeywords,
    revokeOptOutMessage,
    screenImages,
    panCard,
    aadharCard,
  } = useRcsBotVerifyStore();

  return (
    <Card className="max-w-5xl mx-auto shadow-lg border border-transparent  dark:border-default">
      <CardHeader className="bg-primary-50 p-6">
        <h2 className="text-xl font-semibold   flex items-center gap-1">
          <Icon icon="mage:preview" width="24" height="24" />
          Form Preview
        </h2>
      </CardHeader>
      <CardBody className="p-6">
        <div className="flex flex-col gap-6">
          {/* Branding Card */}
          <Card className="border border-default rounded-lg shadow-sm p-4">
            <CardHeader className="flex justify-between items-center pb-4 border-b border-default">
              <h3 className="text-lg font-semibold text-success">Branding</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-6 text-lg">
                {/* Basic Details */}
                <InfoRow label="Brand Name" value={brandName} />
                <InfoRowLink label="Brand Website" url={brandWebsite} />
                <InfoRow label="Brand Logo URL" value={brandLogoUrl} />
                <InfoRow label="Industry ID" value={industryId} />

                <InfoRow label="Address Line 1" value={addressLine1} />
                <InfoRow label="Address Line 2" value={addressLine2} />
                <InfoRow label="City" value={city} />
                <InfoRow label="State" value={state} />
                <InfoRow label="Zip Code" value={zipCode} />
                <InfoRow label="Country Short Code" value={countryIso} />
              </div>
            </CardBody>
          </Card>

          {/* Point of Contact Card */}
          <Card className="border border-default rounded-lg shadow-sm p-4">
            <CardHeader className="flex justify-between items-center pb-4 border-b border-default">
              <h3 className="text-lg font-semibold text-success">
                Point of Contact
              </h3>
            </CardHeader>
            <CardBody>
              {pointOfContacts?.length > 0 &&
                pointOfContacts.map((contact, index) => (
                  <div key={index}>
                    <h2 className="text-md font-medium my-2 text-primary">
                      Contact {index + 1}
                    </h2>
                    <div className="grid grid-cols-2 gap-6 text-lg">
                      <InfoRow
                        label="Contact First Name"
                        value={contact.firstName}
                      />
                      <InfoRow
                        label="Contact Last Name"
                        value={contact.lastName}
                      />
                      <InfoRow
                        label="Contact Designation"
                        value={contact.designation}
                      />
                      <InfoRow label="Email" value={contact.email} />
                      <InfoRow label="Mobile" value={contact.mobile} />
                    </div>
                  </div>
                ))}
            </CardBody>
          </Card>

          {/* Assistance Experience Card */}
          <Card className="border border-default rounded-lg shadow-sm p-4">
            <CardHeader className="flex justify-between items-center pb-4 border-b border-default">
              <h3 className="text-lg font-semibold text-success">
                Assistance Experience
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-6 text-lg">
                <InfoRow
                  label="What actions trigger messages to users?"
                  value={triggerAction}
                />
                <InfoRow
                  label="What types of interactions will the bot have with users?"
                  value={botInteractionTypes}
                />
                <InfoRow
                  label="How do you ensure consent, so that only the users who have opted-in will receive messages from your bot?"
                  value={optInMessage}
                />
                <InfoRow
                  label="What are the opt-out keywords for the bot?"
                  value={optOutKeywords}
                />
                <InfoRow
                  label="What message does the bot send when a user opts out?"
                  value={optOutMessage}
                />

                <InfoRow
                  label="What keywords can the user send to revoke the opt-out and start receiving messages again?"
                  value={revokeOptOutKeywords}
                />

                <InfoRow
                  label="What message does the bot send when a user revokes opt-out?"
                  value={revokeOptOutMessage}
                />
                <InfoRow
                  label="Bot Access Instructions"
                  value={botAccessInstructions}
                />
                <InfoRow label="Webhook URL" value={webhookUrl} />

                <InfoRow label="Bot ID" value={botId} />
                <InfoRow label="Video URL" value={videoUrl} />

                {/* Screen Images */}
                <div className="col-span-2">
                  <span className="font-md text-sm">Screen Images:</span>
                  <div className="flex gap-4 flex-wrap">
                    {screenImages?.length ? (
                      [...screenImages].map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Screen ${index + 1}`}
                          className="w-32 h-32 rounded-md"
                        />
                      ))
                    ) : (
                      <span className="text-sm text-default-500">N/A</span>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="flex flex-col">
                  <span className="font-md text-sm">PAN Card:</span>
                  {panCard ? (
                    <a
                      href={URL.createObjectURL(panCard)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View PAN Card
                    </a>
                  ) : (
                    <span className="text-sm text-default-500">N/A</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-md text-sm">Aadhar Card:</span>
                  {aadharCard ? (
                    <a
                      href={URL.createObjectURL(aadharCard)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Aadhar Card
                    </a>
                  ) : (
                    <span className="text-sm text-default-500">N/A</span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

export default AssistancePreview;
