import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Input,
  Select,
  SelectItem,
  Image,
} from "@heroui/react";
// import AgentTaskTable from "./TaskTable/Index";
import { CustomKanban } from "./Kanban";

export default function AgentsIndex() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex flex-col gap-6 h-screen">
      <div className="flex gap-4 items-center  rounded-lg border-shadow bg-content2  p-4">
        <Image src="/Placeholders/Agent-task.png" width={200} className="p-6" />

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-default-600">
            Agent Task Assignment & Tracking
          </h1>

          <p className="text-sm text-default-500">
            Streamline task assignments for your agents and follow their
            progress through the intuitive Kanban board with different stages.
          </p>
        </div>
      </div>

      {/* <AgentTaskTable /> */}

      <CustomKanban />
    </div>
  );
}
