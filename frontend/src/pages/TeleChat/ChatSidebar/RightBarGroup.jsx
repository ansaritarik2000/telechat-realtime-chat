import React, { useState, useEffect } from "react";
import {
  Image,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  AvatarGroup,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import { getGroupMembersService } from "../../../../../services/Telechat/groupChatService/getGroupMembersService"; // adjust path accordingly

const GroupDetailsCard = ({
  pfp,
  name,
  description,
  avatarType,
  avtarValue,
}) => (
  <div className="flex flex-col gap-2 items-center">
    {typeof pfp === "string" ? (
      <AvatarIndex
        isEditable={false}
        avatarType={avatarType}
        value={avtarValue}
        size={40}
      />
    ) : (
      pfp
    )}
    <div className="text-center">
      <p className="font-semibold text-md">{name}</p>
      <p className="text-sm text-default-500 flex items-center gap-1">
        <Icon icon="mdi:account-group" width="1.2em" height="1.2em" />
        {description || "Group Chat Right Bar"}
      </p>
    </div>
  </div>
);

const MemberCard = ({ member }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-default">
    <AvatarIndex
      isEditable={false}
      avatarType={member.avatarType}
      value={member.avtarValue || member.name}
      size={30}
    />
    <div className="flex flex-col">
      <span className="font-semibold text-sm">{member.name}</span>
      <span className="text-xs text-default-500">
        {member.role || "Member"}
      </span>
    </div>
  </div>
);

export default function RightBarGroupSection({
  pfp,
  name = "Group Name",
  description = "",
  groupId,
  avatarType,
  avtarValue,
}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!groupId) return;

    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // or from context/auth provider
        const result = await getGroupMembersService(groupId, token);

        if (result.status === "SUCCESS") {
          setMembers(result.members);
        } else {
          setError(result.message || "Failed to load members");
        }
      } catch (e) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleDeleteGroup = () => {
    console.log(`Group ${groupId} deleted`);
    setIsModalOpen(false);
  };

  const handleImageClick = (id) => {
    setSelectedImage(`https://picsum.photos/id/${id}/367/326`);
    setIsImageModalOpen(true);
  };

  return (
    <div className="w-[300px] h-full border flex flex-col rounded-2xl p-4 bg-white dark:bg-background gap-4">
      <GroupDetailsCard
        pfp={pfp}
        name={name}
        description={description}
        avatarType={avatarType}
        avtarValue={avtarValue}
      />

      {/* <div className="mt-4">
        <p className="font-semibold mb-2">
          Group Members ({loading ? "Loading..." : members.length})
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <div className="max-h-48 overflow-y-auto">
          {!loading &&
            members.map((member) => (
              <MemberCard key={member.user_id || member.id} member={member} />
            ))}
        </div>
      </div> */}

      <div className="mt-4">
        <p className="font-semibold mb-2">
          Group Members ({loading ? "Loading..." : members.length})
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Compact Avatar Preview */}
        {!loading && members.length > 0 && (
          <AvatarGroup isBordered max={4} size="sm" className="mb-3">
            {members.map((member, index) => (
              <Avatar
                key={index}
                name={member.name}
                src={
                  member.avatarType === "image" ? member.avtarValue : undefined
                }
              >
                {member.avatarType === "character" && member.avtarValue
                  ? member.avtarValue
                  : member.name?.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="grid grid-cols-3 gap-2">
          {[16, 17, 20, 28, 24, 13].map((id) => {
            const imageUrl = `https://picsum.photos/id/${id}/367/326`;
            return (
              <div key={id} className="relative group">
                <Image
                  src={imageUrl}
                  width={100}
                  isZoomed
                  className="cursor-pointer relative z-0"
                />
                <div className="absolute inset-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <Tooltip content="Preview" hideDelay={0}>
                    <Button
                      isIconOnly
                      variant="flate"
                      className="text-white hover:text-green-500 cursor-pointer"
                      onPress={() => handleImageClick(id)}
                    >
                      <Icon
                        icon="ic:twotone-visibility"
                        width="24"
                        height="24"
                      />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Download">
                    <Button
                      isIconOnly
                      variant="flate"
                      className="text-white hover:text-green-500 cursor-pointer"
                      onPress={() => window.open(imageUrl, "_blank")}
                    >
                      <Icon icon="mdi:download" width="24" height="24" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        size="sm"
        variant="flat"
        color="danger"
        onPress={() => setIsModalOpen(true)}
        startContent={<Icon icon="ph:trash" width="1.2em" height="1.2em" />}
      >
        Delete Group
      </Button>

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody className="flex justify-center">
            {selectedImage && <Image src={selectedImage} width={600} />}
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>

      {/* Delete Group Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <Icon
              icon="ph:warning-duotone"
              width={30}
              height={30}
              style={{ color: "#d51e1e" }}
            />
            Confirmation
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete the group{" "}
              <span className="font-bold">{name}</span>? This action is
              irreversible.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              auto
              flat
              variant="light"
              onPress={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              auto
              flat
              variant="flat"
              color="danger"
              onPress={handleDeleteGroup}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
