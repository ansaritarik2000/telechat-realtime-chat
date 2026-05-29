import React, { useEffect, useRef,useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Modal,
    Button,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { addToast } from "@heroui/react"; // Importing addToast for toast notifications
import { formatDate } from "../../../../../../Reports/Tabs/TemplateTable/data";
import {
    CopyIcon,
    PreviewIcon,
    TrashIcon,
} from "../../../../../../../../utils/ReusableIcons";
import { Icon } from "@iconify-icon/react";
import TextTruncator from "../../../../../../../../components/Common/TextTruncator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMedia } from '../Utils/utils.js';

const columns = [
    {
        key: "mediaFileName",
        label: "File Name",
    },
    {
        key: "selectedTemplateTypeSend",
        label: "Media Type",
    },
    {
        key: "created_at",
        label: "Date & Time",
    },
    { key: "action", label: "Actions" },
];

const RecentMediaTable = ({ mediaData }) => {
    const timeoutRef = useRef(null); // Store timeout reference
    const queryClient = useQueryClient();
    const [itemToDelete, setItemToDelete] = useState(null);

    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onOpenChange: onDeleteModalOpenChange,
    } = useDisclosure();
    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);

            // Show success toast
            addToast({
                title: "Copied to Clipboard!",
                description: <span className="text-xs">{text}</span>,
                timeout: 3000, // Toast disappears after 3 seconds
                shouldShowTimeoutProgress: true,
            });
        } catch (error) {
            console.error("Failed to copy text:", error);

            // Show error toast
            addToast({
                title: "Copy Failed!",
                description: "Unable to copy to clipboard.",
                variant: "danger", // Danger variant for errors
                timeout: 3000,
            });
        }
    };

    const handlePreview = (url) => {
        window.open(url, "_blank");
    };

// use for the delete media files from table as well as meta
const { mutateAsync: deleteMediaMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
        // This will automatically refetch the media data
        queryClient.invalidateQueries({ queryKey: ['media'] });
        addToast({
            title: "Deleted!",
            description: "Media deleted successfully",
            color: "success",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
        });
    },
    // Add optimistic updates for instant UI response
    onMutate: async (deletedId) => {
        await queryClient.cancelQueries({ queryKey: ['media'] });
        
        const previousMedia = queryClient.getQueryData(['media']);
        
        queryClient.setQueryData(['media'], (old) => 
            old.filter(item => item.id !== deletedId)
        );
        
        return { previousMedia };
    },
    onError: (err, deletedId, context) => {
        queryClient.setQueryData(['media'], context.previousMedia);
        addToast({
            title: "Error!",
            description: err.message || "Failed to delete media",
            variant: "danger",
            timeout: 3000,
        });
    }
});

const handleDelete = (id) => {
    deleteMediaMutation(id);
};
// open the delete madol
 const openDeleteModal = (id) => {
        setItemToDelete(id);
        onDeleteModalOpen();
    };

const sortedMedia = React.useMemo(() => {
        return [...mediaData].sort((a, b) => 
           new Date(b.created_at)-new Date(a.created_at)
        );
}, [mediaData]);
    const renderCell = React.useCallback(
        (item, columnKey) => {
            const cellValue = item[columnKey];

            switch (columnKey) {
                case "mediaFileName":
                    return <span className="capitalize">
                        <TextTruncator
                         text={cellValue}
                         maxLength={25}
                        />
                    </span>;
                case "created_at":
                    const date = formatDate(cellValue);
                    return <span>{date}</span>;
                case "selectedTemplateTypeSend":
                    return <span className="capitalize">{cellValue}</span>;
                case "action":
                    return (
                        <div className="flex items-center gap-2 h-fit w-fit">
                            {/* Copy media URL */}
                            <Tooltip content="Copy Media URL">
                                <span
                                    className="flex items-center min-w-[6rem] gap-1 cursor-pointer hover:bg-content2 rounded-md p-1"
                                    onClick={() => handleCopy(item.mediaUrl)}
                                >
                                    <CopyIcon />
                                    Media URL
                                </span>
                            </Tooltip>

                            {/* Copy media ID */}
                            <Tooltip content="Copy Media ID">
                                <span
                                    className="flex items-center min-w-[6rem] gap-1 cursor-pointer hover:bg-content2 rounded-md p-1"
                                    onClick={() => handleCopy(item.MediaId)}
                                >
                                    <CopyIcon />
                                    Media ID
                                </span>
                            </Tooltip>

                            {/* Preview media */}
                            <span
                                className="flex items-center w-fit gap-1 cursor-pointer hover:bg-content2 rounded-md p-1"
                                onClick={() => handlePreview(item.mediaUrl)}
                            >
                                <PreviewIcon />
                                View
                            </span>
                            {/* Delete media */}
                            <Button
                                size="sm"
                                isIconOnly
                                onPress={() => openDeleteModal(item.id)}
                                variant="light"
                                
                            >
                                <TrashIcon  size={'1.4em'} />
                            </Button>
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        [handleCopy, handlePreview]
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <>
        <Table
            isVirtualized
            aria-label="Recent Media Table"
            isHeaderSticky={true}
            maxTableHeight={400}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
            </TableHeader>
            <TableBody items={sortedMedia}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>

         {/* Move the modal outside the table */}
         <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
         <ModalContent>
             {(onClose) => (
                 <>
                     <ModalHeader className="flex justify-start items-center gap-1">
                         <Icon
                             icon="si:check-circle-duotone"
                             width="24"
                             height="24"
                             className="text-success"
                         />
                         Confirmation
                     </ModalHeader>
                     <ModalBody>
                         <p>Are you sure you want to delete this media?</p>
                     </ModalBody>
                     <ModalFooter>
                         <Button variant="light" onPress={onClose}>
                             Cancel
                         </Button>
                         <Button 
                             color="danger" 
                             variant="flat"  
                             isLoading={isDeleting}
                             onPress={() => {
                                 handleDelete(itemToDelete);
                                 onClose();
                             }}
                         >
                            {isDeleting ? "Deleting..." : "Yes"}
                         </Button>
                     </ModalFooter>
                 </>
             )}
         </ModalContent>
     </Modal>
 </>
    );
};

export default RecentMediaTable;
