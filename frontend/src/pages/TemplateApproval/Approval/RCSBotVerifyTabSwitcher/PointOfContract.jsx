import React, { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Alert,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRcsBotVerifyStore } from "../../../../store/rcsBotVerifyStore";

const PointOfContract = () => {
    const { pointOfContacts, setPointOfContacts } = useRcsBotVerifyStore();
    const [alertVisible, setAlertVisible] = useState(false);

    // Add new contact
    const addContact = () => {
        if (pointOfContacts.length >= 3) {
            setAlertVisible(true);
            setTimeout(() => {
                setAlertVisible(false);
            }, 3000); // Dismiss after 3 seconds
            return;
            s;
        }

        setPointOfContacts((prevContacts) => [
            ...prevContacts,
            {
                id: prevContacts.length + 1, // Generate a unique id
                firstName: "",
                lastName: "",
                designation: "",
                email: "",
                mobile: "",
            },
        ]);
    };

    // Remove contact
    const removeContact = (id) => {
        setPointOfContacts((prevContacts) =>
            prevContacts.filter((contact) => contact.id !== id)
        );
    };

    // Handle input changes
    const handleInputChange = (id, field, value) => {
        setPointOfContacts((prevContacts) =>
            prevContacts.map((contact) =>
                contact.id === id ? { ...contact, [field]: value } : contact
            )
        );
    };

    return (
        <Card className="max-w-5xl mx-auto shadow-lg border border-transparent dark:border-default">
            <CardHeader className="bg-primary-50 p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex-center items-center gap-2">
                    <Icon
                        icon="hugeicons:contact"
                        width="1.5em"
                        height="1.5em"
                    />
                    Point of Contact
                </h2>
            </CardHeader>
            <CardBody className="p-6">
                {/* ALert */}
                {/* Alert Section */}
                {alertVisible && (
                    <Alert
                        variant="flat"
                        size="sm"
                        color="danger"
                        type="warning"
                        title="You can only add up to 3 contacts."
                        onClose={() => setAlertVisible(false)}
                        className="my-2"
                    />
                )}
                {/* Add Contact Button */}
                <div className="w-full flex justify-between items-center mb-4">
                    <p className="font-medium text-md">
                        Contact(s) in the organisation responsible for the
                        Assistant
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            radius="sm"
                            size="md"
                            variant="flat"
                            color="success"
                            startContent={
                                <Icon
                                    icon="carbon:add"
                                    width="20"
                                    height="20"
                                />
                            }
                            onPress={addContact}
                        >
                            Add Contact
                        </Button>
                    </div>
                </div>

                {/* Dynamic Contact Cards */}
                <div className="flex flex-col gap-6">
                    {pointOfContacts.map((contact, index) => (
                        <Card
                            key={contact.id}
                            className="border border-default rounded-xl shadow-sm p-4"
                        >
                            <CardHeader className="flex justify-between items-center pb-4 border-b border-default">
                                <h3 className="text-lg font-semibold">
                                    Contact {index + 1}
                                </h3>
                                {pointOfContacts.length > 1 && index > 0 && (
                                    <Icon
                                        onClick={() =>
                                            removeContact(contact.id)
                                        }
                                        icon="mdi:close-circle"
                                        width="24"
                                        height="24"
                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                    />
                                )}
                            </CardHeader>
                            <CardBody>
                                {/* First Row of Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input
                                        size="sm"
                                        radius="sm"
                                        isRequired
                                        label="Contact First Name"
                                        value={contact.firstName}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                contact.id,
                                                "firstName",
                                                value
                                            )
                                        }
                                    />
                                    <Input
                                        size="sm"
                                        radius="sm"
                                        isRequired
                                        label="Contact Last Name"
                                        value={contact.lastName}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                contact.id,
                                                "lastName",
                                                value
                                            )
                                        }
                                    />
                                </div>

                                {/* Second Row of Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        size="sm"
                                        radius="sm"
                                        isRequired
                                        label="Contact Designation"
                                        value={contact.designation}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                contact.id,
                                                "designation",
                                                value
                                            )
                                        }
                                    />
                                    <Input
                                        size="sm"
                                        radius="sm"
                                        isRequired
                                        label="Email"
                                        value={contact.email}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                contact.id,
                                                "email",
                                                value
                                            )
                                        }
                                    />
                                </div>

                                {/* Third Row of Inputs */}
                                <div className="mt-4">
                                    <Input
                                        size="sm"
                                        radius="sm"
                                        isRequired
                                        label="Mobile"
                                        value={contact.mobile}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                contact.id,
                                                "mobile",
                                                value
                                            )
                                        }
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default PointOfContract;
