import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useFlowStore } from "../../../../store/automationFlowStore/flowStore";
import { useTranslation } from "react-i18next";
import ChannelsSelector from "../../../../components/Common/Channels";
import { FlowIcon, PlusIcon } from "../../../../utils/ReusableIcons";

export default function Header() {
  // zustand store
  const { flowName, setFlowName } = useFlowStore();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { t } = useTranslation();

  const cancelFlowHandller = () => {
    setFlowName("");
    onClose();
  };

  const handleFlowNameChange = (e) => {
    const newFlowName = e.target.value;
    if (newFlowName > 50) {
      return;
    }
    setFlowName(newFlowName);
  };

  // Check if the flow name is invalid (more than 50 characters)
  const isFlowNameInvalid = flowName.length > 50;

  return (
    <div className="w-full">
      <div className="flex justify-between">
        {/* Search Input */}
        <Input
          isClearable
          className="max-w-[400px] w-full"
          placeholder={t("Search by...")}
          startContent={
            <Icon icon="majesticons:search-line" width="1.2em" height="1.2em" />
          }
        />

        <div className="flex gap-4">
          {/* Create New Btn / To show modal add onClick={onOpen} in button*/}
          <Button
            color="success"
            variant="flat"
            size="md"
            radius="sm"
            onPress={onOpen}
            // href="/flowbuilder"
            // as={Link}
            startContent={<PlusIcon size="1.2em" customClass="text-success" />}
          >
            {t("Create New Flow")}
          </Button>

          {/* Modal Content */}
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex items-center gap-2">
                    <FlowIcon size="1em" />
                    {t("New Flow")}
                  </ModalHeader>
                  <ModalBody className="">
                    {/* Input */}
                    <Input
                      isRequired
                      value={flowName}
                      onChange={handleFlowNameChange}
                      label={t("Flow Name")}
                      radius="sm"
                      size="sm"
                      className="flex-1"
                      errorMessage="Flow Name can't be more than 50 characters"
                      isInvalid={isFlowNameInvalid}
                    />

                    <ChannelsSelector />
                  </ModalBody>
                  <ModalFooter className="flex flex-col">
                    {/* Total audience */}
                    <div className="text-sm text-default-600 flex flex-col gap-2">
                      <Divider />
                    </div>
                    {/* Btns */}
                    <div className="self-end space-x-2">
                      <Button
                        variant="light"
                        color="danger"
                        onPress={cancelFlowHandller}
                      >
                        {t("Cancel")}
                      </Button>
                      <Button
                        variant="flat"
                        color="success"
                        onPress={onClose}
                        href="/flowbuilder"
                        as={Link}
                      >
                        {t("Create")}
                      </Button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}
