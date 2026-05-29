import React, { useEffect, useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalContent,
    useDisclosure,
    ModalFooter,
    Input,
    Tabs,
    Tab,
    Divider,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import MediaUpload from "../mediaUpload/mediaUpload";
import { useSendWhatsappStore } from "../../../../../../../../store/whatsapp/whatsappStore";
import { getMediaData, sendMediaData } from '../Utils/utils.js';
import RecentMediaTable from "../mediaUpload/RecentMediaTable";
import { LinkIcon } from "../../../../../../../../utils/ReusableIcons";
import { useQuery } from '@tanstack/react-query';
export default function InsertMediaURL() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        setMediaUrl,
        mediaUrl,
        setMediaId,
        MediaId,
        mediaFileName,
        selectedTemplateTypeSend,
        selectedTemplateName,
        campaignId,
        userId,
        carouselUrls
    } = useSendWhatsappStore();
    const [activeTab, setActiveTab] = useState("Upload_Media");
    const handleTheUrl = async () => {
        try {
            if(selectedTemplateTypeSend ==='carousel'){
                const urls = carouselUrls.split(',');
                setMediaUrl(urls)
                // alert(mediaUrl)
            }
   // Validate the url if not having media ids and filename then no need to store backend 
    const areEmpty = [MediaId, mediaFileName].every(item => item.length === 0);
        if(!areEmpty){
            const mediastore = await sendMediaData({
                mediaUrl,
                MediaId,
                mediaFileName,
                selectedTemplateTypeSend,
                campaignId,
                userId,
            });
            if (mediastore.success) {
                addToast({
                    title: "Uploaded",
                    description: "File uploaded successfully!",
                    color: "success",
                });
            }
            return mediastore;
        }
        else{
               addToast({
                title:'Url',
                description:'URL Inserted Successfully.',
                color:'success'
               })
        }
        } catch (error) {
            console.error(error);
            throw error.message
        }
    };
    const { data: mediaData } = useQuery({
        queryKey: ['media'],
        queryFn: async () => {
            const response = await getMediaData();
            return response?.media?.data?.media;
        }
    });
  
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <div>
            <Button
                isDisabled={!selectedTemplateName}
                size="sm"
                radius="sm"
                color="default"
                variant="flat"
                onPress={onOpen}
                startContent={<LinkIcon size="1.4em" />}
            >
                Upload Media
            </Button>

            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    placement="top-center"
                    size={activeTab === "Upload_Media" ? "xl" : "5xl"}
                    className={
                        activeTab === "Upload_Media" ? "h-[38rem]" : "h-[38rem]"
                    }
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-2 pt-6">
                                    <div className="flex items-center gap-1">
                                        <LinkIcon size="1.2em" />
                                        <p className="inline-flex text-md">
                                            Upload Media
                                        </p>
                                    </div>
                                    <Tabs
                                        aria-label="Tabs colors"
                                        variant="underlined"
                                        color="success"
                                        selectedKey={activeTab}
                                        onSelectionChange={handleTabChange}
                                    >
                                        <Tab
                                            key="Upload_Media"
                                            title="Upload Media"
                                        />
                                        <Tab
                                            key="Recent_Media"
                                            title="Media Library"
                                        />
                                    </Tabs>
                                </ModalHeader>

                                <ModalBody className="mx-4">
                                    {activeTab === "Upload_Media" ? (
                                        <MediaUpload />
                                    ) : (
                                        <RecentMediaTable mediaData={mediaData} />
                                    )}
                                </ModalBody>

                                <ModalFooter>
                                    {activeTab === "Upload_Media" && (
                                        <div className="flex flex-col gap-1 w-full">
                                            <Divider />

                                            <div className="self-end flex gap-4 justify-end py-3">
                                                <Button
                                                    color="danger"
                                                    variant="light"
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
                                                        handleTheUrl();
                                                    }}
                                                    radius="sm"
                                                >
                                                    Insert
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}
