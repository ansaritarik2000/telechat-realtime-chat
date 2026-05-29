import { Button } from "@heroui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSendWhatsappStore } from "../../../../../../../../store/whatsapp/whatsappStore";
import { ResetIcon } from "../../../../../../../../utils/ReusableIcons";

const SelectAudienceAlert = () => {
    // zustand store
    const {
        setPhoneNumbers,
        setCsvFile,
        setFileProcessingInfo,
        contactUploadedFrom,
        setContactUploadedFrom,
    } = useSendWhatsappStore();

    // This is from "react-i18next". Working is to translate text
    const { t } = useTranslation();

    return (
        <div className="w-full max-w-4xl rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full h-fit gap-1">
                <span className="text-center text-md">
                    {t(
                        "Audience contacts have been already imported from {{source}}.",
                        {
                            source: contactUploadedFrom,
                        }
                    )}
                </span>

                <span className="text-center text-xs mb-7">
                    {t(
                        "To use this feature, please reset the existing contacts."
                    )}
                </span>
            </div>
            <Button
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => {
                    setPhoneNumbers([]);
                    setContactUploadedFrom(null);
                    setCsvFile(null);
                    setFileProcessingInfo(null);
                }}
                startContent={<ResetIcon customClass="text-primary" />}
            >
                {t("Reset Audience")}
            </Button>
        </div>
    );
};

export default SelectAudienceAlert;
