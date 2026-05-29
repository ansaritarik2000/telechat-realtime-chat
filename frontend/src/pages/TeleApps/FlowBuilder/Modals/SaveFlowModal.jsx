import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  Checkbox,
} from "@heroui/react";
import { useFlowStore } from "../../../../store/automationFlowStore/flowStore";

const SaveFlowModal = ({ open, closeModal, saveFlow }) => {
  const [name, setName] = useState();

  // zustand store
  const { flowName, setFlowName } = useFlowStore();

  const saveAsDefaultNameHandller = (e) => {
    if (e.target.checked) {
      setName(flowName);
    }
  };

  const saveFlowHandller = () => {
    setFlowName(name);
    saveFlow();
  };

  return (
    <Modal
      size="lg"
      isOpen={open}
      onOpenChange={closeModal}
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-semibold">Save Flow</h2>
          </div>
        </ModalHeader>

        <ModalBody>
          <Input
            placeholder="Enter flow name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            radius="sm"
          />
          <Checkbox
            color="success"
            onChange={saveAsDefaultNameHandller}
            size="sm"
          >
            Save as default
          </Checkbox>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            onPress={() => closeModal()}
            radius="sm"
          >
            Cancel
          </Button>
          <Button
            color="success"
            variant="flat"
            onClick={saveFlowHandller}
            radius="sm"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveFlowModal;
