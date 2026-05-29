import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Link,
  Chip,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import FlowPreview from "./FlowPreview";
import { useTranslation } from "react-i18next";
import {
  AnalyticsIcon,
  CheckIcon,
  CopyCodeIcon,
  EditPencilIcon,
  FlowIcon,
  InfoDuoTone,
  ThreeDotsIcon,
  TrashIcon,
} from "../../../../utils/ReusableIcons";
import ChannelIconsRenderer from "./ChannelIconrenderer";
import ConfirmationModal from "../../../../components/Common/Modals/ConfirmationModal";

export default function FlowCard({ name, flow_data, id, is_draft }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false); // Deactive Confirmation Modal
  const navigate = useNavigate();
  const handleFlowClick = () => {
    navigate(`/flowbuilder?id=${id}`);
  };
  const { t } = useTranslation();

  return (
    <div className="mx-2">
      <Card
        isFooterBlurred
        className="w-full h-[350px] col-span-12 border border-content2"
        onPress={handleFlowClick}
      >
        {/* Status */}
        <CardHeader className="absolute z-10 top-1 flex justify-start">
          <Chip
            size="sm"
            variant="flat"
            color={`${is_draft ? "warning" : "success"}`}
          >
            <span className="text-xs"> {is_draft ? "Inactive" : "Active"}</span>
          </Chip>
        </CardHeader>
        {/* Render ReactFlow View In Place of Image */}
        <FlowPreview flowData={flow_data} />
        {/* <CardFooter className="absolute w-full   bg-clip-padding    bottom-0 z-10 py-4 "> */}
        <CardFooter className="absolute w-full bg-slate-900 dark:bg-content2 dark:border border-content2  bg-clip-padding backdrop-filter backdrop-blur-sm  bg-opacity-15  bottom-0 z-10 py-3 ">
          {/* Interal Footer Body */}
          <div className="flex flex-col items-center justify-between gap-2 w-full">
            {/* First Row */}
            <div className="flex w-full items-center gap-2">
              <FlowIcon size="1.6em" customClass="text-primary-500 pb-1" />
              <p className="text-sm text-default-700">{name}</p>
            </div>

            {/* Second Row */}
            <div className="flex-between w-full">
              {/* Channel Icons */}
              <div className="flex flex-col gap-1">
                <ChannelIconsRenderer
                  channels={["sms", "rcs", "whatsapp", "email"]}
                />
              </div>

              <div className="flex-center">
                {/* Activate Btn */}
                <Button
                  radius="full"
                  color="primary"
                  variant={is_draft ? "shadow" : "bordered"}
                  size="sm"
                  className="self-end py-0 px-3 text-[10px]"
                  onPress={() => setIsModalOpen(true)}
                >
                  {is_draft ? "Activate" : "Deactivate"}
                </Button>

                {/* Activate / Deactivate Confirmation modal */}
                <ConfirmationModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title={is_draft ? "Activate Flow" : "Deactivate Flow"} // In place of is_draft create new state isActive & use that
                  bodyContent={
                    <span className="text-md">
                      {is_draft
                        ? "Are you sure you want to activate this flow?"
                        : `This will stop all the bots running this flow. Are you sure you want to deactivate ${name}`}
                    </span>
                  }
                  onConfirm={() => setIsModalOpen(false)}
                  cancelLabel="No"
                  confirmLabel="Yes"
                  confirmColor={is_draft ? "success" : "danger"}
                  titleIcon={
                    is_draft ? (
                      <CheckIcon customClass="text-success" size="1.4em" />
                    ) : (
                      <InfoDuoTone customClass="text-danger" size="1.5em" />
                    )
                  }
                />

                {/* Three Dots Trigger*/}
                <Dropdown
                  classNames={{
                    base: "before:bg-default-200",
                    content:
                      "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                  }}
                >
                  <DropdownTrigger className="h-full flex-center">
                    <button>
                      <ThreeDotsIcon size="1.5em" customClass="text-primary" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions" variant="faded">
                    <DropdownItem
                      key="edit"
                      href={`/flowbuilder?id=${id}`}
                      startContent={
                        <EditPencilIcon
                          size="1.3em"
                          customClass="text-default-500"
                        />
                      }
                    >
                      Edit Flow
                    </DropdownItem>
                    <DropdownItem
                      key="copy"
                      startContent={
                        <CopyCodeIcon
                          size="1.3em"
                          customClass="text-default-900"
                        />
                      }
                    >
                      Duplicate Flow
                    </DropdownItem>
                    <DropdownItem
                      key="analytics"
                      href={`/flowanalytics?flowName=${name}`}
                      startContent={
                        <AnalyticsIcon
                          size="1.3em"
                          customClass="text-default-900"
                        />
                      }
                    >
                      Flow Analytics
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={
                        <TrashIcon size="1.3em" customClass="text-danger" />
                      }
                    >
                      Delete Flow
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
