import React from "react";
import InputField from "../RCSBot/InputField";
import { t } from "i18next";
import { useRcsBotVerifyStore } from "../../../../store/rcsBotVerifyStore";
import FooterButtons from "./Buttons/Index";
import FileUpload from "./FileUpload/FileUpload";
import { useLocation } from "react-router-dom";
import { verifyBotService } from "../../../../services/Rcs/rcsBotService";
import toast from "react-hot-toast";

const RcsBotVerify = () => {
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
        screenImagesFileNames,
        panCardFileName,
        aadharCardFileName,
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

    const location = useLocation(); // Get the current location object
    const botId = new URLSearchParams(location.search).get("botId");
    const brandId = new URLSearchParams(location.search).get("brandId");
    const token = localStorage.getItem("token");

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
                screenImages: screenImagesFileNames,
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
                panCardFileName,
                aadharCardFileName,
                screenImagesFiles: screenImages,
            };
            const kycDocsFiles = [
                panCard && panCard.length > 0 ? panCard[0] : null,
                aadharCard && aadharCard.length > 0 ? aadharCard[0] : null,
            ];
            const formData = new FormData();
            formData.append("botData", JSON.stringify(botData));
            formData.append("screenImagesFiles", screenImages);
            formData.append("kycDocsFiles", kycDocsFiles);
            const response = await verifyBotService(token, formData);
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
        <>
            {/* Webhook URL */}
            <InputField
                label={t("Webhook URL")}
                info="false"
                charsAllowed={2048}
                value={webhookUrl}
                onChange={(value) => setWebhookUrl(value)}
            />

            {/* Opt-In Message */}
            <InputField
                label={t("Opt-In Message")}
                info="false"
                charsAllowed={3072}
                value={optInMessage}
                onChange={(value) => setOptInMessage(value)}
                className="-mt-4"
            />

            {/* Video Url */}
            <InputField
                label={t("Video Url")}
                info="Please provide a valid drive url"
                charsAllowed={2048}
                value={videoUrl}
                onChange={(value) => setVideoUrl(value)}
                className="-mt-4"
            />

            {/* Opt-Out Message */}
            <InputField
                label={t("Opt-Out Message")}
                info="false"
                charsAllowed={512}
                value={optOutMessage}
                onChange={(value) => setOptOutMessage(value)}
                className="-mt-4"
            />

            {/* Opt-Out Keywords */}
            <InputField
                label={t("Opt-Out Keywords")}
                info="false"
                charsAllowed={512}
                value={optOutKeywords}
                onChange={(value) => setOptOutKeywords(value)}
                className="-mt-4"
            />

            {/* Revoke Opt-Out Keywords */}
            <InputField
                label={t("Revoke Opt-Out Keywords")}
                info="false"
                charsAllowed={512}
                value={revokeOptOutKeywords}
                onChange={(value) => setRevokeOptOutKeywords(value)}
                isRequired={false}
            />

            {/* Revoke Opt-Out Message */}
            <InputField
                label={t("Revoke Opt-Out Message")}
                info="false"
                charsAllowed={512}
                value={revokeOptOutMessage}
                onChange={(value) => setRevokeOptOutMessage(value)}
                className="-mt-4"
            />

            {/* Bot Access Instructions */}
            <InputField
                label={t("Bot Access Instructions")}
                info="false"
                charsAllowed={512}
                value={botAccessInstructions}
                onChange={(value) => setBotAccessInstructions(value)}
                className="-mt-4"
            />

            {/* Trigger Actions */}
            <InputField
                label={t("Trigger Actions")}
                info="false"
                charsAllowed={3072}
                value={triggerAction}
                onChange={(value) => setTriggerAction(value)}
                className="-mt-4"
            />

            {/* Bot Interaction Types */}
            <InputField
                label={t("Bot Interaction Types")}
                info="false"
                charsAllowed={3072}
                value={botInteractionTypes}
                onChange={(value) => setBotInteractionTypes(value)}
                className="-mt-4"
            />

            {/* Screen Images */}
            <h2 className="text-lg font-semibold text-primary mt-2">
                {t("Screen Images")}
            </h2>
            <FileUpload
                fileType={"image"}
                allowedFiles={"image/*"}
                isMultiplesFile={true}
                documentsName={"screenImages"}
            />

            {/* KYC Details */}
            <div className="flex  gap-8">
                <div>
                    <h2 className="text-lg font-semibold text-primary mb-2">
                        {t("PAN Card of Company")}
                    </h2>
                    <FileUpload
                        allowedFiles={"pdf/*"}
                        isMultiplesFile={false}
                        fileType={"pdf"}
                        documentsName={"panCard"}
                    />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary mb-2">
                        {t("Aadhar Card ")}
                    </h2>
                    <FileUpload
                        allowedFiles={"application/pdf"}
                        isMultiplesFile={false}
                        fileType={"pdf"}
                        documentsName={"aadharCard"}
                    />
                </div>{" "}
            </div>

            {/* Brand Details */}
            <h2 className="text-lg font-semibold text-primary mt-2">
                {t("Brand Details")}
            </h2>
            <InputField
                label={t("Brand Name")}
                info="false"
                className="-mt-4"
                onChange={(value) => setBrandName(value)}
                value={brandName}
            />

            {/* Brand logo Url */}
            <InputField
                label={t("Brand Logo URL")}
                info="false"
                className="-mt-4"
                isRequired={false}
                value={brandLogoUrl}
                onChange={(value) => setBrandLogoUrl(value)}
            />

            {/* Industry ID */}
            <InputField
                label={t("Industry ID")}
                info="false"
                className="-mt-4"
                value={industryId}
                onChange={(value) => setIndustryId(value)}
            />

            {/* Industry Type */}
            <InputField
                label={t("Industry Type")}
                info="false"
                className="-mt-4"
                value={industryType}
                onChange={(value) => setIndustryType(value)}
            />

            <h2 className="text-lg font-semibold text-primary mt-2">Address</h2>
            {/* Address Line 1 */}
            <InputField
                label={t("Address Line 1")}
                info="false"
                className="-mt-4"
                value={addressLine1}
                charsAllowed={100}
                onChange={(value) => setAddressLine1(value)}
            />

            {/* Address Line 2 */}
            <InputField
                label={t("Address Line 2")}
                info="false"
                className="-mt-4"
                value={addressLine2}
                charsAllowed={100}
                onChange={(value) => setAddressLine2(value)}
                isRequired={false}
            />
            {/* City */}
            <InputField
                label={t("City")}
                info="false"
                className="-mt-4"
                charsAllowed={100}
                value={city}
                onChange={(value) => setCity(value)}
            />
            {/* State */}
            <InputField
                label={t("State")}
                info="false"
                className="-mt-4"
                charsAllowed={128}
                value={state}
                onChange={(value) => setState(value)}
            />

            {/* Zip Code */}
            <InputField
                label={t("Zip Code")}
                info="false"
                className="-mt-4"
                charsAllowed={128}
                value={zipCode}
                onChange={(value) => setZipCode(value)}
                isRequired={false}
            />

            {/* Country ISO */}
            <InputField
                label={t("Country ISO")}
                info="false"
                className="-mt-4"
                value={countryIso}
                onChange={(value) => setCountryIso(value)}
                isRequired={false}
            />

            {/* Brand Emails */}
            <InputField
                label="Contact First Name"
                info="false"
                className="-mt-4"
                value={contactFirstName}
                onChange={(value) => setContactFirstName(value)}
            />
            <InputField
                label="Contact Last Name"
                info="false"
                className="-mt-4"
                value={contactLastName}
                onChange={(value) => setContactLastName(value)}
            />
            <InputField
                label="Contact Designation"
                info="false"
                className="-mt-4"
                value={contactDesignation}
                onChange={(value) => setContactDesignation(value)}
            />

            <InputField
                label="Email"
                info="false"
                className="-mt-4"
                value={email}
                onChange={(value) => setEmail(value)}
            />
            <InputField
                label="Mobile"
                info="false"
                className="-mt-4"
                value={mobile}
                onChange={(value) => setMobile(value)}
                isRequired={false}
            />

            {/* Brand Website */}
            <InputField
                label="Brand website"
                info="false"
                className="-mt-4"
                value={brandWebsite}
                onChange={(value) => setBrandWebsite(value)}
            />
            {/* Footer Buttons */}
            <FooterButtons onSubmitHandller={verifyBotsHandller} />
        </>
    );
};

