import React, { useState, useCallback } from "react";
import { Select, SelectItem, Textarea, Button, Input } from "@heroui/react";
import { FileUploader } from "./FileUploader";
import { CloseIcon, PlusIcon } from "../../../../../utils/ReusableIcons";
import { useReactFlow } from "@xyflow/react";
import { generateUniqueId } from "../../utils/generateRandomId";
import AnimatedSVGEdge from "../../CustomEdges/AnimatedSVGEdge";

// Message type options
const messageTypeOptions = [
    { label: "Text", value: "text" },
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
    { label: "Audio", value: "audio" },
    { label: "Document", value: "document" },
    { label: "List", value: "list" },
];

const DirectMessageComponent = ({ onChange, nodeId }) => {
    const { setNodes, setEdges, getNodes } = useReactFlow();
    const [messageType, setMessageType] = useState("");
    const [messageText, setMessageText] = useState("");
    const [listItems, setListItems] = useState("");
    const [fileData, setFileData] = useState(null);
    const [buttonItems, setButtonItems] = useState([]);

    // Handle message type selection change
    const handleMessageTypeChange = (selectedValue) => {
        const type = [...selectedValue][0];
        setMessageType(type);

        // Call parent onChange with the updated state
        if (onChange) {
            onChange({
                messageType: type,
                messageText: type === "text" ? messageText : "",
                listItems: type === "list" ? listItems : "",
                buttonItems: type === "list" ? buttonItems : [],
                fileData: ["image", "video", "audio", "document"].includes(type)
                    ? fileData
                    : null,
            });
        }
    };

    // Handle text message change
    const handleTextChange = (e) => {
        setMessageText(e.target.value);

        if (onChange && messageType === "text") {
            onChange({
                messageType,
                messageText: e.target.value,
                listItems: "",
                buttonItems: [],
                fileData: null,
            });
        }
    };

    // Handle list items change
    const handleListChange = (e) => {
        setListItems(e.target.value);

        if (onChange && messageType === "list") {
            onChange({
                messageType,
                messageText: "",
                listItems: e.target.value,
                buttonItems,
                fileData: null,
            });
        }
    };

    // Handle file data change (would be called from FileUploader)
    const handleFileChange = (file) => {
        setFileData(file);

        if (
            onChange &&
            ["image", "video", "audio", "document"].includes(messageType)
        ) {
            onChange({
                messageType,
                messageText: "",
                listItems: "",
                buttonItems: [],
                fileData: file,
            });
        }
    };

    // Add a new button item
    const addButtonItem = () => {
        setButtonItems([...buttonItems, { label: "", clicked: false }]);
    };

    // Update a button item label
    const updateButtonItem = (index, value) => {
        const updatedItems = [...buttonItems];
        updatedItems[index].label = value;
        setButtonItems(updatedItems);

        if (onChange && messageType === "list") {
            onChange({
                messageType,
                messageText: "",
                listItems,
                buttonItems: updatedItems,
                fileData: null,
            });
        }
    };

    // Delete a button item
    const deleteButtonItem = (index) => {
        const filteredItems = buttonItems.filter((_, i) => i !== index);
        setButtonItems(filteredItems);

        if (onChange && messageType === "list") {
            onChange({
                messageType,
                messageText: "",
                listItems,
                buttonItems: filteredItems,
                fileData: null,
            });
        }
    };

    // Handle button click to duplicate node
    const handleDuplicateNode = useCallback(
        (buttonLabel, index) => {
            if (!nodeId) return;

            setNodes((nds) => {
                // Find the current node
                const currentNode = nds.find((node) => node.id === nodeId);
                if (!currentNode) return nds;

                // Generate a unique ID for the copied node
                const newNodeId = generateUniqueId();

                // Calculate new position
                const row = Math.floor(index / 3);
                const column = index % 3;

                const verticalOffset = 260; // Vertical distance between rows
                const horizontalOffset = 280; // Horizontal distance between nodes

                let newX, newY;

                // Position calculation: bottom-left, bottom-middle, bottom-right
                newY = currentNode.position.y + (row + 1) * verticalOffset;

                // Assign X positions based on column
                if (column === 0) {
                    newX = currentNode.position.x - horizontalOffset;
                } else if (column === 1) {
                    newX = currentNode.position.x;
                } else {
                    newX = currentNode.position.x + horizontalOffset;
                }

                // Create a new node based on the current node
                const newNode = {
                    id: newNodeId,
                    type: "custom",
                    data: {
                        ...currentNode.data,
                    },
                    position: {
                        x: newX,
                        y: newY,
                    },
                };

                // Create a new edge connecting the current node to the new node using AnimatedSVGEdge
                setEdges((eds) => {
                    const newEdge = {
                        id: `${nodeId}->${newNodeId}`,
                        source: nodeId,
                        target: newNodeId,
                        type: "custom-edge",
                        data: { label: buttonLabel },
                    };
                    return [...eds, newEdge];
                });

                // Disable the button after clicking
                const newButtonItems = [...buttonItems];
                newButtonItems[index].clicked = true;
                setButtonItems(newButtonItems);

                return [...nds, newNode];
            });
        },
        [nodeId, setNodes, setEdges, buttonItems]
    );

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Message Type Selector for Direct Message */}
            <Select
                aria-label="Select Message Type"
                isRequired
                label="Message Type"
                labelPlacement="outside"
                placeholder=" "
                onSelectionChange={handleMessageTypeChange}
                value={messageType}
                className="w-full"
                variant="flat"
                color="default"
                radius="sm"
                size="md"
            >
                {messageTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                        {type.label}
                    </SelectItem>
                ))}
            </Select>

            {/* Conditional rendering based on message type */}
            {messageType === "text" && (
                <Textarea
                    label="Message Text"
                    placeholder="Enter your message here..."
                    className="w-full"
                    minRows={3}
                    variant="bordered"
                    color="default"
                    radius="sm"
                    size="md"
                    value={messageText}
                    onChange={handleTextChange}
                />
            )}

            {messageType === "list" && (
                <div>
                    <Textarea
                        label="List Items"
                        placeholder="Enter list items, one per line..."
                        className="w-full"
                        minRows={5}
                        variant="bordered"
                        color="default"
                        radius="sm"
                        size="md"
                        description="Enter each list item on a new line"
                        value={listItems}
                        onChange={handleListChange}
                    />

                    {/* Add Button Item */}
                    <div className="flex justify-between items-center w-full mt-4">
                        <div className="text-sm font-medium text-default-500">
                            Button List
                        </div>
                        <Button
                            size="sm"
                            color="primary"
                            variant="none"
                            onPress={addButtonItem}
                            startContent={<PlusIcon />}
                        >
                            Add Button Item
                        </Button>
                    </div>

                    {/* Button Items */}
                    {buttonItems.length > 0 && (
                        <div className="flex flex-col gap-2 w-full mt-2">
                            {buttonItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        label={`Button Label ${index + 1}`}
                                        value={item.label}
                                        onChange={(e) =>
                                            updateButtonItem(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="flex-grow"
                                        size="sm"
                                        variant="bordered"
                                    />
                                    {/* Disable the button if clicked */}
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        color="success"
                                        variant="flat"
                                        onPress={() =>
                                            !item.clicked &&
                                            handleDuplicateNode(
                                                item.label,
                                                index
                                            )
                                        }
                                        isDisabled={item.clicked} // Disable if clicked
                                    >
                                        <PlusIcon size="1.7em" />
                                    </Button>
                                    {/* Delete */}
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        onPress={() => deleteButtonItem(index)}
                                    >
                                        <CloseIcon size="1.7em" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(messageType === "image" ||
                messageType === "video" ||
                messageType === "audio" ||
                messageType === "document") && (
                <FileUploader
                    type={
                        messageType.charAt(0).toUpperCase() +
                        messageType.slice(1)
                    }
                    onChange={handleFileChange}
                />
            )}
        </div>
    );
};

export default DirectMessageComponent;
