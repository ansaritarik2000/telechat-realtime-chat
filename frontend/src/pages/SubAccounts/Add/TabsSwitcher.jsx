import React, { Suspense, useState, lazy, useEffect } from "react";
import StepperComponent from "../../../components/Stepper/Step";
import { addToast, Alert, Button, Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { createSubAccountService } from "../../../services/Subaccount/subAccountService";
import { useSubAccountStore } from "../../../store/subAccount/subAccountStore";
import { sendEmailsClient } from "../../../services/email/sendEmails";
import { z } from "zod";

const CompanyDetails = lazy(() => import("./CompanyDetails"));
const DefaultUser = lazy(() => import("./DefaultUser"));
const Pricing = lazy(() => import("./Pricing/Index"));
const CreditsHistory = lazy(() => import("./CreditsHistory/Index"));

export default function AddTabSwitcher({ onClose, fetchTableData }) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const subAccountStore = useSubAccountStore();
    const [errorMessage, setErrorMessage] = useState("");

    // Define Zod validation schemas for each step
    const stepSchemas = [
        z.object({
            business_name: z
                .string()
                .min(2, "Business name Should be at least 2 characters")
                .regex(
                    /^[A-Za-z\s]+$/,
                    "Business name must contain only letters"
                ),
            pan_no: z
                .string()
                .min(10, "PAN number Should be 10 digits")
                .regex(
                    /^[A-Z0-9]+$/,
                    "PAN number must be uppercase and alphanumeric"
                ),
            gst_no: z
                .string()
                .min(5, "GST number Should be 5 digits")
                .regex(
                    /^[A-Z0-9]+$/,
                    "GST number must be uppercase and alphanumeric"
                ),
            dlt_entity_id: z
                .string()
                .min(5, "CIN No. must be at least 5 characters")
                .regex(/^\d+$/, "CIN No. must contain only numbers"),

            address: z
                .string()
                .min(5, "Address Should be at least 5 characters"),
            city: z.string().min(2, "City should be at least 2 characters"),
            state: z.string().min(2, "State should be at least 2 characters"),

            pin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits"),

            country: z
                .string()
                .min(2, "Country should be at least 2 characters"),
        }),
        z.object({
            first_name: z.string().min(2, "First name is required"),
            last_name: z.string().min(2, "Last name is required"),
            email: z.string().email("Invalid email address"),
            phone_no: z.string().min(10, "Phone number is required"),
            rel_mng_name: z
                .string()
                .min(2, "Relationship manager name is required"),
            rel_mng_phone: z
                .string()
                .min(10, "Relationship manager phone number is required"),
            rel_mng_email: z.string().email("Invalid email address"),
            password: z
                .string()
                .min(6, "Password must be at least 6 characters"),
        }),
        z.object({}),
        z.object({
            auto_add_credits: z.boolean(),
        }),
    ];

    const steps = [
        {
            title: "Company Details",
            component: <CompanyDetails />,
        },
        {
            title: "Default User",
            component: <DefaultUser />,
        },
        {
            title: "Service Pricing",
            component: <Pricing />,
        },
        {
            title: "Credit & History",
            component: <CreditsHistory />,
        },
    ];

    const validateCurrentStep = () => {
        const schema = stepSchemas[currentStep];
        try {
            schema.parse(subAccountStore);

            setIsNextDisabled(false); // Enable Next button
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});

                setIsNextDisabled(true); // Disable Next button
            }
        }
    };

    // Validate form when inputs change
    useEffect(() => {
        validateCurrentStep();
    }, [subAccountStore, currentStep]);

    const handleNext = () => {
        if (!isNextDisabled) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const content = "";
    // on submit handller
    const onSubmit = async () => {
        try {
            const schema = stepSchemas[currentStep];
            schema.parse(subAccountStore);

            const token = localStorage.getItem("token");
            const response = await createSubAccountService(
                subAccountStore,
                token
            ); // Call the service function with form data

            if (response.status === "SUCCESS") {
                setErrorMessage("");
                await sendEmailsClient({
                    to: subAccountStore.email,
                    subject: "Sub account Credentials",
                    text: ` Hi ${subAccountStore.first_name} your password: ${subAccountStore.password} and PhoneNumber: ${subAccountStore.phone_no} <br /> OTP:1234`,
                    html: `<p>${content}</p>`,
                    customArgs: { userId: subAccountStore.first_name },
                });
                addToast({
                    color: "success",
                    title: "Sub-account created successfully!",
                });

                fetchTableData();
                onClose();

                // Optionally, handle success feedback or navigation
            } else {
                addToast({
                    color: "danger",
                    title: "Failed to create sub-account!",
                });

                setErrorMessage(response.message);

                // Optionally, handle error feedback
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                addToast({
                    color: "danger",
                    title: "Validation failed!",
                });
            } else {
                console.error("Error creating sub-account:", error.message);
            }
        }
    };

    return (
        <div className="rounded-md h-full flex flex-col gap-4">
            {errorMessage && (
                <Alert
                    isVisible={!!errorMessage}
                    variant="faded"
                    onClose={() => setErrorMessage("")}
                    color="danger">
                    {errorMessage}
                </Alert>
            )}
            {/* Stepper */}
            <StepperComponent
                currentStep={currentStep}
                onStepChange={isNextDisabled ? null : setCurrentStep}
            />

            {/* Current Step Component */}
            <div className="flex-grow overflow-auto">
                <Suspense fallback={<div>Loading...</div>}>
                    {steps[currentStep].component}
                </Suspense>

                <div className="mt-4 ">
                    <Divider />
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
                {currentStep > 0 && (
                    <Button
                        size="md"
                        variant="flat"
                        color="success"
                        onPress={handlePrevious}>
                        {t("Previous")}
                    </Button>
                )}
                <div className="ml-auto">
                    {currentStep < steps.length - 1 && (
                        <Button
                            size="md"
                            variant="flat"
                            color="success"
                            isDisabled={isNextDisabled}
                            onPress={handleNext}>
                            {t("Next")}
                        </Button>
                    )}

                    {currentStep === steps.length - 1 && (
                        <Button
                            size="md"
                            onPress={onSubmit}
                            variant="solid"
                            color="success">
                            {t("Submit")}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