export default RcsBotVerify;

// {
//     "bot_id": "h8THFdilrrkrgZMUDw",
//     "webhook_url": "https://google.com/webhook",
//     "opt_in_message": "Consent to send messages to a user’s mobile number is obtained when the user creates an account or places an order on the website",
//     "video_url": "https://drive.google.com/drive/folders/1iDobC5e-KeNsSjqq_FN6W_pLDC6s7qP9?usp=sharing",
//     "bot_access_instructions": "This section seeks details on how your bot interacts with users.",
//     "trigger_action": "Triggers for Messages: Messages are triggered by user actions (e.g., making a purchase, requesting information) or external events (e.g., package delivery updates). First Message Timing: The first message is typically sent immediately after a user opts in or performs a trigger action, such as completing a purchase or signing up for notifications.",
//     "bot_interaction_types": "Triggers for Messages: Messages are triggered by user actions (e.g., making a purchase, requesting information) or external events (e.g., package delivery updates). First Message Timing: The first message is typically sent immediately after a user opts in or performs a trigger action, such as completing a purchase or signing up for notifications.",
//     "screen_image": [
//         {
//             "image_name": "8.png"
//         },
//         {
//             "image_name": "9.png"
//         },
//         {
//             "image_name": "10.png"
//         }
//     ],
//     "is_carrier_edited": true,
//     "carrier_list": [1, 416, 485, 100],
//     "is_opt_out_by_platform": true,
//     "opt_out_keywords": "STOP, UNSUBSCRIBE, CANCEL, END, BLOCK",
//     "opt_out_message": "You have successfully opted out of receiving messages from this bot. If this was a mistake or you wish to re-subscribe, reply with START.",
//     "revoke_opt_out_keywords": "START, SUBSCRIBE, RESUME, GO",
//     "revoke_opt_out_message": "Thank you for re-subscribing! You will now start receiving updates and offers from us again.",
//     "is_conversational_supported": false,
//     "brand_details": {
//         "brand_name": "snwenbr",
//         "brand_id": "4VLzJUzgI5GIffgwZhEDJA==",
//         "brand_logo_url": "https://botstore.info/rcsbotdirectory/partner/2935/brand/2547/logo/35a60b81-a2d2-4e32-a96e-522e2f394782.jpg",
//         "industry_id": 5,
//         "industry_type": "Telecom",
//         "is_brand_verified": false,
//         "address": {
//             "address_line_1": "5th floor, Altf Statesman House, Connaught Place",
//             "address_line_2": "6th floor, Altf Statesman House, Connaught Place",
//             "city": "Singrauli",
//             "state": "Madhya Pradesh",
//             "zip_code": "486886",
//             "country_iso": "IN"
//         },
//         "brand_emails_json": [
//             {
//                 "contact_first_name": "Sunsn legend",
//                 "contact_last_name": "bins",
//                 "contact_designation": "Emp Des",
//                 "email": "abcd@gmail.com",
//                 "mobile": "+919399130661"
//             }
//         ],
//         "brand_website": "https://telepie.com"
//     },
//     "kyc_details": [
//         {
//             "document_type": "business_name_doc",
//             "document_name": "PAN card of Company",
//             "file_name": "pancard.pdf",
//             "document_type_id": 1
//         },
//         {
//             "document_type": "business_address_doc",
//             "document_name": "Aadhar card",
//             "file_name": "aadharcard.pdf",
//             "document_type_id": 2
//         }
//     ]
// }
