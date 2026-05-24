import React, { useState } from "react";
import {
  Image,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useFavouriteChatStore } from "../../../../../store/Telechat/telechatStore";
import toast from "react-hot-toast";
import { updatedFavouriteChatServices } from "../../../../../services/Telechat/chats/updatedFavouriteChatServices";
import AvatarIndex from "../../../../../components/AvatarGen/Index";

const DetailsCard = ({ pfp, name, number, email, avatarType, avtarValue }) => (
  <div className="flex flex-col gap-2 items-center">
    {typeof pfp === "string" ? (
      // <Image src={pfp} width={180} radius="full" isZoomed />
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
        <Icon icon="mi:call" width="1em" height="1em" />
        {number}
      </p>
      <p className="text-sm text-default-500 flex items-center gap-1">
        <Icon icon="ic:outline-email" width="1.2em" height="1.2em" />
        {email}
      </p>
    </div>
  </div>
);

export default function RightBarSection({
  pfp = "https://picsum.photos/id/57/200/200",
  name = "Nawaz Ali",
  number = "+917004893457",
  email = "user@telepie.com",
  chatId = "",
  user_id,
}) {
  const { favouriteChats, toggleFavourite } = useFavouriteChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isFavourite = favouriteChats.includes(user_id);
  const handleToggleFavourite = async () => {
    const requestBody = {
      user_id: user_id,
      is_favourite: !isFavourite, // Send the opposite state
    };

    try {
      const response = await updatedFavouriteChatServices(token, requestBody);
      if (response?.status === "SUCCESS") {
        toggleFavourite(user_id);
        success(
          isFavourite
            ? "Chat removed from favorites successfully"
            : "Chat added to favorites successfully"
        );
      } else {
        error("Failed to update favorite status.");
      }
    } catch (error) {
      error("An error occurred while updating favorite status.");
    }
  };

  const handleDeleteChat = () => {
    toast.success("Chat deleted successfully");
    setIsModalOpen(false);
  };
  // console.log("Profile Picture URL:", pfp);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (id) => {
    setSelectedImage(`https://picsum.photos/id/${id}/367/326`);
    setIsImageModalOpen(true);
  };

  return (
    <div className="w-[300px] h-full border flex flex-col rounded-2xl p-4 bg-white dark:bg-background gap-4">
      <DetailsCard pfp={pfp} name={name} number={number} email={email} />

      <div className="flex flex-col gap-4 flex-grow">
        <Button
          size="sm"
          variant="flat"
          color="warning"
          onPress={handleToggleFavourite}
          startContent={
            <Icon
              icon={isFavourite ? "mdi:star" : "akar-icons:star"}
              width="1.5em"
              height="1.5em"
            />
          }
        >
          {isFavourite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>

        {/* <div className="grid grid-cols-3 gap-2">
          {[16, 17, 20, 28, 24, 13].map((id) => (
            <Image
              key={id}
              src={`https://picsum.photos/id/${id}/367/326`}
              width={100}
              isZoomed
              className="cursor-pointer"
              onClick={() => handleImageClick(id)}
            />
          ))}
        </div> */}

        <div className="grid grid-cols-3 gap-2">
          {[16, 17, 20, 28, 24, 13].map((id) => {
            const imageUrl = `https://picsum.photos/id/${id}/367/326`;

            return (
              <div key={id} className="relative group">
                {/* Image */}
                <Image src={imageUrl} width={100} isZoomed className="cursor-pointer relative z-0" />

                {/* Overlay with Tooltips */}
                <div className="absolute inset-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center  z-10">
                  <Tooltip content="Preview" hideDelay={0}>
                    <Button
                      isIconOnly
                      variant="flate"
                      className="text-white hover:text-green-500 cursor-pointer"
                      onPress={() => handleImageClick(id)}
                    >
                      <Icon icon="ic:twotone-visibility" width="24" height="24" />
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
        Delete Chat
      </Button>
      
      {/* Image Modal */}
      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody className="flex justify-center">
            {selectedImage && <Image src={selectedImage} width={600} />}
          </ModalBody>

          <ModalFooter className="flex justify-end">
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to delete your conversation with{" "}
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
              onPress={handleDeleteChat}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
