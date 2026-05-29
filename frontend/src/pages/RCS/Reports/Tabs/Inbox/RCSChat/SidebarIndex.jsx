import React, { useEffect, useState } from "react";
import {
  Input,
  Tooltip,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Select,
  SelectItem,
  Chip,
  RadioGroup,
  Radio,
  Spinner,
  addToast,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import ChatCard from "./ChatCard";
import RangeCal from "./RangeCal";
import toast from "react-hot-toast";
import PhoneNumber from "../../../../../../components/PhoneNumber";
import TagsDropDown from "../../../../../RCS/SendRCS/Send/TagsDropDown";
import { getRCSContactsService } from "../../../../../../services/phonebook/rcsContactService";
import { set } from "lodash";
import { axiosServerInstance } from "../../../../../../utils/axios/config";
import { useQuery } from "@tanstack/react-query";
import useRcsInbox from "../../../../../../hooks/useRcsInbox";

export default function SidebarIndex() {
  const [selectedTab, setSelectedTab] = useState("chat");
  const [selectedTags, setSelectedTags] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const inboxInfo = useRcsInbox();
  const [selected, setSelected] = useState("");
  const [rcsContacts, setRcsContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const contactsPerPage = 5;

  const token = localStorage.getItem("token");

  const handleColorChange = (key) => {
    setSelectedTab(key);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag.name)) {
      setSelectedTags((prev) => [...prev, tag.name]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (currentPage < totalPages) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getRcsContacts(nextPage);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-3 border border-transparent rounded-2xl h-full py-4 bg-white backdrop-blur-2xl dark:bg-background">
      {/* Search */}
      <div className="flex justify-around  px-1 items-center">
        <Input
          className="px-2"
          variant="bordered"
          color="primary"
          size="md"
          radius="sm"
          placeholder="Search"
          endContent={
            <Icon
              icon="fluent:search-20-regular"
              width="1.4em"
              height="1.4em"
              className="justify-center"
            />
          }
        />

        {/* Filter Modal Icon */}
        <Icon
          icon="ph:sliders-duotone"
          width="1.5em"
          height="1.5em"
          className="cursor-pointer pr-1 hover:text-primary"
          onClick={onOpen}
        />

        {/* Filter Modal  */}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
          size="md"
          // className="h-1/2"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Filter Chat
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    {/* Search by status */}
                    <RadioGroup
                      label="Filter by status"
                      orientation="horizontal"
                      size="md"
                      color="default"
                      onValueChange={setSelected}
                      disableAnimation={true}
                    >
                      <Radio value="active">
                        <Chip color="primary" variant="flat">
                          Active
                        </Chip>
                      </Radio>
                      <Radio value="expired">
                        <Chip color="danger" variant="flat">
                          Expired
                        </Chip>
                      </Radio>
                    </RadioGroup>

                    {/* Search by phone no */}
                    <PhoneNumber />

                    <TagsDropDown
                      onSelectionTagChange={() => {}}
                      isWhatsappTags={true}
                    />

                    {/* Search by calender range */}
                    <div className="space-y-2">
                      <p className="text-default-500 text-md">
                        Search by date range
                      </p>
                      <RangeCal />
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    className="text-danger hover:bg-danger-100"
                    variant="none"
                    onPress={onClose}
                    radius="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    variant="flat"
                    onPress={() => {
                      onClose();
                    }}
                    radius="sm"
                  >
                    Search
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      {/*Contacts chats display box */}
      <div className="px-2 overflow-y-auto">
        {inboxInfo &&
          inboxInfo.map((item, index) => {
            // TODO: Change this last sent msg
            const formattedTime = item?.last_msg_time
              ? new Date(item.last_msg_time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "N/A";

            return (
              <ChatCard
                key={index}
                // title={"Md Faizan"}
                chipStatus="Active"
                recent={"Hii"}
                time={formattedTime}
                number={item?.phone}
                badgeCol="success"
                status="Active"
                item={item}
                day={(() => {
                  // TODO: I need to change this with last sent msg
                  if (!item?.last_msg_time) return "N/A";

                  const submittedDate = new Date(item?.created_at);
                  const today = new Date();
                  const yesterday = new Date();
                  yesterday.setDate(today.getDate() - 1);

                  if (submittedDate.toDateString() === today.toDateString()) {
                    return "Today";
                  } else if (
                    submittedDate.toDateString() === yesterday.toDateString()
                  ) {
                    return "Yesterday";
                  } else {
                    return submittedDate.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                  }
                })()}
              />
            );
          })}
        <div className="flex justify-center mt-4">
          {currentPage < totalPages ? (
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={handleLoadMore}
              isLoading={isLoading}
            >
              Load More
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}