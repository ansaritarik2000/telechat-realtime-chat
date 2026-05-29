import React from "react";
import { Icon } from "@iconify-icon/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { InfoDuoTone } from "../../../../utils/ReusableIcons";

export default function Discard({ discardHandller }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { t } = useTranslation();
    return (
        <div>
            <Button
                size="md"
                radius="sm"
                startContent={
                    <Icon
                        icon="iconamoon:trash-bold"
                        width="1.3em"
                        height="1.3em"
                    />
                }
                color="danger"
                variant="bordered"
                onPress={onOpen}
            >
                {t("Discard")}
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1 items-center">
                                <InfoDuoTone
                                    customClass="text-danger"
                                    size="1.4em"
                                />
                                {t("Confirmation")}
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    {t(
                                        "Are you sure, you want to discard the campaign?"
                                    )}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    {t("Cancel")}
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={onClose}
                                    onClick={discardHandller}
                                    variant="flat"
                                >
                                    {t("Yes")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
