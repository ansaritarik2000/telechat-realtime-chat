import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

export default function Discard({ discardHandller }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { t } = useTranslation();
    return (
        <div>
            <Button
                size="md"
                radius="sm"
                color="danger"
                variant="bordered"
                startContent={
                    <Icon
                        icon="iconamoon:trash-bold"
                        width="1.3em"
                        height="1.3em"
                    />
                }
                onPress={onOpen}>
                <span>{t("Discard")}</span>
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Confirmation
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure, you want to discard the
                                    campaign?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="success"
                                    variant="light"
                                    onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={discardHandller}
                                    onPress={onClose}
                                    variant="flat">
                                    Yes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
