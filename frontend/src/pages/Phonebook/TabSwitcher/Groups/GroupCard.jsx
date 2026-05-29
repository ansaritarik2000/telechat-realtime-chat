import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
    Image,
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import GroupsTable from "./Table/Index";
import { useTranslation } from "react-i18next";
import { deleteGroupService } from "../../../../services/phonebook/phonebookService";
import toast from "react-hot-toast";
import AvatarIndex from "../../../../components/AvatarGen/Index";
import { ThreeDotsIcon } from "../../../../utils/ReusableIcons";

export default function GroupCard(props) {
    const {
        name,
        createdOn,
        avatar_value,
        avatar_type,
        members,
        fetchGroups,
        id,
    } = props;
    const token = localStorage.getItem("token");
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [modalType, setModalType] = useState(null);
    const { t } = useTranslation();

    // Handle Open Modal
    const openModal = (action) => {
        setModalType(action);
        onOpen();
    };

    // This function is used for delete group
    const deleteGroupHandler = async () => {
        const response = await deleteGroupService(id, token);
        if (response.status === "SUCCESS") {
            toast.success("Group deleted successfully");
            onClose();
            fetchGroups();
        } else {
            toast.error("Failed to delete group");
        }
    };

    return (
        <div className="dark:border dark:border-default dark:rounded-xl">
            <Card className="max-w-full py-6 px-4 ">
                <CardHeader className="flex justify-between gap-3 items-start">
                    <AvatarIndex
                        isEditable={false}
                        avatarType={avatar_type || "character"}
                        value={avatar_value || name}
                        size={90}
                        radius={18}
                        border={true}
                        borderSize={3}
                        borderColor="#f0f0f0"
                    />

                    {/* Three Dots Option Menu */}
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Icon
                                icon="bi:three-dots-vertical"
                                width={"1.5em"}
                                height={"1.5em"}
                                className="cursor-pointer"
                            />
                        </DropdownTrigger>

                        <DropdownMenu closeOnSelect={true}>
                            <DropdownItem
                                key="view"
                                startContent={
                                    <Icon
                                        icon="iconamoon:eye"
                                        width={"1.5em"}
                                    />
                                }
                                onPress={() => openModal("view")} // Correctly call openModal
                            >
                                {t("View")}
                            </DropdownItem>

                            <DropdownItem
                                key="delete"
                                variant="bordered"
                                color="danger"
                                className="text-danger"
                                startContent={
                                    <Icon
                                        icon="iconamoon:trash-bold"
                                        width={"1.5em"}
                                    />
                                }
                                onPress={() => openModal("delete")} // Open delete confirmation modal
                            >
                                {t("Delete")}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>

                <CardBody className="mb-6">
                    <div className="flex flex-col">
                        <p className="text-xs text-default-400">Group Name</p>
                        <p className="text-lg font-medium text-default-600">
                            {name}
                        </p>
                    </div>
                </CardBody>

                <Divider />

                {/* Footer */}
                <CardFooter className="flex justify-between text-xs">
                    {/* Members */}
                    <div className="flex flex-col text-success">
                        <div className="flex gap-1">
                            <Icon
                                icon="fluent:people-48-filled"
                                width={"1.3em"}
                            />
                            <p className="text-success-500 font-semibold">
                                {members}
                            </p>
                        </div>
                        <p>{t("Members")}</p>
                    </div>

                    <div className="text-default-400 flex flex-col items-end">
                        <div className="flex gap-1 items-center">
                            <Icon
                                icon="lets-icons:calendar-duotone"
                                className="text-default-900"
                                width={"1.3em"}
                            />
                            <p className="text-default-500 font-semibold">
                                {createdOn}
                            </p>
                        </div>
                        <p>{t("Created on")}</p>
                    </div>
                </CardFooter>

                {/* Modal Content */}
                <Modal
                    isOpen={isOpen}
                    onClose={() => {
                        onClose();
                        if (modalType === "view") {
                            fetchGroups();
                        }
                        // Fetch groups after closing the modal
                    }}
                    onOpenChange={onOpenChange}
                    size={modalType === "view" ? "5xl" : "md"}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                {modalType === "view" ? (
                                    <>
                                        {/* <ModalHeader>
                      <div className="mt-2">
                        <p className="text-xl">
                          {name} {t("Group")}
                        </p>
                      </div>
                    </ModalHeader> */}
                                        <ModalBody>
                                            <GroupsTable
                                                groupTitle={name}
                                                groupId={id}
                                                fetchGroups={() => {
                                                    fetchGroups();
                                                }}
                                            />
                                        </ModalBody>
                                    </>
                                ) : (
                                    <>
                                        <ModalHeader>
                                            <Icon
                                                icon="ph:warning-duotone"
                                                width="30"
                                                height="30"
                                                className="mr-1"
                                                style={{ color: "#d51e1e" }}
                                            />
                                            {t("Confirmation")}
                                        </ModalHeader>
                                        <ModalBody>
                                            <p>
                                                {t(
                                                    "Are you sure you want to delete"
                                                )}{" "}
                                                <span className="font-bold">
                                                    {name}
                                                </span>{" "}
                                                {t("group")}? This action is
                                                irreversible.
                                            </p>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button
                                                variant="light"
                                                onPress={onClose}
                                            >
                                                {t("Cancel")}
                                            </Button>
                                            <Button
                                                variant="flat"
                                                color="danger"
                                                onPress={deleteGroupHandler}
                                            >
                                                {t("Yes")}
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </Card>
        </div>
    );
}
