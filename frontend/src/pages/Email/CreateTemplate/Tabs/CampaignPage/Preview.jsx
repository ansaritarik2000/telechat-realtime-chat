import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";

export default function EmailTemplatePreview({
    userName = "Nawaz",
    otpCode = "493381",
    companyName = "Telepie",
    expiryMinutes = "10",
}) {
    // Define the OTP email template as a function that returns HTML with dynamic values
    const getOtpEmailTemplate = (
        userName,
        otpCode,
        companyName,
        expiryMinutes
    ) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Email Template</title>
            <style>
                /* General Styles */
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .email-container {
                    max-width: 600px;
                    margin: 10px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background-color: #2563eb; /* Primary color */
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .body {
                    padding: 20px;
                    text-align: center;
                }
                .body p {
                    font-size: 16px;
                    color: #333333;
                }
                .otp-code {
                    display: inline-block;
                    font-size: 24px;
                    font-weight: bold;
                    color: #2563eb; /* Primary color */
                    background-color: #e5f3ff; /* Light background for OTP */
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 10px;
                }
                .footer {
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: #666666;
                }
                .footer a {
                    color: #2563eb; /* Primary color */
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <h1>Your OTP Code</h1>
                </div>

                <!-- Body -->
                <div class="body">
                    <p>Hello ${userName},</p>
                    <p>Your One-Time Password (OTP) for verification is:</p>

                    <!-- OTP Code -->
                    <div class="otp-code">${otpCode}</div>

                    <p>Please use this OTP to complete your verification. The code is valid for the next ${expiryMinutes} minutes.</p>

                    <!-- Call-to-action Button -->
                    <a href="#" style="
                        display:inline-block;
                        margin-top:20px;
                        padding:10px 20px;
                        background-color:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:5px;">
                        Verify Now
                    </a>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>If you did not request this OTP, please <a href="#">contact us</a> immediately.</p>
                    <p>Thank you,<br>The ${companyName} Team</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return (
        <div className="px-10">
            <Card shadow={false} radius="lg" className="border border-default">
                {/* <CardHeader
                    className={`p-4 bg-secondary-50 dark:bg-content2 h-14`}
                /> */}

                <CardBody className="h-[34rem] overflow-auto scrollbar-hide">
                    {/* Render raw HTML template with dynamic values */}
                    {getOtpEmailTemplate ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: getOtpEmailTemplate(
                                    userName,
                                    otpCode,
                                    companyName,
                                    expiryMinutes
                                ),
                            }}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-500">
                            <p className="text-md font-medium">
                                Select a template for preview
                            </p>
                        </div>
                    )}
                </CardBody>

                <CardFooter />
            </Card>
        </div>
    );
}
