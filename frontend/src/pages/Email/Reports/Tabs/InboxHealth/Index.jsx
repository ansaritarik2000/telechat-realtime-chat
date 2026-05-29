import React, { useState } from "react";
import HealthCard from "./HealthCard";
import {
    Button,
    Divider,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalContent,
    ModalFooter,
    Tabs,
    Tab,
    useDisclosure,
    addToast,
} from "@heroui/react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Icon } from "@iconify-icon/react";

export default function EmailInboxReport() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [activeTab, setActiveTab] = useState(0);

    const notify = () => {
        addToast({
            title: "Success 🎉",
            description: "Copied to clipboard.",
            color: "success",
        });
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        notify();
    };

    const dnsRecords = [
        {
            type: "TXT",
            key: "Telepie",
            value: "v=spf1 include:amazonses.com ~all",
        },
        {
            type: "MX",
            key: "Telepie",
            value: "10 feedback-smtp.eu-west-3.amazonses.com",
        },
        {
            type: "CNAME",
            key: "jjiueylu7q4dyxr1",
            value: "jjiueylu7q4dyxr1...dkim.amazonses.com",
        },
        { type: "CNAME", key: "wg725x", value: "wg725x...dkim.amazonses.com" },
        { type: "CNAME", key: "tceu", value: "tceu...dkim.amazonses.com" },
    ];

    return (
        <div className="space-y-3 -mt-16">
            {/* Button */}
            <div className="w-full flex justify-end ">
                <Button
                    onPress={onOpen}
                    variant="flat"
                    radius="sm"
                    color="success"
                    startContent={
                        <Icon icon="mdi:email-outline" width="20" height="20" />
                    }
                >
                    Configure Email
                </Button>
            </div>

            {/* Modal with Tabs */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader></ModalHeader>
                            <ModalBody>
                                <Tabs
                                    variant="underlined"
                                    color="success"
                                    selectedIndex={activeTab}
                                    onChange={(index) => setActiveTab(index)}
                                    aria-label="Tab Example"
                                >
                                    <Tab title="SMTP">
                                        <div className="mt-4 flex space-x-4">
                                            <Input
                                                label="Host Name"
                                                isRequired
                                                className="w-3/4"
                                            />
                                            <Input
                                                label="Port"
                                                isRequired
                                                className="w-1/4"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <Input
                                                label="Username"
                                                isRequired
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <Input
                                                label="Password"
                                                isRequired
                                                className="w-full"
                                            />
                                        </div>
                                    </Tab>
                                    <Tab title="Verified Domain">
                                        <div className="">
                                            <div className="bg-white rounded-lg p-2">
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-500">
                                                        By sending emails from
                                                        your own domain, you
                                                        build up domain
                                                        authority and trust.
                                                    </p>
                                                </div>
                                                <div className="bg-yellow-100 border-yellow-500 text-yellow-700 p-4 mb-6">
                                                    <p className="text-sm">
                                                        <strong>
                                                            Waiting for DNS
                                                            verification:
                                                        </strong>{" "}
                                                        Please add the following
                                                        records to verify
                                                        <span className="font-medium">
                                                            {" "}
                                                            fowad@telepie.com
                                                        </span>
                                                        . This may take up to 15
                                                        minutes to register. In
                                                        the meantime, you can
                                                        already start sending
                                                        emails. We will
                                                        automatically switch to
                                                        your domain once
                                                        verified.
                                                    </p>
                                                </div>
                                                {/* DNS Records Table */}
                                                <Table
                                                    aria-label="DNS Records"
                                                    bordered
                                                    lined
                                                    css={{
                                                        height: "auto",
                                                        minWidth: "100%",
                                                    }}
                                                >
                                                    <TableHeader>
                                                        <TableColumn>
                                                            Type
                                                        </TableColumn>
                                                        <TableColumn
                                                            style={{
                                                                width: "500px",
                                                            }}
                                                        >
                                                            Key
                                                        </TableColumn>
                                                        <TableColumn>
                                                            Value
                                                        </TableColumn>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {dnsRecords.map(
                                                            (record, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    className="hover:bg-gray-100"
                                                                >
                                                                    <TableCell>
                                                                        {
                                                                            record.type
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            record.key
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="flex items-center space-x-2">
                                                                        <span>
                                                                            {
                                                                                record.value
                                                                            }
                                                                        </span>

                                                                        <Button
                                                                            isIconOnly
                                                                            variant="light"
                                                                            size="sm"
                                                                            color="gray"
                                                                            onPress={() =>
                                                                                handleCopy(
                                                                                    record.value
                                                                                )
                                                                            }
                                                                        >
                                                                            <Icon
                                                                                icon="mdi:content-copy"
                                                                                className="text-sm"
                                                                            />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </ModalBody>
                            <ModalFooter className="flex flex-col gap-4">
                                <Divider />
                                <div className="self-end flex gap-2">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button color="success" variant="flat">
                                        Verify
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Health Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
                <HealthCard email="sudhanshu123@gmail.com" />
                <HealthCard
                    status="Disconnected"
                    email="sudhirkumar7925@gmail.com"
                    reputation="Medium"
                    messageLimit="10,000"
                    username="Telepie"
                    verifiedName="Telepie Technology"
                />
                <HealthCard
                    email="syedahani634@gmail.com"
                    status="Connected"
                    reputation="High"
                    messageLimit="8,000"
                    username="Example User"
                    verifiedName="Example Verified"
                />
                <HealthCard
                    email="rishabhkumar456@gmail.com"
                    status="Disconnected"
                    reputation="Low"
                    messageLimit="1,000"
                    username="Another User"
                    verifiedName="Another Verified"
                />
            </div>
        </div>
    );
}
