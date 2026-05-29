import React, { useState, useCallback } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Input,
    Textarea,
    Button,
    Avatar,
    Form,
    Radio,
    RadioGroup,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import ColorPicker from "../../../../../TemplateApproval/Approval/RCSBot/ColorPresets";

import { CopyCodeIcon } from "../../../../../../utils/ReusableIcons";
import { PhoneInput } from "../../../../../../components/phone-input";

export default function ChatWidget() {
    const [isWidgetOpen, setIsWidgetOpen] = useState(true);
    const [isImageUrl, setIsImageUrl] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const toggleWidget = () => {
        setIsWidgetOpen(!isWidgetOpen);
    };
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // Form state
    const [formData, setFormData] = useState({
        brandColor: "#3F51B5", // Default color
        ctaText: "Start Chat",
        brandName: "Your Company",
        phoneNumber: "234567890",
        countryDialCode: "+91",
        welcomeText: "Hello! How can we help you today?",
        prefilledMessage: "I'd like to know more about your services.",
        brandIconUrl: "https://i.pravatar.cc/100",
    });

    // Form Errors
    const [formErrors, setFormErrors] = useState({});

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear any specific errors for this input
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: null,
        }));
    };

    // Handle color change from ColorPicker
    const handleColorChange = (e) => {
        setFormData({
            ...formData,
            brandColor: e.target.value,
        });
    };

    // handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setFormData((prevData) => ({
                ...prevData,
                brandIconUrl: URL.createObjectURL(file), // Set URL for preview
            }));
            setIsImageUrl(false); // Switch off URL selection
            setFileName(file.name);
        }
    };

    // Handle image URL Toggle
    const handleImageToggle = (value) => {
        setIsImageUrl(value === "url");
        if (value === "url") {
            //clear selected Image
            setSelectedImage(null);
            setFormData((prevData) => ({ ...prevData, brandIconUrl: "" }));
            setFileName(null);
        }
    };

    // clear selected Image
    const clearSelectedImage = () => {
        setSelectedImage(null);
        setFormData((prevData) => ({
            ...prevData,
            brandIconUrl: "",
        }));
        setFileName(null);
    };

    // form validations

    const validateForm = useCallback(() => {
        let errors = {};

        // Brand Name Validation
        if (!formData.brandName) {
            errors.brandName = "Brand Name is required";
        }

        // CTA Text Validation
        if (!formData.ctaText) {
            errors.ctaText = "CTA Text is required";
        }

        // Validating Phone Number
        if (!formData.phoneNumber) {
            errors.phoneNumber = "Phone Number is required";
        }

        // Welcome text Validation
        if (!formData.welcomeText) {
            errors.welcomeText = "Welcome Text is required";
        }

        // Pre filled message text Validation
        if (!formData.prefilledMessage) {
            errors.prefilledMessage = "Pre-filled Message is required";
        }

        // Logo URL Validation - depends on whether it is a URL or Upload
        if (isImageUrl) {
            if (!formData.brandIconUrl) {
                errors.brandIconUrl = "Brand Icon URL is required";
            }
        } else {
            if (!selectedImage) {
                errors.brandIconUrl = "Brand Icon Upload is required";
            }
        }

        setFormErrors(errors);
        const isValid = Object.keys(errors).length === 0;
        setIsFormValid(isValid); // Update form validity state
        return isValid; // Return true if form is valid
    }, [
        formData.brandName,
        formData.ctaText,
        formData.phoneNumber,
        formData.welcomeText,
        formData.prefilledMessage,
        formData.brandIconUrl,
        isImageUrl,
        selectedImage,
    ]);

    // Generate the script
    const generateScript = () => {
        return `
        <script>
            window.ZXWAMS = {
                brandColor: "${formData.brandColor}",
                ctaText: "${formData.ctaText}",
                position: "bottom-right",
                brandName: "${formData.brandName}",
                phoneNumber: "${formData.phoneNumber}",
                brandHeadline: "${formData.welcomeText}",
                messageText: "${formData.prefilledMessage}",
                brandImg: "${formData.brandIconUrl}"
            };
            (function () {
                var script = document.createElement('script');
                script.src = "https://forms.telepie.ai/waWidget.bundle.js";
                script.async = true;
                var entry = document.getElementsByTagName('script')[0];
                entry.parentNode.insertBefore(script, entry);
            })();
        </script>
        `;
    };

    const handleCopyScript = () => {
        try {
            navigator.clipboard.writeText(generateScript());
            setIsCopied(true);
        } catch (error) {
            console.error("Failed to copy script:", error);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm(); // Validate the form
        if (isFormValid) {
            onOpen();
            // Here will be the code where script is generated.
        } else {
            console.log("Form has validation errors.");
        }
    };

    React.useEffect(() => {
        validateForm();
    }, [formData, validateForm]);

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1">
                                Generated Script
                            </ModalHeader>
                            <ModalBody>
                                <div className="relative">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="solid"
                                        className="absolute top-2 right-2 "
                                        onPress={handleCopyScript}>
                                        <CopyCodeIcon
                                            customClass={
                                                isCopied && "text-primary"
                                            }
                                            size="1.5em"
                                        />
                                    </Button>
                                    <pre className="bg-slate-900 text-white rounded-lg overflow-hidden">
                                        <code>{generateScript()}</code>
                                    </pre>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button color="primary" onPress={onClose}>
                  Close
                </Button> */}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
                {/* Left Column - Form */}
                <div className="flex flex-col gap-6">
                    <Card className="shadow-md">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-t-xl p-6">
                            <h2 className="text-md font-semibold">
                                Widget Configuration
                            </h2>
                        </CardHeader>
                        <CardBody>
                            <Form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4 p-4">
                                <div className="flex justify-between items-center gap-4 w-full">
                                    {/* Brand Name */}
                                    <Input
                                        isRequired
                                        type="text"
                                        label="Brand Name"
                                        name="brandName"
                                        value={formData.brandName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your company name"
                                        variant="flat"
                                        className="flex-1"
                                        errorMessage={formErrors.brandName}
                                    />

                                    {/* Brand Color */}
                                    <ColorPicker
                                        rcsBrandColor={formData.brandColor}
                                        handleColorChange={handleColorChange}
                                    />
                                </div>
                                <div className="flex-center gap-4 w-full">
                                    {/* CTA Text */}
                                    <Input
                                        type="text"
                                        isRequired
                                        label="CTA Text"
                                        size="sm"
                                        name="ctaText"
                                        value={formData.ctaText}
                                        onChange={handleInputChange}
                                        placeholder="Enter call-to-action text"
                                        variant="flat"
                                        errorMessage={formErrors.ctaText}
                                        className="flex-1"
                                    />

                                    {/* Phone Number */}
                                    <PhoneInput
                                        countryDialCode={
                                            formData.countryDialCode
                                        }
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                phoneNumber: value,
                                            })
                                        }
                                        onCountryChange={(country) =>
                                            setFormData({
                                                ...formData,
                                                countryDialCode:
                                                    country?.dial_code,
                                            })
                                        }
                                        value={formData.phoneNumber}
                                        isRequired={true}
                                    />
                                </div>
                                {/* Welcome Text */}
                                <Textarea
                                    isRequired
                                    label="Welcome Text"
                                    name="welcomeText"
                                    value={formData.welcomeText}
                                    onChange={handleInputChange}
                                    placeholder="Enter welcome message"
                                    minRows={2}
                                    variant="flat"
                                    errorMessage={formErrors.welcomeText}
                                />
                                {/* Pre-filled WhatsApp Message */}
                                <Textarea
                                    isRequired
                                    label="Pre-filled WhatsApp Message"
                                    name="prefilledMessage"
                                    value={formData.prefilledMessage}
                                    onChange={handleInputChange}
                                    placeholder="Enter pre-filled message"
                                    minRows={2}
                                    variant="flat"
                                    errorMessage={formErrors.prefilledMessage}
                                />

                                {/* Image source selector (URL or upload) */}
                                <RadioGroup
                                    label="Brand Icon Source"
                                    orientation="horizontal"
                                    value={isImageUrl ? "url" : "upload"}
                                    onValueChange={handleImageToggle}>
                                    <Radio value="url">URL</Radio>
                                    <Radio value="upload">Upload</Radio>
                                </RadioGroup>

                                {/* Brand Icon Input (Upload) */}
                                {isImageUrl && (
                                    <Input
                                        type="url"
                                        label="Brand Icon URL"
                                        name="brandIconUrl"
                                        value={formData.brandIconUrl}
                                        onChange={handleInputChange}
                                        placeholder="Enter URL for your brand icon"
                                        description="Recommended Image size is 100x100px (1:1 aspect ratio)"
                                        variant="flat"
                                        errorMessage={formErrors.brandIconUrl}
                                    />
                                )}
                                {/* Brand Icon Input (Upload) */}
                                {!isImageUrl && (
                                    <div className="w-full">
                                        {/* Label */}
                                        <label className="text-sm text-default-500 font-semibold -pb-4">
                                            Brand Icon
                                        </label>

                                        {/* Image Preview */}
                                        {/* {formData.brandIconUrl && (
                      <img
                        src={formData.brandIconUrl}
                        alt="Brand Icon"
                        className="w-full h-[150px] object-cover border rounded-md mb-2"
                      />
                    )} */}

                                        {/* Image Upload */}
                                        <div className="border rounded-md relative">
                                            <input
                                                id="file_input"
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleImageChange}
                                            />
                                            <label
                                                htmlFor="file_input"
                                                className="flex items-center justify-center w-full  hover:scale-105 rounded-lg bg-default-100 dark:bg-default-50 text-sm cursor-pointer">
                                                <div className="flex items-center justify-between gap-1 w-full h-full">
                                                    <p className="pl-2">
                                                        {fileName
                                                            ? fileName
                                                            : "Upload Image"}
                                                    </p>
                                                    <div className="px-4 py-1  bg-gray-200 h-full">
                                                        <Icon
                                                            icon="ic:outline-file-upload"
                                                            width="24"
                                                            height="24"
                                                        />
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                                {/* Generate Script Button */}
                                <Button
                                    type="submit"
                                    variant="shadow"
                                    color="primary"
                                    className="mt-4 self-end"
                                    isDisabled={!isFormValid} // Disable the button based on form validity
                                >
                                    Generate Script
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column - Widget Preview */}
                <div className="flex flex-col items-end justify-between h-full bg-gray-50 dark:bg-gray-900/20 p-6 rounded-xl">
                    {/* Integration Instructions - Now at the top */}
                    <Card className="w-full mb-auto shadow-md">
                        <CardBody className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/20 p-6 rounded-xl">
                            <div className="text-center">
                                <h2 className="text-xl font-bold mb-2">
                                    ⚡ Integrate WhatsApp Chat Widget
                                </h2>
                                <p className="text-sm text-default-600">
                                    Add the script to the header of the page
                                    where you want it to display.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Widget Preview with Launcher Button - Now at the bottom */}
                    <div className="relative mt-auto">
                        {/* Widget Card - Initially hidden when not active */}
                        {isWidgetOpen && (
                            <Card
                                className="shadow-lg w-80 min-h-[450px] max-h-[600px] mb-4"
                                style={{ borderColor: formData.brandColor }}>
                                {/* Widget Header */}
                                <CardHeader
                                    className="flex justify-between items-center"
                                    style={{
                                        backgroundColor: formData.brandColor,
                                    }}>
                                    <div className="flex gap-3 items-center">
                                        <Avatar
                                            src={formData.brandIconUrl}
                                            size="md"
                                        />
                                        <div className="flex flex-col text-white">
                                            <p className="font-semibold">
                                                {formData.brandName ||
                                                    "Telepie"}
                                            </p>
                                            <p className="text-xs flex items-center">
                                                <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="text-white"
                                        onPress={toggleWidget}>
                                        <Icon
                                            icon="solar:close-circle-bold"
                                            className="text-xl"
                                        />
                                    </Button>
                                </CardHeader>

                                {/* Widget Body */}
                                <CardBody className="flex flex-col gap-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                                    {/* Welcome Message */}
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg max-w-[80%] self-start shadow-sm">
                                        <p className="text-sm">
                                            {formData.welcomeText}
                                        </p>
                                    </div>

                                    {/* QR Code */}
                                    <div className="flex flex-col items-center justify-center gap-2 my-4">
                                        <div className="w-32 h-32 bg-white rounded-md dark:bg-gray-700 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-600">
                                            <Icon
                                                icon="solar:qr-code-linear"
                                                width="100"
                                                height="100"
                                                className="rounded-md"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Scan to chat on WhatsApp
                                        </p>

                                        {/* CTA Button below QR */}
                                        <Button
                                            className="w-fit px-6 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    formData.brandColor,
                                                color: "white",
                                            }}>
                                            {formData.ctaText}
                                        </Button>
                                    </div>
                                </CardBody>

                                {/* Widget Footer */}
                                <CardFooter className="flex flex-col gap-3 bg-gray-100 dark:bg-gray-800/50">
                                    <p className="text-xs text-center text-gray-500">
                                        ⚡ Powered by Telepie
                                    </p>
                                </CardFooter>
                            </Card>
                        )}

                        {/* Launcher Button - Now at the bottom */}
                        <div className="flex justify-end">
                            <Button
                                isIconOnly
                                className="shadow-lg z-10 w-14 h-14 rounded-full"
                                style={{ backgroundColor: formData.brandColor }}
                                onPress={toggleWidget}>
                                <Icon
                                    icon={
                                        isWidgetOpen
                                            ? "radix-icons:cross-2"
                                            : "ri:whatsapp-fill"
                                    }
                                    className="text-white text-2xl"
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
